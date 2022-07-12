import { Component, OnInit, ViewChild, Injector } from '@angular/core';
import { ModService } from '@app/service';
import { Router } from '@angular/router';
import { dataService } from "@app/service/common/dataService";
import { ToastrService } from 'ngx-toastr';
import { MatPaginator, MatSort, MatTableDataSource } from "@angular/material";
import { AppSessionService } from '@shared/session/app-session.service';
import { AppComponentBase } from "@shared/app-component-base";
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { MatDialog } from '@angular/material/dialog';
import { TenantNotificationModalComponent } from './tenant-notification-modal/tenant-notification-modal.component';
import { Constants } from '@app/models/constants';
import { UserRoles } from '@app/enums/user-roles';
import { SurveyNameDialogComponent } from '@app/survey-creator/survey-name-dialog/survey-name-dialog.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-survey-list',
  templateUrl: './survey-list.component.html',
  styleUrls: ['./survey-list.component.css']
})
export class SurveyListComponent extends AppComponentBase implements OnInit {
  isGlobalSearch:string;
  searchInput:string;

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource: MatTableDataSource<any>;
  surveyDisplayedColumns: string[] = ['surveyName', 'surveycompletionpersent', 'edit', 'notifySurvey', 'analysisSurvey'];
  surveyLists: any[] = [];
  surveyJson: string = "";
  Code: string = "POLSUR";
  createPermission: boolean;
  updatePermission: boolean;
  deletePermission: boolean;
  tenantNotify: boolean = false;
  rolePermissions: any[] = [];
  tenantList: any[] = [];
  tenantSelectedList: number[] = [];
  loadComponent: any;
  spinnerColor: string = "accent";
  spinnerMode: string = "determinate";
  dropDownSetting: IDropdownSettings = {};
  selectedTenant = [];
  sendSurveyId: number;
  tenantListForSurvey: any[] = [];
  userId = this.appSession.user.id;

  constructor(
    injector: Injector,
    private dataService: dataService,
    private modService: ModService,
    private toastr: ToastrService,
    private _router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,
  ) {
    super(injector);
  }

  ngOnInit() {
    //for global search
    this.route.queryParams.subscribe(params => {
      this.isGlobalSearch = params['globalSearch'];
      this.searchInput=params['name'];
    });
    this.dataService.isLoading = true;
    this.dataService.pageName = 'Surveys';
    this.loadAllSurvey();
    this.getPermissions();
    this.getAllTenants();
    this.dropDownSetting = {
      singleSelection: false,
      idField: 'id',
      textField: 'tenantName',
      itemsShowLimit: 5,
      allowSearchFilter: true
    };
  }

  getAllTenants() {
    this.modService.getTenants().subscribe(res => {
      if (res.result)
        this.tenantList = res.result;
    }, err => { });
  }

  loadAllSurvey() {
    if(this.isGlobalSearch=="true"&& this.searchInput!=="Survey")
    {
      this.loadGlobalSurvey();
    }
    else{
      this.modService.getAllSurveyList(this.userId).subscribe(res => {
        this.dataService.isLoading = false;
        if (res.result) {
          this.surveyLists = res.result;
          this.dataSource = new MatTableDataSource<any>(this.surveyLists);
          this.paginator.firstPage();
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        } err => {
          console.log(err);
        }
      });
    }
  }

  getUpdateSurveyId(surveyId: number) {
    this.modService.getSurveyId(surveyId).subscribe(res => {
      this.surveyJson = res.result.questionJson;
    });
  }

  getPermissions() {
    if (this.dataService.isSuperAdmin) {
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

  routeToSurveyCreator(id: any) {
    if (id == 0) {
      if (this.createPermission) {
        let surveyNameDialog = this.dialog.open(SurveyNameDialogComponent, {
          width: '60vw'
        });
      }
      else {
        this.toastr.warning("You don't have permission to create survey");
      }
    }
    else {
      if (this.updatePermission) {
        let routerId = btoa(id);
        this._router.navigate(['app/survey-creator', routerId]);
      }
      else {
        this.toastr.warning("You don't have permission to update survey");
      }
    }
  }

  sendNotification(surveyId: number) {
    if (this.userId == UserRoles.SUPERADMIN) {
      this.modService.getAllTenantsForSurvey(surveyId).subscribe(res => {
        if (res.result) {
          this.tenantListForSurvey = res.result;
          let tenantNotification = this.dialog.open(TenantNotificationModalComponent, {
            width: '60vw',
            data: {
              selectSurveyId: surveyId,
              tenantList: this.tenantListForSurvey
            }
          });
        } err => {
          console.log(err);
        }
      });
    }
    else {
      var data = {
        'surveyId': surveyId,
        'senderId': this.userId,
        'tenantIds': this.tenantSelectedList
      };
      this.modService.sendSurveyNotificationTenant(data).subscribe(res => {
        if (res.success) {
          this.toastr.success("Survey notification has been sent");
        }
      }, err => {
        console.log(err);
      });
    }
  }

  routeToSurveyAnalysis(surveyId: number) {
    let tenantId = 0;
    let routerId = btoa(`${surveyId}${Constants.Seperator}${tenantId}`);
    this._router.navigate(['app/survey-analysis', routerId]);
  }

  //global search
  loadGlobalSurvey() {
    this.modService.getGlobalServey(this.searchInput).subscribe(res => {
      this.dataService.isLoading = false;
      if (res.result) {
        this.surveyLists = res.result;
        this.dataSource = new MatTableDataSource<any>(this.surveyLists);
        this.paginator.firstPage();
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      } err => {
        console.log(err);
      }
    });
  }
}