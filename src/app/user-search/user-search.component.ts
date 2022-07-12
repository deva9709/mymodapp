import { Component, OnInit, Injector, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModService } from '@app/service/api/mod.service';
import { dataService } from "@app/service/common/dataService";
import { AppComponentBase } from '@shared/app-component-base';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { UserRoles, AttendanceStatus } from '@app/enums/user-roles';
import { ToastrService } from 'ngx-toastr';
import { ngxCsv } from 'ngx-csv';
import { finalize } from 'rxjs/operators';

export interface FilterSessionStatus {
  name: string;
  email: string;
  status: string;
  inTime: Date;
  outTime: Date;
  participantSessionDuration: number;
  isLateComer: string;
}

@Component({
  selector: 'app-user-search',
  templateUrl: './user-search.component.html',
  styleUrls: ['./user-search.component.css']
})
export class UserSearchComponent extends AppComponentBase implements OnInit {


  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('sessionStatuspaginator') sessionStatuspaginator: MatPaginator;
  sessionStatusdataSource: MatTableDataSource<any>;

  findSessionStatusForm: FormGroup;
  findTrainerStatusForm: FormGroup;
  tenantList: any[] = [];
  sessionList: any[] = [];
  userId = this.appSession.user.id;
  sessionStatusColumn: string[] = ['Name', 'Email', 'Status', 'In Time', 'Out Time', 'Duration (Minutes)', 'LateComer'];
  sessionStatusList: FilterSessionStatus[] = [];
  isShowTenant: boolean = true;
  sessionTitle: string = '';
  sessionStartDate: Date;
  sessionEndDate: Date;
  tenantName: string = '';
  isShowSessionStatus: boolean = false;
  attendanceStatus = AttendanceStatus;
  attendanceStatusSelected: string = '';
  statusList: any[] = [];
  isExportCSV: boolean = false;
  filteredTenant: any[] = [];
  filteredSession: any[] = [];


  constructor(
    injector: Injector,
    private formBuilder: FormBuilder,
    private modService: ModService,
    private dataService: dataService,
    private toastService: ToastrService
  ) {
    super(injector);
  }



  ngOnInit() {
    this.dataService.pageName = 'Search';
    this.initfindSessionStatusForm();
    this.getAllTenants();
    this.sessionStatusdataSource = new MatTableDataSource<FilterSessionStatus>(this.sessionStatusList);
    this.statusList = Object.keys(AttendanceStatus).filter(
      (type) => isNaN(<any>type) && type !== 'values');
    if (this.dataService.currentUserType !== UserRoles[1]) {
      this.getSessionList(this.dataService.currentTenentId);
      this.isShowTenant = false;
    }
    else {
      this.isShowTenant = true;
    }
  }

  initfindSessionStatusForm(): void {
    this.findSessionStatusForm = this.formBuilder.group({
      tenantId: [this.dataService.currentTenentId],
      sessionScheduleId: ['', [Validators.required]],
      attendanceStatus: [this.attendanceStatus[1]],
      isLateComer: [false]
    });
  }

  getAllTenants() {
    this.modService.getTenants().pipe(
      finalize(() => { this.dataService.isLoading = this.dataService.doneLoading(); })
    ).subscribe(res => {
      if (res.result) {
        this.tenantList = res.result;
        this.filteredTenant = this.tenantList;
      }
    });
  }

  getSessionList(event) {
    this.sessionList = [];
    let tenantId;
    tenantId = this.dataService.currentUserType !== UserRoles[1] ? event : event.value;
    this.modService.getSessionSchedulesByTenantId(tenantId).subscribe(res => {
      this.sessionList = res.result != null ? res.result : [];
      this.filteredSession = this.sessionList;
    });
  }

  findSessionStatus() {
    this.dataService.isLoading = true;
    let data = {
      tenantId: this.findSessionStatusForm.value.tenantId,
      sessionScheduleId: this.findSessionStatusForm.value.sessionScheduleId
    };
    this.modService.searchParticipantsLateForSession(data).pipe(
      finalize(() => { this.dataService.isLoading = this.dataService.doneLoading(); })
    ).subscribe(res => {
      if (res.result != null) {
        this.sessionStatusList = [];
        let sessionDetails = res.result;
        this.sessionTitle = sessionDetails.sessionScheduleDetails.sessionTitle;
        this.sessionStartDate = new Date(`${sessionDetails.sessionScheduleDetails.startDate}.000Z`);
        this.sessionEndDate = new Date(`${sessionDetails.sessionScheduleDetails.endDate}.000Z`);
        let participantDetails = res.result.sessionParticipantStatus;
        participantDetails.forEach(participant => {
          let participantInTime, participantOutTime;
          if (participant.participantInTime != null) {
            let inTime = new Date(`${participant.participantInTime}`);
            participantInTime = new Date(`${inTime}.000Z`)
          }
          if (participant.participantOutTime != null) {
            let outTime = new Date(`${participant.participantOutTime}`);
            participantOutTime = new Date(`${outTime}.000Z`)
          }
          let sessionStatus: FilterSessionStatus = {
            name: participant.participantDetails.userDetail.name,
            email: participant.participantDetails.userDetail.email,
            status: this.attendanceStatus[participant.attendanceStatus],
            inTime: participantInTime,
            outTime: participantOutTime,
            participantSessionDuration: participant.participantSessionDuration,
            isLateComer: participant.isLateComer == null ? "N/A" : participant.isLateComer == true ? "Yes" : "No"
          };
          if ((this.findSessionStatusForm.value.attendanceStatus == this.attendanceStatus[1] || sessionStatus.status == this.findSessionStatusForm.value.attendanceStatus)
            && (this.findSessionStatusForm.value.isLateComer == false || sessionStatus.isLateComer == "Yes")) {
            this.sessionStatusList.push(sessionStatus);
          }
        });
        this.isShowSessionStatus = true;
      }
      else {
        this.toastService.warning("No Records found. Please select completed Session");
        this.isShowSessionStatus = false;
      }
      this.isExportCSV = this.sessionStatusList.length === 0 ? false : true;
      this.sessionStatusdataSource = new MatTableDataSource<FilterSessionStatus>(this.sessionStatusList);
      this.sessionStatusdataSource.paginator = this.sessionStatuspaginator;
      this.sessionStatusdataSource.sort = this.sort;
    });
  }

  search(query: string, filterFor: string): void {
    if (filterFor.toLowerCase() === 'tenant') {
      this.filteredTenant = this.performFilter(query, this.tenantList, 'tenantName');
    }
    if (filterFor.toLowerCase() === 'session') {
      this.filteredSession = this.performFilter(query, this.sessionList, 'sessionTitle');
    }
  }

  performFilter(query: string, filterArray: string[], filterBy: string): string[] {
    return filterArray.filter(value => value[filterBy].toLocaleLowerCase().indexOf(query.toLocaleLowerCase()) !== -1);
  }

  downloadAsCSV() {
    let csvHeaders, data, fileName;
    fileName = "Session_Participant_Report";
    csvHeaders = this.sessionStatusColumn;
    data = this.sessionStatusList.map(x => { return { name: x.name, email: x.email, status: x.status, inTime: x.inTime, outTime: x.outTime, duration: x.participantSessionDuration, isLateComer: x.isLateComer } });
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