import { Component, OnInit, Injector, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { SessionType, SessionStatus, JoinMechanism, RecordingApprovalStatus } from '@app/enums/user-roles';
import { Router } from '@angular/router';
import { dataService } from '@app/service/common/dataService';
import { ModService } from '@app/service';
import { AppSessionService } from '@shared/session/app-session.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialogConfig, MatDialog, MatTableDataSource, MatSort } from '@angular/material';
import { MenteeSessionDetailsComponent } from '@app/mod-sessions/mentee-session-details/mentee-session-details.component';
import { PollAnalysisComponent } from '@app/poll-analysis/poll-analysis.component';
import { PollType } from '@app/enums/poll-type';
import { DeleteSessionDialogComponent } from '@app/dialog/delete-session-dialog/delete-session-dialog.component';
import { RescheduleSessionDialogComponent } from '@app/dialog/reschedule-session-dialog/reschedule-session-dialog.component';
import { PollCreatorComponent } from '@app/poll-creator/poll-creator.component';
import { SessionApprovalStatus } from "@app/enums/user-roles";
import { finalize, tap } from 'rxjs/operators';
import { ViewApprovalDetailsComponent } from '@app/dialog/view-approval-details/view-approval-details.component';
import { RejectApprovalComponent } from '@app/dialog/reject-approval/reject-approval.component';
import { TraineeAttendanceComponent } from '@app/dialog/trainee-attendance/trainee-attendance.component';
import { SessionRecordingsComponent } from '@app/dialog/session-recordings/session-recordings.component';
import { SessionAutoAttendanceComponent } from '@app/dialog/session-auto-attendance/session-auto-attendance.component';
import { UserRoles, AttendanceStatus, UserTypes } from '@app/enums/user-roles';
import { AppComponentBase } from '@shared/app-component-base';
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
  selector: 'app-session-detail-card',
  templateUrl: './session-detail-card.component.html',
  styleUrls: ['./session-detail-card.component.css']
})
export class SessionDetailCardComponent extends AppComponentBase implements OnInit {
  //for copy to clipboard
  @ViewChild(MatSort) sort: MatSort;
  textMessage: any;
  msgHideAndShow: boolean = false;
  isHidden: boolean = true;
  isRecordingAvailable: boolean = true;
  @Input() session: any;
  @Input() approval: any;
  @Input() recordingApproval: any;
  @Input() sessionScheduleId;
  @Input() sessionStatusdataSource: MatTableDataSource<any>;
  userId = this.appSession.user.id;
  traineeId = this.appSession.user.id;
  sessionStatusColumn: string[] = ['Status'];
  attendanceStatus: any = AttendanceStatus;
  recordingApprovalStatus: any = RecordingApprovalStatus;
  absenteesStatus: number = AttendanceStatus.Absent;
  isRecordringApproval: boolean = false;
  sessionType: any = SessionType;
  sessionStatus: any = SessionStatus;
  rolePermissions: any[] = [];
  participentStatus: any[] = [];
  Code: string = "SESION";
  readAllPermission: boolean;
  isMentor: boolean = true;
  updatePermission: boolean;
  deletePermission: boolean;
  isTrainerTrainee: boolean;
  currentUserRole: string = this.dataservice.currentUserRole.toUpperCase();
  showModifyCancelSession: boolean = false;
  isSuperAdmin: boolean;
  isSessionCardViewEnabled: boolean;
  isApprovalCardViewEnabled: boolean;
  sessionApprovalStatus: any = SessionApprovalStatus;
  currentTenantId: number;
  statusList: any[] = [];
  status: string;
  absentees: number;
  isRecordringCardViewApproval: boolean;
  @Input() sessionStatusList: FilterSessionStatus[] = [];
  @Output() loadUpcomingTab = new EventEmitter<string>();
  @Output() loadCompletedTab = new EventEmitter<string>();
  @Output() loadWebinarTab = new EventEmitter<string>();
  @Output() loadApprovalTab = new EventEmitter<string>();

