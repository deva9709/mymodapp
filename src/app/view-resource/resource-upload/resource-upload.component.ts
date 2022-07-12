import { Component, OnInit } from '@angular/core';
import { ModService } from '@app/service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { ResourceStatus } from '@app/enums/resource-status';

@Component({
  selector: 'app-resource-upload',
  templateUrl: './resource-upload.component.html',
  styleUrls: ['./resource-upload.component.css']
})
export class ResourceUploadComponent implements OnInit {
  reviewDetails: any;
  comment: string;

  constructor(private modService: ModService,
    private toastr: ToastrService,
    public reviewResourceDialog: MatDialogRef<ResourceUploadComponent>) { }

  ngOnInit() {
  }

  reviewStatus(status) {
    let data = {
      traineeAssignmentId: this.reviewDetails.traineeResourceDetails.id,
      status: status ? ResourceStatus.Pass : ResourceStatus.Fail,
      comments: this.comment
    };
    this.modService.updateAssignmentApprovalStatus(data).subscribe(res => {
      if (res.result) {
        this.reviewResourceDialog.close();
        this.toastr.success("Evaluation succeeded");
      }
    }, err => { });
  }
}
