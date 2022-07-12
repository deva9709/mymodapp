import { Component, OnInit, ViewChild, Injector } from "@angular/core";
import { dataService } from "@app/service/common/dataService";
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ModService } from "@app/service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Guid } from "guid-typescript";
import { ToastrService } from "ngx-toastr";
import { AppComponentBase } from "@shared/app-component-base";
import { AppSessionService } from "@shared/session/app-session.service";
import { MatPaginator, MatSort, MatTableDataSource } from "@angular/material";
import { Router,ActivatedRoute } from "@angular/router";
import { JoinMechanism, SessionStatus, SessionRecurrence, SessionType, RequestSessionErrorMessages } from "@app/enums/user-roles";
import * as SurveyCreator from "survey-creator";
import { DatePipe } from '@angular/common';
import { finalize } from "rxjs/operators";
import { WhiteSpaceValidators } from "@shared/validators/whitespace.validator";
import { MenteeSessionDetailsComponent } from "./mentee-session-details/mentee-session-details.component";
import { ViewAssignmentDocumentComponent } from "../view-assignment-document/view-assignment-document.component";
import { Observable } from "rxjs";
import { DocumentFileType } from "@app/enums/document-type";
import { CostType } from '@app/enums/user-roles';
import { ViewMoreDetailsComponent } from "@app/dialog/view-more-details/view-more-details.component";
import { AddSkillComponent } from "@app/dialog/add-skill/add-skill.component";
import { TimeCheckValidators } from '@shared/validators/timecheck.validator';
import * as moment from "moment";
SurveyCreator.StylesManager.applyTheme("default");


export interface ISessionList {
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  sessions: ISessionDetails[];
}

export interface ISessionDetails {
  tenant: any;
  sessionScheduleId: number;
  startDate: Date;
  endDate: Date;
  sessionTitle: string;
  sessionCode: string;
  sessionUrl: string;
  scheduleRecurrence: number;
  joinMechanism: number;
  requestedUser: any;
  skills: any[];
  sessionStatus: number;
  participants: any[];
  microTutorings: any[];
  sessionType: number;
  participantCount: number;
  isLoggedInUserCanBeTrainee:boolean;
  isLoggedInUserCanBeTraineeId:number;
}

export interface IUser {
  id: number;
  tenantDisplayName: string;
  tenancyName: string;
  role: string;
  emailAddress: string;
  name: string;
  surname: string;
  tenantId: number;
}

export interface IFilters {
  pageSize: number;
  pageNumber: number;
  tenantId: number;
  timeZone: string;
  sessionStatus: number[];
  startDate: string;
  endDate: string;
  platformUserId: number;
  sessionType: number;
  readAll: boolean;
}

export interface IAssignmentList {
  title: string;
  skills: string;
}

@Component({
  selector: "app-mod-sessions",
  templateUrl: "./mod-sessions.component.html",
  styleUrls: ["./mod-sessions.component.css"],
  providers: [DatePipe]
})

