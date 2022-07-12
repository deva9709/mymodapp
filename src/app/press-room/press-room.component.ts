import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DeletePressComponent } from "../dialog/delete-press/delete-press.component";
import { Router } from '@angular/router';
import { ToastrService } from "ngx-toastr";
import { UpdatePressreleaseComponent } from '@app/dialog/update-pressrelease/update-pressrelease.component';
import { dataService } from '@app/service/common/dataService';
import { ModService } from '@app/service';
import { Observable } from 'rxjs';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

export interface IPressReleaseDetails {
  id: number;
  title: string;
  descripion: string;
  modifiedDate: Date;
  endDate: Date;
  thumbnailURL: string;
  tenantId: number;
  tenant: any;
  roleId: number;
  batchId: number;
  createdDate: Date;
  createdUserId: number;
  createdByUserDetail: any;
  modifiedUserId: number;
  modifiedUserDetail: any;
  userIds: [];
}

@Component({
  selector: 'app-press-room',
  templateUrl: './press-room.component.html',
  styleUrls: ['./press-room.component.css'],
  providers: [DatePipe]
})
export class PressRoomComponent implements OnInit {
  isGlobalSearch:string;
  searchInput:string;
  pressReleaseObservable: Observable<any>;
  pressRoomList: any[] = [];
  pressReleaseList: any[] = [];
  createPermission: boolean;
  updatePermission: boolean;
  deletePermission: boolean;
  readAllPermission: boolean;
  rolePermissions: any[] = [];
  Code: string = "PRSROM";
  pressReleaseDataSource: MatTableDataSource<IPressReleaseDetails>;

  @ViewChild('Paginator') Paginator: MatPaginator;
  @ViewChild('TargetPaginator') TargetPaginator: MatPaginator;
  isSuperAdmin: boolean;
  canBeMentor: boolean;
  canBeMentee: boolean;
  readOnlyAccess: boolean = false;
  currentPlatformUserId: number;
  tenantId: number;
  tenantList: any[] = [];
  roles: any[] = [];
  tenantRoles: any[] = [];
  filteredTenantList: any[] = [];
  batchList: any[] = [];
  viewPressReleaseForm: FormGroup;
  targetPressReleaseForm: FormGroup;
  isRoleDisabled: boolean;
  isBatchDisabled: boolean;
  targetPressReleaseList: any[] = [];
  targetPressReleaseDataSource: MatTableDataSource<IPressReleaseDetails>;
  targetPressReleaseObservable: Observable<any>;
  viewPressRoomFormValidationMessages = {
    tenantRequired: 'Please select a tenant',
    roleRequired: 'Please select a  role',
    batchRequired: 'Please select a batch'
  };
  viewTargetPressRoomFormValidationMessages = {
    tenantRequired: 'Please select a tenant',
    startDateRequired: 'Please select a start date',
    endDateRequired: 'Please select a end date'
  };
  constructor(
    public dialog: MatDialog, private router: Router, private toastr: ToastrService, private dataService: dataService, private modService: ModService, private fb: FormBuilder,
    private datePipe: DatePipe,private route: ActivatedRoute
  ) { }


  ngOnInit() {
    //for global search
    this.route.queryParams.subscribe(params => {
      this.isGlobalSearch = params['globalSearch'];
      this.searchInput=params['name'];
    });
    console.log(this.searchInput);
    if(this.isGlobalSearch=="true"&& this.searchInput!=="Press-room")
    {
      this.loadGlobalPressRoom();
    }
    this.dataService.pageName = "Press-Releases"
    this.isSuperAdmin = this.dataService.isSuperAdmin;
    this.currentPlatformUserId = this.dataService.currentPlatformUserId;
    this.initForm();
    this.getPermissions();
    this.getAllRoles();
    this.initTargetPressReleaseForm();
    if (!this.isSuperAdmin) {
      this.canBeMentor = this.dataService.canBeMentor;
      this.canBeMentee = this.dataService.canBeMentee;
      const currentDate = this.datePipe.transform(new Date(), "MM/dd/yyyy");
      this.fetchTargetPressRelease('', this.currentPlatformUserId, currentDate, '');
    }
  }

  deletePressRelease(pressRoom): void {
    if (this.deletePermission) {
      const deletePressReleaseDialog = this.dialog.open(DeletePressComponent, {
        data: {
          id: pressRoom.id,
          title: pressRoom.title
        }
      });
      deletePressReleaseDialog.afterClosed().subscribe(result => {
        if (result && result.isDeleted) {
          this.toastr.success(pressRoom.title + " has been deleted successfully");
          this.reloadPage();
        }
      });
    }
    else {
      this.toastr.warning("You don't have permission to delete a press release");
    }
  }

