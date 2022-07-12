import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ModService } from '@app/service';
import * as Survey from 'survey-angular';
import { AppSessionService } from '@shared/session/app-session.service';
import { DatePipe } from '@angular/common';
import { ToastrService } from "ngx-toastr";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
Survey.StylesManager.applyTheme("default");

@Component({
  selector: 'app-poll-response',
  templateUrl: './poll-response.component.html',
  styleUrls: ['./poll-response.component.css'],
  providers: [DatePipe]
})
export class PollResponseComponent implements OnInit {
  private routeSub: Subscription;
  currentDate = this.datePipe.transform(new Date(), "yyyy-MM-dd hh:mm:ss");
  pollId: number;
  pollJson: "";

  constructor(
    private route: ActivatedRoute,
    private modService: ModService,
    private sessionService: AppSessionService,
    private toastr: ToastrService,
    private datePipe: DatePipe,
    private router: Router,
    public pollResponceDialog: MatDialogRef<PollResponseComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.modService.getPollById(this.data.routerId).subscribe(res => {
      this.pollJson = res.result.questionJson;
      this.takePoll();
    });
  }

  takePoll() {
    const surveyModel = new Survey.Model(JSON.parse(this.pollJson));
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
        this.pollResponceDialog.close();
        let saveData = {
          'PollId': this.data.routerId,
          'CreatedBy': this.sessionService.userId,
          'createdDate': this.currentDate,
          'UpdatedBy': this.sessionService.userId,
          'UpdatedDate': this.currentDate,
          'ResultJson': JSON.stringify(result.data)
        };
        this.modService.createPollAnalysis(saveData).subscribe(res => {
          if (res.success) {
            this.toastr.success("Thank you for completing the poll");
          }
        }, err => {
          console.log(err);
        });
      });
    Survey.SurveyNG.render('pollResponseContainer', { model: surveyModel });
  }
}

