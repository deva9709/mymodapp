import { Component, OnInit, Injector } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ViewAssignmentDocumentComponent } from "../view-assignment-document/view-assignment-document.component";
import { ActivatedRoute } from '@angular/router';
import { ISessionDetails, IAssignmentList } from '@app/mod-sessions/mod-sessions.component';
import { dataService } from '@app/service/common/dataService';
import { SessionType } from '@app/enums/user-roles';
import { ModService } from '@app/service';
import { DocumentFileType } from '@app/enums/document-type';
import { ToastrService } from 'ngx-toastr';
import { RemoveAssignmentComponent } from '@app/dialog/remove-assignment/remove-assignment.component';
import { TraineeAttendanceComponent } from '@app/dialog/trainee-attendance/trainee-attendance.component';

@Component({
  selector: 'app-mod-session-details',
  templateUrl: './mod-session-details.component.html',
  styleUrls: ['./mod-session-details.component.css']
})
export class ModSessionDetailsComponent implements OnInit {
  assignmentSource: any;
  assignmentSearch: any;
  viewAssignment = false;
  sessionScheduleId: string;
  sessionDetails: ISessionDetails;
  sessionType: any = SessionType;
  currentUserRole: string = this.dataService.currentUserType;
  userId: number = this.dataService.currentUserId;
  autoComplete: boolean = false;
  searchAssignment: any;
  filteredAssignments: any;
  assignmentList: any;
  showNoAssignments: boolean;
  assignmentIds: any = [];
  selectedAssignment: any = [];
  isAssignmentAvailable: boolean = true;
  documentFileType = DocumentFileType;
  isSuperAdmin: boolean = this.dataService.isSuperAdmin;
  displayedColumns: string[] = !this.isSuperAdmin ? ['title', 'skill', 'download', 'action'] : ['title', 'skill', 'download'];

  constructor(
    injector: Injector,
    public dialog: MatDialog,
    private activeatedRoute: ActivatedRoute,
    private dataService: dataService,
    private modService: ModService,
    private toastr: ToastrService
  ) { }

  addAssignment() {
    this.viewAssignment = !this.viewAssignment;
    this.selectedAssignment = [];
    this.searchAssignment = '';
    this.applyFilter(this.searchAssignment);
  }

  addAttendance() {
    const dialogRef = this.dialog.open(TraineeAttendanceComponent,{disableClose:true,autoFocus:false,data:{sessionId:this.sessionDetails.sessionScheduleId,sessionTitle:this.sessionDetails.sessionTitle}});
  }

  ngOnInit() {
    this.activeatedRoute.params.subscribe((params) => {
      this.sessionScheduleId = atob(params['id']);
      this.sessionDetails = this.dataService.upcomingSessionList.sessions.filter(s => s.sessionScheduleId === parseInt(this.sessionScheduleId))[0];
      console.log(this.sessionDetails);
    });
    this.loadAssignments();
  }

  viewDocuments(assignment: any, documentType: string): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = false;
    dialogConfig.width = '80vw';
    const dialogRef = this.dialog.open(ViewAssignmentDocumentComponent, dialogConfig);
    dialogRef.componentInstance.assignment = assignment;
    dialogRef.componentInstance.documentType = documentType;
  }

  applyFilter(filterValue: string) {
    if (this.searchAssignment.trim()) {
      this.autoComplete = true;
    }
    else {
      this.autoComplete = false;
    }
    this.filteredAssignments = this.assignmentList.filter((data: IAssignmentList) => data.title.toLowerCase().includes(filterValue.trim().toLowerCase()));
    if (!this.filteredAssignments.length && filterValue.length) {
      this.showNoAssignments = true;
      this.autoComplete = true;
    }
    else
      this.showNoAssignments = false;
    this.assignmentSearch = this.filteredAssignments;
  }

  autoResult() {
    this.autoComplete = false;
  }

  updateAssignment(event: any, assignment: any) {
    if (event.checked) {
      this.selectedAssignment.push(assignment);
    }
    else {
      this.selectedAssignment = this.selectedAssignment.filter(assignment => assignment.id != assignment.id);
    }
  }

  update() {
    let selectedIds = [];
    this.selectedAssignment.forEach(element => {
      selectedIds.push(element.id);
    });
    let data = {
      "sessionId": this.sessionScheduleId,
      "newAssignmentsId": selectedIds
    }
    this.modService.UpdateSessionAssignment(data).subscribe(res => {
      if (res.success)
        this.loadAssignments();
    });
    this.autoComplete = false;
    this.searchAssignment = '';
    this.selectedAssignment = [];
  }

  removeAsssignment(assignmentId: number) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = false;
    dialogConfig.width = '40vw';
    const dialogRef = this.dialog.open(RemoveAssignmentComponent, dialogConfig);
    dialogRef.componentInstance.assignmentId = assignmentId;
    dialogRef.componentInstance.sessionId = parseInt(this.sessionScheduleId);
    dialogRef.afterClosed().subscribe(res => {
      if (res)
        this.loadAssignments();
    });
  }

  loadAssignments() {
    this.assignmentIds = [];
    this.dataService.isLoading = true;
    this.modService.getAssignmentForSession(parseInt(this.sessionScheduleId)).subscribe(res => {
      this.assignmentSource = res.result ? res.result : [];
      this.isAssignmentAvailable = res.result.length;
      this.dataService.isLoading = this.dataService.doneLoading();
      this.assignmentSource.forEach(element => {
        this.assignmentIds.push(element.id);
      });
    });
    this.modService.GetAllAssignmentForUser(this.dataService.currentUserId).subscribe(res => {
      this.assignmentList = res.result ? res.result : [];
    });
  }

  downloadResources(assignment: any) {
    let blobURL: any = [];
    assignment.documents.forEach(element => {
      if (element.type == DocumentFileType[2]) {
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
      this.toastr.warning("No Resources found");
    }
  }

  clearSearch() {
    this.searchAssignment = '';
    this.applyFilter(this.searchAssignment);
  }

  removeSelected(assignmentId: number) {
    this.selectedAssignment = this.selectedAssignment.filter(assignment => assignment.id != assignmentId);
  }
}