  constructor(
    injector: Injector,
    private router: Router,
    private dataservice: dataService,
    private modService: ModService,
    private sessionService: AppSessionService,
    private dialog: MatDialog,
    private dataService: dataService,
    private toastr: ToastrService) {
    super(injector);
  }
  ngOnInit() {
    this.sessionStatusdataSource = new MatTableDataSource<FilterSessionStatus>(this.sessionStatusList);
    this.currentTenantId = this.dataservice.currentTenentId;
    if (this.currentUserRole == 'TRAINER' || this.currentUserRole == 'TRAINEE') {
      this.isTrainerTrainee = true;
    }
    this.statusList = Object.keys(AttendanceStatus).filter(
      (type) => isNaN(<any>type) && type !== 'values');
    if (this.session) {
      this.isSessionCardViewEnabled = true;
      if (this.session.sessionStatus !== SessionStatus.Completed) {
        this.showModifyCancelSession = true;
      }
    }
    else if (this.approval) {
      this.isApprovalCardViewEnabled = true;
    }
    else if (this.recordingApproval) {
      this.isRecordringCardViewApproval = true;
    }

    if (!this.dataservice.currentTenentId) {
      this.isSuperAdmin = true;
    }
    this.getPermissions();
    this.findSessionStatus(this.session);
  }

  toggleShow() {
    this.isRecordingAvailable = !this.isRecordingAvailable;
  }

  viewMore(sessionScheduleId) {
    let sessionId = btoa(sessionScheduleId);
    this.router.navigate(['app/session-details', sessionId]);
  }

  viewReviewAssignments(sessionScheduleId: string) {
    let sessionId = btoa(sessionScheduleId);
    this.router.navigate(['/app/review-assignments', sessionId]);
  }

  viewRecordingOptions(sessionScheduleId: string) {
    {
      let sessionId = btoa(sessionScheduleId);
      debugger;
      if (this.status == this.attendanceStatus.Absent) {
        this.isRecordingAvailable = false;
        this.router.navigate(['app/session-details', sessionId]);
      }
      else
        this.isRecordingAvailable = true;
      this.router.navigate(['app/session-details', sessionId]);
    }
  }

  sendRecordingRequest() {
    let data = {
      SessionId: this.session.sessionScheduleId,
      ApproverId: this.session.trainerApproverid,
      TraineeId: this.userId
    }
    this.modService.createRecordingRequest(data).pipe(
      finalize(() => {
        this.dataservice.isLoading = this.dataservice.doneLoading();
      })).subscribe(res => {
        if (res.result) {
          this.toastr.success("Recording has been requested successfully");
        }
      },
        err => {
          this.toastr.error("Something went wrong try again later");
        });

  }

  findSessionStatus(session: any) {
    debugger;
    
      // let RecordingId = this.recordingApproval.id;
  
    
    this.modService.GetAbsenteesDetailsAsync(session.sessionScheduleId, this.userId).pipe(
      finalize(() => { this.dataService.isLoading = this.dataService.doneLoading(); })
    )
      .subscribe(res => {
        if (res.result) {
          let participentStatus = res.result.sessionParticipantStatus;

          if (participentStatus) {
            for (let i = 0; i < participentStatus.length; i++) {
              //this.notificationlists.push({ attendanceStatus: res.result[i] });
              this.participentStatus.push({ attendanceStatus: participentStatus[i].attendanceStatus });
              this.absentees = participentStatus[i].attendanceStatus;
              console.log("from participemts:",this.absentees);
              
              this.attendanceStatus = AttendanceStatus.Absent;
              console.log("from enum", this.attendanceStatus);
              if(this.absentees == this.attendanceStatus){
                this.recordingApprovalStatus.Requested;
                this.isRecordingAvailable = false;

              }
              else
              {
                this.recordingApprovalStatus.Approved;
                this.isRecordingAvailable = true;
              }
            }
          }
          if (this.currentUserRole == 'TRAINEE') {
            debugger;
            if (this.absentees !== AttendanceStatus.Absent) {
              this.isRecordingAvailable = true;
              console.log(this.isRecordingAvailable);
            }
          }
          else {
            this.isRecordingAvailable = false;
          }
          this.sessionStatusdataSource = new MatTableDataSource<FilterSessionStatus>(this.sessionStatusList);
          this.sessionStatusdataSource.sort = this.sort;
        }
      });
  }

