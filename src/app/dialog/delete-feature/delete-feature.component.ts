import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ModService } from "@app/service";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: 'app-delete-feature',
  templateUrl: './delete-feature.component.html',
  styleUrls: ['./delete-feature.component.css']
})
export class DeleteFeatureComponent implements OnInit {

  deleteRoleFeature: boolean = false;
  title: string;

  constructor(private modService: ModService,
    private toastr: ToastrService,
    public deleteRoleFeatureDialog: MatDialogRef<DeleteFeatureComponent>,
    @Inject(MAT_DIALOG_DATA) public roleFeatureData: any,
    public deleteFeatureDialog: MatDialogRef<DeleteFeatureComponent>,
    @Inject(MAT_DIALOG_DATA) public featureData: any) { }

  ngOnInit() {
    if (this.roleFeatureData.roleFeatureId) {
      this.deleteRoleFeature = true;
      this.title = "Role Feature";
    }
    else {
      this.deleteRoleFeature = false;
      this.title = this.featureData.featureName;
    }
  }

  removeRoleFeature() {
    this.modService.deleteRoleFeature(this.roleFeatureData.roleFeatureId).subscribe(res => {
      this.deleteRoleFeatureDialog.close({ isRoleFeatureDeleted: true });
    }, err => {
      this.toastr.warning("Please try again later");
    });
  }

  removeFeature() {
    this.modService.deleteFeature(this.featureData.featureId).subscribe(res => {
      this.deleteFeatureDialog.close({ isFeatureDeleted: true });
    }, err => {
      this.toastr.warning("Please try again Later");
    });
  }

  cancel() {
    this.deleteFeatureDialog.close({ isDeleted: false });
  }
}
