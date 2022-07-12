import { Component, OnInit, Injector } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ModService } from '@app/service';
import * as SurveyCreator from "survey-creator";
import { AppComponentBase } from '@shared/app-component-base';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { dataService } from "@app/service/common/dataService";
import { MatDialog } from '@angular/material';
import { SurveyNameDialogComponent } from './survey-name-dialog/survey-name-dialog.component';
SurveyCreator.StylesManager.applyTheme("default");

@Component({
  selector: 'app-survey-creator',
  templateUrl: './survey-creator.component.html',
  styleUrls: ['./survey-creator.component.css'],
  providers: [DatePipe]
})
export class SurveyCreatorComponent extends AppComponentBase implements OnInit {
  private routeSub: Subscription;// get id from router 
  surveyCreator: SurveyCreator.SurveyCreator;
  surveyId: string;
  surveyJson: "";
  surveyName: "";
  today: number;
  isEnabled = false;
  saveSurveyId: number;
  currentDate = this.datePipe.transform(new Date(), "yyyy-MM-dd hh:mm:ss");
  userId: number = this.appSession.user.id;
  questionLimit: number = 0;
  isSurveyCreator = false;
  surveyCreatorOptions = {
    showJSONEditorTab: false,
    showTestSurveyTab: false,
    showEmbededSurveyTab: false,
    questionTypes: ["text", "boolean", "radiogroup", "checkbox", "droupdown", "rating", "comment", "file", "imagepicker", "panel", "matrix", "multipletext", "html"]
  };
  isRoutetoSurveyList: boolean = true;
  isSurveySaved: boolean = false;
  isSurveyModified: boolean = false;

  constructor(
    injector: Injector,
    private dataService: dataService,
    private route: ActivatedRoute,
    private modService: ModService,
    private toastr: ToastrService,
    private datePipe: DatePipe,
    public dialog: MatDialog,
    private router: Router
  ) {
    super(injector);
  }

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.surveyId = atob(params['id']);
    });
    this.createSurvey(this.surveyId);
  }

  createSurvey(surveyid) {
    if (surveyid == 0) {
      let tenantNotification = this.dialog.open(SurveyNameDialogComponent, {
      });
    }
    else {
      this.modService.getSurveyId(surveyid).subscribe(res => {
        this.surveyJson = res.result.questionJson;
        this.dataService.pageName = res.result.surveyName;
        this.isRoutetoSurveyList = false;
        this.surveyCall();
      });
    }
  }

  surveyCall() {
    let options = { showEmbededSurveyTab: true, generateValidJSON: true };
    this.surveyCreator = new SurveyCreator.SurveyCreator(
      "surveyCreatorContainer",
      this.surveyCreatorOptions
    );
    this.surveyCreator.text = JSON.parse(this.surveyJson);
    this.questionLimit = this.surveyCreator.survey.getAllQuestions().length;
    if (this.questionLimit) {
      this.isRoutetoSurveyList = false;
    }
    this.isSurveyCreator = true;
    this.surveyCreator.onQuestionAdded.add((sender, option) => {
      this.isSurveyModified = true;
    });
    this.surveyCreator.onElementDeleting.add((sender, option) => {
      this.isSurveyModified = true;
    })
    this.isSurveySaved = this.surveyCreator.survey.getAllQuestions().length ? true : false;
    this.surveyCreator.saveSurveyFunc = this.saveMySurvey.bind(this);
  }

  saveMySurvey() {
    this.questionLimit = this.surveyCreator.survey.getAllQuestions().length;
    this.isRoutetoSurveyList = false;
    if (this.questionLimit === 0) {
      this.toastr.warning("Survey creation should have atleast one question");
    }
    else {
      let data = {
        'id': this.surveyId,
        'questionJson': JSON.stringify(this.surveyCreator.text),
        'updatedBy': this.userId,
        'updateDate': this.currentDate,
        'isEnabled': true
      };
      this.modService.updateSurveyQuestion(data).subscribe(res => {
        this.isSurveySaved = true;
        this.isSurveyModified = false;
        this.toastr.success("Survey has been created successfully");
      }, err => {
        this.toastr.warning("Please try again later");
      });
    };
  }

  back() {
    this.questionLimit = this.surveyCreator.survey.getAllQuestions().length;
    if (this.isSurveyModified || !this.isSurveySaved) {
      this.toastr.warning("Please save the created survey");
    }
    else if (this.questionLimit || this.saveMySurvey) {
      this.router.navigate(['app/survey-list']);
    }
  }
}