  getSessionParticipantRole(session: any) {
    this.modService.getSessionParticipantRole(session.sessionScheduleId, this.dataservice.currentPlatformUserId).subscribe(res => {
      if (res.result) {
        this.dataservice.currentSessionParticipantRole = res.result.participantRole.toUpperCase();
        this.joinSession(session);
      }
    }, err => {
      this.toastr.error("Something went wrong try again later");
    });
  }

  viewMoreApprovalDetails() {
    const viewMoreApprovalDetailsDialog = this.dialog.open(ViewApprovalDetailsComponent, {
      data: {
        sessionTitle: this.approval.sessionTitle,
        approvalRequestorTenantName: this.approval.approvalRequestorTenantName,
        requestedUserName: this.approval.requestedUserName,
        startDate: this.approval.startDate,
        endDate: this.approval.endDate,
        trainerName: this.approval.trainerName,
        traineeCount: this.approval.traineeCount,
        sessionApprovalStatus: this.approval.sessionApprovalStatus,
        approvalRequestorTenant: this.approval.approvalRequestorTenant,
        description: this.approval.description
      }
    });
  }

  approve() {
    this.dataservice.isLoading = true;
    this.modService.createScheduleMany(this.approval).subscribe(res => {
      if (res.result) {
        let data = {
          "id": this.approval.id,
          "modifiedBy": this.dataservice.currentUserId,
          "sessionApprovalStatus": this.sessionApprovalStatus.Approved
        };
        this.modService.updateApprovalStatus(data).pipe(
          finalize(() => {
            this.dataservice.isLoading = this.dataservice.doneLoading();
          })).subscribe(element => {
            if (element.result) {
              this.loadApprovalTab.emit();
              this.toastr.success("Session has been approved and scheduled successfully");
            }
          }, err => {
            this.toastr.error("Something went wrong try again later");
          });
      }
    }, err => {
      this.toastr.error("Something went wrong try again later");
    });
  }

  //approve method for approving the recoring for trainee
  approveRecording() {
    let data = {
      "id": this.recordingApproval.id,
      "modifiedBy": this.dataservice.currentUserId,
      "recordingApprovalStatus": this.recordingApprovalStatus.Approved
    };
    this.modService.updateRecordingApprovalStatus(data).pipe(
      finalize(() => {
        this.dataservice.isLoading = this.dataservice.doneLoading();
      })).subscribe(res => {
        if (res.result) {
          this.loadApprovalTab.emit();
          this.toastr.success("Recording has been approved successfully");
        }
      }, err => {
        this.toastr.error("Something went wrong try again later");
      });
  }
  reject() {
    let data = {
      "id": this.approval.id,
      "modifiedBy": this.dataservice.currentUserId,
      "sessionApprovalStatus": this.sessionApprovalStatus.Rejected,
      "description": ''
    };
    const rejectApprovalDialog = this.dialog.open(RejectApprovalComponent);
    rejectApprovalDialog.afterClosed().subscribe(result => {
      if (result && result.isRejected) {
        if (result.description)
          data.description = "Description: " + result.description;
        this.dataservice.isLoading = true;
        this.modService.updateApprovalStatus(data).pipe(
          finalize(() => {
            this.dataservice.isLoading = this.dataservice.doneLoading();
          })).subscribe(element => {
            if (element.result) {
              this.loadApprovalTab.emit();
              this.toastr.success("Session request has been rejected successfully");
            }
          }, err => {
            this.toastr.error("Something went wrong try again later");
          });
      }
    });
  }