  getPressReleaseDetails(pressRoom) {
    if (this.updatePermission) {
      this.modService.getPressReleaseDetails(pressRoom.id).subscribe(res => {
        if (res.result) {
          const updatePressReleaseDialog = this.dialog.open(UpdatePressreleaseComponent, {
            minWidth: '80vw',
            data: {
              title: res.result.title,
              description: res.result.description,
              thumbnailUrl: res.result.ThumbnailURL,
              id: res.result.id,
              tenantId: res.result.tenantId,
              roleId: res.result.roleId,
              batchId: res.result.batchId,
              userIds: res.result.userIds
            }
          });
          updatePressReleaseDialog.afterClosed().subscribe(result => {
            if (result && result.isUpdated) {
              this.toastr.success(result.title + " has been updated successfully");
              this.reloadPage();
            }
          });
        }
      });
    }
    else {
      this.toastr.warning("You don't have permission to update a press release");
    }
  }

  getPermissions() {
    if (this.dataService.isSuperAdmin) {
      this.createPermission = this.updatePermission = this.deletePermission = this.readAllPermission = true;
    }
    else {
      this.rolePermissions = this.dataService.rolePermissions;
      let permissions = this.rolePermissions.find(val => val.feature.featureCode === this.Code);
      if (permissions) {
        this.createPermission = permissions.create;
        this.updatePermission = permissions.update;
        this.deletePermission = permissions.delete;
        this.readAllPermission = permissions.readAll;
        if (this.createPermission == false && this.updatePermission == false && this.deletePermission == false) {
          this.readOnlyAccess = true;
        }
      }
      else {
        this.createPermission = this.updatePermission = this.deletePermission = this.readAllPermission = false;
        this.readOnlyAccess = true;
      }
    }
  }

  readMore(id: string) {
    let pressReleaseId = btoa(id);
    this.router.navigate(['/app/press-release', pressReleaseId]);
  }

