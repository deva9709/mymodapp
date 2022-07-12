import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ModService } from "@app/service";
import { ToastrService } from "ngx-toastr";
import { dataService } from "@app/service/common/dataService";

@Component({
  selector: 'app-delete-session-dialog',
  templateUrl: './delete-session-dialog.component.html',
  styleUrls: ['./delete-session-dialog.component.css']
})
export class DeleteSessionDialogComponent implements OnInit {
  deleteSessionTitle: string;
  constructor(private modService: ModService,
    public dataService: dataService,
    private toastr: ToastrService,
    public deleteSessionDialog: MatDialogRef<DeleteSessionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public deleteSessionData: any) { }

  ngOnInit() {
    this.deleteSessionTitle = this.deleteSessionData.title;
  }

  removeSession() {
    let data = {
      sessionScheduleId: this.deleteSessionData.deleteSessionId,
      canceledByUserId: this.dataService.currentPlatformUserId
    }
    this.modService.cancelSession(data).subscribe(res => {
      if (res.success)
        this.deleteSessionDialog.close({ isDeleted: true });
      else
        this.toastr.warning("Please try again Later");
    }, err => {
      this.toastr.warning("Please try again Later");
    });
  }

  cancel() {
    this.deleteSessionDialog.close({ isDeleted: false });
  }
}
