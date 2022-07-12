import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ModService } from '@app/service/api/mod.service';
import { dataService } from '@app/service/common/dataService';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs/operators';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatDialogConfig, MatDialog, MatCheckboxChange } from '@angular/material';
import { AddMembersComponent } from '@app/dialog/add-members/add-members.component';
import { DeleteBatchComponent } from '@app/dialog/delete-batch/delete-batch.component';
import { ActivatedRoute } from '@angular/router';

export interface BatchListDetails {
  createdByUser: string;
  tanentName: string;
  batchDescription: string;
  batchName: string;
  action: any;
}
export interface BatchMemberList {
  select: any;
  tenantDisplayName: string;
  tenancyName: string;
  roleNames: string;
  emailAddress: string;
  name: string;
  surname: string;
  userId: string;
  skills: string;
  microtutorings: string;
  id: number;
  platFormId: number,

}
export interface User {
  select: any;
  tenantDisplayName: string;
  tenancyName: string;
  roleNames: string;
  emailAddress: string;
  name: string;
  surname: string;
  skills: string;
  microtutorings: string;
  id: number;
  platFormId: number,
}
export interface Members {
  select: any;
  emailAddress: string;
  name: string;
  surname: string;
  userCode: string;
}
export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}


@Component({
  selector: 'app-batch-creation',
  templateUrl: './batch-creation.component.html',
  styleUrls: ['./batch-creation.component.css']
})

export class BatchCreationComponent implements OnInit {
  isGlobalSearchedBatchEnabled:boolean;
  isGlobalSearch:string;
  searchInput:string;
  currentTenantId:number;
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSourceTable: MatTableDataSource<BatchListDetails>;
  manageMembersDetails: MatTableDataSource<BatchMemberList>;
  userDetails: MatTableDataSource<User>;
  selection = new SelectionModel<User>(true, []);
  selectionMembers = new SelectionModel<User>(true, []);
  batchCreationForm: FormGroup;
  viewUserForm: FormGroup;
  manageBatchMember: FormGroup;
  filteredTenants: any[] = [];
  tenants: any[] = [];
  memberList: any[] = [];
  batchCreationObject = {};
  tenantId: any;
  tenantDetails: any;
  tanentDisplayName: any;
  userId: any;
  batchList: any[] = [];
  showNoBatchList: boolean;
  batchId: number;
  batchMemberList: any[] = [];
  displayedColumnsForBatchList: string[] = ['tanentName', 'batchName', 'batchDescription', 'createdByUser', 'action'];
  displayedColumnsForBatchMemberList: string[] = ['name', 'surName', 'email', 'code', 'action'];
  usersDisplayedColumns: string[] = ['select', 'emailAddress', 'name', 'surname'];
  membersDisplayedColumns: string[] = ['select', 'emailAddress', 'name', 'surname', 'userCode'];
  showNoBatchMemberList: boolean;
  roles: any[] = [];
  tenantRoles: any[] = [];
  tenantsValue: any[];
  roleId: number;
  isSuperAdmin: boolean;
  users: User[] = [];
  selectedUserId: any[] = [];
  id: any;
  @ViewChild('usersSort') usersSort: MatSort;
  @ViewChild('usersPaginator') usersPaginator: MatPaginator;
  @ViewChild('batchPaginator') batchPaginator: MatPaginator;
  eventValue: any;
  isHideFlgaForBulkFeedback: boolean;
  tenantDetailsValue: any;
  isHideAndDisableFlag: boolean = false;
  batchListValue: any[];
  selectedRemoveId: any[];
  batchCreationFormValidationMessages = {
    tenantRequired: 'Please select a tenant',
    courseNameMessage: 'Please enter course name',
    batchNameMessage: 'Please enter batch name',
  }
  viewUserFormValidationMessages = {
    tenantRequiredMessage: 'Please select a tenant',
    roleRequired: 'Please select a role'
  }
  isEditFlag: boolean;
  tenantVale: any;
  batch: any;
  descriptionValue: any[];
  course: any;
  tenantIdValu: any;
  batchIdValue: any;
  index: number;
  tenant: string;
  tenantValueId: number;
  role: number;
  isflagForHide: boolean;
  canBeMentor: any;
  mentor: any;
  tenantDetailsId: any;
  isTenantFlag: boolean;
  isDeleteFlag: boolean = true;
  batchDetails: any;
  rolePermissions: any;
  createBatchPermission: boolean;
  permissionCode = "BATCH";
  @ViewChild('memberDetailsSort') batchSort: MatSort;
  @ViewChild('addmemberPaginator') addmemberPaginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  updateBatchPermission: any;
  deleteBatchPermission: any;
  constructor(
    private modService: ModService,
    private formBuilder: FormBuilder,
    private dataService: dataService,
    private toastr: ToastrService,
    public dialog: MatDialog,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    //for global search
    this.isGlobalSearchedBatchEnabled=false;
    this.currentTenantId=this.dataService.currentTenentId;
    this.route.queryParams.subscribe(params => {
      this.isGlobalSearch = params['globalSearch'];
      this.searchInput=params['name'];
    });
    if(this.isGlobalSearch=="true")
    {
      this.loadGlobalBatch();
    }
    this.index = 0;
    if (this.dataService.currentPlatformUserId) {
      this.userId = this.dataService.currentPlatformUserId;
      this.getUserProfileDetail();
    }

    if (this.dataService.isSuperAdmin) {
      this.isSuperAdmin = this.dataService.isSuperAdmin;
    }

    if (this.dataService.currentTenantName) {
      this.tenant = this.dataService.currentTenantName;
      this.isTenantFlag = true;
      this.tenantVale = this.tenant;
    }

    if (this.dataService.currentTenentId) {
      this.tenantValueId = this.dataService.currentTenentId;
    }
    if (this.dataService.currentRoleId) {
      this.role = this.dataService.currentRoleId;
      this.roleId = this.role;
    }
    this.id = this.dataService.currentTenentId;
    this.getAllRoles();
    this.getAllTenants();
    this.inItFormForBtach();
    if (this.isSuperAdmin) {
      this.createBatchPermission = true;
      this.updateBatchPermission = true;
      this.deleteBatchPermission = true;
    }
    else {
      this.getPermissions();
    }
  }

