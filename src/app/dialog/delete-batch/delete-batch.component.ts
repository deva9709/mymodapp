import { Component, Inject, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ModService } from '@app/service/api/mod.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { dataService } from '@app/service/common/dataService';

@Component({
  selector: 'app-delete-batch',
  templateUrl: './delete-batch.component.html',
  styleUrls: ['./delete-batch.component.css']
})
export class DeleteBatchComponent implements OnInit {
  userId:number
  removeFlage: boolean;
  batchId:number;
  id: number;
  userDetails: any;
  constructor(
    private toastr: ToastrService,
    private modService: ModService,
    private dataService: dataService,
    public deleteDialog: MatDialogRef<DeleteBatchComponent>,
    @Inject(MAT_DIALOG_DATA) public batchData: any,
    @Inject(MAT_DIALOG_DATA) public tenantValue: any,
    @Inject(MAT_DIALOG_DATA) public data: any,
    
  ) { }

  ngOnInit() {
    this.userId = this.dataService.currentPlatformUserId;
    this.userDetails = this.data;
    if(this.userDetails.members){
      this.removeFlage = true;
    }
    this.batchData = this.batchData;

  }

  removeBatch(){
    let deletBatch = {
     tenantId:this.batchData.batchDetails.tenant.id,
     batchId:this.batchData.batchDetails.batchId,
     updatedBy:this.batchData.batchDetails.createdByUser.platformUserId
    }
     this.modService.deleteBatch(deletBatch).subscribe(response=>{
       if(response.success){
        this.deleteDialog.close({ isBatchDeleted: true });
       }
     }, err=>{
      this.toastr.warning("Please try again later");
     });
   }
  
   removeMembers(){
    let removeMembers ={
      tenantId: this.userDetails.tenantDetailsValue,
      batchId: this.userDetails.batchId,
      removedMemberIds:this.userDetails.membersListId,
      updatedBy: this.userId
    }
     this.modService.deleteMembersListFromBatch(removeMembers).subscribe(response=>{
       if(response.success){
        this.deleteDialog.close({ isMemberDeleted: true });
       }
     }, err=>{
      this.toastr.warning("Please try again later");
     });
   }

   cancelMember(){
    this.deleteDialog.close({ isMemberDeleted: false });
   }
   cancel(){
    this.deleteDialog.close( { isBatchDeleted: false });
   }
   

}
