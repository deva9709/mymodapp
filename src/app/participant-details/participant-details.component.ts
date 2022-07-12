import { Component, OnInit, Injector, ViewChild, Input } from '@angular/core';
import { ngxCsv } from 'ngx-csv';
import { finalize } from 'rxjs/operators';
import { UserRoles, AttendanceStatus, SessionStatus, UserTypes } from '@app/enums/user-roles';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { ModService } from '@app/service';
import { ToastrService } from 'ngx-toastr';
import { dataService } from "@app/service/common/dataService";
import { AppComponentBase } from '@shared/app-component-base';
import { Constants } from '@app/models/constants';

export interface FilterSessionStatus {
  firstName: string;
  lastName: string;
  email: string;
  status: string;
  inTime: Date;
  outTime: Date;
  participantSessionDuration: number;
  isLateComer: string;
  isMentor: boolean;
}

@Component({
  selector: 'app-participant-details',
  templateUrl: './participant-details.component.html',
  styleUrls: ['./participant-details.component.css']
})

export class ParticipantDetailsComponent extends AppComponentBase implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('sessionStatuspaginator') sessionStatuspaginator: MatPaginator;
  sessionStatusdataSource: MatTableDataSource<any>;
  userId = this.appSession.user.id;
  sessionStatusColumn: string[] = ['FirstName', 'LastName', 'Email', 'Status', 'In Time', 'Out Time', 'Duration (Minutes)', 'LateComer'];
  sessionStatusList: FilterSessionStatus[] = [];
  attendanceStatus = AttendanceStatus;
  isExportCSV: boolean = false;
  filteredTenant: any[] = [];
  filteredSession: any[] = [];
  @Input() sessionScheduleId;
  sessionScheduleDetails: any[] = [];
  sessionStatus: string = "";
  Code: string = "CALENDAR";
  rolePermissions: any[] = [];
  readAllPermission: boolean;
  isMentor: boolean = true;

  constructor(
    injector: Injector,
    private modService: ModService,
    private dataService: dataService,
    private toastService: ToastrService
  ) {
    super(injector);
  }

  ngOnInit() {
    this.sessionStatusdataSource = new MatTableDataSource<FilterSessionStatus>(this.sessionStatusList);
    this.rolePermissions = this.dataService.rolePermissions;
    let permissions = this.rolePermissions.find(val => val.feature.featureCode === this.Code);
    if (permissions) {
      this.readAllPermission = permissions.readAll;
    }
    this.findSessionStatus();
  }

  findSessionStatus() {
    this.modService.getSessionParticipantDetailsById(this.sessionScheduleId, this.userId).pipe(
      finalize(() => { this.dataService.isLoading = this.dataService.doneLoading(); })
    ).subscribe(res => {
      if (res.result) {

        let sessionScheduleDetails = res.result.sessionScheduleDetails;
        this.sessionStatusColumn = sessionScheduleDetails.sessionStatus == SessionStatus.Completed ? ['FirstName', 'LastName', 'Email', 'Status', 'In Time', 'Out Time', 'Duration (Minutes)', 'LateComer'] : ['FirstName', 'LastName', 'Email'];
        this.sessionStatus = SessionStatus[sessionScheduleDetails.sessionStatus];

        let sessionParticipantDetails;
        if (this.dataService.currentUserType === UserRoles[1] || this.readAllPermission || res.result.sessionParticipantStatus.find(x => x.participantDetails.participantUserId == this.dataService.currentPlatformUserId && x.participantDetails.participantRole == UserTypes.Trainer)) {
          sessionParticipantDetails = res.result.sessionParticipantStatus;
        } else {
          this.isMentor = false;
          sessionParticipantDetails = res.result.sessionParticipantStatus.filter(x => x.participantDetails.participantUserId == this.dataService.currentPlatformUserId)
        }

        sessionParticipantDetails.forEach(participant => {
          let participantInTime, participantOutTime;
          if (participant.participantInTime != null) {
            let inTime = new Date(`${participant.participantInTime}`);
            participantInTime = new Date(`${inTime}.000Z`);
          }
          if (participant.participantOutTime != null) {
            let outTime = new Date(`${participant.participantOutTime}`);
            participantOutTime = new Date(`${outTime}.000Z`);
          }
          let sessionStatus: FilterSessionStatus = {
            firstName: participant.participantDetails.userDetail.name,
            lastName: participant.participantDetails.userDetail.surName,
            email: participant.participantDetails.userDetail.email,
            status: this.attendanceStatus[participant.attendanceStatus],
            inTime: participantInTime,
            outTime: participantOutTime,
            participantSessionDuration: participant.participantSessionDuration,
            isLateComer: participant.isLateComer == null ? "N/A" : participant.isLateComer == true ? "Yes" : "No",
            isMentor: participant.participantDetails.participantRole == UserTypes.Trainer ? true : false
          };
          this.sessionStatusList.push(sessionStatus);
        });
        this.isExportCSV = this.sessionStatusList.length === 0 ? false : true;
        this.sessionStatusdataSource = new MatTableDataSource<FilterSessionStatus>(this.sessionStatusList);
        this.sessionStatusdataSource.paginator = this.sessionStatuspaginator;
        this.sessionStatusdataSource.sort = this.sort;
      }
    });
  }

  downloadAsCSV() {
    let csvHeaders, data, fileName;
    fileName = "Session_Participant_Report";
    csvHeaders = this.sessionStatusColumn;
    if (this.sessionStatus != SessionStatus[4])
      data = this.sessionStatusList.map(x => { return { firstName: x.firstName, lastName: x.lastName, email: x.email } });
    else
      data = this.sessionStatusList.map(x => { return { firstName: x.firstName, lastName: x.lastName, email: x.email, status: x.status, inTime: x.inTime, outTime: x.outTime, duration: x.participantSessionDuration, isLateComer: x.isLateComer } });
    let options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      headers: csvHeaders
    };
    new ngxCsv(data, fileName, options);
    this.toastService.success("Your report has been downloaded. Please check your downloads.");
  }
}
