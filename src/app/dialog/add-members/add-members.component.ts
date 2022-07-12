import { Component, OnInit } from '@angular/core';
import { ModService } from '@app/service/api/mod.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { dataService } from '@app/service/common/dataService';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-add-members',
  templateUrl: './add-members.component.html',
  styleUrls: ['./add-members.component.css']
})
export class AddMembersComponent implements OnInit {
  langugeDropdownSettings: IDropdownSettings = {};
  userId: any;
  tenant:any;
  memberListId:any;
  batchList: any[] =[];
  showNoBatchList: boolean;
  tenantValue: any;
  batchListValue: any[];
  selecteBatch:any[] =[];
  selecteBatchId: any;
  membersId:number;
  constructor(
    private modService: ModService,
    private dataService: dataService,
    private toastr: ToastrService,
    public closeDialog: MatDialogRef<AddMembersComponent>,
  ) { }

  ngOnInit() {
    this.tenantValue = this.tenant;
    this.membersId = this.memberListId;
    this.userId = this.dataService.currentPlatformUserId;
    if( this.tenantValue && this.userId){
      this.getBatchList();
    }

    this.langugeDropdownSettings = {
      singleSelection: true,
      idField: 'batchId',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 5,
      allowSearchFilter: true,
    };
  }
 
  onBatchSelect(item: any) {
    this.selecteBatchId =  item.batchId;
  }

  onLanguageDeSelect(item: any) {
    this.selecteBatch = this.batchListValue.filter(x => x.id !== item.batchId);
  }
  getBatchList(){
    this.modService.getBatchList(this.tenant).subscribe(response=>{
      for (let user of response.result){
        let users={
          name:user.name,
          batchId:user.batchId
        }
        this.batchList.push(users)
      }
      this.batchListValue = this.batchList;
    })
  }

  addMembersToBatchList(){
    if(this.selecteBatchId){
      let addMembers ={
        tenantId: this.tenant.id,
        batchId: this.selecteBatchId,
        newMemberIds:this.membersId,
        updatedBy:this.userId
      }
      this.modService.addMemmbersListToBatch(addMembers).subscribe(response=>{
        let res  = response.result;
        if(response.success && response.result!==null ){
          this.toastr.success("Member Added Successfully");
          this.closeDialog.close({ batchAdded: true });
        }
        else{
          this.toastr.error(res.result);
        }
      });
    }
    else{
      this.toastr.warning("Select Any Batch");
    }
   
  }

}
