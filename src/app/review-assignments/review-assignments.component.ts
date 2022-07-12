import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModService } from '@app/service';
import { Result, CompletionStatus, Evaluation } from '@app/enums/document-type';
import { dataService } from '@app/service/common/dataService';
import { ToastrService } from 'ngx-toastr';

export interface grade {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-review-assignments',
  templateUrl: './review-assignments.component.html',
  styleUrls: ['./review-assignments.component.css']
})

export class ReviewAssignmentsComponent implements OnInit {
  panelOpenState = false;
  viewAssignments = false;
  grades: grade[] = [
    { value: 'Pass', viewValue: 'Pass' },
    { value: 'Retry', viewValue: 'Retry' }
  ];
  sessionScheduleId: any;
  assignments: any = [];
  assignmentName: any;
  skillList: any;
  selectedAssignment: any = [];
  grade: string;
  feedback: string;
  isAssignmentsAvailable: boolean = true;
  completionStatus: any = CompletionStatus;
  evaluation: any = Evaluation;

  submitAssignments(assignment: any) {
    this.viewAssignments = !this.viewAssignments;
    this.skillList = assignment.skills.split(',');
    this.selectedAssignment = assignment;
  }

  constructor(private modService: ModService,
    private route: ActivatedRoute,
    private dataService: dataService,
    private toastr: ToastrService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.sessionScheduleId = parseInt(atob(params['id']));
    });
    this.dataService.isLoading = true;
    this.modService.reviewAssignments(this.sessionScheduleId).subscribe(res => {
      this.assignments = res.result ? res.result : [];
      this.isAssignmentsAvailable = this.assignments.isAssignmentsAvailable;
      this.dataService.isLoading = this.dataService.doneLoading();
    });
  }

  sendFeedback() {
    let data = {
      "submissionId": this.selectedAssignment.submission.submissionId,
      "feedback": this.feedback ? this.feedback.trim() : '',
      "rating": 0,
      "status": this.grade,
    }
    if (this.grade == Result[1]) {
      this.modService.submitFeedback(data).subscribe(res => {
        this.viewAssignments = !this.viewAssignments;
        this.modService.reviewAssignments(this.sessionScheduleId).subscribe(res => {
          this.assignments = res.result ? res.result : [];
        });
      });
    }
    if (this.grade == Result[2]) {
      this.modService.retryAssignment(data).subscribe(res => {
        this.viewAssignments = !this.viewAssignments;
        this.modService.reviewAssignments(this.sessionScheduleId).subscribe(res => {
          this.assignments = res.result ? res.result : [];
        });
      });
    }
  }

  back() {
    this.viewAssignments = !this.viewAssignments;
  }

  downloadDocument(assignment: any) {
    let blobURL: any = [];
    let submissions = assignment.submission ? assignment.submission : [];
    blobURL.push(submissions.documents.document);
    if (blobURL.length) {
      let data = {
        "blobURLs": blobURL,
        "assignmentId": assignment.assignmentId
      }
      this.modService.getDownloadURL(data).subscribe(res => {
        let documents = res.result ? res.result : [];
        documents.forEach(element => {
          window.location.href = element;
        });
      });
    }
    else {
      this.toastr.warning("No Documents found");
    }
  }
}