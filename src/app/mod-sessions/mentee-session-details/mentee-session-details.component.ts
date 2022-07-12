import { Component, OnInit } from '@angular/core';
import { ModService } from '@app/service';
import { ToastrService } from 'ngx-toastr';
import { dataService } from "@app/service/common/dataService";
import { SessionStatus, SessionType } from '@app/enums/user-roles';
import { CompletionStatus, Evaluation, DocumentFileType } from '@app/enums/document-type';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { ViewAssignmentDocumentComponent } from '@app/view-assignment-document/view-assignment-document.component';

@Component({
  selector: 'app-mentee-session-details',
  templateUrl: './mentee-session-details.component.html',
  styleUrls: ['./mentee-session-details.component.css']
})
export class MenteeSessionDetailsComponent implements OnInit {
  viewAssignments = false;
  viewFeedback: boolean[];
  session: any;
  sessionType: any = SessionType;
  assignments: any[];
  sessionStatus: any = SessionStatus;
  completionStatus: any = CompletionStatus;
  evaluation: any = Evaluation;
  assignmentName: string;
  skillList: any;
  file: any = [];
  assignmentId: any;
  enableSubmit: boolean = false;
  showNoAssignments: boolean;
  assignmentCount: number = 0;
  documentFileType: any = DocumentFileType;

  constructor(private modService: ModService,
    private toastr: ToastrService,
    public dialog: MatDialog,
    public dataService: dataService) {
  }

  viewReview(index: number) {
    this.viewFeedback[index] = !this.viewFeedback[index];
  }

  ngOnInit() {
    this.modService.getAllAssignmentsForMentee(this.session.sessionScheduleId, this.dataService.currentUserId).subscribe(res => {
      this.assignments = res.result ? res.result : [];
      this.showNoAssignments = !this.assignments.length;
      this.viewFeedback = [];
      this.assignments.forEach(element => {
        element.skillList = element.skills.split(',');
        this.viewFeedback.push(false);
      });
      this.assignmentCount = this.assignments.length;
    });
  }

  submitAssignments(assignment: any) {
    this.viewAssignments = !this.viewAssignments;
    this.assignmentName = assignment.title;
    this.skillList = assignment.skills.split(',');
    this.assignmentId = assignment.id;
  }

  onFileChange(event) {
    if (event.target.files.length > 0) {
      let selectedFile = event.target.files[0].type;
      this.file = event.target.files[0];
      this.enableSubmit = true;
      if (selectedFile == "application/x-zip-compressed"
        || selectedFile == "application/x-rar-compressed") {
        this.toastr.success('File selected');
      }
      else {
        this.toastr.warning('Upload only Zip files');
      }
    }
    else {
      this.toastr.warning('Please select a file');
    }
  }

  back() {
    this.viewAssignments = !this.viewAssignments;
    this.enableSubmit = false;
    this.file = [];
  }

  submitAssignment() {
    const formData = new FormData();
    formData.append('file', this.file, this.file.name);
    this.dataService.isLoading = true;
    this.modService.submitAssignment(formData, this.assignmentId, this.session.sessionScheduleId, this.dataService.currentUserId).subscribe(res => {
      if (res) {
        this.dataService.isLoading = this.dataService.doneLoading();
        this.toastr.success("Assignment Submitted");
        this.viewAssignments = !this.viewAssignments;
        this.modService.getAllAssignmentsForMentee(this.session.sessionScheduleId, this.dataService.currentUserId).subscribe(res => {
          this.assignments = res.result ? res.result : [];
          this.assignments.forEach(element => {
            element.skillList = element.skills.split(',');
          });
        });
      }
    });
  }

  viewDocuments(assignment: any,documentType: string): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = false;
    dialogConfig.width = '70vw';
    const dialogRef = this.dialog.open(ViewAssignmentDocumentComponent, dialogConfig);
    dialogRef.componentInstance.assignment = assignment;
    dialogRef.componentInstance.documentType = documentType;
  }

  downloadFiles(assignment: any, type: DocumentFileType) {
    let blobURL: any = [];
    assignment.documents.forEach(element => {
      if (element.type == type) {
        blobURL.push(element.document);
      }
    });
    if (blobURL.length) {
      let data = {
        "blobURLs": blobURL,
        "assignmentId": assignment.id
      }
      this.modService.getDownloadURL(data).subscribe(res => {
        let documents = res.result ? res.result : [];
        documents.forEach(element => {
          window.open(element);
        });
      });
    }
    else {
      let toastrMessage = (type == DocumentFileType['1'] ? "No Documents found" : "No Resources found");
      this.toastr.warning(toastrMessage);
    }
  }
}