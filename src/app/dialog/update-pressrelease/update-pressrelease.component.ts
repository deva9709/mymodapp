import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from "ngx-toastr";
import { WhiteSpaceValidators } from "@shared/validators/whitespace.validator";
import { ModService } from "@app/service";
import { dataService } from "@app/service/common/dataService";
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-update-pressrelease',
  templateUrl: './update-pressrelease.component.html',
  styleUrls: ['./update-pressrelease.component.css']
})
export class UpdatePressreleaseComponent implements OnInit {
  pressReleaseForm: FormGroup;
  thumpnail: any;
  title: string;
  description: string;
  submitButtonName: string;
  pressReleaseId: number;
  dialogTitle: string;
  isCreate: boolean = false;
  tenantList: any[] = [];
  filteredTenantList: any[] = [];
  roles: any[] = [];
  tenantRoles: any[] = [];
  roleId: number;
  isSuperAdmin: boolean;
  showTenantField: boolean = true;
  batchList: any[] = [];
  usersList: any[] = [];
  userDropdownSettings: IDropdownSettings = {};
  selectedUserIdList: any[] = [];
  isRoleDisabled: boolean;
  isBatchDisabled: boolean;
  @ViewChild('ngMultiSelect') disableMultiSelect: any;
  pressReleaseFormValidationMessages = {
    titleRequired: 'Please provide the title',
    descriptionRequired: 'Please provide the news-content',
    tenantRequired: 'Please select a tenant',
    roleRequired: 'Please select a role',
    batchRequired: 'Please select a batch'
  };
  constructor(private modService: ModService,
    public dataService: dataService,
    private router: Router,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private createPressReleaseDialog: MatDialogRef<UpdatePressreleaseComponent>,
    public updatePressReleaseDialog: MatDialogRef<UpdatePressreleaseComponent>,
    @Inject(MAT_DIALOG_DATA) public updateData: any) { }

  ngOnInit() {
    this.getAllRoles();
    this.initForm();
    if (this.updateData) {
      this.pressReleaseForm.patchValue({
        title: this.updateData.title,
        description: this.updateData.description,
        tenantId: this.updateData.tenantId,
        roleId: this.updateData.roleId,
        batchId: this.updateData.batchId,
      })
      this.title = this.updateData.title;
      this.description = this.updateData.description;
      this.thumpnail = this.updateData.thumbnailUrl;
      this.pressReleaseId = this.updateData.id;
      this.dialogTitle = "Update";
      this.submitButtonName = "Update";
      if (this.updateData.batchId == null && this.updateData.roleId == null) {
        this.updateSelectedUsers(this.updateData.tenantId);
      }
    }
    else {
      this.dialogTitle = "Create";
      this.submitButtonName = "Publish";
      this.isCreate = true;
    }
    this.isSuperAdmin = this.dataService.isSuperAdmin;
    if (this.isSuperAdmin) {
      this.getAllTenants();
    }
    else if (!this.updateData && !this.isSuperAdmin) {
      this.showTenantField = false;
      this.pressReleaseForm.patchValue({
        tenantId: this.dataService.currentTenentId
      });
    }
    else {
      this.showTenantField = false;
    }
    this.userDropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
  }
  ngAfterViewInit() {
    this.disableMultiSelect.disabled = false;
  }

  initForm(): void {
    this.pressReleaseForm = this.formBuilder.group({
      title: ['', [Validators.required, WhiteSpaceValidators.emptySpace(), Validators.maxLength(300)]],
      description: ['', [Validators.required, WhiteSpaceValidators.emptySpace()]],
      tenantId: ['', [Validators.required]],
      roleId: [''],
      batchId: [''],
      userIds: ['']
    });
  }

