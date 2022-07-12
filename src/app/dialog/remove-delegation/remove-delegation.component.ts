import { Component, OnInit, Inject } from '@angular/core';
import { ModService } from '@app/service';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { dataService } from "@app/service/common/dataService";

@Component({
  selector: 'app-remove-delegation',
  templateUrl: './remove-delegation.component.html',
  styleUrls: ['./remove-delegation.component.css']
})
export class RemoveDelegationComponent implements OnInit {

  constructor(private modService: ModService,
    private toastr: ToastrService,
    public dataService: dataService,
    public removeDelegationDialog: MatDialogRef<RemoveDelegationComponent>,
    @Inject(MAT_DIALOG_DATA) public removeDelegationData: any) { }

  ngOnInit() {
  }

  removeDelegation() {
    this.modService.removeDelegationForUser(this.removeDelegationData).subscribe(res => {
      this.removeDelegationDialog.close({ isDeleted: true });
    }, err => {
      this.toastr.warning("Please try again later");
    });
  }

  cancel() {
    this.removeDelegationDialog.close({ isDeleted: false });
  }
}