  inItFormForBtach() {
    this.batchCreationForm = this.formBuilder.group({
      tenantName: ['', [Validators.required]],
      courseName: ['', [Validators.required]],
      batchName: ['', [Validators.required]],
      description: ['']
    });
    this.viewUserForm = this.formBuilder.group({
      tenant: ['', [Validators.required]],
      role: ['', [Validators.required]]
    });
    this.manageBatchMember = this.formBuilder.group({
      tenantForBatch: [''],
      batchValue: [''],

    })
  }

  getUserProfileDetail() {
    this.modService.getUserDetails(this.userId).subscribe(res => {
      if (res.result) {
        this.mentor = res.result.canBeMentor;
        if (this.mentor) {
          this.tenantDetailsId = res.result.tenant.id
          this.getBatchList();
        }
      }
    }, err => {
    });
  }


  tabChanged(event) {
    let eventIndex = event.index;
    switch (eventIndex) {
      case 0:
        this.getAllTenants();
        this.users = [];
        break;
      case 1:
        this.getAllTenants();
        this.getAllRoles();
        this.manageMembersDetails = null;
        if (this.isSuperAdmin) {
          this.inItFormForBtach();
        }
        break;
      case 2:
        this.userDetails = null;
        if (this.isSuperAdmin) {
          this.inItFormForBtach();
        }
        this.getAllTenants();
        if (!this.isSuperAdmin) {
          this.getBatchListDetails();
        }
        break;
    }
  }

  search(query: string, filterFor: string): void {
    if (filterFor.toLowerCase() === 'tenant') {
      this.filteredTenants = this.performFilter(query, this.tenants, 'tenantName');
    }
  }

  getTanentDetails(tanent: any) {
    this.tenantDetails = tanent;
    this.tenantDetailsId = tanent.id;
    this.id = tanent.id;
    this.tanentDisplayName = tanent.tenantName
  }

