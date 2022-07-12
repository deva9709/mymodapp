import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { dataService } from "@app/service/common/dataService";
import { ModService } from "@app/service";
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FeedbackType } from "@app/enums/feedback-type";
import { MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { ParticipantRole, UserRoles } from '@app/enums/user-roles';
import { AppSessionService } from '@shared/session/app-session.service';

export interface feedbackDetails {
  name: string;
  email: string;
  participantRole: ParticipantRole;
  id: number;
  platformUserId: number;
}
@Component({
  selector: 'app-session-feedback',
  templateUrl: './session-feedback.component.html',
  styleUrls: ['./session-feedback.component.css']
})
export class SessionFeedbackComponent implements OnInit {
  feedbackForm: FormGroup;
  mentorRating: number;
  sessionScheduleId: number;
  feedbackDescription: string = "";
  ratedByUseId: number;
  audioQualityRating: number;
  videoQualityRating: number;
  audioQuality: string = "audioQualityRating";
  videoQuality: string = "videoQualityRating";
  overAllRating: string = "mentorRating";
  sessionRating: any[] = [];
  feedbackQuestionLists: any[] = [];
  isHide: boolean = false;
  isHideFlgaForBulkFeedback: boolean = false;
  disableCheckBox: boolean = false;
  eventValue: boolean = false;
  allParticipants: any[] = [];
  allParticipantMentee: any[] = [];
  selectedMenteeId: any[] = [];
  menteeRating: number;
  menteeFeedBackDetails: any[] = [];
  menteeId: number;
  feedback: any = {};
  isMentorBlockFlag: boolean = false;
  isMenteeBlockFlag: boolean = false;
  dataSource: MatTableDataSource<feedbackDetails>;
  feedBackDetailsColumns: string[] = ['select', 'name', 'email'];
  selection = new SelectionModel<feedbackDetails>(true, []);
  traineeValue: any;
  checked: any;
  sessionCode: string;
  constructor(private dataService: dataService,
    private activateRoute: ActivatedRoute,
    private sessionService: AppSessionService,
    private modService: ModService,
    private router: Router,
    private toastr: ToastrService,
    private cdRef: ChangeDetectorRef,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.selectedMenteeId = [];
    this.selection.clear();
    this.sessionCode = this.activateRoute.snapshot.queryParamMap.get('sessioncode');
    let sessionDetails = {
      'SessionCode': this.sessionCode,
      'ParticipantUserId': this.sessionService.userId
    };
    this.menteeRating = 1;
    this.dataService.pageName = "Session Feedbacks";
    this.getFeedbackQuestions(FeedbackType.Session);
    this.feedbackForm = this.formBuilder.group({
      feedbackDescription: ['', [Validators.required]],
    });
    this.getSessionDetailsForFeedback(sessionDetails);

    if (atob(localStorage.getItem(btoa(this.sessionCode))) === 'true') {
      this.updateSessionConnectStatusAsync(sessionDetails);
      localStorage.setItem(btoa(this.sessionCode), btoa("false"));
    }
  }

  updateSessionConnectStatusAsync(sessionDetails: any) {
    this.modService.updateSessionConnectStatusAsync(sessionDetails).subscribe(response => {
      this.dataService.isLoading = false;
      //To navigate surveymonkey page after sessionstatus upadted one session end
      window.open("https://www.surveymonkey.com/r/6L9KY5B",'_self');
    });
  }

  getSessionDetailsForFeedback(sessionDetails: any) {
    this.modService.getSessionDetailsForFeedbackAsync(sessionDetails).subscribe(response => {
      if (response.result) {
        this.dataService.sessionCode = response.result.sessionCode;
        this.dataService.sessionTitle = response.result.sessionTitle;
        this.dataService.sessionScheduleId = response.result.id;
        this.dataService.currentSessionParticipantRole = response.result.participantRole;
        if (this.dataService.sessionScheduleId && this.dataService.currentSessionParticipantRole == ParticipantRole.Trainer) {
          this.getAllParticipantInSession();
          this.isMentorBlockFlag = true;
          this.isMenteeBlockFlag = false;
        }
        else {
          this.isMentorBlockFlag = false;
          this.isMenteeBlockFlag = true;
        }
      }
      this.dataService.isLoading = false;
    });
  }

  onRate($event, id: number) {
    let data = {
      parameterId: id,
      rating: $event.newValue
    }
    let modified: boolean = false;
    if (this.sessionRating) {
      this.sessionRating.forEach(val => {
        if (val.parameterId === data.parameterId) {
          val.rating = data.rating;
          modified = true;
        }
      });
    }
    if (!modified)
      this.sessionRating.push(data);
  }

  addRating() {
    let data = {
      sessionScheduleId: this.dataService.sessionScheduleId,
      ratedByUseId: this.dataService.currentPlatformUserId,
      feedback: this.feedbackDescription ? this.feedbackDescription : "",
      mentorRating: this.mentorRating,
      audioQuality: this.audioQualityRating,
      videoQuality: this.videoQualityRating,
      sessionRatingParameters: this.sessionRating
    }
    if (data.mentorRating && data.audioQuality && data.videoQuality) {
      this.modService.rateSession(data).subscribe(res => {
        if (res.success) {
          this.dataService.sessionScheduleId = 0;
          this.router.navigate(['app/mod-sessions']);
        }
        else {
          this.toastr.warning("Please try again later");
        }
      }, err => {
        this.toastr.warning("Please try again later");
      });
    }
    else
      this.toastr.warning("Please rate mandatory fields");
  }
  backToSession() {
    this.router.navigate(['app/mod-sessions']);
  }

  onRateDefault($event, parameter: string) {
    if (parameter === this.audioQuality) {
      this.audioQualityRating = $event.newValue;
    }
    if (parameter === this.videoQuality) {
      this.videoQualityRating = $event.newValue;
    }
    if (parameter === this.overAllRating) {
      this.mentorRating = $event.newValue;
    }
  }

  getFeedbackQuestions(type: number) {
    this.modService.getFeedbackQuestionList(type).subscribe(res => {
      if (res.result)
        this.feedbackQuestionLists = res.result;
    });
  }

  getAllParticipantInSession(): void {
    this.modService.getAllParticipantInSession(this.dataService.sessionScheduleId).subscribe(res => {
      this.allParticipants = res.result;
      this.allParticipantMentee = this.allParticipants.filter(x => (x.participantRole == ParticipantRole.Trainee));
      if (this.allParticipantMentee.length == 0) {
        this.router.navigate(['app/admindashboard']);
      }
      this.onLoad();
    });
  }
  onLoad(): void {
    this.dataSource = new MatTableDataSource<feedbackDetails>(this.allParticipantMentee);
  }

  cancelTraineeFeedback(): void {
    this.isHide = false;
    this.isHideFlgaForBulkFeedback = false;
    this.disableCheckBox = false;
    this.selection.clear();
    this.cdRef.detectChanges();
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    this.selectedMenteeId = [];
    this.isHide = false;
    if (numSelected === 1) {
      this.isHide = true;
      this.menteeId = this.selection.selected[0].platformUserId;
    }
    if (numSelected > 1) {
      this.isHide = false;
      this.isHideFlgaForBulkFeedback = true;
      this.selectedMenteeId = this.selection.selected.map(x => x.platformUserId);
    }
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ? this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }
  isSubmitFeedback: boolean = true;
  submitmitFeedback() {
    if (!this.feedbackForm.valid) {
      this.toastr.warning("Please enter valid details");
      return;
    }
    let dateTime = moment(new Date()).format('YYYY-MM-DD');
    if (this.selectedMenteeId.length > 1) {
      this.feedback = {
        sessionScheduleId: this.dataService.sessionScheduleId,
        ratedByUserId: this.dataService.currentPlatformUserId,
        menteeUserId: this.selectedMenteeId,
        feedback: this.feedbackForm.value.feedbackDescription,
        menteeRating: this.menteeRating,
        ratedOn: dateTime
      };
      this.modService.trainerBulkFeedback(this.feedback).subscribe(res => {
        if (res && res.success) {
          this.feedbackForm.reset('');
          this.toastr.success("Feedback save successfully");
          this.ngOnInit();
        }
      });
    }
    else {
      let menteeDetails = {
        menteeUserId: this.menteeId,
        feedback: this.feedbackForm.value.feedbackDescription,
        menteeRating: this.menteeRating,
        ratedOn: dateTime
      };
      this.menteeFeedBackDetails.push(menteeDetails);
      this.feedback = {
        sessionScheduleId: this.dataService.sessionScheduleId,
        ratedByUserId: this.dataService.currentPlatformUserId,
        menteeDetail: this.menteeFeedBackDetails
      };
      this.modService.trainerFeedback(this.feedback).subscribe(res => {
        if (res && res.success) {
          this.feedbackForm.reset('');
          this.toastr.success("Feedback save successfully");
          this.ngOnInit();
        }
      });
    }
  }

  individualFeedBackCheckBoxSelection(event) {
    this.eventValue = event.checked;
    this.isHideFlgaForBulkFeedback = true;
  }

  raitinggivenBTrainer($event) {
    this.menteeRating = $event.newValue;
  }
}

