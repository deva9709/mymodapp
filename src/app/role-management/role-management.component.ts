import { Component, OnInit, ViewChild, Injector } from '@angular/core';
import { dataService } from '@app/service/common/dataService';
import { ModService } from '@app/service';
import { ToastrService } from 'ngx-toastr';
import { MatPaginator, MatSort, MatTableDataSource } from "@angular/material";
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DeleteFeatureComponent } from '@app/dialog/delete-feature/delete-feature.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { WhiteSpaceValidators } from '@shared/validators/whitespace.validator';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { RemoveDelegationComponent } from '@app/dialog/remove-delegation/remove-delegation.component';

@Component({
  selector: 'app-role-management',
  templateUrl: './role-management.component.html',
  styleUrls: ['./role-management.component.css']
})
export class RoleManagementComponent implements OnInit {
  delegateForm: FormGroup;
  roleFeatureForm: FormGroup;
  roleForm: FormGroup;
  featureForm: FormGroup;
  selectedMajorRole: number;
  selectedSubordinateRole: number;
  delegate: boolean;
  showApprove: boolean;
  roleFeatures: any = [];
  roles: any[] = [];
  actions: string = "";
  featuresDisplayedColumns: string[] = ['featureName', 'featureCode', 'actions'];
  roleFeatureDisplayedColumns: string[] = ['roleName', 'featureFeatureName', 'permission', 'actions'];
  roleDelatedUsersDisplayedColumns: string[] = ['name', 'existingRole', 'newRole', 'action'];
  featuresData: MatTableDataSource<any>;
  roleFeaturesData: MatTableDataSource<any>;
  delegatedRoleUserData: MatTableDataSource<any>;
  newRole: number;
  newFeature: number;
  newCreate: boolean;
  newUpdate: boolean;
  newRead: boolean;
  newReadAll: boolean;
  newDelete: boolean;
  newApprove: boolean;
  tenantId: number;
  features: any[] = [];
  updateRoleFeatureId: number;
  updateRoleFeatureTenantId: number;
  editRoleFeature: boolean;
  isSuperAdmin: boolean;
  tenantList: any[] = [];
  filteredTenantList: any[] = [];
  createRoleName: string = '';
  roleFeatureButtonName: string = "Create";
  isEditRoleFeature: boolean;
  code: string = "ROLMAN";
  tenantRoles: any[] = [];
  subordinateRoles: any[] = [];
  selectedUsers: any[] = [];
  usersList: any[] = [];
  selectedUserIdList: any[] = [];
  delegatedRoleUserDetails: any[] = [];
  isEditFeature: boolean;
  featureName: string = '';
  featureCode: string = '';
  featureButtonName: string = "Create";
  editFeatureId: number;
  userDropdownSettings: IDropdownSettings = {};
  roleFormValidationMessages = {
    roleName: 'Please provide a valid name',
    tenantRequired: 'Please select a tenant'
  };
  featureFormValidationMessages = {
    name: 'Please provide a valid feature name',
    code: 'Please provide a valid feature code'
  };
  roleFeatureFormValidationMessages = {
    featureRequired: 'Please select a feature',
    tenantRequired: 'Please select a tenant',
    roleRequired: 'Please select a role'
  };
  delegateFormValidationMessages = {
    tenantRequired: 'Please select a tenant',
    majorRoleRequired: 'Please select a major role',
    subordinateRoleRequired: 'Please select a subordinate role'
  };
  @ViewChild('featuresSort') featuresSort: MatSort;
  @ViewChild('featuresPagination') featuresPagination: MatPaginator;
  @ViewChild('roleFeatureSort') roleFeatureSort: MatSort;
  @ViewChild('delegateRoleUsersSort') delegateRoleUsersSort: MatSort;
  @ViewChild('roleFeaturePagination') roleFeaturePagination: MatPaginator;
  @ViewChild('delegateRoleUsersPagination') delegateRoleUsersPagination: MatPaginator;