export class ModSessionsComponent extends AppComponentBase implements OnInit {
  isGlobalSearch:string;
  searchInput:string;
  sessionStatus:string;
  seletedTabName:number;
  autoComplete = false;
  assignmentStatus = false;
  webinarStatus: boolean = false;
  sessions = false;
  createEdit = false;
  mentors: any = []; // all mentors
  mentees = []; //all mentees
  selectedMentors = []; // selected by ng model
  selectedMentees = []; // selected by ng model
  selectedMentorPlatformId: number;
  selectedTrainerTenantId: number;
  isExternalTrainerSelected: boolean;
  selectedSkill = [];
  skillList = [];
  mentorName;
  menteeName;
  rolePermissions: any[] = [];
  createPermission: boolean;
  readAllPermission: boolean;
  updatePermission: boolean;
  deletePermission: boolean;
  approvePermission: boolean;
  isTrainerTrainee:boolean;
  Code: string = "SESION";
  permissionCode = "BATCH";
  mentorDropdownSettings: IDropdownSettings = {};
  menteeDropdownSettings: IDropdownSettings = {};
  skillDropdownSettings: IDropdownSettings = {};
  scheduleForm: FormGroup;
  upcomingFilterForm: FormGroup;
  completedFilterForm: FormGroup;
  webinarFilterForm: FormGroup;
  selectedMenteeDetails = []; // pass this to api
  selectedMentorDetails = []; // pass this to api
  selectedSkillId: number;
  minDate = new Date();
  endMinDate = new Date();
  upcomingSessionStartMinDate = new Date();
  upcomingSessionEndMinDate = new Date();
  completedSessionendMinDate = new Date();
  completedSessionendMaxDate = new Date();
  completedSessionstartMaxDate = new Date();
  webinarSessionStartMinDate = new Date();
  webinarSessionEndMinDate = new Date();
  sessionDisplayedColumns: string[] = ['sessionTitle', 'mentorName', 'menteeName', 'startDate', 'endDate', 'sessionUrl', 'action', 'playBack', 'feedBack', 'polls'];// 'createPoll', 'viewPoll'
  trainersDisplayedColumns: string[] = ['name', 'experience', 'skillTech', 'languages', 'location', 'cost'];
  sessionList: ISessionList;
  currentUserRole: string;
  sessionApprovals: any[] = [];
  recordingApprovals: any[] = []; // added for recording approval array list.
  approvalDataSource: MatTableDataSource<any>;
  approvalRecordingDataSource: MatTableDataSource<any>;
  upcomingDataSource: MatTableDataSource<ISessionDetails>;
  completedDataSource: MatTableDataSource<ISessionDetails>;
  webinarDataSource: MatTableDataSource<ISessionDetails>;
  trainersDetails: MatTableDataSource<any>;
  isLoading: boolean;
  timeIntervals: any[] = [{ "key": 0, "value": "12:00 AM" }, { "key": 1, "value": "12:30 AM" }, { "key": 2, "value": "01:00 AM" }, { "key": 3, "value": "01:30 AM" },
  { "key": 4, "value": "02:00 AM" }, { "key": 5, "value": "02:30 AM" }, { "key": 6, "value": "03:00 AM" }, { "key": 7, "value": "03:30 AM" }, { "key": 8, "value": "04:00 AM" },
  { "key": 9, "value": "04:30 AM" }, { "key": 10, "value": "05:00 AM" }, { "key": 11, "value": "05:30 AM" }, { "key": 12, "value": "06:00 AM" }, { "key": 13, "value": "06:30 AM" },
  { "key": 14, "value": "07:00 AM" }, { "key": 15, "value": "07:30 AM" }, { "key": 16, "value": "08:00 AM" }, { "key": 17, "value": "08:30 AM" }, { "key": 18, "value": "09:00 AM" },
  { "key": 19, "value": "09:30 AM" }, { "key": 20, "value": "10:00 AM" }, { "key": 21, "value": "10:30 AM" }, { "key": 22, "value": "11:00 AM" }, { "key": 23, "value": "11:30 AM" },
  { "key": 24, "value": "12:00 PM" }, { "key": 25, "value": "12:30 PM" }, { "key": 26, "value": "01:00 PM" }, { "key": 27, "value": "01:30 PM" }, { "key": 28, "value": "02:00 PM" },
  { "key": 29, "value": "02:30 PM" }, { "key": 30, "value": "03:00 PM" }, { "key": 31, "value": "03:30 PM" }, { "key": 32, "value": "04:00 PM" }, { "key": 33, "value": "04:30 PM" },
  { "key": 34, "value": "05:00 PM" }, { "key": 35, "value": "05:30 PM" }, { "key": 36, "value": "06:00 PM" }, { "key": 37, "value": "06:30 PM" }, { "key": 38, "value": "07:00 PM" },
  { "key": 39, "value": "07:30 PM" }, { "key": 40, "value": "08:00 PM" }, { "key": 41, "value": "08:30 PM" }, { "key": 42, "value": "09:00 PM" }, { "key": 43, "value": "09:30 PM" },
  { "key": 44, "value": "10:00 PM" }, { "key": 45, "value": "10:30 PM" }, { "key": 46, "value": "11:00 PM" }, { "key": 47, "value": "11:30 PM" }];
  endTimeIntervals: any[] = [];
  startTimeIntervals: any[] = [];
  startMinTime: string;
  endMinTime: string;
  @ViewChild('startTimePicker') startTimePicker: any;
  @ViewChild('endTimePicker') endTimePicker: any;
  timePattern: string = "((1[0-2]|0?[1-9]):([0-5][0-9]) ?([AaPp][Mm]))";
  defaultStartTime: string;
  defaultEndTime: string;
  startTimeCheck: Date;
  currentTimeCheck: Date;
  endTimeCheck: Date;
  isValidDate = false;
  dateFormat = { startDate: '', startTime: '', endDate: '', endTime: '' };
  selectedSkillIdList: number[] = [];
  isSuperAdmin: boolean;
  pollName: any;
  //joinMechanisms: any[] = [{ key: "Twilio", value: "Twilio" }, { key: "Teams", value: "Microsoft Teams" }, { key: "BBB", value: "IIHT" }];
  joinMechanisms: any[] = [{ key: "BBB", value: "IIHT" }, { key: "Teams", value: "Microsoft Teams" }];
  selectedjoinMechanism: string;
  scheduleFormValidationMessages = {
    sessionTitleRequired: 'Please enter the session title',
    sessionTitleWhiteSpace: 'Please enter valid session title',
    selectedSkillRequired: 'Please select minimum one skill',
    selectedMentorRequired: 'Please select the mentor',
    selectedMenteeRequired: 'Please select minimum one mentee',
    startDateRequired: 'Please select the start date',
    startTimeRequired: 'Please select the start time',
    endDateRequired: 'Please select the end date',
    endTimeRequired: 'Please select the end time',
    joinMechanismRequired: 'Please select the communication channel',
    sessionTitleMaxLimit: 'Titile should be less than 300 character',
    startTimePattern: 'Start time pattern should be 12 hr format like 12:00 am',
    endTimePattern: 'End time pattern should be 12 hr format like 12:00 am',
    startTimeCheck: 'Start time should be greater than current time',
    endTimeCheck: 'End time should be less than start time'
  };
  currentTenantId: number;
  isScheduleSubmitted: boolean;
  trainers: any[] = [];
  duration60Min: string;
  filters: IFilters;
  showNoAssignments: boolean;
  assignmentList: any;
  showCreateSession: boolean = false;
  outSourceExternalTrainerStatus: boolean = false;
  externalTrainerStatus: boolean = false;
  filteredAssignments: any;
  selectedAssignments: any = [];
  selectedAssignmentId: any = [];
  includeAssignment = false;
  approvalObservable: Observable<any>;
  recodingApprovalObservable: Observable<any>; // added for recording observable generic type
  upcomingObservable: Observable<any>;
  completedObservable: Observable<any>;
  webinarObservable: Observable<any>;
  isFormSubmitted: boolean = false;
  documentFileType = DocumentFileType;
  upcomingSessionSearchWord: string = "";
  completedSessionSearchWord: string = "";
  webinarSearchWord: string = "";
  batchList: any[] = [];
  batchListValue: any[];
  isHideFlagForTraineeAndBatch: boolean;
  isHideFlagForTrainee: boolean;
  batchMemberList: any[];
  memberList: any[] = [];
  @ViewChild('trainersPaginator') trainersPaginator: MatPaginator;
  @ViewChild('upComingPaginator') upComingPaginator: MatPaginator;
  @ViewChild('completedPaginator') completedPaginator: MatPaginator;
  @ViewChild('webinarPaginator') webinarPaginator: MatPaginator;
  @ViewChild('approvalPaginator') approvalPaginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('trainersSort') trainersSort: MatSort;
  batchDetails: any;
  userId: any;
  title: any;
  resourceDetails: any;
  participantlist: any[];
  isSelectBatch: boolean;
  createBatchPermission: any;
  batchess: any[];
  filteredTenants: string[];
  autoResult() {
    this.autoComplete = false;
  }

  editSession(isCreateSession: number) {
    this.scheduleForm.reset();
    this.scheduleForm.controls.startTime.disable();
    this.scheduleForm.controls.endTime.disable();
    this.trainersDetails = new MatTableDataSource<any>([]);
    this.endMinDate = new Date();
    this.autoComplete = false;
    this.assignmentStatus = false;
    this.includeAssignment = false;
    this.webinarStatus = false;
    this.externalTrainerStatus = false;
    this.outSourceExternalTrainerStatus = false;
    this.mentors = [];
    this.sessions = !this.sessions;
    this.isSelectBatch = false;
    this.getUserDetails(this.dataService.currentTenentId);
  }

  addAssignment(event: any) {
    this.assignmentStatus = !this.assignmentStatus;
    this.selectedAssignmentId = [];
    this.selectedAssignments = [];
    if (event.checked) {
      this.modService.GetAllAssignmentForUser(this.dataService.currentUserId).subscribe(res => {
        this.assignmentList = res.result ? res.result : [];
      });
    }
  }

  webinar(event: any) {
    this.webinarStatus = event.checked;
    if (event.checked)
      this.scheduleForm.get("selectedMentee").setValidators(null);
    else
      this.scheduleForm.get("selectedMentee").setValidators([Validators.required]);
    this.selectedMentees = [];
    this.selectedAssignmentId = [];
    this.selectedAssignments = [];
    this.includeAssignment = false;
    this.assignmentStatus = false;
  }