  selectThumbnail(event: any) {
    if (event.target.files.length) {
      this.thumpnail = event.target.files[0];
      let thumpnailType = event.target.files[0].type;
      if (thumpnailType == "image/png" || thumpnailType == "image/jpeg") {
        this.toastr.success('Thumbnail selected');
      }
      else {
        this.toastr.warning('Upload only image files');
      }
    }
    else {
      this.toastr.warning('Please select a image');
    }
  }
  createPressRelease() {
    if (!this.pressReleaseForm.valid && !this.pressReleaseForm.value.title.trim() && !this.pressReleaseForm.value.description.trim()) {
      this.toastr.error("Invalid data");
    }
    else if ((this.pressReleaseForm.value.batchId == null || this.pressReleaseForm.value.batchId == "")
      && (this.pressReleaseForm.value.roleId == null || this.pressReleaseForm.value.roleId == "")
      && (this.pressReleaseForm.value.userIds == null || this.pressReleaseForm.value.userIds == "")
      && this.selectedUserIdList.length == 0) {
      this.toastr.error("Invalid data");
    }
    else {
      const formData = new FormData();
      if (this.thumpnail) {
        formData.append('file', this.thumpnail, this.thumpnail.name);
      }
      this.dataService.isLoading = true;
      let data = {
        title: this.pressReleaseForm.value.title.trim(),
        description: this.pressReleaseForm.value.description.trim(),
        userId: this.dataService.currentUserId,
        tenantId: this.pressReleaseForm.value.tenantId,
        batchId: this.pressReleaseForm.value.batchId,
        roleId: this.pressReleaseForm.value.roleId,
        userIds: this.selectedUserIdList
      }
      this.modService.createPressRelease(data).pipe(
        finalize(() => {
          this.dataService.isLoading = this.dataService.doneLoading();
        })).subscribe(response => {
          if (response) {
            let pressReleaseId = response.result;
            if (formData) {
              this.dataService.isLoading = true;
              this.modService.addThumbnail(formData, pressReleaseId).pipe(
                finalize(() => {
                  this.dataService.isLoading = this.dataService.doneLoading();
                })).subscribe(res => {
                  if (res) {
                    this.createPressReleaseDialog.close({ isAdded: true });
                    this.toastr.success(data.title + " has been published");
                    this.router.navigate(['/app/press-room']);
                  }
                  else {
                    this.toastr.warning("Please try again later");
                  }
                }, err => { });
            }
          }
          else {
            this.toastr.warning("Please try again later");
          }
        }, err => {
          this.toastr.warning("Please try again later");
        });
    }
  }
  updatePressRelease() {
    if (!this.pressReleaseForm.valid && !this.pressReleaseForm.value.title.trim() && !this.pressReleaseForm.value.description.trim()) {
      this.toastr.error("Invalid data");
    }
    else if (
      (this.pressReleaseForm.value.batchId == undefined || this.pressReleaseForm.value.batchId == "")
      && (this.pressReleaseForm.value.roleId == undefined || this.pressReleaseForm.value.roleId == "")
      && (this.pressReleaseForm.value.userIds == undefined || this.pressReleaseForm.value.userIds == "")
      && this.selectedUserIdList.length == 0
    ) {
      this.toastr.error("Invalid data");
    }
    else {
      const formData = new FormData();
      if (this.thumpnail) {
        formData.append('file', this.thumpnail, this.thumpnail.name);
      }
      this.dataService.isLoading = true;
      let data = {
        title: this.pressReleaseForm.value.title.trim(),
        description: this.pressReleaseForm.value.description.trim(),
        userId: this.dataService.currentUserId,
        pressReleaseId: this.pressReleaseId,
        tenantId: this.pressReleaseForm.value.tenantId,
        batchId: this.pressReleaseForm.value.batchId,
        roleId: this.pressReleaseForm.value.roleId,
        userIds: this.selectedUserIdList
      }
      this.modService.updatePressRelease(data).pipe(
        finalize(() => {
          this.dataService.isLoading = this.dataService.doneLoading();
        })).subscribe(response => {
          if (response) {
            if (formData) {
              this.dataService.isLoading = true;
              this.modService.addThumbnail(formData, data.pressReleaseId).pipe(
                finalize(() => {
                  this.dataService.isLoading = this.dataService.doneLoading();
                })).subscribe(res => {
                  if (res) {
                    this.updatePressReleaseDialog.close({ isUpdated: true, title: data.title });
                  }
                  else {
                    this.toastr.warning("Please try again later");
                  }
                }, err => { });
            }
            else {
              this.updatePressReleaseDialog.close({ isUpdated: true, title: data.title });
            }
          }
          else {
            this.toastr.warning("Please try again later");
          }
        }, err => {
          this.toastr.warning("Please try again later");
        });
    }
  }
  cancel() {
    this.pressReleaseForm.reset();
    this.updatePressReleaseDialog.close({ isAdded: false, isUpdated: false });
  }
  getAllTenants() {
    this.modService.getTenants().subscribe(res => {
      if (res.result) {
        this.tenantList = res.result;
        this.filteredTenantList = this.tenantList;
      }
    }, err => { });
  }
  search(query: string, filterFor: string): void {
    if (filterFor === 'tenant') {
      this.filteredTenantList = this.performFilter(query, this.tenantList, 'tenantName');
    }
  }
  performFilter(query: string, filterArray: string[], filterBy: string): string[] {
    query = query.toLocaleLowerCase();
    return filterArray.filter(value => value[filterBy].toLocaleLowerCase().indexOf(query) !== -1);
  }
  getAllRoles() {
    this.modService.getAllRoles().subscribe(res => {
      if (res.result) {
        this.roles = res.result.items;
        if (this.updateData) {
          this.filterTenantBasedRecords(this.updateData.tenantId);
        }
        else if (!this.updateData && !this.isSuperAdmin) {
          this.filterTenantBasedRecords(this.dataService.currentTenentId);
        }
      }
    }, err => { });
  }
  filterTenantBasedRecords(tenantId: number) {
    this.pressReleaseForm.controls.userIds.setValue('');
    this.tenantRoles = this.roles.filter(x => x.tenantId == tenantId);
    this.getBatchList(tenantId);
    this.getUserList(tenantId);
    this.pressReleaseForm.controls.batchId.enable();
    this.pressReleaseForm.controls.roleId.enable();
    this.pressReleaseForm.controls.userIds.enable();
    this.disableMultiSelect.disabled = false;
  }
  getBatchList(tenantId) {
    this.modService.getBatchList(tenantId).subscribe(response => {
      this.batchList = response.result;
    })
  }
  getUserList(tenantId) {
    this.modService.getAllUserByTenant(tenantId).subscribe(response => {
      this.usersList = response.result;
    })
  }
  onUserSelect(item: any) {
    this.selectedUserIdList.push(item.id);
    this.enableUserDrodown();
  }