  joinSession(session): void {
    this.dataservice.sessionCode = session.sessionCode;
    this.dataservice.sessionTitle = session.sessionTitle;
    this.dataservice.sessionScheduleId = session.sessionScheduleId;
    this.dataservice.sessionType = session.sessionType;
    this.router.navigate(['app/join-session'], { queryParams: { sessioncode: session.sessionCode } });

  }

  viewFeedback(sessionScheduleId: string) {
    let sessionId = btoa(sessionScheduleId);
    this.router.navigate(['app/overall-feedback', sessionId]);
  }

  canJoinSession(session: any): boolean {
    let currenDate = new Date();
    let difference = (new Date(session.startDate)).getTime() - currenDate.getTime();
    let resultInMinutes = Math.round(difference / 60000);
    return new Date(session.endDate) > currenDate && resultInMinutes <= 5;
  }

  viewPlayBack(session: any) {
    this.dataservice.isLoading = true;
    this.modService.getVideoPlayBackDetails(session.sessionScheduleId).pipe(finalize(() => {
      this.dataservice.isLoading = this.dataservice.doneLoading();
    })).subscribe(res => {
      if (res.success) {
        if (res.result.errorMessage == null) {
          const sessionRecordingDialog = this.dialog.open(SessionRecordingsComponent, {
            data: {
              recordingData: res.result.bbbRecordingUrls,
              startDate: session.startDate,
              endDate: session.endDate,
              sessionTitle: session.sessionTitle
            }
          });
        }
        else
          this.toastr.warning(res.result.errorMessage);
      }
    });
  }

  copyUrl(sessionUrl: string, isMODApplication: boolean): void {
    let customUrl: string = sessionUrl;
    if (!isMODApplication) {
      customUrl = sessionUrl.replace("/join-session?sessiontoken", "/conference?conferencetoken");
    }
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = customUrl;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.toastr.success('Copied to clipboard');
  }

  cancelSession(session) {
    if (this.deletePermission) {
      const deleteSessionDialog = this.dialog.open(DeleteSessionDialogComponent, {
        data: {
          deleteSessionId: session.sessionScheduleId,
          title: session.sessionTitle
        }
      });
      deleteSessionDialog.afterClosed().subscribe(result => {
        if (result && result.isDeleted) {
          if (session.sessionType !== SessionType.Webinar) {
            this.loadUpcomingTab.emit();
            this.loadCompletedTab.emit();
          }
          else
            this.loadWebinarTab.emit();
          this.toastr.success("Session has been deleted successfully");
        }
      });
    }
    else {
      this.toastr.warning("You don't have permission to cancel a session");
    }
  }

  getPermissions() {
    this.rolePermissions = this.dataservice.rolePermissions;
    let permissions = this.rolePermissions.find(val => val.feature.featureCode === this.Code);
    if (permissions) {
      this.updatePermission = permissions.update;
      this.deletePermission = permissions.delete;
    }
    else {
      this.updatePermission = this.deletePermission = false;
    }
  }

  reScheduleSession(session) {
    if (this.updatePermission) {
      const rescheduleSessionDialog = this.dialog.open(RescheduleSessionDialogComponent, {
        data: {
          sessionId: session.sessionScheduleId,
          startDate: session.startDate,
          endDate: session.endDate,
          sessionTitle: session.sessionTitle,
          sessionType: session.sessionType
        }
      });
      rescheduleSessionDialog.afterClosed().subscribe(result => {
        if (result && result.isUpdated) {
          if (session.sessionType !== SessionType.Webinar) {
            this.loadUpcomingTab.emit();
            this.loadCompletedTab.emit();

          }
          else
            this.loadWebinarTab.emit();
          this.toastr.success("Session has been rescheduled successfully");
        }
      });
    }
    else {
      this.toastr.warning("You don't have permission to reschedule a session");
    }
  }

