import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModService } from '@app/service';
import { ToastrService } from 'ngx-toastr';
import { AppSessionService } from '@shared/session/app-session.service';
import { dataService } from "@app/service/common/dataService";
import { Subscription } from 'rxjs';
import * as SurveyAnalytics from "survey-analytics";
import * as Survey from "survey-angular";
import { MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource, MatPaginator, MatSort } from '@angular/material';

@Component({
  selector: 'app-poll-analysis',
  templateUrl: './poll-analysis.component.html',
  styleUrls: ['./poll-analysis.component.css']
})
export class PollAnalysisComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  private routeSub: Subscription;
  associateId: number;
  associateType: number;
  showPoll: boolean = true;
  showPollAnalysis: boolean = false;
  pollResultsJson: any[] = [];
  pollQuestionJson: string = "";
  pollLists: any[] = [];
  ViewPollColumns: string[] = ['pollName', 'analysisPoll'];
  dataSource: MatTableDataSource<any>;

  constructor(
    private dataService: dataService,
    private route: ActivatedRoute,
    private modService: ModService,
    private toastr: ToastrService,
    private sessionService: AppSessionService,
    public pollAnalysisDialog: MatDialogRef<PollAnalysisComponent>,
    @Inject(MAT_DIALOG_DATA) public pollAnalysisData: any,
    private router: Router
  ) { }

  ngOnInit() {
    this.getPollDetails();
  }

  getPollDetails() {
    this.showPoll = true;
    this.pollLists = [];
    let data = {
      'AssociateType': this.pollAnalysisData.associateType,
      'AssociateId': this.pollAnalysisData.associateId,
      'PlatformUserId': this.sessionService.userId
    };
    this.modService.getPollBySessionId(data).subscribe(res => {
      if (res.result) {
        this.pollLists = res.result;
      }
      this.dataSource = new MatTableDataSource<any>(this.pollLists);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }, err => {
      this.toastr.warning("Please try again later");
    });
  }

  analysisPoll(pollId: number) {
    this.showPoll = false;
    this.showPollAnalysis = true;
    this.pollResultsJson = [];
    this.modService.getPollResutById(pollId).subscribe(res => {
      if (res.result) {
        let pollData = res.result;
        pollData.resultJson.forEach(pollList => {
          this.pollResultsJson.push(JSON.parse(pollList));
        });
        this.pollQuestionJson = JSON.parse(res.result.questionJson);
        this.analysis();
      }
    }, err => {
      this.toastr.warning("Please try again later");
    });
  }

  analysis() {
    let poll = new Survey.SurveyModel(this.pollQuestionJson);
    let normalizedData = this.pollResultsJson.map(function (item) {
      poll.getAllQuestions().forEach(function (question) {
        if (item[question.name] == undefined || item[question.name] == null) {
          item[question.name] = "";
        }
      }, this);
      return item;
    });
    let pollAnalysis = new SurveyAnalytics.VisualizationPanel(
      document.getElementById("pollAnalyticsContainer"),
      poll.getAllQuestions(),
      normalizedData
    );
    pollAnalysis.showHeader = true;
    pollAnalysis.render();
  }

  backToViewPoll() {
    $("#pollAnalyticsContainer").empty();
    this.showPollAnalysis = false;
    this.showPoll = true;
    this.getPollDetails();
  }

  sendNotify(pollid) {
    let data = {
      'SessionScheduleId': this.pollAnalysisData.associateId,
      'Id': pollid
    };
    this.modService.sendPollNotification(data).subscribe(res => {
      if (res.success) {
        this.toastr.success("Notification has sent to mentee");
      }
    }, err => {
      this.toastr.error("Send Notification failed. Please try again");
    });
  }
}