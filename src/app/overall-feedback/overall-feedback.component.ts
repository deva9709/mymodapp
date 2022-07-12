import { Component, OnInit } from '@angular/core';
import { ModService } from "@app/service";
import { dataService } from "@app/service/common/dataService";
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { FeedbackType } from "@app/enums/feedback-type";

@Component({
  selector: 'app-overall-feedback',
  templateUrl: './overall-feedback.component.html',
  styleUrls: ['./overall-feedback.component.css']
})
export class OverallFeedbackComponent implements OnInit {
  averageMentorRating: number;
  averageAudioQuality: number;
  averageVideoQuality: number;
  isReadonly: boolean = false;
  overAllRating: any[] = [];
  sessionTitle: string = "";
  feedbackQuestionLists: any[] = [];
  sessionScheduleId: number;
  sessionRatings: any[] = [];
  otherRatingParameters: any[] = [];
  constructor(private modService: ModService, private route: ActivatedRoute, private router: Router, private dataService: dataService) { }

  ngOnInit() {
    this.dataService.pageName = "Session Feedbacks";
    this.route.params.subscribe(params => {
      let sessionId = atob(params['id']);
      this.sessionScheduleId = parseInt(sessionId);
    });
    this.getSessionDetails(this.sessionScheduleId);
    this.getFeedbackQuestions(FeedbackType.Session);
  }
  getSessionDetails(scheduleId: number) {
    this.modService.getSessionDetails(scheduleId).subscribe(res => {
      this.sessionTitle = res.result.sessionTitle;
    });
  }

  backToSession() {
    this.router.navigate(['app/mod-sessions']);
  }

  getFeedbackQuestions(type: number) {
    this.modService.getFeedbackQuestionList(type).subscribe(res => {
      this.feedbackQuestionLists = res.result;
      this.getOverallRatingForSession(this.sessionScheduleId);
    });
  }

  getOverallRatingForSession(scheduleId: number) {
    this.modService.getOverallRatingForSession(scheduleId).subscribe(res => {
      this.averageMentorRating = res.result.averageMentorRating;
      this.averageAudioQuality = res.result.averageAudioQuality;
      this.averageVideoQuality = res.result.averageVideoQuality;
      if (res.result.sessionAverageRatingParameters.length) {
        this.otherRatingParameters = res.result.sessionAverageRatingParameters;
      }
      else {
        this.feedbackQuestionLists.forEach(element => {
          var data = {
            description: "",
            parameterId: 0,
            averageRating: 0
          }
          data.description = element.description;
          data.parameterId = element.id;
          data.averageRating = 0;
          this.otherRatingParameters.push(data);
        });
      }
      this.isReadonly = true;
      this.modService.getSessionRatings(scheduleId).subscribe(res => {
        if (res.result) {
          res.result.forEach(element => {
            if (element.generalFeedback.trim()) {
              this.sessionRatings.push(element);
            }
          });
        }
      });
    });
  }
}
