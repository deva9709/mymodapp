import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ModService } from "@app/service";
import { ToastrService } from "ngx-toastr";
import { dataService } from "@app/service/common/dataService";

@Component({
  selector: 'app-delete-announcement',
  templateUrl: './delete-announcement.component.html',
  styleUrls: ['./delete-announcement.component.css']
})
export class DeleteAnnouncementComponent implements OnInit {
  constructor(private modService: ModService,
    private toastr: ToastrService,
    public dataService: dataService,
    public deleteAnnouncementDialog: MatDialogRef<DeleteAnnouncementComponent>,
    @Inject(MAT_DIALOG_DATA) public deleteAnnouncementData: any) { }

  ngOnInit() {
  }
  deleteAnnouncement() {
    let data = {
      id: this.deleteAnnouncementData.announcementId,
      modifiedByUserId: this.dataService.currentUserId
    }
    this.modService.deleteAnnouncement(data).subscribe(res => {
      if (res)
        this.deleteAnnouncementDialog.close({ isDeleted: true });
      else
        this.toastr.warning("Please try again later");
    },
      err => {
        this.toastr.warning("Please try again later");
      });
  }
  cancelDeleteAnnouncement() {
    this.deleteAnnouncementDialog.close({ isDeleted: false });
  }
}
