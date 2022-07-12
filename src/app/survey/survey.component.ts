import { Component, OnInit, Injector } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModService } from '@app/service';
import { Subscription } from 'rxjs';
import { DatePipe } from '@angular/common';
import { ToastrService } from "ngx-toastr";
import * as Survey from 'survey-angular';
import { AppComponentBase } from '@shared/app-component-base';
import { dataService } from "@app/service/common/dataService";
import { SurveyResponse } from "@app/enums/poll-type";
Survey.StylesManager.applyTheme("default");

@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.css'],
  providers: [DatePipe]
})
export class SurveyComponent extends AppComponentBase implements OnInit {
  private routeSub: Subscription;// get id from router 

  surveyId: any;
  surveyJson: string;
  resultData: string;
  myDate = this.datePipe.transform(new Date(), "yyyy-MM-dd hh:mm:ss");
  platformId = this.appSession.user.id;
  userId = this.appSession.user.id;
  errorMessage: string;
  isSurevyErrorMessage: boolean = false;

  constructor(
    injector: Injector,
    private dataservice: dataService,
    private route: ActivatedRoute,
    private modService: ModService,
    private toastr: ToastrService,
    private datePipe: DatePipe,
  ) {
    super(injector);
  }

  ngOnInit() {
    this.dataservice.pageName = 'Take Survey';
    this.dataservice.isLoading = true;
    let queryParam = this.route.snapshot.queryParamMap.get('surveytoken');
    var data = {
      'tenantId': this.dataservice.currentTenentId,
      'queryString': queryParam,
      'platformUserId': this.userId
    }
    this.modService.takeSurveyId(data).subscribe(res => {
      this.dataservice.isLoading = false;
      if (res.result) {
        let isSurveyCompleted = res.result;
        if (res.result.errorMessage) {
          this.errorMessage = SurveyResponse[isSurveyCompleted.errorMessage];
          this.isSurevyErrorMessage = true;
          this.toastr.warning(SurveyResponse[isSurveyCompleted.errorMessage]);
        }
        else {
          this.surveyJson = res.result.questionJson;
          this.surveyId = res.result.id;
          this.takeSurvey();
        }
      }
      else {
        const surveyModel = new Survey.Model();
        surveyModel.completedHtml = "My Thank you page";
        this.toastr.warning("Survey response has been submitted");
      }
    });
  }
  takeSurvey() {
    const surveyModel = new Survey.Model(JSON.parse(this.surveyJson));
    surveyModel.onAfterRenderQuestion.add((survey, options) => {
      if (!options.question.popupdescription) {
        return;
      }
      // Add a button;
      const button = document.createElement('button');
      button.className = 'btn btn-info btn-xs';
      button.innerHTML = 'More Info';
      button.onclick = function () { };
      const showHeader = options.htmlElement.querySelector('h5');
      const showQuestion = document.createElement('span');
      showQuestion.innerHTML = '  ';
      showHeader.appendChild(showQuestion);
      showHeader.appendChild(button);
    });
    surveyModel.onComplete
      .add((result, options) => {
        this.resultData = result.data;
        let savedata = {
          'surveyId': this.surveyId,
          'userId': this.platformId,
          'createdDate': this.myDate,
          'isCompletionSubmit': true,
          'surveyResultJson': JSON.stringify(result.data)
        };
        this.modService.createSurveyAnalysis(savedata).subscribe(res => {
          if (res.success)
            this.toastr.success("Thank you for taking the survey");
        }, err => {
          console.log(err);
        });
      });
    Survey.SurveyNG.render('surveyElement', { model: surveyModel });
  }
}
