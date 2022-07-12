import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ModService } from "@app/service";
import { ToastrService } from "ngx-toastr";
import { dataService } from "@app/service/common/dataService";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RequestSessionErrorMessages, SessionType } from '@app/enums/user-roles';
import * as moment from 'moment';
import { TimeCheckValidators } from '@shared/validators/timecheck.validator';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { finalize } from 'rxjs/operators';
import { IUser } from '@app/mod-sessions/mod-sessions.component';

@Component({
  selector: 'app-reschedule-session-dialog',
  templateUrl: './reschedule-session-dialog.component.html',
  styleUrls: ['./reschedule-session-dialog.component.css']
})
export class RescheduleSessionDialogComponent implements OnInit {
  sessionTitle: string;
  startDate: Date;
  endDate: Date;
  formattedStartTime: string;
  formattedEndTime: string;
  startTime: string;
  endTime: string;
  sessionId: number;
  reScheduleForm: FormGroup;
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
  sessionStartDate: Date;
  sessionEndDate: Date;
  reScheduleFormValidationMessages = {
    startDateRequired: 'Please select the start date',
    startTimeRequired: 'Please select the start time',
    endDateRequired: 'Please select the end date',
    endTimeRequired: 'Please select the end time',
    startTimePattern: 'Start time pattern should be 12 hr format like 12:00 am',
    endTimePattern: 'End time pattern should be 12 hr format like 12:00 am',
    startTimeCheck: 'Start time should be greater than current time',
    endTimeCheck: 'End time should be less than start time'
  };
  dateFormat = { startDate: '', startTime: '', endDate: '', endTime: '' };
  minDate = new Date();
  endMinDate = new Date();
  selectedUsers: any[] = [];
  selectedUserIdList: any[] = [];
  menteeDropdownSettings: IDropdownSettings = {};
  mentees = []; //all mentees
  menteesList = [];
  showTrainee: boolean;
  constructor(private modService: ModService,
    public dataService: dataService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    public rescheduleSessionDialog: MatDialogRef<RescheduleSessionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public reScheduleSessionData: any) { }

  ngOnInit() {
    this.initForm();
    this.isBatchSelectedInSession(this.reScheduleSessionData.sessionId);
    this.updateSelectedMentees(this.reScheduleSessionData.sessionId);
    this.getUserDetails(this.dataService.currentTenentId);
    this.sessionTitle = this.reScheduleSessionData.sessionTitle;
    this.sessionId = this.reScheduleSessionData.sessionId;
    this.startDate = this.reScheduleSessionData.startDate;
    this.endDate = this.reScheduleSessionData.endDate;
    this.populateExistingSessionDetails();
    this.updateTimePickerMinTimes();
    this.menteeDropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
  }
  populateExistingSessionDetails() {
    this.startDate = this.reScheduleSessionData.startDate;
    this.endDate = this.reScheduleSessionData.endDate;
    this.formattedStartTime = this.getFormattedTime(this.startDate);
    this.formattedEndTime = this.getFormattedTime(this.endDate);
    this.startTime = this.formattedStartTime;
    this.endTime = this.formattedEndTime;
    this.reScheduleForm.patchValue({
      startTime: this.startTime,
      endTime: this.endTime
    });
    this.defaultStartTime = this.reScheduleForm.value.startTime;
    this.defaultEndTime = this.reScheduleForm.value.endTime;
  }
  reScheduleSession() {
    if (this.reScheduleForm.valid) {
      let date = new Date();
      if (this.reScheduleForm.value.endDate > date.setHours(0, 0, 0, 0) && this.reScheduleForm.value.endTime === this.getFormattedTime(date)) {
        this.toastr.warning('Please select the valid date and time');
      }
      this.dataService.isLoading = true;
      let reScheduleDetails = {
        "sessionScheduleId": this.sessionId,
        "sessionTitle": this.sessionTitle,
        "startDate": `${this.getFormattedDate(this.reScheduleForm.value.startDate)} ${this.reScheduleForm.value.startTime}`,
        "endDate": `${this.getFormattedDate(this.reScheduleForm.value.endDate)} ${this.reScheduleForm.value.endTime}`,
        "timeZone": this.getTimeZone(),
        "traineeIds": this.selectedUserIdList
      }
      if (reScheduleDetails.startDate < reScheduleDetails.endDate) {
        this.modService.reScheduleSession(reScheduleDetails).pipe(
          finalize(() => {
            this.dataService.isLoading = this.dataService.doneLoading();
          })).subscribe(res => {
            if (res.success) {
              if (res.result.errorMessage) {
                this.toastr.warning(RequestSessionErrorMessages[res.result.errorMessage]);
              }
              else {
                this.rescheduleSessionDialog.close({ isUpdated: true });
                this.reScheduleForm.reset();
              }
            }
          }, err => {
            this.toastr.warning("Please try again later");
          });
      }
      else
        this.toastr.warning('Please select the valid date and time');
    }
  }

