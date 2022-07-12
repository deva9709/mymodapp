import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { async } from '@angular/core/testing';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { flattenStyles } from '@angular/platform-browser/src/dom/dom_renderer';
import { Router } from '@angular/router';
import { NotificationTypes } from '@app/enums/notification-types.enum';

import { ModService } from '@app/service';
import { dataService } from "@app/service/common/dataService";
import { AppSessionService } from '@shared/session/app-session.service';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-notification-settings',
  templateUrl: './notification-settings.component.html',
  styleUrls: ['./notification-settings.component.css']
})
export class NotificationSettingsComponent implements OnInit {
  value = 5;
  sessionTitle: string = "";
  sessionScheduleId: number; 
  SessionDetails: any;
  arrayInputs = [];
  notificationTypes:any;
  announcementList: any[] = [];
  hasAnnouncement: boolean = false;
  notificationlists: any[] = [];
  notificationCount: number;
  hasNotification: boolean = false;
  sessionStartDate: Date;
  notificationTime: number;
  isSave: boolean = true;
  isUpdate:boolean=false;
  platformUserId:number;
  notificationdata = [];

  constructor(private fb: FormBuilder,
    private router: Router,
    private modService: ModService,
    public dataService: dataService, private sessionService: AppSessionService,
    private toastr: ToastrService,
  ) { }
  ngOnInit() {
    this.notificationTypes=NotificationTypes;
    this.sessionTitle = this.dataService.calSession['title'];
    this.sessionScheduleId = this.dataService.calSession['id'];
    this.sessionStartDate = this.dataService.calSession['sessionStartDate'];
    this.platformUserId=this.sessionService.userId;
    localStorage.setItem("platformUserId",this.platformUserId.toString())
    this.setArrayInputs(this.arrayInputs);
    this.modService.getNotifySettings(this.sessionService.userId, this.sessionScheduleId).subscribe(res => {
      if (res.result.length != 0) {
        this.isSave = false;
        this.isUpdate=true; 
        for (let i = 0; i < res.result.length; i++) {
          (this.formName.get('controllerArray') as FormArray).push(this.fb.group({ controlerInputName0: res.result[i].notificationType, controlerInputName1: res.result[i].notificationTime }))
        }
      }
      else {
        this.arrayInputs = [{ controlerInputName0: 1, controlerInputName1: "5" }];
      }
    })
  }

  sessionDetails: any;
  selectNotify(val, i) {
    this.formName.controls.controllerArray.value[i].controlerInputName0 = val;
  
  } 

  // To sending email Alrets
  SendEmailAlerts(val) {
    this.modService.getSessionDetailsById(val).pipe(
      finalize(() => { this.dataService.isLoading = this.dataService.doneLoading(); })
    ).subscribe(res => {
      if (res.result) {

        this.sessionDetails = res.result;
        this.SessionDetails = this.sessionDetails;
        let Name = this.SessionDetails.sessionRequestor.name;
        let Email = this.SessionDetails.sessionRequestor.email;
        let Title = this.SessionDetails.sessionTitle;
        let StartDate =  this.SessionDetails.startDate;
        let EndDate = this.SessionDetails.endDate;
        let SessionUrl = this.SessionDetails.sessionUrl;
        this.modService.SendEmailAlerts(Name, Email, Title, StartDate, EndDate, SessionUrl, this.sessionService.userId, this.sessionScheduleId).subscribe(res => {

        });

      }
    });

  }

// To sending Mentee Notifications
  GetNotification(time) {
    setTimeout(()=>{
      this.modService.getNotificationsList(Number(localStorage.getItem("platformUserId"))).subscribe(res => {
        if (res.result){
          for (let i = 0; i < res.result.length; i++) {
            this.notificationlists.push({ name: res.result[i] });
          }
          this.dataService.getNotificationContxt(this.notificationlists);
          
        }        
      })
    }, this.getStartDate(time));
    
  }

// To sending Mentee Popups
  getPopupAnnouncements(time) {
    setTimeout(()=>{
      this.modService.getPopupList(Number(localStorage.getItem("platformUserId"))).subscribe(res => {
        if (res.result) {
          for (let i = 0; i < res.result.length; i++) {
            this.announcementList.push({ message: res.result[i] });
          }
          this.dataService.getPopupContxt(this.announcementList);          
        }
      })
    }, this.getStartDate(time));
   
  }

  formName = this.fb.group({
    controllerArray: this.fb.array([])
  })

  setArrayInputs(arrayInputs) {

    const arrayFG = arrayInputs.map(address => this.fb.group(address));
    const formArray = this.fb.array(arrayFG);
    this.formName.setControl('controllerArray', formArray);
  }

  addInput() {
    if (this.formName.controls.controllerArray.value.length <= 2) {
      (this.formName.get('controllerArray') as FormArray).push(this.fb.group({ controlerInputName0: 1, controlerInputName1: "5" }))
    }
  }

  removeInput(index) {
    this.formName.controls.controllerArray.value.length = this.formName.controls.controllerArray.value.length - 1;
    this.formName.controls.controllerArray["controls"].splice(index, 1)
  }
 
  saveChanges(type) {    
    for (let i = 0; i < this.formName.controls.controllerArray.value.length; i++) {
      this.notificationdata.push({
        "userId": this.sessionService.userId,
        "sessionScheduleId": this.sessionScheduleId,
        "notificationType": this.formName.controls.controllerArray.value[i].controlerInputName0,
        "notificationTime": this.formName.controls.controllerArray.value[i].controlerInputName1,
        "isDeleted": false,
        "id": 0

      });

    }
    
    this.modService.SaveNotifySettings(this.notificationdata,type).subscribe(res => {      
      this.isSave = false;
      this.isUpdate=true;
      if(type==1){this.toastr.success("Notifications Saved sucessfully");
    }
    else if(type==2){
      this.toastr.success("Notifications updated sucessfully");
    }      
      this.AlertCalc();
    })
     
  }
  updateChanges(){

  }

  getStartDate(value) { 
    let currenDate = new Date();
    let difference = (new Date(this.dataService.calSession['sessionStartDate'])).getTime() - currenDate.getTime();
    let SessionStartInMinutes = Math.round(difference / 60000);
    let finalDifference=Number(SessionStartInMinutes)-Number(value);    
    return finalDifference * 60000;
  }
  
  async AlertCalc()  {
    for (let i = 0; i < this.notificationdata.length; i++) {
      if (this.formName.controls.controllerArray.value[i].controlerInputName0 == NotificationTypes.Notification) {
        this.GetNotification(this.formName.controls.controllerArray.value[i].controlerInputName1);
      }
       if (this.formName.controls.controllerArray.value[i].controlerInputName0 == NotificationTypes.Email) {
        var run2 = await setTimeout(() => this.SendEmailAlerts(this.notificationdata[0].sessionScheduleId),
          this.getStartDate(this.formName.controls.controllerArray.value[i].controlerInputName1));
      }
      if (this.formName.controls.controllerArray.value[i].controlerInputName0 == NotificationTypes.Popup) {
       clearTimeout();
       this.getPopupAnnouncements(this.formName.controls.controllerArray.value[i].controlerInputName1);
      }

    }
  }
 
  back() {
    this.router.navigate(['app/calendar']);
  }
}


