import { Component, OnInit, Injector, ViewChild } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ModService } from "@app/service";
import { MatPaginator, MatSort, MatTableDataSource } from "@angular/material";
import { NewAnnouncementComponent } from '@app/dialog/new-announcement/new-announcement.component';
import { DeleteAnnouncementComponent } from '@app/dialog/delete-announcement/delete-announcement.component';
import { ToastrService } from "ngx-toastr";
import { dataService } from "@app/service/common/dataService";
import { finalize } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

export interface PeriodicElement {
  title: string;
  startDate: string;
  endDate: string;
  user: string;
  description: string;
}

@Component({
  selector: 'app-announcements',
  templateUrl: './announcements.component.html',
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
  styleUrls: ['./announcements.component.css']

})
export class AnnouncementsComponent implements OnInit {
  isGlobalSearch:string;
  searchInput:string;
  allAnnouncements: any[] = [];
  allTenants: any[] = [];
  createPermission: boolean;
  updatePermission: boolean;
  deletePermission: boolean;
  rolePermissions: any[] = [];
  Code: string = "ANONCE";
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['title', 'startDate', 'endDate', 'tenant', 'user', 'actions'];
  showTenant: boolean = true;
  roles: any[] = [];
  isSuperAdmin: boolean;
  expandedElement: PeriodicElement | null;
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(injector: Injector, public dataService: dataService, private toastr: ToastrService, public dialog: MatDialog, private modService: ModService,
    private router: Router,
    private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.isGlobalSearch = params['globalSearch'];
      this.searchInput=params['name'];
    });
    this.dataService.pageName = "Announcements";
    this.isSuperAdmin = this.dataService.isSuperAdmin;
    if (!this.isSuperAdmin) {
      this.displayedColumns = ['title', 'startDate', 'endDate', 'user', 'actions'];
    }
    this.getAllTenants();
    this.getPermissions();
  }

  newAnnouncement(): void {
    if (this.createPermission) {
      const createAnnouncementDialog = new MatDialogConfig();
      createAnnouncementDialog.disableClose = true;
      createAnnouncementDialog.autoFocus = false;
      createAnnouncementDialog.width = '30vw';
      const dialogRef = this.dialog.open(NewAnnouncementComponent, createAnnouncementDialog);
      dialogRef.afterClosed().subscribe(result => {
        if (result && result.isCreated) {
          this.toastr.success(result.announcementTitle + " has been created successfully");
          this.loadAllAnnouncements();
        }
      });
    }
    else {
      this.toastr.warning("You don't have permission to create an announcement");
    }
  }

  deleteAnnouncement(announcement) {
    if (this.deletePermission) {
      const deleteAnnouncementDialog = this.dialog.open(DeleteAnnouncementComponent, {
        data: {
          announcementId: announcement.id,
        }
      });
      deleteAnnouncementDialog.afterClosed().subscribe(result => {
        if (result && result.isDeleted) {
          this.toastr.success(announcement.title + " has been deleted successfully");
          this.loadAllAnnouncements();
        }
      });
    }
    else {
      this.toastr.warning("You don't have permission to delete an announcement");
    }
  }

  getAnnouncementDetails(id: number) {
    if (this.updatePermission) {
      this.modService.getAnnouncement(id).subscribe(res => {
        if (res.result) {
          const updateAnnouncementDialog = this.dialog.open(NewAnnouncementComponent, {
            data: {
              announcementId: res.result.id,
              startDate: res.result.startDate,
              endDate: res.result.endDate,
              title: res.result.title,
              message: res.result.message,
              roleId: res.result.roleId,
              selectedTenant: res.result.tenantId,
              id: res.result.id
            }
          });
          updateAnnouncementDialog.afterClosed().subscribe(result => {
            if (result && result.isUpdated) {
              this.toastr.success(result.announcementTitle + " has been updated successfully");
              this.loadAllAnnouncements();
            }
          });
        }
        else {
          this.toastr.warning("Please try again later");
        }
      }, err => {
        this.toastr.warning("Please try again later");
      });
    }
    else {
      this.toastr.warning("You don't have permission to update an announcement");
    }
  }

  getPermissions() {
    if (this.isSuperAdmin) {
      this.createPermission = this.updatePermission = this.deletePermission = true;
    }
    else {
      this.rolePermissions = this.dataService.rolePermissions;
      let permissions = this.rolePermissions.find(val => val.feature.featureCode === this.Code);
      if (permissions) {
        this.createPermission = permissions.create;
        this.updatePermission = permissions.update;
        this.deletePermission = permissions.delete;
      }
      else {
        this.createPermission = this.updatePermission = this.deletePermission = false;
      }
    }
  }

  getAllRoles() {
    this.modService.getAllRoles().subscribe(res => {
      if (res.result) {
        this.roles = res.result.items;
        this.loadAllAnnouncements();
      }
    }, err => { });
  }

  getAllTenants() {
    this.dataService.isLoading = true;
    this.modService.getTenants().subscribe(res => {
      if (res.result) {
        this.allTenants = res.result;
      }
      this.getAllRoles();
    }, err => { });
  }

  loadAllAnnouncements() {
    if(this.isGlobalSearch==="true"&& this.searchInput!=="Announcements")
    {
      this.loadGlobalSearchAnnouncement();
    }
    else{
    this.modService.getAllAnnouncements().pipe(
      finalize(() => {
        this.dataService.isLoading = this.dataService.doneLoading();
      })
    ).subscribe(res => {
      if (res.result) {
        if (!this.isSuperAdmin) {
          this.showTenant = false;
          this.allAnnouncements = res.result.filter(s => (s.tenantId === this.dataService.currentTenentId));
        }
        else {
          this.allAnnouncements = res.result;
        }
        this.allAnnouncements = this.allAnnouncements.map(announcement => {
          return { ...announcement, role: this.roles.find(x => x.id === announcement.roleId).name, tenant: this.allTenants.find(t => t.id === announcement.tenantId).tenantDisplayName }; ``
        });
      }
      this.showAllAnnouncements();
    }, err => {
      this.toastr.warning("Please try again later");
    });
  }
  }

  showAllAnnouncements() {
    this.dataSource = new MatTableDataSource<any>(this.allAnnouncements);
    this.paginator.firstPage();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadGlobalSearchAnnouncement() {
    this.modService.getGlobalAnnouncement(this.searchInput).pipe(
      finalize(() => {
        this.dataService.isLoading = this.dataService.doneLoading();
      })
    ).subscribe(res => {
      if (res.result) {
        if (!this.isSuperAdmin) {
          this.showTenant = false;
          this.allAnnouncements = res.result.filter(s => (s.tenantId === this.dataService.currentTenentId));
        }
        else {
          this.allAnnouncements = res.result;
        }
        this.allAnnouncements = this.allAnnouncements.map(announcement => {
          return { ...announcement, role: this.roles.find(x => x.id === announcement.roleId).name, tenant: this.allTenants.find(t => t.id === announcement.tenantId).tenantDisplayName }; ``
        });
      }
      this.dataSource = new MatTableDataSource<any>(this.allAnnouncements);
    this.paginator.firstPage();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    }, err => {
      this.toastr.warning("Please try again later");
    });
  }
}