  viewDocuments(assignment: any, documentType: string): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = false;
    dialogConfig.width = '80vw';
    const dialogRef = this.dialog.open(ViewAssignmentDocumentComponent, dialogConfig);
    dialogRef.componentInstance.assignment = assignment;
    dialogRef.componentInstance.documentType = documentType;
  }

  constructor(
    public dataService: dataService,
    injector: Injector,
    public dialog: MatDialog,
    private modService: ModService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private sessionService: AppSessionService,
    private datePipe: DatePipe,
    private router: Router,
    private toastService: ToastrService, private route: ActivatedRoute) {
    super(injector);
  }
  sessionDetail(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = false;
    dialogConfig.width = '60vw';
    const dialogRef = this.dialog.open(MenteeSessionDetailsComponent, dialogConfig);
  }
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.isGlobalSearch = params['globalSearch'];
      this.searchInput=params['name'];
      this.sessionStatus=params['status'];
    });
    this.currentTenantId = this.dataService.currentTenentId;
    this.userId = this.dataService.currentPlatformUserId;
    this.duration60Min = CostType.Min60;
    this.isSuperAdmin = this.dataService.isSuperAdmin;
    if (this.isSuperAdmin) {
      this.createPermission = false;
      this.readAllPermission = true;
    }
    else {
      this.getPermissions();
      this.getJoiningMechanismStatus();
      this.getAllSessionApprovals();
      this.getAllRecordingApprovals(); // added for get recording approval
    }
    this.dataService.pageName = 'Sessions';
    this.initForm();
    this.modService.getAllSkill().subscribe(res => {
      this.skillList = res.result.items;
    });
    this.currentUserRole = this.dataService.currentUserRole;
    if(this.currentUserRole=='Trainer'|| this.currentUserRole=='Trainee'){
      this.isTrainerTrainee=true;
    }
    this.dataService.isLoading = true;
    this.filters = {
      pageSize: 1000,
      pageNumber: 1,
      tenantId: this.dataService.currentTenentId ? this.dataService.currentTenentId : 0,
      timeZone: this.getTimeZone(),
      sessionStatus: [SessionStatus.Requested, SessionStatus.Scheduled, SessionStatus.InProgress],
      sessionType: SessionType.Scheduled,
      startDate: "01/03/2020 05:00 PM",
      endDate: "11/03/2030 05:00 PM",
      platformUserId: (this.isSuperAdmin) ? 0 : this.appSession.user.id,
      readAll: this.readAllPermission
    };
    this.getUpcomingSessionList();
    this.getCompletedSessionList();
    this.getWebinarList();
    this.mentorDropdownSettings = {
      singleSelection: true,
      idField: 'platformUserId',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 5,
      allowSearchFilter: true
    };

    this.skillDropdownSettings = { ...this.mentorDropdownSettings, singleSelection: false, idField: 'id' };

    this.menteeDropdownSettings = { ...this.mentorDropdownSettings, singleSelection: false, idField: 'id' };

    this.getUserDetails(this.dataService.currentTenentId);
    this.trainersDetails = new MatTableDataSource<any>(this.trainers);
  }

  viewMoreUserDetails(data): void {
    const viewMoreDetailsComponent = new MatDialogConfig();
    viewMoreDetailsComponent.autoFocus = false;
    viewMoreDetailsComponent.width = '60vw';
    const dialogRef = this.dialog.open(ViewMoreDetailsComponent, viewMoreDetailsComponent);
    dialogRef.componentInstance.tanentValue = data;
  }

  getJoiningMechanismStatus() {
    this.modService.getJoiningMechanismStatus(this.dataService.currentTenentId).subscribe(res => {
      if (res.result) {
        if (res.result.twillioDisabledStatus && res.result.teamsDisabledStatus)
          this.joinMechanisms = [];
        else if (res.result.twillioDisabledStatus)
          this.joinMechanisms = [{ key: "BBB", value: "IIHT" }, { key: "Teams", value: "Microsoft Teams" }];
        else if (res.result.teamsDisabledStatus)
          this.joinMechanisms = [{ key: "BBB", value: "IIHT" }];
      }
    });
    this.selectedjoinMechanism = "BBB";
  }

  getAllSessionApprovals() {
    this.modService.getAllApprovals(this.dataService.currentTenentId).pipe(
      finalize(() => {
        this.dataService.isLoading = this.dataService.doneLoading();
      })).subscribe(res => {
        if (res.result) {
          this.sessionApprovals = res.result ? res.result : [];
          this.approvalDataSource = new MatTableDataSource<any>(this.sessionApprovals);
          this.approvalDataSource.paginator = this.approvalPaginator;
          this.approvalObservable = this.approvalDataSource.connect();
        }
      });
  }

  // get method added for recording approval
  getAllRecordingApprovals() {
      this.modService.getAllRecordingApprovals(this.dataService.currentPlatformUserId).pipe(
      finalize(() => {
        this.dataService.isLoading = this.dataService.doneLoading();
      })).subscribe(res => {
        if (res.result) {
          console.log("get recording approval details:", res.result);
          this.recordingApprovals = res.result ? res.result : [];
          this.approvalRecordingDataSource = new MatTableDataSource<any>(this.recordingApprovals);
          this.approvalRecordingDataSource.paginator = this.approvalPaginator;
          this.recodingApprovalObservable = this.approvalRecordingDataSource.connect();
          console.log("get recording approval details:", this.recodingApprovalObservable);
        }
      });
  }

  refreshApprovalsAndSessions() {
    this.getAllSessionApprovals();
    this.getUpcomingSessionList();
    this.getAllRecordingApprovals();
  }
  getUpcomingSessionList() {
    this.upcomingFilterForm.reset();
    this.modService.getAllSchedule(this.filters).pipe(
      finalize(() => {
        this.dataService.isLoading = this.dataService.doneLoading();
      })).subscribe(res => {
        let date = new Date();
        let today = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
        this.dataService.upcomingSessionList = res.result ? res.result : [];
        this.dataService.upcomingSessionList.sessions.map(s => (s.startDate = new Date(`${s.startDate}.000Z`), s.endDate = new Date(`${s.endDate}.000Z`)));
        this.dataService.upcomingSessionList.sessions = this.dataService.upcomingSessionList.sessions.filter(session => session.sessionType !== SessionType.Webinar && session.endDate >= today);
        if (!this.isSuperAdmin) {
          this.dataService.upcomingSessionList.sessions = this.dataService.upcomingSessionList.sessions.filter(session => session.tenant.id === this.currentTenantId);
        }
         //To get all upcoming sessions for  trainer only
         if (this.dataService.currentUserRole==="Trainer") {
           this.dataService.upcomingSessionList.sessions = this.dataService.upcomingSessionList.sessions.filter(session=>session.participants[0].participantUser.platformUserId=== this.dataService.currentUserId || session.isLoggedInUserCanBeTraineeId===this.dataService.currentUserId);
         }
          //To get all upcoming sessions for  global search only
          if (this.isGlobalSearch==="true"&& this.sessionStatus==="UpcomingSession"&&this.searchInput!=="UpcomingSession") {
           this.dataService.upcomingSessionList.sessions = this.dataService.upcomingSessionList.sessions.filter(session=>session.sessionTitle=== this.searchInput);
         }
        this.dataService.upcomingSessionList.sessions = this.dataService.upcomingSessionList.sessions.sort((a, b) => +b.endDate - +a.endDate);
        this.upcomingDataSource = new MatTableDataSource<ISessionDetails>(this.dataService.upcomingSessionList.sessions);
        this.upcomingDataSource.paginator = this.upComingPaginator;
        this.upcomingObservable = this.upcomingDataSource.connect();
      });
  }

  getCompletedSessionList() {
    this.completedFilterForm.reset();
    let competedFilter = { ...this.filters, sessionStatus: [SessionStatus.Completed] };
    this.modService.getAllSchedule(competedFilter).pipe(
      finalize(() => {
      })).subscribe(res => {
        this.dataService.completedSessionList = res.result ? res.result : [];
        this.dataService.completedSessionList.sessions.map(s => (s.startDate = new Date(`${s.startDate}.000Z`), s.endDate = new Date(`${s.endDate}.000Z`)));
        this.dataService.completedSessionList.sessions = this.dataService.completedSessionList.sessions.filter(session => session.sessionType !== SessionType.Webinar);
        if (!this.isSuperAdmin) {
          this.dataService.completedSessionList.sessions = this.dataService.completedSessionList.sessions.filter(session => session.tenant.id === this.currentTenantId);
        }
        //To get all completed sessions for  trainer only
        if (this.dataService.currentUserRole==="Trainer") {
          this.dataService.completedSessionList.sessions = this.dataService.completedSessionList.sessions.filter(session=>session.participants[0].participantUser.platformUserId=== this.dataService.currentUserId || session.isLoggedInUserCanBeTraineeId===this.dataService.currentUserId);
        }
        //To get all upcoming sessions for  global search only
        if (this.isGlobalSearch==="true"&&this.sessionStatus==="CompletedSession" && this.searchInput!=="CompletedSession") {
          this.seletedTabName=1;
         this.dataService.completedSessionList.sessions = this.dataService.completedSessionList.sessions.filter(session=>session.sessionTitle=== this.searchInput);
       }
       if (this.isGlobalSearch==="true"&&this.sessionStatus==="CompletedSession" && this.searchInput==="CompletedSession") {
        this.seletedTabName=1;
     }
        this.dataService.completedSessionList.sessions = this.dataService.completedSessionList.sessions.sort((a, b) => +b.endDate - +a.endDate);
        this.completedDataSource = new MatTableDataSource<ISessionDetails>(this.dataService.completedSessionList.sessions);
        this.completedDataSource.paginator = this.completedPaginator;
        this.completedObservable = this.completedDataSource.connect();
      });
  }

  getWebinarList() {
    this.webinarFilterForm.reset();
    let webinarFilter = { ...this.filters, sessionType: SessionType.Webinar };
    this.modService.getAllSchedule(webinarFilter).pipe(
      finalize(() => {
      })).subscribe(res => {
        this.dataService.webinarSessionList = res.result ? res.result : [];
        this.dataService.webinarSessionList.sessions.map(s => (s.startDate = new Date(`${s.startDate}.000Z`), s.endDate = new Date(`${s.endDate}.000Z`)));
        this.dataService.webinarSessionList.sessions = this.dataService.webinarSessionList.sessions.filter(session => session.sessionType === SessionType.Webinar);
        this.dataService.webinarSessionList.sessions = this.dataService.webinarSessionList.sessions.sort((a, b) => +b.endDate - +a.endDate);
        this.webinarDataSource = new MatTableDataSource<ISessionDetails>(this.dataService.webinarSessionList.sessions);
        this.webinarDataSource.paginator = this.webinarPaginator;
        this.webinarObservable = this.webinarDataSource.connect();
      });
  }

  upcomingFilterData() {
    if (this.upcomingFilterForm.valid) {
      this.upcomingFilterForm.value.searchWord = this.upcomingFilterForm.value.searchWord != null ? this.upcomingFilterForm.value.searchWord : '';
      let filteredUpcomingSessionList = this.dataService.upcomingSessionList.sessions.filter(s => s.sessionTitle.toLowerCase().includes(this.upcomingFilterForm.value.searchWord.trim().toLowerCase()) && s.startDate.setHours(0, 0, 0, 0).valueOf() >= this.upcomingFilterForm.value.startDate && s.endDate.setHours(0, 0, 0, 0).valueOf() <= this.upcomingFilterForm.value.endDate);
      this.upcomingDataSource = new MatTableDataSource<ISessionDetails>(filteredUpcomingSessionList);
      this.upComingPaginator.firstPage();
      this.upcomingDataSource.paginator = this.upComingPaginator;
      this.upcomingObservable = this.upcomingDataSource.connect();
    }
  }

  completedFilterData() {
    if (this.completedFilterForm.valid) {
      this.completedFilterForm.value.searchWord = this.completedFilterForm.value.searchWord != null ? this.completedFilterForm.value.searchWord : '';
      let filteredCompletedSessionList = this.dataService.completedSessionList.sessions.filter(s => s.sessionTitle.toLowerCase().includes(this.completedFilterForm.value.searchWord.trim().toLowerCase()) && s.startDate.setHours(0, 0, 0, 0).valueOf() >= this.completedFilterForm.value.startDate && s.endDate.setHours(0, 0, 0, 0).valueOf() <= this.completedFilterForm.value.endDate);
      this.completedDataSource = new MatTableDataSource<ISessionDetails>(filteredCompletedSessionList);
      this.completedPaginator.firstPage();
      this.completedDataSource.paginator = this.completedPaginator;
      this.completedObservable = this.completedDataSource.connect();
    }
  }

  webinarFilterData() {
    if (this.webinarFilterForm.valid) {
      this.webinarFilterForm.value.searchWord = this.webinarFilterForm.value.searchWord != null ? this.webinarFilterForm.value.searchWord : '';
      let filteredwebinarSessionList = this.dataService.webinarSessionList.sessions.filter(s => s.sessionTitle.toLowerCase().includes(this.webinarFilterForm.value.searchWord.trim().toLowerCase()) && s.startDate.setHours(0, 0, 0, 0).valueOf() >= this.webinarFilterForm.value.startDate && s.endDate.setHours(0, 0, 0, 0).valueOf() <= this.webinarFilterForm.value.endDate);
      this.webinarDataSource = new MatTableDataSource<ISessionDetails>(filteredwebinarSessionList);
      this.webinarPaginator.firstPage();
      this.webinarDataSource.paginator = this.webinarPaginator;
      this.webinarObservable = this.webinarDataSource.connect();
    }
  }

  filterByUpcomingSessionName(filterValue: string) {
    let filteredUpcomingSessionList = (this.upcomingFilterForm.value.startDate == null && this.upcomingFilterForm.value.endDate == null) ? this.dataService.upcomingSessionList.sessions.filter(s => s.sessionTitle.toLowerCase().includes(filterValue.trim().toLowerCase())) : this.dataService.upcomingSessionList.sessions.filter(s => s.sessionTitle.toLowerCase().includes(filterValue.trim().toLowerCase()) && s.startDate.setHours(0, 0, 0, 0).valueOf() >= this.upcomingFilterForm.value.startDate && s.endDate.setHours(0, 0, 0, 0).valueOf() <= this.upcomingFilterForm.value.endDate);
    this.upcomingDataSource = new MatTableDataSource<ISessionDetails>(filteredUpcomingSessionList);
    this.upComingPaginator.firstPage();
    this.upcomingDataSource.paginator = this.upComingPaginator;
    this.upcomingObservable = this.upcomingDataSource.connect();
  }

  filterByCompletedSessionName(filterValue: string) {
    let filteredCompletedSessionList = (this.completedFilterForm.value.startDate == null && this.completedFilterForm.value.endDate == null) ? this.dataService.completedSessionList.sessions.filter(s => s.sessionTitle.toLowerCase().includes(filterValue.trim().toLowerCase())) : this.dataService.completedSessionList.sessions.filter(s => s.sessionTitle.toLowerCase().includes(filterValue.trim().toLowerCase()) && s.startDate.setHours(0, 0, 0, 0).valueOf() >= this.completedFilterForm.value.startDate && s.endDate.setHours(0, 0, 0, 0).valueOf() <= this.completedFilterForm.value.endDate);
    this.completedDataSource = new MatTableDataSource<ISessionDetails>(filteredCompletedSessionList);
    this.completedPaginator.firstPage();
    this.completedDataSource.paginator = this.completedPaginator;
    this.completedObservable = this.completedDataSource.connect();
  }

  filterByWebinarSessionName(filterValue: string) {
    let filteredwebinarSessionList = (this.webinarFilterForm.value.startDate == null && this.webinarFilterForm.value.endDate == null) ? this.dataService.webinarSessionList.sessions.filter(s => s.sessionTitle.toLowerCase().includes(filterValue.trim().toLowerCase())) : this.dataService.webinarSessionList.sessions.filter(s => s.sessionTitle.toLowerCase().includes(filterValue.trim().toLowerCase()) && s.startDate.setHours(0, 0, 0, 0).valueOf() >= this.webinarFilterForm.value.startDate && s.endDate.setHours(0, 0, 0, 0).valueOf() <= this.webinarFilterForm.value.endDate);
    this.webinarDataSource = new MatTableDataSource<ISessionDetails>(filteredwebinarSessionList);
    this.webinarPaginator.firstPage();
    this.webinarDataSource.paginator = this.webinarPaginator;
    this.webinarObservable = this.webinarDataSource.connect();
  }

  onUpcomingSessionFilterDateChange(value) {
    this.upcomingSessionEndMinDate = value;
  }

  onCompletedSessionFilterDateChange(value) {
    this.completedSessionendMinDate = value;
  }

  onWebinarSessionFilterDateChange(value) {
    this.webinarSessionEndMinDate = value;
  }

  resetUpcomingSessionFilter() {
    this.upcomingFilterForm.reset();
    this.upcomingDataSource = new MatTableDataSource<ISessionDetails>(this.dataService.upcomingSessionList.sessions);
    this.upcomingDataSource.paginator = this.upComingPaginator;
    this.upcomingObservable = this.upcomingDataSource.connect();
  }

  resetCompletedSessionFilter() {
    this.completedFilterForm.reset();
    this.completedDataSource = new MatTableDataSource<ISessionDetails>(this.dataService.completedSessionList.sessions);
    this.completedDataSource.paginator = this.completedPaginator;
    this.completedObservable = this.completedDataSource.connect();
  }

  resetWebinarSessionFilter() {
    this.webinarFilterForm.reset();
    this.webinarDataSource = new MatTableDataSource<ISessionDetails>(this.dataService.webinarSessionList.sessions);
    this.webinarDataSource.paginator = this.webinarPaginator;
    this.webinarObservable = this.webinarDataSource.connect();
  }

  getPermissions() {
    this.rolePermissions = this.dataService.rolePermissions;
    let permissions = this.rolePermissions.find(val => val.feature.featureCode === this.Code);
    let batchPermission = this.rolePermissions.find(val => val.feature.featureCode === this.permissionCode);
    if (batchPermission) {
      this.createBatchPermission = batchPermission.create;
    }
    if (permissions) {
      this.createPermission = permissions.create;
      this.readAllPermission = permissions.readAll;
      this.approvePermission = permissions.approve;
    }
    else {
      this.createPermission = false;
      this.readAllPermission = false;
      this.createBatchPermission = false;
    }
  }

  isSessionCompleted(session: any): boolean {
    return session.sessionStatus === SessionStatus.Completed;
  }

  viewPlayBack(sessionScheduleId: number) {
    this.modService.getVideoPlayBackDetails(sessionScheduleId).subscribe(res => {
      if (res.success) {
        this.dataService.sessionPlayBackURL = res.result.sessionCompositions.length ? res.result.sessionCompositions[0].primaryDownloadUrl : "";
        if (this.dataService.sessionPlayBackURL)
          this.router.navigate(["/app/video-player"]);
        else
          this.toastr.warning("Recording not available, please try after sometime.");
      }
    });
  }

  getUserDetails(tenantId: number): void {
    this.mentees = [];
    let mentee = [];
    this.dataService.isLoading = true;
    this.modService.getUser('').pipe(
      finalize(() => {
        this.dataService.isLoading = this.dataService.doneLoading();
      })
    ).subscribe(users => {
      for (let user of users.result) {
        let modUser: IUser = {
          id: user.platformUserId,
          tenantDisplayName: user.tenantDisplayName,
          tenancyName: user.tenantName,
          role: "2",
          emailAddress: user.email,
          //To display site admin in trainee list
          name: user.role.name==="Site Admin"? user.name+"(SA)":user.name,
          surname: user.surName,
          tenantId: user.tenant.id
        };
        if ((user.canBeMentee ||user.role.name==="Site Admin") && modUser.tenantId === tenantId) {
          mentee.push(modUser);
        }
      }
      this.mentees = mentee;
      if (this.selectedMentorPlatformId)
        this.mentees = this.mentees.filter(x => x.id != this.selectedMentorPlatformId);
    });
  }

  initForm(): void {
    this.scheduleForm = this.formBuilder.group({
      sessionTitle: ['', [Validators.required, WhiteSpaceValidators.emptySpace(), Validators.maxLength(300)]],
      selectedMentor: ['', [Validators.required]],
      selectedMentee: [''],
      selectedSkill: ['', [Validators.required]],
      startDate: ['', [Validators.required]],
      startTime: [{ value: '', disabled: true }, [Validators.required, Validators.pattern(this.timePattern)]],
      endDate: ['', [Validators.required]],
      endTime: [{ value: '', disabled: true }, [Validators.required, Validators.pattern(this.timePattern)]],
      joinMechanism: ['', [Validators.required]],
      roomId: [''],
      searchAssignment: [''],
      batchValue: ['']
    });

    this.upcomingFilterForm = this.formBuilder.group({
      searchWord: [''],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
    });

    this.completedFilterForm = this.formBuilder.group({
      searchWord: [''],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]]
    });

    this.webinarFilterForm = this.formBuilder.group({
      searchWord: [''],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]]
    });
  }

  onMentorSelect(item: any) {
    this.selectedMentorDetails = [];
    this.selectedMentorDetails.push({ id: item, role: "1" });
  }

  outSourceExternalTrainer(event: any) {
    this.outSourceExternalTrainerStatus = event.checked;
    if (this.selectedSkillIdList)
      this.getUserBySkillId();
  }

  externalTrainer(event: any) {
    this.externalTrainerStatus = event.checked;
    if (this.selectedSkillIdList)
      this.getUserBySkillId();
  }

  getUserBySkillId() {
    this.mentors = [];
    let data = { SkillIds: this.selectedSkillIdList, SearchExternalTrainers: this.outSourceExternalTrainerStatus, GetB2CMentors: true, TenantId: this.dataService.currentTenentId ? this.dataService.currentTenentId : 0 };
    if (this.selectedSkillIdList.length) {
      this.modService.getUserBySkill(data).subscribe(res => {
        if (res.result) {
          this.dataService.isLoading = false;
          res.result.map(data => {
            if (data.canBeMentor) {
              if (this.mentors.find(m => m.tenantName === data.tenant.tenantName)) {
                let list = this.mentors.filter(f => f.tenantName === data.tenant.tenantName)[0];
                list.mentorDetails.push(data);
              }
              else {
                let details = { tenantName: data.tenant.tenantName, mentorDetails: [data] };
                this.mentors.push(details);
              }
            }
          });
          if (!this.externalTrainerStatus) {
            this.mentors.map(data => {
              data.mentorDetails = data.mentorDetails.filter(trainer => trainer.tenant.id != this.currentTenantId || !trainer.externalTrainer)
            });
          }
        }
        this.loadTrainerDetails();
      });
    }
    else {
      this.trainers = [];
      this.dataService.isLoading = false;
    }
  }

  loadTrainerDetails() {
    this.trainers = [];
    if (this.mentors.length) {
      this.mentors.map(data => {
        data.mentorDetails.map(trainer => {
          let languages = [];
          trainer.languages.map(knownLanguage => languages.push(knownLanguage.language));
          trainer.languages = languages.join(',');
          this.trainers.push(trainer)
        });
      });
    }
    this.trainersDetails = new MatTableDataSource<any>(this.trainers);
    this.trainersPaginator.firstPage();
    this.trainersDetails.paginator = this.trainersPaginator;
    this.trainersDetails.sortingDataAccessor = (data, sortHeaderId) => data[sortHeaderId] ? data[sortHeaderId].toLocaleLowerCase() : '';
    this.trainersDetails.sort = this.trainersSort;
  }

  filterMentees(data: any) {
    this.selectedMentorPlatformId = data.platformUserId;
    this.selectedTrainerTenantId = data.tenant.id;
    this.isExternalTrainerSelected = data.externalTrainer;
    this.selectedMentees = [];
    this.getBatchListDetails();
    this.getUserDetails(this.dataService.currentTenentId);
  }

  onSkillSelect(item: any) {
    this.selectedSkillIdList.push(item.id);
    this.getUserBySkillId();
  }

  onSkillDeSelect(item: any) {
    this.selectedSkillIdList = this.selectedSkillIdList.filter(deselectSkillId => deselectSkillId !== item.id);
    this.getUserBySkillId();
  }

  onSkillSelectAll(skills: any) {
    this.selectedSkillIdList = [];
    this.skillList.forEach(element => {
      this.selectedSkillIdList.push(element.id);
    });
    this.getUserBySkillId();
  }

  onDeselectSkillAll(skills: any) {
    this.selectedSkillIdList = [];
  }

  onMenteeSelect(item: any) {
    this.isHideFlagForTraineeAndBatch = true;
    this.selectedMenteeDetails = [];
    for (let selectedmentee of this.selectedMentees) {
      this.selectedMenteeDetails.push(this.mentees.filter(mentee => mentee.id === selectedmentee.id)[0]);
    }
  }

  onMenteeDeSelect(item: any) {
    this.isHideFlagForTraineeAndBatch = false;
    this.selectedMenteeDetails = this.selectedMenteeDetails.filter(deselectMentee => deselectMentee.id !== item.id);
  }

  onDeselectAllMentee() {
    this.selectedMenteeDetails = [];
    this.isHideFlagForTraineeAndBatch = false;
  }

  onMenteeSelectAll(items: any) {
    this.isHideFlagForTraineeAndBatch = true;
    this.selectedMenteeDetails = [...this.mentees];
  }

  schedule(): void {
    if (this.createPermission) {
      if (this.scheduleForm.valid && this.scheduleForm.value.sessionTitle.trim()) {
        this.isFormSubmitted = true;
        this.dataService.isLoading = true;
        this.isScheduleSubmitted = true;
        if (this.webinarStatus)
          this.selectedMenteeDetails = [];
        let participant = [...this.selectedMenteeDetails, ...this.selectedMentorDetails];
        this.participantlist = [];

        let participantlist = participant.map(function (mentor) {
          return {
            "participantUserId": mentor.id,
            "participantRole": mentor.role
          }
        });
        let scheduleDetails = {
          "sessionTitle": this.scheduleForm.value.sessionTitle,
          "startDate": `${this.getFormattedDate(this.scheduleForm.value.startDate)} ${this.scheduleForm.value.startTime}`,
          "endDate": `${this.getFormattedDate(this.scheduleForm.value.endDate)} ${this.scheduleForm.value.endTime}`,
          "requesterUserId": this.sessionService.userId,
          "participants": participantlist,
          "skillIds": this.selectedSkillIdList,
          "sessionCode": Guid.create().toString(),
          "joinMechanism": this.scheduleForm.value.joinMechanism,
          "TimeZone": this.getTimeZone(),
          "SessionStatus": SessionStatus.Scheduled,
          "ScheduleRecurrence": SessionRecurrence.Once,
          "SessionType": this.webinarStatus ? SessionType.Webinar : SessionType.Scheduled,
          "TenantId": this.dataService.currentTenentId,
          "AssignmentIds": this.selectedAssignmentId,
          "ApprovalAuthourisedTenant": this.selectedTrainerTenantId,
          "ApprovalRequestorTenant": this.dataService.currentTenentId
        }
        this.title = scheduleDetails.sessionTitle;
        //Create Approval for External / Outsource trainer used session
        if (this.selectedTrainerTenantId != this.dataService.currentTenentId || this.isExternalTrainerSelected) {
          this.modService.createApproval(scheduleDetails).pipe(finalize(() => {
            this.isFormSubmitted = false;
            this.dataService.isLoading = this.dataService.doneLoading();
          })).subscribe(res => {
            if (res) {
              this.toastr.success("Session request sent");
              this.scheduleForm.reset();
              this.scheduleForm.controls.startTime.disable();
              this.scheduleForm.controls.endTime.disable();
              this.webinarStatus = false;
              this.externalTrainerStatus = false;
              this.outSourceExternalTrainerStatus = false;
              this.getAllSessionApprovals();
            }
          }, err => {
            this.toastr.error("Something went wrong try again later");
          });
        }
        else {  //Create session using internal trainers
          this.modService.createScheduleMany(scheduleDetails).pipe(
            finalize(() => {
              this.isFormSubmitted = false;
              this.dataService.isLoading = this.dataService.doneLoading();
            })).subscribe({
              next: (res) => this.onscheduleComplete(res.result, scheduleDetails.sessionTitle),
              error: err => this.toastr.warning(err)
            });
        }
      }
      else {
        this.toastr.warning("Please enter valid details only");
      }
    }
    else {
      this.toastr.warning("You don't have permission to create a session");
    }
  }

  getTimeZone() {
    return /\((.*)\)/.exec(new Date().toString())[1];
  }

  scheduleTeamsMeeting(): void {
    if (this.scheduleForm.valid) {
      let participant = [...this.selectedMenteeDetails, ...this.selectedMentorDetails];
      let participantlist = participant.map(function (mentor) {
        return {
          "participantUserId": mentor.id,
          "participantRole": mentor.role
        }
      });

      let scheduleDetails = {
        "sessionTitle": this.scheduleForm.value.sessionTitle,
        "startDate": `${this.getFormattedDate(this.scheduleForm.value.startDate)} ${this.scheduleForm.value.startTime}`,
        "endDate": `${this.getFormattedDate(this.scheduleForm.value.endDate)} ${this.scheduleForm.value.endTime}`,
        "requesterUserId": this.sessionService.userId,
        "participants": participantlist,
        "skillIds": this.selectedSkillIdList,
        "sessionCode": Guid.create().toString(),
        "JoinMechanism": "Teams"
      }

      this.modService.createScheduleMany(scheduleDetails).subscribe({
        next: (res) => this.onscheduleTeamsComplete(res),
        error: err => this.toastr.warning(err)
      });
      this.selectedSkillIdList = [];
      this.mentors = [];
    }
  }

  onscheduleTeamsComplete(res) {
    if ((res.result.toString()) == "") {
      return;
    }
    this.toastr.success("Teams Meeting has been scheduled");
    this.scheduleForm.reset();
    this.scheduleForm.controls.startTime.disable();
    this.scheduleForm.controls.endTime.disable();
    this.modService.getAllSchedule(this.filters).subscribe(res => {
      this.sessionList = res.result ? res.result : [];
    });
    this.editSession(0);
  }

  onscheduleComplete(isSessionCreated, title: string) {
    if (isSessionCreated) {
      if (isSessionCreated.errorMessage) {
        this.toastService.warning(RequestSessionErrorMessages[isSessionCreated.errorMessage]);
        return;
      }
      if (this.webinarStatus) {
        this.toastr.success(`Session : ${title} has been created successfully. It is available in the Webinar tab`);
        this.webinarStatus = false;
      }
      else {
        if (this.isSelectBatch) {
          this.getResourceIdAfterCreationSession();
        }
        this.toastr.success(`Session : ${title} has been created successfully. It is available in the Upcoming tab`);
      }
      this.selectedSkillIdList = [];
      this.mentors = [];
      this.scheduleForm.reset();
      this.scheduleForm.controls.startTime.disable();
      this.scheduleForm.controls.endTime.disable();
      this.isScheduleSubmitted = false;
      this.getWebinarList();
      this.getUpcomingSessionList();
      this.getCompletedSessionList();
      this.editSession(0);
      this.webinarStatus = false;
      this.externalTrainerStatus = false;
      this.outSourceExternalTrainerStatus = false;
      this.trainersDetails = new MatTableDataSource<any>([]);
      this.isSelectBatch = false;
    }
    else {
      this.toastr.warning('Unable to schedule a sesison. Please try again.');
    }
  }

  getFormattedDate(date) {
    let year = date.getFullYear();
    let month = (1 + date.getMonth()).toString().padStart(2, '0');
    let day = date.getDate().toString().padStart(2, '0');
    return month + '/' + day + '/' + year;
  }

  //implemented ngx-material-timepicker
  onSessionTimeChange(type, value) {
    if (value == "") {
      return false;
    }
    if (this.validateStartTime(type, value) == false) {
      return false;
    }
    if (this.validateEndTime(type, value) == false) {
      return false;
    }
    this.dateFormat[type] = value;
    if (type === "startDate") {
      this.scheduleForm.patchValue({
        endDate: value
      });
      this.dateFormat["endDate"] = value;
      this.endMinDate = new Date(this.dateFormat.startDate);
      if (this.dateFormat.startDate.valueOf() == <any>new Date().setHours(0, 0, 0, 0).valueOf()) {
        let currentTime = this.getFormattedTime(new Date());
        this.startMinTime = currentTime;
      }
      else {
        this.startMinTime = null;
      }
    }
    if (this.dateFormat.startDate && this.dateFormat.endDate && this.dateFormat.startTime) {
      if (Date.parse(this.dateFormat.startDate) === Date.parse(this.dateFormat.endDate)) {
        this.endMinTime = this.checkStartTime(this.dateFormat.startTime);
        this.defaultStartTime = this.dateFormat.startTime;
      }
      else if (Date.parse(this.dateFormat.startDate) < Date.parse(this.dateFormat.endDate)) {
        this.endMinTime = null;
      }
      else {
        this.endMinTime = null;
      }
    }
    if (type == "endDate") {
      if (this.dateFormat.startDate.valueOf() == this.dateFormat.endDate.valueOf()) {
        if (Date.parse('01/01/2011 ' + this.dateFormat.endTime) < Date.parse('01/01/2011 ' + this.endMinTime)) {
          this.scheduleForm.get('endTime').setValidators([TimeCheckValidators.checkStartTimeWithEndTime(this.dateFormat.endTime, this.endMinTime)])
          this.scheduleForm.get('endTime').updateValueAndValidity();
        }
        else {
          this.scheduleForm.get('endTime').setValidators([Validators.required])
          this.scheduleForm.get('endTime').updateValueAndValidity();
        }
      }
      else {
        this.scheduleForm.get('endTime').setValidators([Validators.required])
        this.scheduleForm.get('endTime').updateValueAndValidity();
      }
    }
    if (type == "startTime") {
      this.scheduleForm.patchValue({
        endTime: ''
      });
      this.dateFormat["endTime"] = "";
    }
    if (type == "endTime") {
      this.defaultEndTime = this.dateFormat.endTime;
    }
    this.handleSessionTimepicker();
  }

  getFormattedTime(date) {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let AmOrPm = hours >= 12 ? 'PM' : 'AM';
    hours = (hours % 12) || 12;
    hours = hours <= 9 ? `0${hours}` : hours;
    minutes = minutes <= 9  ? `0${minutes}` : minutes;
    return `${hours}:${minutes} ${AmOrPm}`;
  }

  //increase the end time by 30 minute from start time
  checkStartTime(time) {
    const convertedTime = moment(time, ["h:mm A"]).format("HH:mm");
    let splitTime = convertedTime.split(':');
    let minutes = (+splitTime[0]) * 60 + (+splitTime[1]) + 1;
    let hours = Math.floor(minutes / 60);
    minutes = minutes % 60;
    return moment(`${hours}.${minutes}`, ["HH.mm"]).format("hh:mm a");
  }
  //validate start time
  validateStartTime(type, value): boolean {
    if (type == "startTime") {
      if (this.dateFormat.startDate.valueOf() == <any>new Date().setHours(0, 0, 0, 0).valueOf()) {
        if (Date.parse('01/01/2011 ' + value) < Date.parse('01/01/2011 ' + this.getFormattedTime(new Date()))) {
          this.scheduleForm.get('startTime').setValidators([TimeCheckValidators.checkStartTimeWithCurrentTime(value)])
          this.scheduleForm.get('startTime').updateValueAndValidity();
          this.scheduleForm.get('endTime').disable();
          return false;
        }
        else {
          this.scheduleForm.get('startTime').setValidators([Validators.required])
          this.scheduleForm.get('startTime').updateValueAndValidity();
          this.scheduleForm.get('endTime').enable();
          return true;
        }
      }
      else {
        this.scheduleForm.get('startTime').setValidators([Validators.required])
        this.scheduleForm.get('startTime').updateValueAndValidity();
        return true;
      }
    }
    else {
      return true;
    }
  }
  //validate end time with end min time
  validateEndTime(type, value): boolean {
    if (type == "endTime") {
      if (this.dateFormat.startDate.valueOf() == this.dateFormat.endDate.valueOf()) {
        if (Date.parse('01/01/2011 ' + value) < Date.parse('01/01/2011 ' + this.endMinTime)) {
          this.scheduleForm.get('endTime').setValidators([TimeCheckValidators.checkStartTimeWithEndTime(value, this.endMinTime)])
          this.scheduleForm.get('endTime').updateValueAndValidity();
          return false;
        }
        else {
          this.scheduleForm.get('endTime').setValidators([Validators.required])
          this.scheduleForm.get('endTime').updateValueAndValidity();
          return true;
        }
      }
      else {
        this.scheduleForm.get('endTime').setValidators([Validators.required])
        this.scheduleForm.get('endTime').updateValueAndValidity();
        return true;
      }
    }
    else {
      return true;
    }
  }

  handleSessionTimepicker() {
    if (this.dateFormat.startDate != '') {
      this.scheduleForm.controls.startTime.enable();
    }
    else {
      this.scheduleForm.controls.startTime.disable();
    }
    if (this.dateFormat.startTime != '') {
      this.scheduleForm.controls.endTime.enable();
    }
    else {
      this.scheduleForm.controls.endTime.disable();
    }
  }

  applyFilter(filterValue: string) {
    if (this.scheduleForm.value.searchAssignment.trim()) {
      this.autoComplete = true;
    }
    else {
      this.autoComplete = false;
    }
    this.filteredAssignments = this.assignmentList;
    this.filteredAssignments = this.filteredAssignments.filter((data: IAssignmentList) => data.title.toLowerCase().includes(filterValue.trim().toLowerCase()));
    if (!this.filteredAssignments.length && filterValue.length) {
      this.showNoAssignments = true;
      this.autoComplete = true;
    }
    else
      this.showNoAssignments = false;
  }

  addAssignmentSelectedList(assignment: any, id: number) {
    this.selectedAssignments.push(assignment);
    this.selectedAssignmentId.push(id);
  }

  removeSelected(assignmentId: number) {
    this.selectedAssignmentId = this.selectedAssignmentId.filter(res => res !== assignmentId);
    this.selectedAssignments = this.selectedAssignments.filter(res => res.id !== assignmentId);
  }

  ngOnDestroy() {
    if (this.upcomingDataSource)
      this.upcomingDataSource.disconnect();
    if (this.completedDataSource)
      this.completedDataSource.disconnect();
  }

  clearSearch() {
    this.scheduleForm.patchValue({
      searchAssignment: ''
    });
    this.applyFilter(this.scheduleForm.value.searchAssignment);
  }

  getBatchListDetails() {
    this.batchList = [];
    this.modService.getBatchList(this.currentTenantId).subscribe(response => {
      for (let user of response.result) {
        let users = {
          name: user.name,
          batchId: user.batchId
        }
        this.batchList.push(users)
      }
      this.batchListValue = this.batchList;
      this.batchess = this.batchList;
    })
  }

  getBatchDetails(batch) {
    this.isSelectBatch = true;
    this.mentees = [];
    this.batchDetails = batch;
    if (this.batchDetails) {
      this.getAddMembersInBatch();
    }
  }

  deselectBatch() {
    this.isSelectBatch = false;
    this.getUserDetails(this.dataService.currentTenentId);
  }

  getAddMembersInBatch() {
    this.modService.getMembersList(this.batchDetails.batchId).subscribe(response => {
      this.batchMemberList = response.result;
      this.selectedMenteeDetails = [];
      for (let i = 0; i < this.batchMemberList.length; i++) {
        if (this.batchMemberList[i].member !== null && this.selectedMentorPlatformId !== this.batchMemberList[i].member.platformUserId) {
          let users = {
            emailAddress: this.batchMemberList[i].member.email,
            id: this.batchMemberList[i].member.platformUserId,
            name: this.batchMemberList[i].member.name,
            role: '2',
            surName: this.batchMemberList[i].member.surName
          }
          this.selectedMenteeDetails.push(users)
        }
      }
    })
  }

  getResourceIdAfterCreationSession() {
    this.modService.getResourceID(this.currentTenantId, this.title).subscribe(res => {
      this.resourceDetails = res.result;
      if (res.result) {
        this.createBatchResourceForSheduledSession();
      }
    })
  }
  createBatchResourceForSheduledSession() {
    let resourceDetails = {
      "resourceId": this.resourceDetails,
      "resourceType": 1,
      "batchId": this.batchDetails.batchId,
      "addedBy": this.userId,
    }
    this.modService.createBatchResourceForSession(resourceDetails).subscribe(res => {
      if (res) {
        let respone = res.reult;
      }
    })
  }

  gotoBatchCreatePage() {
    if (this.createBatchPermission) {
      this.router.navigate(["/app/batch-creation"]);
    }
    else {
      this.toastr.warning("you don't have permission for batch creation");
    }

  }

  search(query: string, filterFor: string): void {
    if (filterFor.toLowerCase() === 'batch') {
      this.filteredTenants = this.performFilter(query, this.batchess, 'name');
    }
  }

  performFilter(query: string, filterArray: string[], filterBy: string): string[] {
    query = query.toLocaleLowerCase();
    return filterArray.filter(value => value[filterBy].toLocaleLowerCase().indexOf(query) !== -1);
  }
  addSkill(): void {
    if (this.createPermission) {
      const addSkillDialog = new MatDialogConfig();
      addSkillDialog.disableClose = true;
      addSkillDialog.autoFocus = false;
      addSkillDialog.width = '60vw';
      const dialogRef = this.dialog.open(AddSkillComponent, addSkillDialog);
      dialogRef.afterClosed().subscribe(result => {
        if (result && result.isCreated) {
          this.modService.getAllSkill().subscribe(res => {
            this.skillList = res.result.items;
          });
        }
      });
      
    }
    else {
      this.toastr.warning("You don't have permission to create a tenant");
    }
  }
}



