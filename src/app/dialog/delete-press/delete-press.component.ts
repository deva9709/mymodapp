import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ModService } from "@app/service";
import { ToastrService } from "ngx-toastr";
import { dataService } from "@app/service/common/dataService";

@Component({
  selector: 'app-delete-press',
  templateUrl: './delete-press.component.html',
  styleUrls: ['./delete-press.component.css']
})
export class DeletePressComponent implements OnInit {
  id: number;
  title: string;
  constructor(private modService: ModService,
    private toastr: ToastrService,
    public dataService: dataService,
    public deletePressReleaseDialog: MatDialogRef<DeletePressComponent>,
    @Inject(MAT_DIALOG_DATA) public deletePressReleaseData: any) { }

  ngOnInit() {
    this.id = this.deletePressReleaseData.id;
    this.title = this.deletePressReleaseData.title;
  }
  deletePressRelease() {
    this.modService.deletePressRelease(this.deletePressReleaseData.id, this.dataService.currentUserId).subscribe(res => {
      this.deletePressReleaseDialog.close({ isDeleted: true });
    }, err => {
      this.toastr.warning("Please try again later");
    });
  }

  cancel() {
    this.deletePressReleaseDialog.close({ isDeleted: false });
  }
}
