import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { ModService } from '@app/service';
import { dataService } from '@app/service/common/dataService';
import { AppComponentBase } from "@shared/app-component-base";
import { MatPaginator, MatSort, MatTableDataSource } from "@angular/material";
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { UpdateConfigComponent } from '@app/dialog/update-config/update-config.component';
import { DeleteConfigComponent } from '@app/dialog/delete-config/delete-config.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-sys-config',
  templateUrl: './sys-config.component.html',
  styleUrls: ['./sys-config.component.css']
})
export class SysConfigComponent extends AppComponentBase implements OnInit {
  configs: any[] = [];
  displayedColumns: string[] = ['name', 'value', 'actions'];
  dataSource: MatTableDataSource<any>;
  systemConfigId: number;
  updateModel: boolean = false;
  createPermission: boolean;
  updatePermission: boolean;
  deletePermission: boolean;
  rolePermissions: any[] = [];
  code: string = "SYSCFG";
  deleteModel: boolean = false;
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(
    injector: Injector,
    private modService: ModService,
    private dataService: dataService,
    public dialog: MatDialog,
    private toastr: ToastrService
  ) {
    super(injector);
  }

  ngOnInit() {
    this.dataService.pageName = 'System Configuration';
    this.loadAllConfig();
    this.getPermissions();
  }

  getConfigurationDetails(id: number) {
    if (this.updatePermission) {
      this.modService.getConfigurationDetails(id).subscribe(res => {
        if (res.result) {
          const updateConfigurationDialog = this.dialog.open(UpdateConfigComponent, {
            data: {
              sysConfigId: res.result.id,
              sysConfigValue: res.result.value,
              sysConfigName: res.result.name
            }
          });
          updateConfigurationDialog.afterClosed().subscribe(result => {
            if (result && result.isUpdated) {
              this.toastr.success("Configuration has been updated successfully");
              this.loadAllConfig();
            }
          });
        }
      });
    }
    else {
      this.toastr.warning("You don't have permission to update configuration");
    }
  }

  getPermissions() {
    if (this.dataService.isSuperAdmin) {
      this.createPermission = this.updatePermission = this.deletePermission = true;
    }
    else {
      this.rolePermissions = this.dataService.rolePermissions;
      let permissions = this.rolePermissions.find(val => val.feature.featureCode === this.code);
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

  loadAllConfig() {
    this.configs = [];
    this.modService.getAllConfig().subscribe(res => {
      if (res.result.items) {
        this.configs = res.result.items;
        this.dataSource = new MatTableDataSource<any>(this.configs);
        this.paginator.firstPage();
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    });
  }

  newConfiguration(): void {
    if (this.createPermission) {
      const createConfigurationDialog = this.dialog.open(UpdateConfigComponent);
      createConfigurationDialog.afterClosed().subscribe(result => {
        if (result && result.isCreated) {
          this.toastr.success("Configuration has been created successfully");
          this.loadAllConfig();
        }
      });
    }
    else {
      this.toastr.warning("You don't have permission to create a configuration");
    }
  }

  deleteConfiguration(id: number) {
    if (this.deletePermission) {
      const deleteConfigDialog = this.dialog.open(DeleteConfigComponent, {
        data: {
          deleteConfigId: id
        }
      });
      deleteConfigDialog.afterClosed().subscribe(result => {
        if (result && result.isDeleted) {
          this.toastr.success("Configuration has been deleted successfully");
          this.loadAllConfig();
        }
      });
    }
    else {
      this.toastr.warning("You don't have permission to delete a configuration");
    }
  }
}  