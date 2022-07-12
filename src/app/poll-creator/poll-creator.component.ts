import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModService } from '@app/service';
import { Subscription } from 'rxjs';
import { dataService } from "@app/service/common/dataService";
import * as SurveyCreator from "survey-creator";
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { AppSessionService } from '@shared/session/app-session.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
SurveyCreator.StylesManager.applyTheme("default");

@Component({
  selector: 'app-poll-creator',
  templateUrl: './poll-creator.component.html',
  styleUrls: ['./poll-creator.component.css'],
  providers: [DatePipe]

})
export class PollCreatorComponent implements OnInit {
  private routeSub: Subscription;
  associateId: number;
  associateType: number;
  hasPollName: boolean = true;
  pollName: string;
  pollCreation: SurveyCreator.SurveyCreator;
  currentDate = this.datePipe.transform(new Date(), "yyyy-MM-dd hh:mm:ss");
  questionLimit: number = 0;
  isPollSaved: boolean = false;
  showPollCretor: boolean = false;
  pollId: number;
  pollsCreatorOptions = {
    showJSONEditorTab: false,
    showTestSurveyTab: false,
    showEmbededSurveyTab: false,
    showPropertyGrid: false,
    questionTypes: ["boolean", "radiogroup", "checkbox"],
  };

  constructor(
    private dataService: dataService,
    private route: ActivatedRoute,
    private modService: ModService,
    private toastr: ToastrService,
    private sessionService: AppSessionService,
    private datePipe: DatePipe,
    private router: Router,
    public pollCreationDialog: MatDialogRef<PollCreatorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
  }

  saveName() {
    if (this.pollName) {
      this.showPollCretor = true;
      this.hasPollName = false;
      this.pollCreation = new SurveyCreator.SurveyCreator(
        "pollCreator",
        this.pollsCreatorOptions);
      this.pollCreation.toolbarItems.push({
        id: "custom-preview",
        visible: true,
        title: "Send Poll",
        action: () => {
          if (this.isPollSaved == true) {
            this.sendNotify(this.pollId);
          }
          else {
            this.toastr.warning("Please save poll before sending.");
          }
        }
      });
      this.pollCreation.saveSurveyFunc = this.saveMySurvey.bind(this);
    }
    else {
      this.toastr.warning("Please enter poll name");
    }
  }

  sendNotify(pollId) {
    this.pollCreationDialog.close();
    let data = {
      'SessionScheduleId': this.data.associateId,
      'Id': pollId
    };
    this.modService.sendPollNotification(data).subscribe(res => {
      if (res.success) {
        this.toastr.success("Notification has been sent to mentee");
      }
    }, err => {
      console.log(err);
      this.toastr.error("Send Notification failed. Please try again");
    });
  }

  saveMySurvey() {
    this.questionLimit = this.pollCreation.survey.getAllQuestions().length;
    if (this.questionLimit > 1) {
      this.toastr.warning("Poll creation should have only one question");
    }
    else if (this.questionLimit === 0) {
      this.toastr.warning("Poll creation should have atleast one question");
    }
    else {
      if (this.isPollSaved == false) {
        let data = {
          'associateId': this.data.associateId,
          'associateType': this.data.associateType,
          'pollName': this.pollName,
          'questionJson': JSON.stringify(this.pollCreation.text),
          'createdBy': this.sessionService.userId,
          'createdDtae': this.currentDate,
          'updatedBy': this.sessionService.userId,
          'updatedDate': this.currentDate
        };
        this.modService.createPoll(data).subscribe(res => {
          if (res.success) {
            this.pollId = res.result.id;
            this.isPollSaved = true;
            this.toastr.success("Poll has been created successfully");
          }
        }, err => {
          this.toastr.error("Poll creation failed, Please check your connection and try again");
          console.log(err);
        });
      }
      else {
        let data = {
          'Id': this.pollId,
          'QuestionJson': JSON.stringify(this.pollCreation.text)
        };
        this.modService.updatePoll(data).subscribe(res => {
          if (res.success)
            this.toastr.success("Poll has been created successfully");
        }, err => {
          this.toastr.error("Poll creation failed, Please check your connection and try again");
        })
      }
    }
  }

  backToSession(): void {
    this.pollCreationDialog.close();
  }

  onCancel(): void {
    this.pollCreationDialog.close();
  }
}