  onUserDeSelect(item: any) {
    this.selectedUserIdList = this.selectedUserIdList.filter(userId => userId !== item.id);
    this.enableUserDrodown();
    if (this.selectedUserIdList.length == 0) {
      this.pressReleaseForm.patchValue({
        roleId: [''],
        batchId: ['']
      })
      this.pressReleaseForm.controls.roleId.enable();
      this.pressReleaseForm.controls.batchId.enable();
      this.isRoleDisabled = false;
      this.isBatchDisabled = false;
    }
  }

  onUserSelectAll(users: any) {
    this.selectedUserIdList = [];
    this.usersList.forEach(element => {
      this.selectedUserIdList.push(element.id);
    });
    this.enableUserDrodown();
  }

  onDeselectUserAll(users: any) {
    this.selectedUserIdList = [];
    this.pressReleaseForm.patchValue({
      roleId: [''],
      batchId: ['']
    })
    this.pressReleaseForm.controls.roleId.enable();
    this.pressReleaseForm.controls.batchId.enable();
    this.isRoleDisabled = false;
    this.isBatchDisabled = false;
  }

  enableRoleDrodown() {
    this.pressReleaseForm.patchValue({
      userIds: '',
      batchId: ''
    });
    this.pressReleaseForm.controls.batchId.disable();
    this.disableMultiSelect.disabled = true;
    this.isBatchDisabled = true;
    this.isRoleDisabled = false;
  }

  enableBatchDrodown() {
    this.pressReleaseForm.patchValue({
      roleId: '',
      userIds: ''
    });
    this.pressReleaseForm.controls.roleId.disable();
    this.disableMultiSelect.disabled = true;
    this.isRoleDisabled = true;
    this.isBatchDisabled = false;
  }

  enableUserDrodown() {
    this.pressReleaseForm.patchValue({
      batchId: '',
      roleId: ''
    });
    this.pressReleaseForm.controls.batchId.disable();
    this.pressReleaseForm.controls.roleId.disable();
    this.isRoleDisabled = true;
    this.isBatchDisabled = true;
  }

  onClearRole(event) {
    this.pressReleaseForm.patchValue({
      roleId: ''
    })
    this.pressReleaseForm.controls.batchId.enable();
    this.pressReleaseForm.controls.userIds.enable();
    this.disableMultiSelect.disabled = false;
    event.stopPropagation();
  }
  onClearBatch(event) {
    this.pressReleaseForm.patchValue({
      batchId: ''
    })
    this.pressReleaseForm.controls.roleId.enable();
    this.pressReleaseForm.controls.userIds.enable();
    this.disableMultiSelect.disabled = false;
    event.stopPropagation();
  }
  updateSelectedUsers(tenantId) {
    this.modService.getAllUserByTenant(tenantId).subscribe(response => {
      this.usersList = response.result;
      const children: Array<{ id: number; isDisabled: boolean; name: string }> = [];
      this.updateData.userIds.forEach(element => {
        children.push({ id: element, isDisabled: undefined, name: this.usersList.find(x => x.id == element).name })
      });
      this.pressReleaseForm.patchValue({
        userIds: children
      });
      this.selectedUserIdList = this.updateData.userIds;
    })
  }

}
