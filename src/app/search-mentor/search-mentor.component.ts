import { Component, OnInit, Injector, ViewChild } from "@angular/core";
import { ModService } from "@app/service";
import { AppSessionService } from "@shared/session/app-session.service";
import { dataService } from "@app/service/common/dataService";
import { Router } from "@angular/router";
import { AppComponentBase } from "@shared/app-component-base";
import { Guid } from "guid-typescript";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { SessionStatus, SessionRecurrence, SessionType, JoinMechanism, RequestSessionErrorMessages } from "@app/enums/user-roles";
import { AppConsts } from "@shared/AppConsts";
import { finalize } from "rxjs/operators";
import { CookieService } from 'ngx-cookie-service';
import { MatPaginator, MatTableDataSource } from "@angular/material";
import { Observable } from "rxjs";

@Component({
  selector: "app-search-mentor",
  templateUrl: "./search-mentor.component.html",
  styleUrls: ["./search-mentor.component.css"]
})
export class SearchMentorComponent extends AppComponentBase implements OnInit {

  @ViewChild('mentorPaginator') mentorPaginator: MatPaginator;
  mentorObservable: Observable<any>;
  mentorDataSource: MatTableDataSource<any>;

  externalTrainerStatus: boolean = false;
  currentTenantId: number;
  inviteMentor: boolean = false;
  skillList: string[] = [];
  technologyList: string[] = [];
  rolePermissions: any = [];
  mentors: any = [];
  createPermission: boolean;
  updatePermission: boolean;
  deletePermission: boolean;
  loginUser: any;
  Code: string = "TNRSRC";
  chatRoomId: string;
  mentorSkillId: any;
  microTutor = false;
  findMentorForm: FormGroup;
  connectMentorForm: FormGroup;
  sessionDurations: any[] = ['30', '60', '90'];
  //joinMechanisms: any[] = [{ key: "Twilio", value: "Twilio" }, { key: "Teams", value: "Microsoft Teams" }, { key: "BBB", value: "BigBlueButton" }];
  joinMechanisms: any[] = [{ key: "BBB", value: "IIHT" }, { key: "Teams", value: "Microsoft Teams" }];
  selectedjoinMechanism: string;
  intervalFunc: any;
  isWaitingForMentor: boolean = false;
  isFindMentorFormSubmitted: boolean;
  isConnectMentorFormSubmitted: boolean;
  selectedMicroTutoring: any;
  tenants: any[] = [];
  filteredSkillList: string[];
  filteredTechnologyList: string[];
  durationTypeList: any[];
  languageList: any[];
  filteredLanguageList: string[];
  filteredDurationTypeList: string[];
  isMaximumCost: boolean = false;
  isMentorList: boolean = false;
  outSourceExternalTrainerStatus: boolean = false;

  schedule() {
    this.inviteMentor = !this.inviteMentor;
  }
  constructor(
    injector: Injector,
    private modService: ModService,
    private sessionService: AppSessionService,
    private dataService: dataService,
    private router: Router,
    private formBuilder: FormBuilder,
    private toastService: ToastrService,
    private cookieService: CookieService
  ) { super(injector); }

  ngOnInit() {
    this.dataService.pageName = "Trainer Search";
    this.currentTenantId = this.dataService.currentTenentId;
    if (this.dataService.isLoading) {
      this.dataService.isLoading = false;
    }
    this.initFindMentorForm();
    this.getPermissions();
    this.getSkillList();
    this.getTechnologyList();
    this.initConnectMentorForm();
    this.getAllTenants();
    this.getJoiningMechanismStatus();
    this.getDurationTypeList();
    this.getLanguageList();
  }


  initFindMentorForm(): void {
    this.findMentorForm = this.formBuilder.group({
      skillId: ['0'],
      technologyId: ['0'],
      languageId: ['0'],
      durationTypeId: ['0'],
      maximumCost: ['1', [Validators.pattern("^[1-9][0-9]*$")]]
    });
  }

