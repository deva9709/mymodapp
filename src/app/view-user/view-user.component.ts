import { Component, OnInit, ViewChild } from '@angular/core';
import { ModService } from '@app/service';
import { dataService } from '@app/service/common/dataService';
import { MatSort, MatTableDataSource, MatPaginator, MatDialogConfig, MatDialog } from '@angular/material';
import { finalize } from 'rxjs/operators';
import { ViewMoreDetailsComponent } from '@app/dialog/view-more-details/view-more-details.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

export interface User {
  tenantDisplayName: string;
  tenancyName: string;
  roleNames: string;
  emailAddress: string;
  name: string;
  surname: string;
  skills: string;
  microtutorings: string;
  id: number;
  platFormId: number
}

@Component({
  selector: 'app-view-user',
  templateUrl: './view-user.component.html',
  styleUrls: ['./view-user.component.css']
})
export class ViewUserComponent implements OnInit {
  isGlobalSearch:string;
  searchInput:string;
  viewUserForm: FormGroup;
  users: User[] = [];
  tenantDisplayName: string;
  tenancyName: string;
  usersDisplayedColumns: string[] = ['emailAddress', 'name', 'surname'];
  userDetails: MatTableDataSource<User>;
  role: string = '';
  tenantId: number;
  isSuperAdmin: boolean;
  tenantList: any[] = [];
  roles: any[] = [];
  tenantRoles: any[] = [];
  filteredTenantList: any[] = [];
  roleId: number;
  viewUserFormValidationMessages = {
    tenantRequired: 'Please select a tenant',
    roleRequired: 'Please select a  role'
  };

  @ViewChild('usersSort') usersSort: MatSort;
  @ViewChild('usersPaginator') usersPaginator: MatPaginator;

  constructor(
    private modService: ModService,
    private dataService: dataService,
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    //for global search
    this.route.queryParams.subscribe(params => {
      this.isGlobalSearch = params['globalSearch'];
      this.searchInput=params['name'];
    });
    if(this.isGlobalSearch=="true"&& this.searchInput!=="ViewUser")
    {
      this.loadGlobalSearchDetails();
    }
   
    this.getAllRoles();
    this.dataService.pageName = 'View Users';
    this.isSuperAdmin = this.dataService.isSuperAdmin;
    if (this.isSuperAdmin) {
      this.getAllTenants();
      this.viewUserForm = this.formBuilder.group({
        tenant: ['', [Validators.required]],
        role: ['', [Validators.required]]
      });
    }
    else {
      this.tenantId = this.dataService.currentTenentId;
      this.viewUserForm = this.formBuilder.group({
        role: ['', [Validators.required]]
      });
    }
    this.dataService.isLoading = this.dataService.doneLoading();
  }

  getAllRoles() {
    this.modService.getAllRoles().subscribe(res => {
      if (res.result) {
        this.roles = res.result.items;
        if (!this.isSuperAdmin)
          this.filterTenantRoles(this.tenantId);
      }
    }, err => { });
  }

  filterTenantRoles(tenantId: number) {
    this.roleId = undefined;
    this.tenantRoles = this.roles.filter(x => x.tenantId == tenantId);
  }

  getAllTenants() {
    this.modService.getTenants().subscribe(res => {
      if (res.result) {
        this.tenantList = res.result;
        this.filteredTenantList = this.tenantList;
      }
    }, err => { });
  }

  search(query: string): void {
    this.filteredTenantList = this.performFilter(query, this.tenantList, 'tenantName');
  }

  performFilter(query: string, filterArray: string[], filterBy: string): string[] {
    query = query.toLocaleLowerCase();
    return filterArray.filter(value => value[filterBy].toLocaleLowerCase().indexOf(query) !== -1);
  }

  loadUserDetails(): void {
    if (this.viewUserForm.valid) {
      this.dataService.isLoading = true;
      this.modService.getUsersForSelectedRole(this.tenantId, this.roleId).pipe(
        finalize(() => {
          this.dataService.isLoading = this.dataService.doneLoading();
        })).subscribe(res => {
          if (res.result) {
            this.users = res.result;
            this.userDetails = new MatTableDataSource<User>(this.users);
            this.userDetails.paginator = this.usersPaginator;
            this.userDetails.sortingDataAccessor = (data, sortHeaderId) => data[sortHeaderId] ? data[sortHeaderId].toLocaleLowerCase() : '';
            this.userDetails.sort = this.usersSort;
          }
        });
    }
  }

  // vew more details of user
  viewMoreUserDetails(tanentValue): void {
    const viewMoreDetailsComponent = new MatDialogConfig();
    viewMoreDetailsComponent.autoFocus = false;
    viewMoreDetailsComponent.width = '60vw';
    const dialogRef = this.dialog.open(ViewMoreDetailsComponent, viewMoreDetailsComponent);
    dialogRef.componentInstance.tanentValue = tanentValue;
  }

 // for global search
  loadGlobalSearchDetails(): void {
      this.dataService.isLoading = true;
      this.modService.getUsersByName(this.searchInput).pipe(
        finalize(() => {
          this.dataService.isLoading = this.dataService.doneLoading();
        })).subscribe(res => {
          if (res.result) {
            this.users = res.result;
            this.userDetails = new MatTableDataSource<User>(this.users);
            this.userDetails.paginator = this.usersPaginator;
            this.userDetails.sortingDataAccessor = (data, sortHeaderId) => data[sortHeaderId] ? data[sortHeaderId].toLocaleLowerCase() : '';
            this.userDetails.sort = this.usersSort;
          }
        });
    
  }
}