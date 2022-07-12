import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { dataService } from "@app/service/common/dataService";
import { ModService } from "@app/service";
import { ToastrService } from "ngx-toastr";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-update-config',
  templateUrl: './update-config.component.html',
  styleUrls: ['./update-config.component.css']
})
export class UpdateConfigComponent implements OnInit {

  sysConfigName: string;
  sysConfigValue: string;
  dialogTitle: string;
  submitButtonName: string;
  sysConfigId: number;

  constructor(private createConfigurationDialog: MatDialogRef<UpdateConfigComponent>,
    public dataService: dataService,
    private modService: ModService,
    private toastr: ToastrService,
    public updateConfigurationDialog: MatDialogRef<UpdateConfigComponent>,
    @Inject(MAT_DIALOG_DATA) public updateData: any) { }

  ngOnInit() {
    if (this.updateData) {
      this.sysConfigName = this.updateData.sysConfigName;
      this.sysConfigValue = this.updateData.sysConfigValue;
      this.sysConfigId = this.updateData.sysConfigId;
      this.dialogTitle = "Update Configuration";
      this.submitButtonName = "Update";
    }
    else {
      this.dialogTitle = "Create Configuration";
      this.submitButtonName = "Publish";
    }
  }

  addConfig() {
    let data = {
      'name': this.sysConfigName.trim(),
      'value': this.sysConfigValue.trim()
    }
    if (data.name && data.value) {
      this.modService.addConfig(data).subscribe(res => {
        this.createConfigurationDialog.close({ isCreated: true, isUpdated: false });
      }, err => {
        this.toastr.warning("Please try again later");
      });
    }
    else {
      this.toastr.error("Invalid data");
    }
  }

  updateConfig() {
    let data = {
      'id': this.sysConfigId,
      'name': this.sysConfigName.trim(),
      'value': this.sysConfigValue.trim()
    }
    if (data.name && data.value) {
      this.modService.updateConfigDetails(data).subscribe(res => {
        this.updateConfigurationDialog.close({ isCreated: false, isUpdated: true });
      }, err => {
        this.toastr.warning("Please try again later");
      });
    }
    else {
      this.toastr.error("Invalid data");
    }
  }

  cancel() {
    this.createConfigurationDialog.close({ isCreated: false, isUpdated: false });
  }

}