  newPressRelease() {
    if (this.createPermission) {
      const createPressReleaseDialog = this.dialog.open(UpdatePressreleaseComponent, {
        minWidth: '80vw'
      });
      createPressReleaseDialog.afterClosed().subscribe(result => {
        if (result && result.isAdded) {
          this.reloadPage();
        }
      });
    }
    else {
      this.toastr.warning("You don't have permission to create a press release");
    }
  }
  initForm() {
    if (this.isSuperAdmin) {
      this.getAllTenants();
      this.viewPressReleaseForm = this.fb.group({
        tenant: ['', [Validators.required]],
        role: ['', [Validators.required]],
        batch: ['', [Validators.required]]
      })
    }
    else {
      this.tenantId = this.dataService.currentTenentId;
      this.viewPressReleaseForm = this.fb.group({
        role: ['', [Validators.required]],
        batch: ['', [Validators.required]]
      })
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

  getAllRoles() {
    this.modService.getAllRoles().subscribe(res => {
      if (res.result) {
        this.roles = res.result.items;
        if (!this.isSuperAdmin)
          this.filterTenantBasedRecords(this.tenantId);
      }
    }, err => { });
  }

  filterTenantBasedRecords(tenantId: number) {
    this.tenantRoles = this.roles.filter(x => x.tenantId == tenantId);
    this.getBatchList(tenantId);
    this.viewPressReleaseForm.patchValue({
      role: '',
      batch: ''
    });
    this.viewPressReleaseForm.controls.batch.enable();
    this.viewPressReleaseForm.controls.role.enable();
    this.getAllPressReleasesByTenant(tenantId);
  }

  search(query: string): void {
    this.filteredTenantList = this.performFilter(query, this.tenantList, 'tenantName');
  }

  performFilter(query: string, filterArray: string[], filterBy: string): string[] {
    query = query.toLocaleLowerCase();
    return filterArray.filter(value => value[filterBy].toLocaleLowerCase().indexOf(query) !== -1);
  }

  getBatchList(tenantId) {
    this.modService.getBatchList(tenantId).subscribe(response => {
      this.batchList = response.result;
      this.dataService.isLoading = this.dataService.doneLoading();
    })
  }

  onRoleSelection() {
    this.viewPressReleaseForm.patchValue({
      batch: ''
    });
    this.viewPressReleaseForm.controls.batch.disable();
    this.isRoleDisabled = false;
    this.isBatchDisabled = true;
  }

  onBatchSelection() {
    this.viewPressReleaseForm.patchValue({
      role: ''
    })
    this.viewPressReleaseForm.controls.role.disable();
    this.isRoleDisabled = true;
    this.isBatchDisabled = false;
  }
  onClearRole(event) {
    this.viewPressReleaseForm.patchValue({
      role: ''
    })
    this.viewPressReleaseForm.controls.batch.enable();
    this.isRoleDisabled = false;
    this.isBatchDisabled = false;
    this.viewPressReleaseForm.get('role').setValidators([Validators.required]);
    this.viewPressReleaseForm.get('role').updateValueAndValidity();
    this.viewPressReleaseForm.get('batch').clearValidators();
    this.viewPressReleaseForm.get('batch').updateValueAndValidity();
    event.stopPropagation();
  }
  onClearBatch(event) {
    this.viewPressReleaseForm.patchValue({
      batch: ''
    })
    this.viewPressReleaseForm.controls.role.enable();
    this.isRoleDisabled = false;
    this.isBatchDisabled = false;
    this.viewPressReleaseForm.get('batch').setValidators([Validators.required]);
    this.viewPressReleaseForm.get('batch').updateValueAndValidity();
    this.viewPressReleaseForm.get('role').clearValidators();
    this.viewPressReleaseForm.get('role').updateValueAndValidity();
    event.stopPropagation();
  }
  loadAllPressRelease() {
    const roleId = this.viewPressReleaseForm.value.role == undefined ? '' : this.viewPressReleaseForm.value.role;
    const batchId = this.viewPressReleaseForm.value.batch == undefined ? '' : this.viewPressReleaseForm.value.batch;
    if (this.isSuperAdmin) {
      const tenantId = this.viewPressReleaseForm.value.tenant;
      this.getAllPressRelease(tenantId, roleId, batchId);
    }
    else {
      this.getAllPressRelease(this.tenantId, roleId, batchId);
    }
  }

  getAllPressRelease(tenantId, roleId, batchId) {
    this.dataService.isLoading = true;
    this.modService.SearchPressRelease(tenantId, roleId, batchId).pipe(
      finalize(() => {
        this.dataService.isLoading = this.dataService.doneLoading();
      })).subscribe(res => {
        if (res.result) {
          this.pressReleaseList = res.result;
          this.pressReleaseDataSource = new MatTableDataSource<IPressReleaseDetails>(this.pressReleaseList);
          this.Paginator.firstPage();
          this.pressReleaseDataSource.paginator = this.Paginator;
          this.pressReleaseObservable = this.pressReleaseDataSource.connect();
        }
      }, err => { });
  }

  initTargetPressReleaseForm() {
    if (this.isSuperAdmin) {
      this.targetPressReleaseForm = this.fb.group({
        tenant: ['', [Validators.required]]
      })
    }
    else {
      this.targetPressReleaseForm = this.fb.group({
        startDate: ['', [Validators.required]],
        endDate: ['', [Validators.required]]
      })
    }
  }
  getAllTargetPressRelease() {
    const tenantId = this.targetPressReleaseForm.value.tenant == undefined ? '' : this.targetPressReleaseForm.value.tenant;
    const startDate = this.targetPressReleaseForm.value.startDate == undefined ? '' : this.datePipe.transform(this.targetPressReleaseForm.value.startDate, "MM/dd/yyyy");
    const endDate = this.targetPressReleaseForm.value.endDate == undefined ? '' : this.datePipe.transform(this.targetPressReleaseForm.value.endDate, "MM/dd/yyyy");
    this.fetchTargetPressRelease(tenantId, this.currentPlatformUserId, startDate, endDate);
  }

  fetchTargetPressRelease(tenantId, currentPlatformUserId, startDate, endDate) {
    this.dataService.isLoading = true;
    this.modService.getTargetPressRelease(tenantId, currentPlatformUserId, startDate, endDate).pipe(
      finalize(() => {
        this.dataService.isLoading = this.dataService.doneLoading();
      })).subscribe(res => {
        if (res.result) {
          this.targetPressReleaseList = res.result;
          this.targetPressReleaseDataSource = new MatTableDataSource<IPressReleaseDetails>(this.targetPressReleaseList);
          this.TargetPaginator.firstPage();
          this.targetPressReleaseDataSource.paginator = this.TargetPaginator;
          this.targetPressReleaseObservable = this.targetPressReleaseDataSource.connect();
        }
      }, err => { });
  }

  getAllPressReleasesByTenant(tenantId) {
    this.dataService.isLoading = true;
    this.modService.getAllPressReleasesByTenant(tenantId).pipe(
      finalize(() => {
        this.dataService.isLoading = this.dataService.doneLoading();
      })).subscribe(res => {
        if (res.result) {
          this.pressReleaseList = res.result;
          this.pressReleaseDataSource = new MatTableDataSource<IPressReleaseDetails>(this.pressReleaseList);
          this.Paginator.firstPage();
          this.pressReleaseDataSource.paginator = this.Paginator;
          this.pressReleaseObservable = this.pressReleaseDataSource.connect();
        }
      }, err => { });
  }
  reloadPage() {
    window.location.reload();
  }
  
  //for global search
  loadGlobalPressRoom(){
    this.dataService.isLoading = true;
    this.modService.getGlobalPressRelease(this.searchInput).pipe(
      finalize(() => {
        this.dataService.isLoading = this.dataService.doneLoading();
      })).subscribe(res => {
        if (res.result) {
          this.targetPressReleaseList = res.result;
          this.targetPressReleaseDataSource = new MatTableDataSource<IPressReleaseDetails>(this.targetPressReleaseList);
          this.TargetPaginator.firstPage();
          this.targetPressReleaseDataSource.paginator = this.TargetPaginator;
          this.targetPressReleaseObservable = this.targetPressReleaseDataSource.connect();
        }
      }, err => { });
  }
}