  getFormattedTime(date) {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let AmOrPm = hours >= 12 ? 'PM' : 'AM';
    hours = (hours % 12) || 12;
    hours = hours <= 9 ? `0${hours}` : hours;
    minutes = minutes <= 9 ? `0${minutes}` : minutes;
    return `${hours}:${minutes} ${AmOrPm}`;
  }

  cancel() {
    this.reScheduleForm.reset();
    this.rescheduleSessionDialog.close({ isUpdated: false });
  }

  getTimeZone() {
    return /\((.*)\)/.exec(new Date().toString())[1];
  }

  getFormattedDate(date) {
    let year = date.getFullYear();
    let month = (1 + date.getMonth()).toString().padStart(2, '0');
    let day = date.getDate().toString().padStart(2, '0');
    return month + '/' + day + '/' + year;
  }

  initForm(): void {
    if (this.reScheduleSessionData.sessionType != SessionType.Webinar) {
      this.reScheduleForm = this.formBuilder.group({
        startDate: ['', [Validators.required]],
        startTime: ['', [Validators.required]],
        endDate: ['', [Validators.required]],
        endTime: ['', [Validators.required]],
        selectedMentees: ['', [Validators.required]]
      });
      this.showTrainee = false;
    }
    else {
      this.reScheduleForm = this.formBuilder.group({
        startDate: ['', [Validators.required]],
        startTime: ['', [Validators.required]],
        endDate: ['', [Validators.required]],
        endTime: ['', [Validators.required]],
        selectedMentees: ['']
      });
      this.showTrainee = false;
    }
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
      this.reScheduleForm.patchValue({
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
          this.reScheduleForm.get('endTime').setValidators([TimeCheckValidators.checkStartTimeWithEndTime(this.dateFormat.endTime, this.endMinTime)])
          this.reScheduleForm.get('endTime').updateValueAndValidity();
        }
        else {
          this.reScheduleForm.get('endTime').setValidators([Validators.required])
          this.reScheduleForm.get('endTime').updateValueAndValidity();
        }
      }
      else {
        this.reScheduleForm.get('endTime').setValidators([Validators.required])
        this.reScheduleForm.get('endTime').updateValueAndValidity();
      }
    }
    if (type == "startTime") {
      this.reScheduleForm.patchValue({
        endTime: ''
      });
      this.dateFormat["endTime"] = "";
    }
    if (type == "endTime") {
      this.defaultEndTime = this.dateFormat.endTime;
    }
    this.handleSessionTimepicker();
  }
  //validate start time
  validateStartTime(type, value): boolean {
    if (type == "startTime") {
      if (this.dateFormat.startDate.valueOf() == <any>new Date().setHours(0, 0, 0, 0).valueOf()) {
        if (Date.parse('01/01/2011 ' + value) < Date.parse('01/01/2011 ' + this.getFormattedTime(new Date()))) {
          this.reScheduleForm.get('startTime').setValidators([TimeCheckValidators.checkStartTimeWithCurrentTime(value)])
          this.reScheduleForm.get('startTime').updateValueAndValidity();
          this.reScheduleForm.get('endTime').disable();
          return false;
        }
        else {
          this.reScheduleForm.get('startTime').setValidators([Validators.required])
          this.reScheduleForm.get('startTime').updateValueAndValidity();
          this.reScheduleForm.get('endTime').enable();
          return true;
        }
      }
      else {
        this.reScheduleForm.get('startTime').setValidators([Validators.required])
        this.reScheduleForm.get('startTime').updateValueAndValidity();
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
          this.reScheduleForm.get('endTime').setValidators([TimeCheckValidators.checkStartTimeWithEndTime(value, this.endMinTime)])
          this.reScheduleForm.get('endTime').updateValueAndValidity();
          return false;
        }
        else {
          this.reScheduleForm.get('endTime').setValidators([Validators.required])
          this.reScheduleForm.get('endTime').updateValueAndValidity();
          return true;
        }
      }
      else {
        this.reScheduleForm.get('endTime').setValidators([Validators.required])
        this.reScheduleForm.get('endTime').updateValueAndValidity();
        return true;
      }
    }
    else {
      return true;
    }
  }
  //Time picker value check
  handleSessionTimepicker() {
    if (this.dateFormat.startDate != '') {
      this.reScheduleForm.controls.startTime.enable();
    }
    else {
      this.reScheduleForm.controls.startTime.disable();
    }
    if (this.dateFormat.startTime != '') {
      this.reScheduleForm.controls.endTime.enable();
    }
    else {
      this.reScheduleForm.controls.endTime.disable();
    }
  }
  //increase the min end time by 1 minute
  checkStartTime(time) {
    const convertedTime = moment(time, ["h:mm A"]).format("HH:mm");
    let splitTime = convertedTime.split(':');
    let minutes = (+splitTime[0]) * 60 + (+splitTime[1]) + 1;
    let hours = Math.floor(minutes / 60);
    minutes = minutes % 60;
    return moment(`${hours}.${minutes}`, ["HH.mm"]).format("hh:mm a");
  }
  // update dateformat property with default min times
  updateTimePickerMinTimes() {
    let firstDate: any = new Date(this.startDate.toDateString());
    let secondDate: any = new Date(this.endDate.toDateString());
    let currentDate: any = new Date(new Date().toDateString());
    this.dateFormat['startDate'] = firstDate;
    this.dateFormat['endDate'] = secondDate;
    this.dateFormat['startTime'] = this.startTime;
    this.dateFormat['endTime'] = this.endTime;
    if (firstDate.valueOf() == currentDate.valueOf()) {
      let currentTime = this.getFormattedTime(new Date());
      this.startMinTime = currentTime;
      if (Date.parse('01/01/2011 ' + this.startMinTime) > Date.parse('01/01/2011 ' + this.startTime)) {
        this.endMinTime = this.checkStartTime(this.startMinTime);
      }
      else if (Date.parse('01/01/2011 ' + this.startMinTime) < Date.parse('01/01/2011 ' + this.startTime)) {
        this.endMinTime = this.checkStartTime(this.startTime);
      }
    }
    else {
      this.startMinTime = null;
      this.endMinTime = null;
    }
    if (firstDate.valueOf() == secondDate.valueOf() &&
      firstDate.valueOf() != currentDate.valueOf()) {
      this.endMinTime = this.checkStartTime(this.startTime);
    }
  }
  //Add or remove trainee from a session
  onUserSelect(item: any) {
    this.selectedUserIdList.push(item.id);
  }

  onUserDeSelect(item: any) {
    this.selectedUserIdList = this.selectedUserIdList.filter(userId => userId !== item.id);
  }

  onUserSelectAll(users: any) {
    this.selectedUserIdList = [];
    this.mentees.forEach(element => {
      this.selectedUserIdList.push(element.id);
    });
  }

  onDeselectUserAll(users: any) {
    this.selectedUserIdList = [];
  }
  //get all the applicable mentees of tenant
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
          name: user.name,
          surname: user.surName,
          tenantId: user.tenant.id
        };
        if (user.canBeMentee && modUser.tenantId === tenantId) {
          mentee.push(modUser);
        }
      }
      this.mentees = mentee;
    });
  }
  //updated the mentees id in multiselect dropdown
  updateSelectedMentees(sessionId) {
    this.modService.getAllMenteesOfSession(sessionId).subscribe(response => {
      this.menteesList = response.result;
      const children: Array<{ id: number; isDisabled: boolean; name: string }> = [];
      this.menteesList.forEach(element => {
        children.push({ id: element.participantUserId, isDisabled: undefined, name: element.userDetail.name })
      });
      this.reScheduleForm.patchValue({
        selectedMentees: children
      });
      this.selectedUserIdList = this.menteesList.map((item) => { return item.participantUserId });
    })
  }
  isBatchSelectedInSession(sessionId) {
    this.modService.checkIfBatchAssociatedWithSession(sessionId).subscribe(response => {
      if (response.result == true) {
        this.showTrainee = false;
      }
      else if (response.result == false && this.reScheduleSessionData.sessionType != SessionType.Webinar) {
        this.showTrainee = true;
      }
      else if (response.result == false && this.reScheduleSessionData.sessionType == SessionType.Webinar) {
        this.showTrainee = false;
      }
    });
  }
}
