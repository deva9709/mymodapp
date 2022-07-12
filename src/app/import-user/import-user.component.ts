import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { ModService } from '@app/service';
import { ToastrService } from 'ngx-toastr';
import { dataService } from '@app/service/common/dataService';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { CreateTenantComponent } from '@app/dialog/create-tenant/create-tenant.component';

@Component({
  selector: 'app-import-user',
  templateUrl: './import-user.component.html',
  styleUrls: ['./import-user.component.css']
})
export class ImportUserComponent implements OnInit {
  uploadUserForm: FormGroup;
  selectedFile: any;
  file: any;
  fileTypeGranted: boolean = false;
  userType: string;
  isUploadUserFormSubmitted: boolean;
  tenantList: any[] = [];
  filteredTenantList: any[] = [];
  tenantId: number;
  roleId: number;
  isSuperAdmin: boolean;
  roles: any[] = [];
  tenantRoles: any[] = [];
  filteredRoles: any[] = [];
  rolePermissions: any[] = [];
  createPermission: boolean;
  code: string = "IMPUSR";
  uploadUserFormValidationMessages = {
    tenantRequired: 'Please select a tenant',
    roleRequired: 'Please select a role'
  };
  constructor(
    private modService: ModService,
    private toastr: ToastrService,
    public dataService: dataService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog) { }

  ngOnInit() {
    this.dataService.isLoading = this.dataService.doneLoading();
    this.isSuperAdmin = this.dataService.isSuperAdmin;
    this.initForm();
    this.getPermissions();
    this.dataService.pageName = 'Import Users';
    this.getAllRoles();
  }

  initForm() {
    if (this.isSuperAdmin) {
      this.uploadUserForm = this.formBuilder.group({
        userFile: ['', Validators.required],
        tenant: ['', Validators.required],
        role: ['', Validators.required]
      });
      this.getAllTenants();
    }
    else {
      this.tenantId = this.dataService.currentTenentId;
      this.uploadUserForm = this.formBuilder.group({
        userFile: ['', Validators.required],
        role: ['', Validators.required]
      });
    }
  }

  getPermissions() {
    if (this.dataService.isSuperAdmin) {
      this.createPermission = true;
    }
    else {
      this.rolePermissions = this.dataService.rolePermissions;
      let permissions = this.rolePermissions.find(val => val.feature.featureCode === this.code);
      this.createPermission = permissions ? permissions.create : false;
    }
  }

  getAllRoles() {
    this.modService.getAllRoles().subscribe(res => {
      if (res.result) {
        this.roles = res.result.items;
        if (!this.isSuperAdmin) {
          this.filterTenantRoles(this.tenantId);
        }
      }
    }, err => { });
  }

  filterTenantRoles(tenantId) {
    this.tenantRoles = this.roles.filter(x => x.tenantId == tenantId);
    this.filteredRoles = this.tenantRoles;
  }


  newTenant(): void {
    if (this.createPermission) {
      const createTenantDialog = new MatDialogConfig();
      createTenantDialog.disableClose = true;
      createTenantDialog.autoFocus = false;
      createTenantDialog.width = '40vw';
      const dialogRef = this.dialog.open(CreateTenantComponent, createTenantDialog);
      dialogRef.afterClosed().subscribe(result => {
        if (result && result.isCreated) {
          this.getAllRoles();
          this.getAllTenants();
        }
      });
    }
    else {
      this.toastr.warning("You don't have permission to create a tenant");
    }
  }

  getAllTenants() {
    this.dataService.isLoading = true;
    this.modService.getTenants().pipe(
      finalize(() => {
        this.dataService.isLoading = this.dataService.doneLoading();
      })).subscribe(res => {
        if (res.result) {
          this.tenantList = res.result;
          this.filteredTenantList = this.tenantList;
        }
      }, err => { });
  }

  search(query: string, filterFor: string): void {
    if (filterFor.toLowerCase() == 'tenant') {
      this.filteredTenantList = this.performFilter(query, this.tenantList, 'tenantName');
    }
    else if (filterFor.toLowerCase() == 'role') {
      this.filteredRoles = this.performFilter(query, this.tenantRoles, 'name');
    }
  }

  performFilter(query: string, filterArray: string[], filterBy: string): string[] {
    query = query.toLocaleLowerCase();
    return filterArray.filter(value => value[filterBy].toLocaleLowerCase().indexOf(query) !== -1);
  }

  onFileChange(event) {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0].type;
      this.file = event.target.files[0];

      if (this.selectedFile == "application/vnd.ms-excel"
        || this.selectedFile == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
        this.fileTypeGranted = true;
        this.toastr.success('File selected, please click on the upload button to import users.');
      }
      else {
        this.toastr.warning('Upload only excel files');
      }
    }
    else {
      this.toastr.warning('Please select a file');
    }
  }

  uploadUsers(): void {
    if (this.createPermission) {
      if (this.uploadUserForm.valid) {
        this.isUploadUserFormSubmitted = true;
        const formData = new FormData();
        formData.append('file', this.file, this.file.name);
        this.dataService.isLoading = true;
        this.modService.userImport(formData, this.tenantId, this.roleId).pipe(
          finalize(() => {
            this.isUploadUserFormSubmitted = false;
            this.dataService.isLoading = this.dataService.doneLoading();
          })
        ).subscribe(res => {
          if (res.result != '') {
            this.toastr.error(res.result);
          }
          else {
            this.toastr.success('User uploaded successfully, please check the logs for detailed information.');
          }
        });
      }
      else {
        this.toastr.warning('Please select a file');
      }
    }
    else {
      this.toastr.warning("You don't have permission to upload users.");
    }
  }
}