  constructor(
    private dataService: dataService, private modService: ModService, private toastr: ToastrService, private formBuilder: FormBuilder,
    injector: Injector, public dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.isSuperAdmin = this.dataService.isSuperAdmin;
    if (this.isSuperAdmin) {
      this.getAllTenants();
      this.roleFeatureDisplayedColumns = ['tenantName', 'roleName', 'featureFeatureName', 'permission', 'actions'];
      this.roleDelatedUsersDisplayedColumns = ['tenantName', 'name', 'existingRole', 'newRole', 'action'];
    }
    else {
      this.tenantId = this.dataService.currentTenentId;
    }
    this.getAllRoles();
    this.initForm();
    this.dataService.pageName = 'User Role Management';
    this.getAllFeatures();
    this.loadAllRoleFeatures();
    this.getAllDelegatedRoleUserDetails();
    this.userDropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 5,
      allowSearchFilter: true
    };
  }

  tabChanged() {
    this.roleForm.reset();
    this.roleFeatureForm.reset();
    this.initForm();
    this.getAllRoles();
    if (this.isSuperAdmin) {
      this.tenantId = undefined;
    }
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

  createRole() {
    if (this.roleForm.valid) {
      let data = {
        'tenantId': this.tenantId,
        'name': this.createRoleName
      };
      let existingRole: any[] = [];
      this.modService.getAllRoles().subscribe(res => {
        if (res.result) {
          existingRole = res.result.items.filter(x => x.tenantId == data.tenantId && x.name == data.name);
          if (existingRole.length) {
            this.toastr.warning("Similar role exists for the tenant");
          }
          else {
            this.dataService.isLoading = true;
            this.modService.createRole(data).pipe(
              finalize(() => {
                this.dataService.isLoading = this.dataService.doneLoading();
              })).subscribe(res => {
                if (res) {
                  this.roleForm.reset();
                  this.initForm();
                  this.toastr.success("Role created successfully");
                  this.getAllFeatures();
                }
              }, err => {
                this.toastr.error("Something went wrong, try again later");
              });
          }
        }
      }, err => {
        this.toastr.error("Something went wrong, try again later");
      });
    }
    else {
      this.toastr.warning("Please provide valid details");
    }
  }
  cancelRoleForm() {
    this.roleForm.reset();
    this.initForm();
  }

  cancelFeatureForm() {
    this.isEditFeature = false;
    this.featureButtonName = "Create";
    this.featureForm.reset();
    this.initForm();
  }

  addRoleFeature() {
    if (this.roleFeatureForm.valid) {
      if (this.newCreate || this.newUpdate || this.newRead || this.newDelete || this.newApprove) {
        var data = {
          'tenantId': this.tenantId,
          'roleId': this.newRole,
          'featureId': this.newFeature,
          'create': this.newCreate ? true : false,
          'update': this.newUpdate ? true : false,
          'read': this.newRead ? true : false,
          'readAll': this.newReadAll ? true : false,
          'delete': this.newDelete ? true : false,
          'approve': this.newApprove ? true : false
        };
        this.dataService.isLoading = true;
        this.modService.getallrolefeatures().subscribe(res => {
          if (res.result) {
            if (!res.result.items.length) {
              //If there is no existingdata directly add the new rolefeature
              this.modService.addRoleFeature(data).pipe(
                finalize(() => {
                  this.dataService.isLoading = this.dataService.doneLoading();
                })).subscribe(response => {
                  if (response) {
                    this.loadAllRoleFeatures();
                    this.tenantRoles = [];
                    this.roleFeatureForm.reset();
                    this.initForm();
                    this.toastr.success("Role feature added successfully");
                  }
                }, err => {
                  this.toastr.error("Something went wrong try again later");
                });
            }
            else {
              let existingRoleFeature = res.result.items.find(x => x.roleId == this.newRole && x.tenantId == this.tenantId && x.featureId == this.newFeature);
              if (existingRoleFeature) {
                //If data existing already for same feature, role, tenant, then update the role feature permission
                let updateRoleFeature = {
                  'id': existingRoleFeature.id,
                  'featureId': existingRoleFeature.featureId,
                  'roleId': existingRoleFeature.roleId,
                  'tenantId': existingRoleFeature.tenantId,
                  'create': existingRoleFeature.create,
                  'read': existingRoleFeature.read,
                  'readAll': existingRoleFeature.readAll,
                  'update': existingRoleFeature.update,
                  'delete': existingRoleFeature.delete,
                  'approve': existingRoleFeature.approve
                }
                if (this.newCreate)
                  updateRoleFeature.create = this.newCreate;
                if (this.newUpdate)
                  updateRoleFeature.update = this.newUpdate;
                if (this.newRead)
                  updateRoleFeature.read = this.newRead;
                if (this.newReadAll)
                  updateRoleFeature.readAll = this.newReadAll;
                if (this.newDelete)
                  updateRoleFeature.update = this.newDelete;
                if (this.newApprove)
                  updateRoleFeature.approve = this.newApprove;
                this.modService.updateRoleFeature(updateRoleFeature).pipe(
                  finalize(() => {
                    this.dataService.isLoading = this.dataService.doneLoading();
                  })).subscribe(res => {
                    if (res) {
                      this.loadAllRoleFeatures();
                      this.tenantRoles = [];
                      this.roleFeatureForm.reset();
                      this.initForm();
                      this.toastr.success("Role feature added successfully");
                    }
                  }, err => {
                    this.toastr.error("Something went wrong try again later");
                  });
              }
              else {
                //If existing data is present but not for same feature, role, tenant then add the new role feature
                this.modService.addRoleFeature(data).pipe(
                  finalize(() => {
                    this.dataService.isLoading = this.dataService.doneLoading();
                  })).subscribe(response => {
                    if (response) {
                      this.loadAllRoleFeatures();
                      this.tenantRoles = [];
                      this.roleFeatureForm.reset();
                      this.initForm();
                      this.toastr.success("Role feature added successfully");
                    }
                  }, err => {
                    this.toastr.error("Something went wrong try again later");
                  });
              }
            }
          }
        }, err => {
          this.toastr.error("Something went wrong try again later");
        });
      }
      else {
        this.toastr.warning("Atleast one permission is required");
      }
    }
    else {
      this.toastr.warning("Please select Tenant / Role / Feature");
    }
  }

  populateRoleFeature(element) {
    this.tenantRoles = this.roles.filter(x => x.tenantId == element.tenantId);
    this.roleFeatureButtonName = "Update";
    this.isEditRoleFeature = true;
    this.newRead = element.read;
    this.newReadAll = element.readAll;
    this.newUpdate = element.update;
    this.newDelete = element.delete;
    this.newApprove = element.approve;
    if (element.approve)
      this.showApprove = true;
    else
      this.showApprove = false;
    this.newCreate = element.create;
    this.newRole = element.roleId;
    this.newFeature = element.featureId;
    this.updateRoleFeatureId = element.id;
    this.tenantId = element.tenantId;
  }

  featureSelect(feature: any) {
    if (feature.featureCode == "SESION") {
      this.showApprove = true;
    }
    else {
      this.showApprove = false;
      this.newApprove = false;
    }
  }

  updateRoleFeature() {
    if (this.roleFeatureForm.valid) {
      if (this.newCreate || this.newUpdate || this.newRead || this.newDelete || this.newApprove) {
        let updateRoleFeature = {
          'id': this.updateRoleFeatureId,
          'featureId': this.newFeature,
          'roleId': this.newRole,
          'tenantId': this.tenantId,
          'create': this.newCreate,
          'read': this.newRead,
          'readAll': this.newReadAll,
          'update': this.newUpdate,
          'delete': this.newDelete,
          'approve': this.newApprove
        }
        this.dataService.isLoading = true;
        this.modService.updateRoleFeature(updateRoleFeature).pipe(
          finalize(() => {
            this.dataService.isLoading = this.dataService.doneLoading();
          })).subscribe(res => {
            if (res) {
              this.loadAllRoleFeatures();
              this.roleFeatureButtonName = "Create";
              this.isEditRoleFeature = false;
              this.tenantRoles = [];
              this.roleFeatureForm.reset();
              this.initForm();
              this.toastr.success("Role feature updated successfully");
            }
          }, err => {
            this.toastr.error("Something went wrong try again later");
          });
      }
      else {
        this.toastr.warning("Atleast one permission is required");
      }
    }
    else {
      this.toastr.warning("Please select Tenant / Role / Feature");
    }
  }

  deleteRoleFeature(id: number) {
    const deleteRoleFeatureDialog = this.dialog.open(DeleteFeatureComponent, {
      data: {
        roleFeatureId: id
      }
    });
    deleteRoleFeatureDialog.afterClosed().subscribe(result => {
      if (result && result.isRoleFeatureDeleted) {
        this.roleFeatureForm.reset();
        this.toastr.success("Role Feature has been deleted successfully");
        this.loadAllRoleFeatures();
      }
    });
  }

  loadAllRoleFeatures() {
    this.dataService.isLoading = true;
    this.modService.getAllRoleFeatures().pipe(
      finalize(() => {
        this.dataService.isLoading = this.dataService.doneLoading();
      })).subscribe(res => {
        if (res.result) {
          if (this.isSuperAdmin)    //If super admin then show all tenant role features
            this.roleFeatures = res.result;
          else                      //If tenant user then show only particular tenant data
            this.roleFeatures = res.result.filter(x => x.tenantId == this.dataService.currentTenentId);
          if (this.roleFeatures) {
            this.roleFeatures.forEach(element => {
              this.actions = "";
              if (element.create)
                this.actions += " Create" + " ,";
              if (element.update)
                this.actions += " Update " + " ,";
              if (element.read)
                this.actions += " Read " + " ,";
              if (element.readAll)
                this.actions += " Read All " + " ,";
              if (element.approve)
                this.actions += " Approve" + ",";
              if (element.delete)
                this.actions += " Delete" + ",";
              element.permission = this.actions.slice(0, -1);
            });
          }
        }
        this.roleFeaturesData = new MatTableDataSource<any>(this.roleFeatures);
        this.roleFeaturePagination.firstPage();
        this.roleFeaturesData.paginator = this.roleFeaturePagination;
        this.roleFeaturesData.sortingDataAccessor = (data, sortHeaderId) => data[sortHeaderId] ? data[sortHeaderId].toLocaleLowerCase() : '';
        this.roleFeaturesData.sort = this.roleFeatureSort;
      });
  }

  filterSubordinateRoles(majorRoleId: number) {
    this.selectedUserIdList = [];
    this.selectedUsers = [];
    this.selectedSubordinateRole = undefined;
    this.subordinateRoles = this.tenantRoles.filter(x => x.id != majorRoleId);
    this.modService.getUsersForSelectedRole(this.tenantId, majorRoleId).subscribe(res => {
      if (res.result) {
        this.usersList = res.result;
      }
    }, err => { });
  }

  delegateRoles() {
    let data = {
      userIds: this.selectedUserIdList,
      existingRoleId: this.selectedMajorRole,
      newRoleId: this.selectedSubordinateRole,
      modifiedBy: this.dataService.currentUserId,
      tenantId: this.tenantId
    }
    if (this.selectedUserIdList.length) {
      this.dataService.isLoading = true;
      this.modService.delegateUserRoles(data).pipe(
        finalize(() => {
          this.dataService.isLoading = this.dataService.doneLoading();
        })).subscribe(res => {
          if (res) {
            this.getAllDelegatedRoleUserDetails();
            this.delegateForm.reset();
            this.initForm();
            this.toastr.success("Delegating RolePermissions applied successfully");
          }
        }, err => {
          this.toastr.error("Something went wrong, try again later");
        });
    }
    else {
      this.toastr.warning("Please select users");
    }
  }

  getAllDelegatedRoleUserDetails() {
    this.dataService.isLoading = true;
    this.modService.getAllDelegatedRoleUserDetails().pipe(
      finalize(() => {
        this.dataService.isLoading = this.dataService.doneLoading();
      })).subscribe(res => {
        if (res.result) {
          if (this.isSuperAdmin)
            this.delegatedRoleUserDetails = res.result;
          else
            this.delegatedRoleUserDetails = res.result.filter(x => x.tenantId == this.dataService.currentTenentId) ? res.result.filter(x => x.tenantId == this.dataService.currentTenentId) : [];
        }
        this.delegatedRoleUserData = new MatTableDataSource<any>(this.delegatedRoleUserDetails);
        this.delegateRoleUsersPagination.firstPage();
        this.delegatedRoleUserData.paginator = this.delegateRoleUsersPagination;
        this.delegatedRoleUserData.sortingDataAccessor = (data, sortHeaderId) => data[sortHeaderId] ? data[sortHeaderId].toLocaleLowerCase() : '';
        this.delegatedRoleUserData.sort = this.delegateRoleUsersSort;
      }, err => { });
  }

  removeDelegationForUser(removeDelegatedata) {
    const removeDelegationDialog = this.dialog.open(RemoveDelegationComponent, {
      data: {
        'userId': removeDelegatedata.userId,
        'existingRoleId': removeDelegatedata.existingRoleId,
        'newRoleId': removeDelegatedata.newRoleId,
        'delegateId': removeDelegatedata.id,
        'removedBy': this.dataService.currentUserId
      }
    });
    removeDelegationDialog.afterClosed().subscribe(result => {
      if (result && result.isDeleted) {
        this.getAllDelegatedRoleUserDetails();
        this.toastr.success("Delegated user role has been removed successfully");
      }
    });
  }

  cancelDelegateRoles() {
    this.delegateForm.reset();
    this.initForm();
  }

  onUserSelect(item: any) {
    this.selectedUserIdList.push(item.id);
  }

  onUserDeSelect(item: any) {
    this.selectedUserIdList = this.selectedUserIdList.filter(userId => userId !== item.id);
  }

  onUserSelectAll(users: any) {
    this.selectedUserIdList = [];
    this.usersList.forEach(element => {
      this.selectedUserIdList.push(element.id);
    });
  }

  onDeselectUserAll(users: any) {
    this.selectedUserIdList = [];
  }

  deleteFeature(id: number, name: string) {
    this.modService.getallrolefeatures().subscribe(res => {
      let existingMappedFeature = res.result.items.filter(x => x.featureId == id);
      if (!existingMappedFeature.length) {
        const deleteFeatureDialog = this.dialog.open(DeleteFeatureComponent, {
          data: {
            featureId: id,
            featureName: name
          }
        });
        deleteFeatureDialog.afterClosed().subscribe(result => {
          if (result && result.isFeatureDeleted) {
            this.featureForm.reset();
            this.initForm();
            this.toastr.success(name + " has been deleted successfully");
            this.getAllFeatures();
          }
        });
      }
      else {
        this.toastr.warning("The selected feature is mapped to a role. Please remove and try again");
      }
    });
  }

  populateFeature(element: any) {
    this.isEditFeature = true;
    this.featureButtonName = "Update";
    this.featureCode = element.featureCode;
    this.featureName = element.featureName;
    this.editFeatureId = element.id;
  }

  updateFeature() {
    if (this.featureForm.valid && this.featureForm.value.name.trim() && this.featureForm.value.code.trim()) {
      let existingFeature = this.features.filter(x => x.featureName == this.featureName && x.featureCode == this.featureCode);
      if (existingFeature.length) {
        this.toastr.warning("Similar feature name and code exists");
      }
      else {
        let featureData = {
          'id': this.editFeatureId,
          'featureName': this.featureForm.value.name.trim(),
          'featureCode': this.featureForm.value.code.trim()
        }
        this.dataService.isLoading = true;
        this.modService.updateFeatures(featureData).pipe(
          finalize(() => {
            this.dataService.isLoading = this.dataService.doneLoading();
          })).subscribe(res => {
            if (res) {
              this.getAllFeatures();
              this.isEditFeature = false;
              this.featureButtonName = "Create";
              this.toastr.success(featureData.featureName + " updated successfully");
              this.featureForm.reset();
              this.initForm();
            }
          }, err => {
            this.toastr.error("Something went wrong try again later");
          });
      }
    }
    else {
      this.toastr.warning("Please provide valid details");
    }
  }

  createFeature() {
    if (this.featureForm.valid && this.featureForm.value.name.trim() && this.featureForm.value.code.trim()) {
      let existingFeature = this.features.filter(x => x.featureName == this.featureName || x.featureCode == this.featureCode);
      if (existingFeature.length) {
        this.toastr.warning("Similar feature name or code exists");
      }
      else {
        let featureData = {
          'featureName': this.featureForm.value.name.trim(),
          'featureCode': this.featureForm.value.code.trim()
        }
        this.dataService.isLoading = true;
        this.modService.addFeatures(featureData).pipe(
          finalize(() => {
            this.dataService.isLoading = this.dataService.doneLoading();
          })).subscribe(res => {
            if (res) {
              this.getAllFeatures();
              this.toastr.success(featureData.featureName + " added successfully");
              this.featureForm.reset();
              this.initForm();
            }
          }, err => {
            this.toastr.error("Something went wrong try again later");
          });
      }
    }
    else {
      this.toastr.warning("Please provide valid details");
    }
  }

  getAllRoles() {
    this.roles = [];
    this.modService.getAllRoles().subscribe(res => {
      if (res.result) {
        this.roles = res.result.items;
        if (!this.isSuperAdmin)
          this.filterTenantRoles(this.tenantId);
      }
    }, err => { });
  }

  filterTenantRoles(tenantId: number) {
    this.selectedMajorRole = undefined;
    this.subordinateRoles = [];
    this.selectedUsers = [];
    this.newRole = undefined;
    if(!this.isSuperAdmin)
    {
      this.tenantRoles = this.roles.filter(x => x.tenantId == tenantId && x.name !== "IRIS Learner" && x.name !== "IRIS Admin");
    }
    else{
      this.tenantRoles = this.roles.filter(x => x.tenantId == tenantId);
    }
  }

  getAllFeatures() {
    this.modService.getAllFeature().subscribe(res => {
      if (res.result) {
        this.features = res.result.items;
      }
      this.featuresData = new MatTableDataSource<any>(this.features);
      this.featuresPagination.firstPage();
      this.featuresData.paginator = this.featuresPagination;
      this.featuresData.sortingDataAccessor = (data, sortHeaderId) => data[sortHeaderId] ? data[sortHeaderId].toLocaleLowerCase() : '';
      this.featuresData.sort = this.featuresSort;
    });
  }

  initForm(): void {
    if (this.isSuperAdmin) {

      this.delegateForm = this.formBuilder.group({
        tenant: ['', [Validators.required]],
        majorRole: ['', [Validators.required]],
        subordinateRole: ['', [Validators.required]],
        selectedUser: ['', [Validators.required]]
      });

      this.roleFeatureForm = this.formBuilder.group({
        tenant: ['', [Validators.required]],
        feature: ['', [Validators.required]],
        role: ['', [Validators.required]],
        create: [''],
        read: [''],
        readAll: [''],
        update: [''],
        delete: [''],
        approve: ['']
      });

      this.roleForm = this.formBuilder.group({
        tenant: ['', [Validators.required]],
        roleName: ['', [Validators.required, WhiteSpaceValidators.emptySpace(), Validators.maxLength(100)]]
      });
    }
    else {

      this.delegateForm = this.formBuilder.group({
        majorRole: ['', [Validators.required]],
        subordinateRole: ['', [Validators.required]],
        selectedUser: ['', [Validators.required]]
      });
      this.roleFeatureForm = this.formBuilder.group({
        feature: ['', [Validators.required]],
        role: ['', [Validators.required]],
        create: [''],
        read: [''],
        readAll: [''],
        update: [''],
        delete: [''],
        approve: ['']
      });

      this.roleForm = this.formBuilder.group({
        roleName: ['', [Validators.required, WhiteSpaceValidators.emptySpace(), Validators.maxLength(100)]],
        create: [''],
        read: [''],
        update: [''],
        delete: [''],
        approve: ['']
      });
    }
    this.featureForm = this.formBuilder.group({
      name: ['', [Validators.required, WhiteSpaceValidators.emptySpace(), Validators.maxLength(100)]],
      code: ['', [Validators.required, WhiteSpaceValidators.emptySpace()]]
    });
  }
}