  getTanentDetailsForBatch(tanent: any) {
    this.tenantDetails = tanent;
    this.id = tanent.id;
    this.tenantDetailsId = tanent.id
    this.tanentDisplayName = tanent.tenantName
    this.getBatchList();
  }

  performFilter(query: string, filterArray: string[], filterBy: string): string[] {
    query = query.toLocaleLowerCase();
    return filterArray.filter(value => value[filterBy].toLocaleLowerCase().indexOf(query) !== -1);
  }

  getAllRoles() {
    this.modService.getAllRoles().subscribe(res => {
      if (res.result) {
        this.roles = res.result.items;
        if (!this.isSuperAdmin) {
          this.tenantRoles = this.roles.filter(x => x.tenantId == this.tenantValueId);
        }
      }
    });
  }

  filterTenantRoles(tenant: any) {
    this.batchList = [];
    this.id = tenant.id;
    this.tenantDetailsValue = tenant
    this.tenantRoles = this.roles.filter(x => x.tenantId == tenant.id);
    this.getBatchListDetails();
  }

  searchParams(query: string, filterFor: string): void {
    if (filterFor.toLowerCase() === 'batch') {
      this.filteredTenants = this.performFilterBatch(query, this.batchListValue, 'name');
    }
  }

  performFilterBatch(query: string, filterArray: string[], filterBy: string): string[] {
    query = query.toLocaleLowerCase();
    return filterArray.filter(value => value[filterBy].toLocaleLowerCase().indexOf(query) !== -1);
  }

  filterBatch(batch: any) {
    this.batchId = batch.batchId;
    this.getMembersDetails();
  }

  getRollValue(role: any) {
    this.roleId = role.id;
    this.loadUserDetails();

  }

  loadUserDetails(): void {
    if (this.isSuperAdmin) {
      Object.keys(this.viewUserForm.controls).forEach(field => {
        const control = this.viewUserForm.get(field);
        if (control instanceof FormControl) {
          control.markAsTouched({
            onlySelf: true
          });
        }
      });
      if (!this.viewUserForm.valid) {
        this.toastr.warning("Please slect tenant and role");
        return;
      }
    }
    this.dataService.isLoading = true;
    this.modService.getUsersForSelectedRole(this.id, this.roleId).pipe(
      finalize(() => {
        this.dataService.isLoading = this.dataService.doneLoading();
      })).subscribe(res => {
        if (res.result) {
          this.users = res.result;
          this.userDetails = new MatTableDataSource<User>(this.users);
          this.userDetails.paginator = this.addmemberPaginator;
          this.showNoBatchMemberList = !this.batchMemberList.length;
        }
      });
  }

  isAllSelected() {
    if (this.userDetails !== null) {
      const numRows = this.userDetails.data.length;
      const numSelected = this.selection.selected.length;
      if (numSelected === 1) {
        this.selectedUserId = this.selection.selected.map(x => x.id);
        this.isHideAndDisableFlag = true;
      }
      if (numSelected > 1) {
        this.isHideAndDisableFlag = false;
        this.selectedUserId = this.selection.selected.map(x => x.id);
        this.isHideAndDisableFlag = true;
      }
      return numSelected === numRows;
    }

  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ? this.selection.clear() : this.userDetails.data.forEach(row => this.selection.select(row));

  }
  selectMemberValue(event: MatCheckboxChange) {
    if (event.checked) {
      this.isHideAndDisableFlag = true;
    }
    else {
      this.isHideAndDisableFlag = false;
      this.selectedUserId = [];
    }
  }

