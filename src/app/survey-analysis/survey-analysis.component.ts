import { Component, OnInit } from '@angular/core';
import * as Survey from "survey-angular";
import * as SurveyAnalytics from "survey-analytics";
import { ActivatedRoute } from '@angular/router';
import { ModService } from '@app/service';
import { dataService } from "@app/service/common/dataService";
import { Subscription } from 'rxjs';
import { Constants } from '@app/models/constants';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-survey-analysis',
  templateUrl: './survey-analysis.component.html',
  styleUrls: ['./survey-analysis.component.css']
})
export class SurveyAnalysisComponent implements OnInit {
  private routeSub: Subscription;// get id from router 
  surveyId: number;
  tenantId: number;
  surveyResultsJson: any[] = [];
  surveyQuestionJson: string = "";
  routerIdDecode: string;
  routerId: string[] = [];
  constructor(
    private dataService: dataService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private modService: ModService) { }

  ngOnInit() {
    this.dataService.pageName = 'Survey Analysis';
    this.routeSub = this.route.params.subscribe(params => {
      if (params.id) {
        this.routerIdDecode = atob(params['id']);
        this.routerId = this.routerIdDecode.split(Constants.Seperator);
      }
    }, err => {
      console.log(err);
    });
    let data = {
      'surveyId': this.routerId[0],
      'tenantId': this.routerId[1]
    };
    this.surveyResultsJson = [];
    this.modService.getSurveyResutById(data).subscribe(res => {
      if (res.result) {
        let surveyData = res.result;
        surveyData.resultJson.forEach(surveyList => {
          this.surveyResultsJson.push(JSON.parse(surveyList));
        });
        this.surveyQuestionJson = JSON.parse(res.result.questionJson);
        this.surveyAnalysis();
      }
    }, err => {
      console.log(err);
    });
  }

  surveyAnalysis() {
    let survey = new Survey.SurveyModel(this.surveyQuestionJson);
    let normalizedData = this.surveyResultsJson.map((item) => {
      survey.getAllQuestions().forEach((surveyQuestion) => {
        if (item[surveyQuestion.name] == undefined || item[surveyQuestion.name] == null) {
          item[surveyQuestion.name] = "";
        }
      }, this);
      return item;
    });
    let surveyAnalysis = new SurveyAnalytics.VisualizationPanel(
      document.getElementById("surveyAnalyticsContainer"),
      survey.getAllQuestions(),
      normalizedData
    );
    surveyAnalysis.showHeader = true;
    surveyAnalysis.render();
  }
}