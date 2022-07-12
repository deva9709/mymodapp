import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig, MatPaginator, MatTableDataSource } from '@angular/material';
import { feedbackDetails } from '@app/admindashboard/admindashboard.component';
import { FullFeedbackdetailsComponent } from '@app/dialog/full-feedbackdetails/full-feedbackdetails.component';
import { ModService } from '@app/service/api/mod.service';
import { dataService } from '@app/service/common/dataService';
@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent implements OnInit {
  feedBackDetails_Columns: string[] = ['sessionTitle', 'trainerName', 'traineeRating', 'date', 'feedback'];

  constructor(private modService: ModService,
    private dataService: dataService, public dialog: MatDialog,) { }
  dataSource_Feedback: MatTableDataSource<feedbackDetails>;
  allFeedback: any[] = [];
  menteePlatformId: number;
  canBeMentee: boolean = false;
  selectedTenant: number;
  tenantId: number;
  @ViewChild(MatPaginator)
  paginator: MatPaginator;

  ngOnInit() {
    this.menteePlatformId = this.dataService.currentPlatformUserId;
    if (this.dataService.canBeMentee == true) {
      this.getTraineeFeedbackByTraineeId();
    }
    if (this.dataService.canBeMentor == true) {
      this.getTraineeFeedbackByTrainerId();
    }
    if (this.dataService.currentUserRole == "SiteAdmin") {
      this.getSiteAdminfeedback();
    }
    if (this.dataService.currentUserRole == "SUPERADMIN") {
      this.getSuperAdminFeedbackDetails();
    }

  }
  getTraineeFeedbackByTraineeId(): void {
    this.modService.getTraineeFeedbackByTraineeId(this.dataService.currentPlatformUserId).subscribe(res => {
      this.dataSource_Feedback = new MatTableDataSource<feedbackDetails>(res.result);
      this.paginator.firstPage();
      this.dataSource_Feedback.paginator = this.paginator;
    });
  }
  getTraineeFeedbackByTrainerId(): void {
    this.modService.getTraineeFeedbackByTrainerId(this.dataService.currentPlatformUserId).subscribe(res => {
      this.allFeedback = res.result;
      this.dataSource_Feedback = new MatTableDataSource<feedbackDetails>(this.allFeedback);
      this.paginator.firstPage();
      this.dataSource_Feedback.paginator = this.paginator;
    });
  }
  getSiteAdminfeedback() {
    this.modService.getSiteAdminFeedback().subscribe(res => {
      this.allFeedback = res.result;
      this.dataSource_Feedback = new MatTableDataSource<feedbackDetails>(this.allFeedback);
      this.paginator.firstPage();
      this.dataSource_Feedback.paginator = this.paginator;
    });
  }
  getSuperAdminFeedbackDetails() {
    this.selectedTenant = this.dataService.selectedTenant;
    this.modService.GetSuperAdminFeedbackDetails(this.selectedTenant).subscribe(res => {
      this.allFeedback = res.result;
      this.dataSource_Feedback = new MatTableDataSource<feedbackDetails>(this.allFeedback);
      this.paginator.firstPage();
      this.dataSource_Feedback.paginator = this.paginator;
    });
  }
  feedbackMoreDetails(val) {
    const membersDialog = new MatDialogConfig();
    membersDialog.autoFocus = false;
    membersDialog.width = '60vw';
    membersDialog.height = '22vw';
    membersDialog.data = val;
    const dialogRef = this.dialog.open(FullFeedbackdetailsComponent, membersDialog);
  }

}
