import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource, MatSort, MatPaginator, MatDialogConfig, MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { AssessmentUrlComponent } from '@app/dialog/assessment-url/assessment-url.component';
import { ModService } from '@app/service';
import { ResourceUploadComponent } from './resource-upload/resource-upload.component';
import { dataService } from '@app/service/common/dataService';
import { ResourceStatus } from '@app/enums/resource-status';
import { ToastrService } from 'ngx-toastr';
export interface Reading {
  title: any;
  trainee: string;
  date: number;
  downloded: string;
  documentDownloded: number;
}
export interface Assignment {
  resource: any;
  train: string;
  date: number;
  createdby: string;
  reviewer: number;
  action: string;
}
export interface Assegnment {
  resource: any;
  train: string;
  date: number;
  status: string;
  noOfAttempt: number;
  url: string;
}
export interface Trainer {
  titleName: any;
  trainName: string;
  dates: number;
  due: number;
  actions: string;
}
@Component({
  selector: 'app-view-resource',
  templateUrl: './view-resource.component.html',
  styleUrls: ['./view-resource.component.css']
})

export class ViewResourceComponent implements OnInit {
  viewResourceForm: FormGroup;
  resourceTypeId: number;
  resourceShareId: number;
  resourceStatus: any = ResourceStatus;
  displayedColumnsForReadingMaterial: string[] = ['title', 'trainee', 'date', 'downloded'];
  displayedColumnsForAssignment: string[] = ['resource', 'train', 'date', 'createdby', 'reviewer', 'action'];
  displayedColumnsForAssegment: string[] = ['resource', 'train', 'date', 'status', 'noOfAttempt', 'url'];
  dataSourceForReadingMaterialTable: MatTableDataSource<Reading>;
  dataSourceForAssignmentTable: MatTableDataSource<Assignment>;
  dataSourceForAssesmentTable: MatTableDataSource<Assegnment>;
  dataSourceForVeiwResource: MatTableDataSource<Trainer>;
  testData: any[];
  traineeData: any[];
  sideNav: boolean = false;
  routeSub: any;
  commonString: string;
  readingMaterial: any[];
  assignMentData: any[];
  assesMent: any[];
  readingMaterialFlag: boolean;
  assignMentFlag: boolean;
  assegmentFlag: boolean;
  resourceType: string;
  resourceTenantId: number;
  readAllPermission: boolean;
  rolePermissions: any[] = [];
  resourceSharedDetails: any[] = [];
  code: string = "RESOURCESHARING";
  status: any[] = [
    { value: 'c-0', viewValue: 'pass' },
    { value: 'java-1', viewValue: 'fail' },
  ];

  @ViewChild('assesmentSort') assesmentSort: MatSort;
  @ViewChild('assesmentPaginator') assesmentPaginator: MatPaginator;
  @ViewChild('assignmentSort') assignmentSort: MatSort;
  @ViewChild('assignmentPaginator') assignmentPaginator: MatPaginator;
  @ViewChild('readingMaterialSort') readingMaterialSort: MatSort;
  @ViewChild('readingMaterialPaginator') readingMaterialPaginator: MatPaginator;

  constructor(
    private router: Router,
    private activeatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private modService: ModService,
    private dataService: dataService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.getPermissions();
    this.routeSub = this.activeatedRoute.queryParams.subscribe(params => {
      this.resourceShareId = params['resourceShareId'] ? parseInt(atob(params['resourceShareId'])) : 0;
      this.resourceTypeId = params['resourceTypeId'] ? parseInt(atob(params['resourceTypeId'])) : 0;
      this.resourceTenantId = params['tenantId'] ? parseInt(atob(params['tenantId'])) : 0;
      this.resourceType = params['resourceType'] ? atob(params['resourceType']).toLowerCase() : '';
    });
    this.showResourceSharedDetails(0, this.resourceTenantId, this.resourceTypeId, this.resourceShareId, this.readAllPermission);
  }

  get skill() {
    if (this.resourceSharedDetails.length)
      return this.resourceSharedDetails[0].skill;
    return '';
  }

  showResourceSharedDetails(traineeId, resourceTenantId, resourceTypeId, resourceShareId, isReadAllPermission) {
    this.modService.getResourceShareStatusDetails(traineeId, resourceTenantId, resourceTypeId, resourceShareId, isReadAllPermission).subscribe(res => {
      if (res.result && res.result.length) {
        this.resourceSharedDetails = res.result;
        this.loadResources(res.result);
      }
    }, err => { });
  }

  loadResources(data: any) {
    if (this.resourceType === "reading material") {
      this.readingMaterialFlag = true;
      this.assegmentFlag = false;
      this.assignMentFlag = false;
      this.readingMaterial = data;
      this.dataSourceForReadingMaterialTable = new MatTableDataSource<Reading>(this.readingMaterial);
    }

    if (this.resourceType === "assignment") {
      this.assignMentFlag = true;
      this.readingMaterialFlag = false
      this.assegmentFlag = false;
      this.assignMentData = data;
      this.dataSourceForAssignmentTable = new MatTableDataSource<Assignment>(this.assignMentData);
    }

    if (this.resourceType === "assessment") {
      this.assegmentFlag = true;
      this.assignMentFlag = false;
      this.readingMaterialFlag = false;
      this.assesMent = data.map(x => {
        x.traineeResourceDetails.progressJson = JSON.parse(x.traineeResourceDetails.progressJson);
        return x;
      });
      this.dataSourceForAssesmentTable = new MatTableDataSource<Assegnment>(this.assesMent);
    }
  }

  navigateUpload() {
    this.router.navigate(["/app/view-resource/resource-upload"]);
  }
  navigateBack() {
    this.router.navigate(["/app/share-resource"]);
  }

  getPermissions() {
    if (this.dataService.isSuperAdmin) {
      this.readAllPermission = true;
    }
    else {
      this.rolePermissions = this.dataService.rolePermissions;
      let permissions = this.rolePermissions.find(val => val.feature.featureCode === this.code);
      if (permissions) {
        this.readAllPermission = permissions.readAll;
      }
      else {
        this.readAllPermission = false;
      }
    }
  }

  reviewPage(data) {
    if (ResourceStatus[data.traineeResourceDetails.status] === ResourceStatus[1] || ResourceStatus[data.traineeResourceDetails.status] == ResourceStatus[2])
      this.toastr.warning("Resource not yet submitted");
    else if (ResourceStatus[data.traineeResourceDetails.status] === ResourceStatus[4] || ResourceStatus[data.traineeResourceDetails.status] == ResourceStatus[5])
      this.toastr.warning("Resource already evaluated");
    else {
      const resourceSharing = new MatDialogConfig();
      resourceSharing.autoFocus = false;
      resourceSharing.width = '52vw';
      resourceSharing.height = '32vw';
      const dialogRef = this.dialog.open(ResourceUploadComponent, resourceSharing);
      dialogRef.componentInstance.reviewDetails = data;
    }
  }

  showAssessmentUrl(url: string) {
    const assessmentDialog = new MatDialogConfig();
    assessmentDialog.autoFocus = false;
    assessmentDialog.width = '68vw';
    assessmentDialog.height = '12vw';
    const dialogRef = this.dialog.open(AssessmentUrlComponent, assessmentDialog);
    dialogRef.componentInstance.assessmentUrl = url;
  }
}