  isAllSelectedMembers() {
    if (this.manageMembersDetails !== null) {
      const numSelected = this.selectionMembers.selected.length;
      const numRows = this.manageMembersDetails.data.length;
      if (numSelected === 1) {
        this.selectedRemoveId = this.selectionMembers.selected.map(x => x.id);
        this.isHideAndDisableFlag = true;
      }
      if (numSelected > 1) {
        this.isHideAndDisableFlag = false;
        this.selectedRemoveId = this.selectionMembers.selected.map(x => x.id);
        this.isHideAndDisableFlag = true;
      }
      return numSelected === numRows;
    }

  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggleMembers() {
    this.isAllSelectedMembers() ? this.selectionMembers.clear() :
      this.manageMembersDetails.data.forEach(row => this.selectionMembers.select(row));
  }

  selectValue(event: MatCheckboxChange) {
    if (event.checked) {
      this.isHideAndDisableFlag = true;
    }
    else {
      this.isHideAndDisableFlag = false;
      this.selectedRemoveId = [];
    }
  }

  individualFeedBackCheckBoxSelection(event) {
    this.eventValue = event.checked;
    this.isHideFlgaForBulkFeedback = true;
  }

  getAllTenants() {
    this.modService.getTenants().subscribe(res => {
      if (res.result) {
        this.tenants = res.result;
        this.filteredTenants = this.tenants;
      }
    }, err => { });
  }

  batchCreation() {
    Object.keys(this.batchCreationForm.controls).forEach(field => {
      const control = this.batchCreationForm.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({
          onlySelf: true
        });
      }
    });
    if (!this.batchCreationForm.valid) {
      this.toastr.warning("Please enter valid details");
      return;
    }
    if (this.tanentDisplayName === undefined) {
      this.tanentDisplayName = this.tenant;
    }
    let courseName = this.batchCreationForm.controls.courseName.value;
    let batchName = this.batchCreationForm.controls.batchName.value;
    let fullBatchName = this.tanentDisplayName + '_' + courseName + '_' + batchName;
    this.batchCreationObject = {
      name: fullBatchName,
      tenantId: this.id,
      description: this.batchCreationForm.controls.description.value,
      createdBy: this.userId
    }

    this.modService.createBatch(this.batchCreationObject).subscribe(res => {
      if (res.success && res.result !== null) {
        this.toastr.success("Batch create Successfully");
        this.batchCreationForm.reset('');
        this.reloadPage();
      }
      else {
        this.toastr.error("Batch Create is not succesfully");
      }
    });
  }

  getBatchList() {
    this.modService.getBatchList(this.tenantDetailsId).subscribe(response => {
      this.batchList = response.result;
      this.dataSourceTable = new MatTableDataSource<BatchListDetails>(this.batchList);
      this.batchPaginator.firstPage(); 
      this.dataSourceTable.paginator = this.batchPaginator;
      this.showNoBatchList = !this.batchList.length;
    })
  }

  getMembersDetails() {
    this.memberList = [];
    this.modService.getMembersList(this.batchId).subscribe(response => {
      this.batchMemberList = response.result;
      for (let i = 0; i < this.batchMemberList.length; i++) {
        if (this.batchMemberList[i].member !== null) {
          let users = {
            name: this.batchMemberList[i].member.name,
            surName: this.batchMemberList[i].member.surName,
            email: this.batchMemberList[i].member.email,
            mentorCode: this.batchMemberList[i].member.mentorCode,
            id: this.batchMemberList[i].member.platformUserId,
            checkValue: false
          }
          this.memberList.push(users)
        }
      }
      this.manageMembersDetails = new MatTableDataSource<BatchMemberList>(this.memberList);
      
      this.usersPaginator.firstPage();
      this.manageMembersDetails.paginator = this.usersPaginator;
      this.manageMembersDetails.sortingDataAccessor = (data, sortHeaderId) => data[sortHeaderId] ? data[sortHeaderId].toLocaleLowerCase() : '';
      this.showNoBatchMemberList = !this.batchMemberList.length;
    })
  }

  edtBatchDetails(element) {
    this.isTenantFlag = false;
    this.isEditFlag = true;
    this.isDeleteFlag = false;
    let name = element.name;
    this.tenantIdValu = element.tenant.id;
    this.batchIdValue = element.batchId
    let batchName = name.split("_");
    this.tenantVale = batchName[0];
    this.course = batchName[1]
    this.batch = batchName[2];
    this.descriptionValue = element.description;
  }

