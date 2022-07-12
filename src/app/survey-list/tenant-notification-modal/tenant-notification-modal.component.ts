import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { dataService } from "@app/service/common/dataService";
import { ModService } from '@app/service';
import { MatPaginator, MatSort, MatTableDataSource } from "@angular/material";
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Constants } from '@app/models/constants';

@Component({
  selector: 'app-tenant-notification-modal',
  templateUrl: './tenant-notification-modal.component.html',
  styleUrls: ['./tenant-notification-modal.component.css']
})
export class TenantNotificationModalComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dropDownSetting: IDropdownSettings = {};
  tenantSelectedList: any[] = [];
  selectedTenant = [];
  tenantList: any[] = [];
  tenantListForSurvey: any[] = [];
  tenantIds: any[] = [];
  tenantNotificationColumns: string[] = ['tenantName', 'percentageCompleted', 'reSend', 'analysisSurvey'];
  sendActive: boolean = false;
  dataSource: MatTableDataSource<any>;
  spinnerColor: string = "accent";
  spinnerMode: string = "determinate";

  constructor(
    private dataService: dataService,
    private modService: ModService,
    private toastr: ToastrService,
    private _router: Router,
    private tenantNotification: MatDialogRef<TenantNotificationModalComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any) { }

  ngOnInit() {
    this.loadTenant();
    this.dropDownSetting = {
      singleSelection: false,
      idField: 'id',
      textField: 'tenantName',
      itemsShowLimit: 5,
      allowSearchFilter: true
    };
    this.tenantListForSurvey = this.data.tenantList;
    this.tenantListForSurvey.forEach(tenantList => {
      this.tenantIds.push(tenantList.tenantId);
    });
    this.dataSource = new MatTableDataSource<any>(this.tenantListForSurvey);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadTenant() {
    this.modService.getTenants().subscribe(res => {
      if (res.result)
        this.tenantList = res.result;
    });
  }

  loadAllTenant() {
    this.tenantIds = [];
    this.modService.getAllTenantsForSurvey(this.data.selectSurveyId).subscribe(res => {
      if (res.result) {
        this.tenantListForSurvey = res.result;
        this.tenantListForSurvey.forEach(tenantList => {
          this.tenantIds.push(tenantList.tenantId);
        });
        this.dataSource = new MatTableDataSource<any>(this.tenantListForSurvey);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.sendActive = false;
      }
      err => {
        this.toastr.warning("Please try again later");
      }
    });
  }

  onSelectedTenant(tenantList: any) {
    this.tenantSelectedList.push(tenantList.id);
  }

  onDeselectTenant(tenantList: any) {
    this.tenantSelectedList = this.tenantSelectedList.filter(deselectTenantId => deselectTenantId !== tenantList.id);
  }

  onTenantSelectAll(tenantList: any) {
    tenantList.forEach(element => this.tenantSelectedList.push(element.id));
  }

  onTenantDeselectAll(tenantList: any) {
    this.tenantSelectedList = [];
  }

  notifyData() {
    this.sendActive = true;
    this.dataService.isLoading = true;
    if (this.tenantSelectedList.length != 0) {
      if (this.tenantIds.length >= 1) {
        this.tenantSelectedList = this.tenantSelectedList.filter((item) => {
          return !(<any>this.tenantIds).includes(item);
        });
      }
      if (this.tenantSelectedList.length) {
        var data = {
          'surveyId': this.data.selectSurveyId,
          'senderId': 0,
          'tenantIds': this.tenantSelectedList
        };
        this.modService.sendSurveyNotificationTenant(data).subscribe(res => {
          if (res.success) {
            this.toastr.success("Survey notification sent to selected tenants");
            this.dataService.isLoading = false;
            this.selectedTenant = [];
            this.loadAllTenant();
          }
        }, err => {
          this.toastr.warning("please try again later");
        });
      }
      else {
        this.dataService.isLoading = false;
        this.toastr.warning("Survey notification has already been sent to the selected tenants");
        this.sendActive = false;
        this.selectedTenant = [];
      }
    }
    else {
      this.toastr.warning("Please select the tenant name to sent");
      this.sendActive = false;
    }
  }

  reSend(tenantId: number) {
    let data = {
      'surveyId': this.data.selectSurveyId,
      'tenantId': tenantId
    };
    this.modService.reSendTenantNotification(data).subscribe(res => {
      if (res.success && this.toastr.success("Survey notification has been sent")) {
        this.tenantNotification.close();
      }
    }, err => {
      console.log(err);
    });
  }

  routeToSurveyAnalysis(tenantId: number) {
    this.tenantNotification.close();
    let routerId = btoa(`${this.data.selectSurveyId}${Constants.Seperator}${tenantId}`);
    this._router.navigate(['app/survey-analysis', routerId]);
  }
}