  viewAssignments(session: any): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = false;
    dialogConfig.width = '80vw';
    const dialogRef = this.dialog.open(MenteeSessionDetailsComponent, dialogConfig);
    dialogRef.componentInstance.session = session;
  }

  viewPollsAnalysisList(sessionScheduleId: number) {
    this.dialog.closeAll();
    const pollAnalysisDialog = this.dialog.open(PollAnalysisComponent, {
      width: '50%',
      data: {
        associateId: sessionScheduleId,
        associateType: PollType.Session
      }
    });
  }

  newPoll(session: any) {
    let currentDates = new Date();
    let sessionStartDate = new Date(session.startDate);
    let sesionEndDate = new Date(session.endDate);
    if (currentDates < sessionStartDate) {
      this.toastr.warning("Polls can be created only for ongoing-session")
    }
    else if (currentDates > sesionEndDate) {
      this.toastr.warning("Session expired");
    }
    else {
      this.dialog.closeAll();
      const pollCreatorDialog = this.dialog.open(PollCreatorComponent, {
        width: '50%',
        data: {
          associateId: session.sessionScheduleId,
          associateType: PollType.Session
        }
      });
    }
  }
  addAttendance() {
    const dialogRef = this.dialog.open(TraineeAttendanceComponent, { disableClose: true, autoFocus: false, data: { sessionId: this.session.sessionScheduleId, sessionTitle: this.session.sessionTitle } });
  }

  // Download Attendance method is required to get the auto attendance csv file from ruby server
  // ruby server required internal meeting id to be passed in the url for calling 
  async downloadAttendance(session: any) {
    this.dataservice.isLoading = true;
    this.modService.getSessionDetailsForAttendanceAsync(session.sessionScheduleId, this.getTimeZoneInfo()).pipe(finalize(() => {
      this.dataservice.isLoading = this.dataservice.doneLoading();
    })).subscribe(res => {
      if (res.result.sessionInternalMeetingDtos.length > 0) {
        const autoAttendanceDialog = this.dialog.open(SessionAutoAttendanceComponent, {
          data: {
            attendanceData: res.result.sessionInternalMeetingDtos,
            sessionDate: res.result.sessionDate,
            sessionTitle: res.result.sessionTitle,
            startDate: session.startDate,
            endDate: session.endDate
          }
        });
      }
      else {
        this.toastr.warning("Auto attendance report is not available for the session.");
        return false;
      }
    })
  }
  getTimeZoneInfo() {
    return /\((.*)\)/.exec(new Date().toString())[1];
  }

  //to display message after link copied
  textMessageFunc(msgText) {
    this.textMessage = msgText + " Copied to Clipboard";
    this.msgHideAndShow = true;
    setTimeout(() => {
      this.textMessage = "";
      this.msgHideAndShow = false;
    }, 5000);
  }

  //Generate guest user session join link
  copyGuestSessionJoinLink(session) {
    this.modService.guestUserSessionJoinUrl(session.sessionCode, "Guest", "User").subscribe(res => {
      if (res.result) {
        document.addEventListener('copy', (e: ClipboardEvent) => {
          e.clipboardData.setData('text/plain', (res.result));
          e.preventDefault();
          document.removeEventListener('copy', null);
        });
        document.execCommand('copy');
        this.textMessageFunc('Link');
      }
    }, err => {
    });
  }

  //To validate the visibility of link copy button
  canGuestJoinSession(session: any): boolean {
    let currenDate = new Date();
    let difference = (new Date(session.approve)).getTime() - currenDate.getTime();
    if (this.session.participants[0].participantUser.tenant.tenantName.toLowerCase() === "hpe") {
      if (difference > 0)
        return true;
      else
        return false;
    }
    else
      return false;
  }
}