  updateBatch() {
    let updateDetailsBatch = {
      tenantId: this.tenantIdValu,
      batchId: this.batchIdValue,
      name: this.tenantVale + '_' + this.course + '_' + this.batch,
      description: this.descriptionValue,
      updatedBy: this.userId
    }
    this.modService.updatebatch(updateDetailsBatch).subscribe(response => {
      let res = response.result;
      if (response.success) {
        this.toastr.success("Batch Upadated Successfully");
        this.isDeleteFlag = true;
        this.getBatchList();
        this.reloadPage();
      }
    });
  }

  cancel() {
    this.isDeleteFlag = true;
    this.isTenantFlag = false;
    this.isEditFlag = false;
    this.tenantVale = null;
    this.course = null;
    this.batch = null;
    this.descriptionValue = null;
    this.reloadPage();
    this.batchCreationForm.reset();
  }
  reloadPage() {
    window.location.reload();
  }

  deleteBatch(batchDetails: any) {
    const deleteRoleFeatureDialog = this.dialog.open(DeleteBatchComponent, {
      data: {
        batchDetails: batchDetails
      }
    });
    deleteRoleFeatureDialog.afterClosed().subscribe(result => {
      if (result && result.isBatchDeleted) {
        this.toastr.success("Batch deleted successfully");
        this.getBatchList();
      }
    });
  }

  deleteMembers() {
    if (this.deleteBatchPermission) {
      const deleteRoleFeatureDialog = this.dialog.open(DeleteBatchComponent, {
        data: {
          tenantDetailsValue: this.id,
          membersListId: this.selectedRemoveId,
          batchId: this.batchId,
          members: true,
        },
      });
      deleteRoleFeatureDialog.afterClosed().subscribe(result => {
        if (result && result.isMemberDeleted) {
          this.toastr.success("Batch Member deleted successfully");
          this.getMembersDetails();
        }
      });
    }
    else {
      this.toastr.warning("you don't have delete permission");
    }

  }

  addMembers() {
    if (this.updateBatchPermission) {
      const membersDialog = new MatDialogConfig();
      membersDialog.autoFocus = false;
      membersDialog.width = '60vw';
      membersDialog.height = '22vw';
      const dialogRef = this.dialog.open(AddMembersComponent, membersDialog);
      dialogRef.componentInstance.tenant = this.id;
      dialogRef.componentInstance.memberListId = this.selectedUserId;

      dialogRef.afterClosed().subscribe(res => {
        if (res && res.batchAdded) {
          this.selectionMembers.clear();
          this.reloadPage();
        }
      })
    }
    else {
      this.toastr.warning("you don't have update permission");
    }
  }

  getBatchListDetails() {
    this.batchList = [];
    this.modService.getBatchList(this.id).subscribe(response => {
      for (let user of response.result) {
        let users = {
          name: user.name,
          batchId: user.batchId
        }
        this.batchList.push(users)
      }
      this.batchListValue = this.batchList;
    })
  }

  getPermissions() {
    this.rolePermissions = this.dataService.rolePermissions;
    let batchPermission = this.rolePermissions.find(val => val.feature.featureCode === this.permissionCode);
    if (batchPermission) {
      this.createBatchPermission = batchPermission.create;
      this.updateBatchPermission = batchPermission.update;
      this.deleteBatchPermission = batchPermission.delete;
    }
    else {
      this.createBatchPermission = false;
      this.updateBatchPermission = false;
      this.deleteBatchPermission = false;
    }
  }

  //global search
  loadGlobalBatch(){
    if(this.currentTenantId === undefined ||this.currentTenantId===null){
      this.currentTenantId=0;
    }
    this.modService.getGlobalBatch(this.currentTenantId,this.searchInput).subscribe(response => {
      this.batchList = response.result;
      this.dataSourceTable = new MatTableDataSource<BatchListDetails>(this.batchList);
      this.batchPaginator.firstPage(); 
      this.dataSourceTable.paginator = this.batchPaginator;
      this.showNoBatchList = !this.batchList.length;
    })
  }
}
