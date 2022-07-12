import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-reject-approval',
  templateUrl: './reject-approval.component.html',
  styleUrls: ['./reject-approval.component.css']
})
export class RejectApprovalComponent implements OnInit {
  description: string = '';
  constructor(public rejectApprovalDialog: MatDialogRef<RejectApprovalComponent>) { }

  ngOnInit() {
  }
  rejectApproval() {
    this.rejectApprovalDialog.close({ isRejected: true, description: this.description });
  }

  cancel() {
    this.rejectApprovalDialog.close({ isRejected: false });
  }
}
