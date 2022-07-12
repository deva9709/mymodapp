import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SessionApprovalStatus } from '@app/enums/user-roles';
import { dataService } from "@app/service/common/dataService";

@Component({
  selector: 'app-view-approval-details',
  templateUrl: './view-approval-details.component.html',
  styleUrls: ['./view-approval-details.component.css']
})
export class ViewApprovalDetailsComponent implements OnInit {
  currentTenantId: number;
  sessionApprovalStatus: any = SessionApprovalStatus;
  constructor(public dataService: dataService,
    public viewMoreApprovalDetailsDialog: MatDialogRef<ViewApprovalDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public approvalData: any) { }

  ngOnInit() {
    this.currentTenantId = this.dataService.currentTenentId;
  }
}