  initConnectMentorForm(): void {
    this.connectMentorForm = this.formBuilder.group({
      sessionTitle: ['', [Validators.required]],
      sessionDuration: ['60 Minutes'],
      joinMechanism: ['', [Validators.required]]
    });
  }
  getAllTenants() {
    this.modService.getTenants().subscribe(res => {
      if (res.result)
        this.tenants = res.result;
    }, err => { });
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

  showHide() {
    this.microTutor = !this.microTutor;
    if (!this.microTutor) {
      this.findMentorForm.patchValue({
        microTutoringId: ''
      });
    }
  }

  getPermissions() {
    if (this.dataService.isSuperAdmin) {
      this.createPermission = this.updatePermission = this.deletePermission = true;
    }
    else {
      this.rolePermissions = this.dataService.rolePermissions;
      let permissions = this.rolePermissions.find(val => val.feature.featureCode === this.Code);
      if (permissions) {
        this.createPermission = permissions.create;
        this.updatePermission = permissions.update;
        this.deletePermission = permissions.delete;
      }
      else {
        this.createPermission = this.updatePermission = this.deletePermission = false;
      }
    }
  }

  search(query: string, filterFor: string): void {
    if (filterFor.toLowerCase() === 'skill') {
      this.filteredSkillList = this.performFilter(query, this.skillList, 'name');
    }
    if (filterFor.toLowerCase() === 'technology') {
      this.filteredTechnologyList = this.performFilter(query, this.technologyList, 'name');
    }
    if (filterFor.toLowerCase() === 'language') {
      this.filteredLanguageList = this.performFilter(query, this.languageList, 'language');
    }
    if (filterFor.toLowerCase() === 'duration') {
      this.filteredDurationTypeList = this.performFilter(query, this.durationTypeList, 'duration');
    }
  }

  showCostRange(event) {
    this.isMaximumCost = event.value != 0 ? true : false;
  }

  performFilter(query: string, filterArray: string[], filterBy: string): string[] {
    return filterArray.filter(value => value[filterBy].toLocaleLowerCase().indexOf(query.toLocaleLowerCase()) !== -1);
  }

  getSkillList(): void {
    this.modService.getAllSkill().subscribe(res => {
      this.skillList = res.result ? res.result.items : [];
      this.filteredSkillList = this.skillList;
    });
  }

  getTechnologyList(): void {
    this.modService.getAllTechnology().subscribe(res => {
      this.technologyList = res.result ? res.result.items : [];
      this.filteredTechnologyList = this.technologyList;
    });
  }

  getLanguageList(): void {
    this.modService.getAllLanguageList().subscribe(res => {
      this.languageList = res.result ? res.result : [];
      this.filteredLanguageList = this.languageList;
    });
  }

  getDurationTypeList(): void {
    this.modService.getAllDurationType().subscribe(res => {
      this.durationTypeList = res.result ? res.result : [];
      this.filteredDurationTypeList = this.durationTypeList;
    });
  }

  close() {
    this.mentors = [];
    this.isMentorList = false;
  }

  outSourceExternalTrainer(event: any) {
    this.outSourceExternalTrainerStatus = event.checked;
  }

  externalTrainer(event: any) {
    this.externalTrainerStatus = event.checked;
  }

  findMentor(): void {
    if (this.createPermission) {
      if (this.findMentorForm.valid) {
        this.dataService.isLoading = true;
        this.isFindMentorFormSubmitted = true;
        let data = { ...this.findMentorForm.value, tenantId: this.dataService.currentTenentId, externalTrainer: this.outSourceExternalTrainerStatus };
        this.modService.getMentorByCriteria(data).pipe(
          finalize(() => {
            this.dataService.isLoading = this.dataService.doneLoading();
          })).subscribe(res => {
            this.isFindMentorFormSubmitted = false;
            if (res.result) {
              let controlVariable = 0;
              let skills = [];
              this.mentors = res.result;
              res.result.forEach(element => {
                element.mentorCategories.forEach(function (mc) {
                  skills.push(mc.skill.name);
                });
                let mentorSkills = skills.filter((value, index, self) => self.indexOf(value) === index); //Distinct skills
                this.mentors[controlVariable].skills = mentorSkills.join(',');
                controlVariable++;
              });
              if (!this.externalTrainerStatus) {
                this.mentors = this.mentors.filter(x => x.tenantId != this.currentTenantId || !x.externalTrainer);
              }
              this.mentorDataSource = new MatTableDataSource<any>(this.mentors);
              this.mentorDataSource.paginator = this.mentorPaginator;
              this.mentorObservable = this.mentorDataSource.connect();
              this.isMentorList = true;
            }
            else {
              this.isMentorList = false;
              this.mentors = [];
              this.mentorDataSource = new MatTableDataSource<any>(this.mentors);
              this.mentorDataSource.paginator = this.mentorPaginator;
              this.mentorObservable = this.mentorDataSource.connect();
              this.toastService.warning('No trainers available for this search criteria');
            }
            this.connectMentorForm.reset();
          });
      }
    }
    else {
      this.toastService.warning("You don't have permission to search for a trainer");
    }
  }

  requestSession(requestmentor: any[]): void {
    if (this.connectMentorForm.valid) {
      this.dataService.isLoading = true;
      this.isConnectMentorFormSubmitted = true;
      let currentUser: any = { ...this.sessionService.user, platformUserId: this.sessionService.user.id, role: "2" };
      let participants = [{ ...requestmentor, role: "1" }, { ...currentUser }];
      let participantlist = participants.map(function (participant) {
        return {
          "participantUserId": participant.platformUserId,
          "participantRole": participant.role
        }
      });

      let currentDate = new Date();
      let scheduleDetails = {
        "sessionTitle": this.connectMentorForm.value.sessionTitle,
        "startDate": `${this.getFormattedDate(currentDate)} ${this.getFormattedTime(currentDate)}`,
        "endDate": `${this.getFormattedDate(currentDate)} ${this.getEndTime(currentDate)}`,
        "requesterUserId": this.sessionService.userId,
        "participants": participantlist,
        "skillIds": [this.findMentorForm.value.skillId],
        "sessionCode": Guid.create().toString(),
        "joinMechanism": this.connectMentorForm.value.joinMechanism,
        "TimeZone": this.getTimeZone(),
        "SessionStatus": SessionStatus.Scheduled,
        "ScheduleRecurrence": SessionRecurrence.Once,
        "SessionType": SessionType.OnDemand,
        "TenantId": this.dataService.currentTenentId
      }

      this.dataService.sessionCode = scheduleDetails.sessionCode;
      this.dataService.sessionTitle = scheduleDetails.sessionTitle;

      this.modService.createScheduleMany(scheduleDetails).pipe(
        finalize(() => {
          this.dataService.isLoading = this.dataService.doneLoading();
        })).subscribe({
          next: (res) => {
            if (res.result) {
              if (res.result.errorMessage) {
                this.toastService.warning(RequestSessionErrorMessages[res.result.errorMessage]);
                return;
              }
              this.router.navigate(['app/join-session'], { queryParams: { sessioncode: res.result.sessionCode } });
            }
            else {
              this.toastService.warning("Unable to connect to trainer, Please try again");
            }
          },
          error: err => {
            this.toastService.warning("Unable to connect to trainer, Please try again");
            console.log(err);
          }
        });

    }
  }

  isSessionInProgressAsync(sessionScheduleId) {
    this.modService.isSessionInProgressAsync(sessionScheduleId, this.sessionService.user.id).subscribe(res => {
      if (res.success && res.result) {
        this.isWaitingForMentor = false;
        (<HTMLElement>document.getElementsByClassName("overlay")[0]).style.display = "none";
        clearInterval(this.intervalFunc);
        this.router.navigate(['app/one-to-one-session']);
      }
      else {
        console.log("isSessionInProgressAsync", false);
      }
    });
  }

  getTimeZone() {
    return /\((.*)\)/.exec(new Date().toString())[1];
  }

  formatMinutes(minutes) {
    return minutes <= 9 ? `0${minutes}` : minutes;
  }

  getFormattedTime(date) {
    var hours = date.getHours();
    var AmOrPm = hours >= 12 ? 'pm' : 'am';
    hours = (hours % 12) || 12;
    var minutes = this.formatMinutes(date.getMinutes());
    return `${hours}:${minutes} ${AmOrPm}`;
  }

  getEndTime(date) {
    let endDate = new Date(date.getTime() + 60 * 60000)
    return this.getFormattedTime(endDate);
  }

  requestMeeting(requestmentor: any[]): void {
    this.dataService.mentorDetails = requestmentor;

    this.chatRoomId = Guid.create().toString();
    this.dataService.sessionCode = this.chatRoomId;

    let currentUser: any = { ...this.sessionService.user, platformUserId: this.sessionService.user.id, role: "Mentee" };
    let participants = [{ ...requestmentor, role: "Mentor" }, { ...currentUser }];

    let participantlist = participants.map(function (participant) {
      return {
        "participantUserId": participant.platformUserId,
        "participantRole": participant.role
      }
    });

    let selectedSkillIdList: number[] = [];
    selectedSkillIdList.push(this.findMentorForm.value.skillId);
    let sessionData = {
      sessionCode: this.chatRoomId.toString(),
      participants: participantlist,
      requesterUserId: this.sessionService.userId,
      joinMechanism: "Teams",
      skillIds: selectedSkillIdList
    }

    this.modService.generateTeamsMeeting(sessionData).subscribe(res => {
      if ((res.result.toString()) == "") {
        return;
      }
      window.open(res.result.toString(), '_blank');
    });
  };

  getFormattedDate(date) {
    let year = date.getFullYear();
    let month = (1 + date.getMonth()).toString().padStart(2, '0');
    let day = date.getDate().toString().padStart(2, '0');
    return month + '/' + day + '/' + year;
  }
}
