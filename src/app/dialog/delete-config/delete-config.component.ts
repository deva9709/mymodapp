import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ModService } from "@app/service";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: 'app-delete-config',
  templateUrl: './delete-config.component.html',
  styleUrls: ['./delete-config.component.css']
})
export class DeleteConfigComponent implements OnInit {

  constructor(private modService: ModService,
    private toastr: ToastrService,
    public deleteConfigDialog: MatDialogRef<DeleteConfigComponent>,
    @Inject(MAT_DIALOG_DATA) public deleteConfigurationData: any) { }

  ngOnInit() {
  }

  removeConfig() {
    this.modService.removeConfigId(this.deleteConfigurationData.deleteConfigId).subscribe(res => {
      this.deleteConfigDialog.close({ isDeleted: true });
    }, err => {
      this.toastr.warning("Please try again Later");
    });
  }

  cancel() {
    this.deleteConfigDialog.close({ isDeleted: false });
  }

}
