import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableDataSource, MatSort, MatPaginator, MatDialogConfig, MatDialog } from '@angular/material';
import { MenteeUploadAssignmentComponent } from '@app/dialog/mentee-upload-assignment/mentee-upload-assignment.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ShareComponent } from '../dialog/share/share.component';
import { DownloadDocumentComponent } from '@app/dialog/download-document/download-document.component';
import { DownloadReadingmaterialComponent } from '@app/dialog/download-readingmaterial/download-readingmaterial.component';
import { AssessmentUrlComponent } from '@app/dialog/assessment-url/assessment-url.component';
import { dataService } from "@app/service/common/dataService";
import { ModService } from '@app/service';
import { ResourceStatus } from '@app/enums/resource-status';
import { finalize } from 'rxjs/operators';
import { Constants } from '@app/models/constants';
import { ToastrService } from 'ngx-toastr';
import { ViewResourceComponent } from '@app/view-resource/view-resource.component';
import { UserRoles } from '@app/enums/user-roles';
import { environment as en } from "environments/environment";
import { ActivatedRoute } from '@angular/router';

export interface resourcesData {
  tenant: string;
  resourceId: number;
  resourceTitle: string;
  resourceType: string;
  skill: string;
  createdby: string;
  reviewer: string;
  resourceTraineeMapId: number;
  resourceShareId: number;
  resourceUrl: string;
  tenantId: number;
  // action: string;
}
export interface Material {
  resouceName: any;
  type: string;
  createdBy: string;
  createdDate: string;
  status: string;
}
export interface ReadingMaterial {
  resourceId: number;
  resourceTraineeMapId: number;
  readingMaterialtitle: any;
  skill: string;
  trainer: string;
  resourceType: string,
  sendOn: number;
  downlodedOn: string;
  documentUrl: string;
}
export interface Assignment {
  resourceId: number;
  resourceTraineeMapId: number;
  assignmentTitle: string;
  skill: string;
  trainer: string;
  dueDate: Date;
  status: string;
  documentUrl: string;
  resourceType: string,
  action: string;
}
export interface Assessnment {
  resourceId: number;
  resourceTraineeMapId: number;
  assessmentTitle: string;
  skill: string;
  trainer: string;
  dueDate: number;
  status: string;
  resourceType: string,
  noOfAttempt: number;
  documentUrl: string;
  progressJson: any
}
@Component({
  selector: 'app-share-resource',
  templateUrl: './share-resource.component.html',
  styleUrls: ['./share-resource.component.css']
})

export class ShareResourceComponent implements OnInit {
  isGlobalSearch:string;
  searchInput:string;
  seletedTabName:number;
  displayedColumnsForResourcesTab: string[] = this.dataService.currentUserType === UserRoles[1] ? ['tenant', 'resourceTitle', 'resourceType', 'skill', 'createdby', 'download', 'reviewer', 'action'] : ['resourceTitle', 'resourceType', 'skill', 'createdby', 'download', 'reviewer', 'action'];
  displayedColumnsForResourceTracking: string[] = ['resourceTitle', 'type', 'createdBy', 'createdDate', 'status'];
  displayedColumnsForResourceGlobal: string[] = ['resourceTitle', 'type', 'createdBy', 'createdDate', 'status'];
  displayedColumnsForShareResource: string[] = ['resource', 'resourceType', 'skill', 'createdby', 'download', 'reviewer', 'action'];
  displayedColumnsForTraineeReadingMaterial: string[] = ['readingMaterialTitle', 'skill', 'trainer', 'sendOn', 'downlodedOn', 'documentDownloded'];
  displayedColumnsForTraineeAssignment: string[] = ['assignmentTitle', 'skill', 'trainer', 'dueDate', 'status', 'downloadDocument', 'action'];
  displayedColumnsForAssessment: string[] = ['assessmentTitle', 'skill', 'trainer', 'completedOn', 'status', 'noOfAttempt', 'url'];
  dataSourceTable: MatTableDataSource<resourcesData>;
  dataSourceForReadingMaterial: MatTableDataSource<Material>;
  dataSourceTableForMenteeAssignment: MatTableDataSource<Assignment>;
  dataSourceTableForMenteeAssessnment: MatTableDataSource<Assessnment>;
  dataSourceTableForMenteeReadingMaterial: MatTableDataSource<ReadingMaterial>;
  testData: any[];
  materialData: any[];
  createResourceForm: FormGroup;
  assignmentForTrainee: any[];
  readingMaterialForTrainee: any[];
  assessmentForTrainee: any[];
  isSuperAdmin: boolean;
  canBeMentor: boolean;
  canBeMentee: boolean;
  tenantId: number;
  tenantList: any[] = [];
  filteredTenantList: any[] = [];
  resourceTrackDetails: any[] = [];
  resourceTrackingData: MatTableDataSource<any>;
  resourceGlobalDetails: any[] = [];
  resourceGlobalData: MatTableDataSource<any>;
  resourcesTabDetails: any[] = [];
  resourcesTabData: MatTableDataSource<any>;
  views: any[] = [
    { value: 'v-0', viewValue: 'Gopal' },
    { value: 've-1', viewValue: 'name' },
    { value: 'vew-2', viewValue: 'name' }
  ];
  skills: any[] = [
    { value: 'c-0', viewValue: 'C#' },
    { value: 'java-1', viewValue: '.NET' },
    { value: 'net-2', viewValue: 'JAVA' }
  ];
  creats: any[] = [
    { value: 'cr-0', viewValue: 'Dhinesh' },
    { value: 'crt-1', viewValue: 'name' },
    { value: 'creat-2', viewValue: 'name' }
  ];
  commonString: string;
  userId: number;
  traineeResourceList = [];
  resourceType: any = [];
  resourceTypeId: number;
  tabLable: string = "";
  resourceShareId: number = 0;
  resources = Constants.Resources;
  trackResources = Constants.TrackResources;
  Assignments = Constants.Assignmnet;
  Assessment = Constants.Assessment;
  ReadingMaterial = Constants.ReadingMaterial;
  isTrainee: boolean = false;
  rolePermissions: any[] = [];
  createPermission: boolean;
  readAllPermission: boolean = false;
  updatePermission: boolean;
  deletePermission: boolean;
  approvePermission: boolean;
  Code: string = "RESOURCESHARING";
  skillList = [];
  tenantsList: any = [];
  selectedTenantId: number = 0;
  selectedSkillId: number = 0;
  selectedCreatedBy: number = 0;
  selectedreviewer: number = 0;
  currentTenantId: number = 0;
  createdByList = [];
  reviewerList = [];

  @ViewChild('resourceGlobalSort') resourceGlobalSort: MatSort;
  @ViewChild('resourceGlobalPaginator') resourceGlobalPaginator: MatPaginator;
  @ViewChild('resourceTrackingSort') resourceTrackingSort: MatSort;
  @ViewChild('resourceTrackingPaginator') resourceTrackingPaginator: MatPaginator;
  @ViewChild('assignmentPaginator') assignmentPaginator: MatPaginator;
  @ViewChild('assessmentPaginator') assessmentPaginator: MatPaginator;
  @ViewChild('readingMaterialPaginator') readingMaterialPaginator: MatPaginator;
  @ViewChild('resourcesTabSort') resourcesTabSort: MatSort;
  @ViewChild('resourcesTabPaginator') resourcesTabPaginator: MatPaginator;
  @ViewChild('assignmentSort') assignmentSort: MatSort;
  @ViewChild('assessmentSort') assessmentSort: MatSort;
  @ViewChild('readingMateralSort') readingMaterialSort: MatSort;
  @ViewChild(MatSort) sort: MatSort;

  constructor(public dialog: MatDialog,
    private router: Router,
    private formBuilder: FormBuilder,
    private dataService: dataService,
    private modService: ModService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    //for global search
    this.route.queryParams.subscribe(params => {
      this.isGlobalSearch = params['globalSearch'];
      this.searchInput=params['name'];
    });
    if(this.isGlobalSearch=="true" && this.searchInput!=="Resource")
    {
      this.loadGlobalSearchDetails();
    }
    this.inItFormForResource();
    this.dataService.pageName = "Resource Sharing";
    this.userId = this.dataService.currentPlatformUserId;
    this.isSuperAdmin = this.dataService.isSuperAdmin;
    this.getPermissions();
    this.getAllSkills();
    this.dataService.isLoading = true;
    this.modService.getResourceTypes()
      .pipe(
        finalize(() => { this.dataService.isLoading = this.dataService.doneLoading(); })
      )
      .subscribe(res => {
        if (res.result) {
          this.resourceType = res.result;
          if (this.isSuperAdmin) {
            this.getAllTenants();
          }
          else {
            this.tenantId = this.currentTenantId = this.dataService.currentTenentId;
            this.canBeMentor = this.dataService.canBeMentor;
            this.canBeMentee = this.dataService.canBeMentee;
            this.getAllResources();
            this.getTrackResourceDetails(this.tenantId);
            this.getCreatedBy();
            this.getReviewer();
          }

        }
        else
          this.toastr.error("Something went wrong, Please contact admin");
      });
  }

  inItFormForResource() {
    this.createResourceForm = this.formBuilder.group({
      tenant: ['', [Validators.required]],
      skill: [''],
      createdBy: [''],
      reviewer: ['']
    });
  }

  getResourceTypes() {
    this.modService.getResourceTypes()
      .subscribe(res => {
        if (res.result)
          this.resourceType = res.result;
        else
          this.toastr.error("Something went wrong, Please contact admin");
      });
  }

  getAllSkills() {
    this.modService.getAllSkill()
      .subscribe(res => {
        if (res.result) {
          this.skillList = res.result.items;
        }
      });
  }

  getPermissions() {
    if (this.isSuperAdmin) {
      this.createPermission = this.readAllPermission = true;
    }
    else {
      this.rolePermissions = this.dataService.rolePermissions;
      let permissions = this.rolePermissions.find(val => val.feature.featureCode === this.Code);

      if (permissions) {
        this.createPermission = permissions.create;
        this.readAllPermission = permissions.readAll;
      }
      else {
        this.createPermission = false;
        this.readAllPermission = false;
      }
    }
  }

  getCreatedBy(value = 0) {
    let tenantId = this.isSuperAdmin ? this.selectedTenantId : this.currentTenantId;
    this.modService.getCreatedBy(tenantId, this.userId, this.readAllPermission)
      .subscribe(res => {
        if (res.result) {
          this.createdByList = res.result;
        }
        else {
          this.toastr.error("No records found");
        }
      }, err => { });
  }

  getReviewer() {
    let tenantId = this.isSuperAdmin ? this.selectedTenantId : this.currentTenantId;
    this.modService.getReviewer(tenantId, this.userId, this.readAllPermission)
      .subscribe(res => {
        if (res.result) {
          this.reviewerList = res.result;
        }
        else {
          this.toastr.error("No records found");
        }
      }, err => { });
  }

  getAllResources() {
    this.resourcesTabDetails = [];
    this.resourcesTabData = new MatTableDataSource<any>();
    let tenantId = this.isSuperAdmin ? this.selectedTenantId : this.currentTenantId;
    if (this.isSuperAdmin && tenantId == 0) {
      this.toastr.warning("Please Select Tenant");
      return;
    }
    this.dataService.isLoading = true;
    let createdById = !this.isSuperAdmin && !this.readAllPermission ? this.userId : this.selectedCreatedBy;

    this.modService.getAllResources(tenantId, this.selectedSkillId, createdById, this.selectedreviewer).pipe(
      finalize(() => { this.dataService.isLoading = this.dataService.doneLoading(); })
    ).subscribe(res => {
      if (res.result) {
        let resourcesRecords: resourcesData[] = [];
        res.result.forEach(element => {
          let type = this.resourceType.find(x => x.id == element.resourceTypeId).type;
          if (element.resourceSharedDetails == null || element.resourceSharedDetails.length == 0) {
            let resource: resourcesData = {
              tenant: element.tenant.tenantName,
              resourceId: element.id,
              resourceTitle: element.resourceTitle,
              resourceType: type,
              skill: element.skillName,
              createdby: element.createdByUserDetail.name,
              reviewer: "-",
              resourceTraineeMapId: 0,
              resourceShareId: 0,
              resourceUrl: element.resourceUrl,
              tenantId: element.tenant.id
            }
            resourcesRecords.push(resource);
          }
          else {
            element.resourceSharedDetails.forEach(share => {
              let resource: resourcesData = {
                tenant: element.tenant.tenantName,
                resourceId: element.id,
                resourceTitle: element.resourceTitle,
                resourceType: type,
                skill: element.skillName,
                createdby: element.createdByUserDetail.name,
                reviewer: share.reviewer.email,
                resourceTraineeMapId: 0,
                resourceShareId: share.resourceShare.id,
                resourceUrl: element.resourceUrl,
                tenantId: element.tenant.id
              }
              resourcesRecords.push(resource);
            });
          }
        });
        this.resourcesTabDetails = resourcesRecords;
        this.resourcesTabData = new MatTableDataSource<any>(this.resourcesTabDetails);
        this.resourcesTabData.paginator = this.resourcesTabPaginator;
        this.resourcesTabData.sortingDataAccessor = (data, sortHeaderId) => data[sortHeaderId] ? data[sortHeaderId].toLocaleLowerCase() : '';
        this.resourcesTabData.sort = this.resourcesTabSort;
      }
      else {
        this.toastr.error("No Resources found");
      }
    },
      error => console.error(error));
  }

  openAssessmentUrl(element: any) {
    var customArgs: any = { messagingQueueUrl: en['azureFunctionEndPoint'], sectionModuleInstanceId: element.resourceTraineeMapId };
    var data = JSON.stringify(customArgs);
    var form = document.createElement("form");
    form.setAttribute("method", "post");
    form.setAttribute("action", element.documentUrl);

    form.setAttribute("target", "view");

    var hiddenField = document.createElement("input");
    hiddenField.setAttribute("type", "hidden");
    hiddenField.setAttribute("name", "customArgs");
    hiddenField.setAttribute("value", data);
    form.appendChild(hiddenField);
    document.body.appendChild(form);

    window.open('', 'view');

    form.submit();
  }

  openViewResourceShareDetails(resource: any) {
    let resourceTypeId = this.resourceType.find(x => x.type == resource.resourceType).id;
    this.router.navigate(['/app/view-resource'], { queryParams: { resourceShareId: btoa(resource.resourceShareId), resourceTypeId: btoa(resourceTypeId), resourceType: btoa(resource.resourceType), tenantId: btoa(resource.tenantId) } });
  }

  openShareResourcePopup(resourceId: number) {
    let resourceIds: number[] = [];
    resourceIds.push(resourceId);
    const shareResource = new MatDialogConfig();
    shareResource.autoFocus = false;
    shareResource.width = '57vw';
    shareResource.height = '32vw';
    const dialogRef = this.dialog.open(ShareComponent, shareResource);
    dialogRef.componentInstance.resourceIds = resourceIds;
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.isUpdated) {
        this.dataService.isLoading = this.dataService.doneLoading();
        this.getAllResources();
      }
    });

  }

  getTrackResourceDetails(tenantId: number) {
    this.dataService.isLoading = true;
    this.modService.getTrackResourceDetails(tenantId).pipe(
      finalize(() => { this.dataService.isLoading = this.dataService.doneLoading(); })
    ).subscribe(res => {
      if (res.result) {
        this.resourceTrackDetails = res.result.map(x => {
          new Date(`${x.startDate}.000Z`);
          x.type = this.resourceType.find(y => y.id == x.resourceTypeId).type;
          x.status = x.isShared ? 'Shared' : 'Not-Shared';
          return x;
        });
        this.resourceTrackingData = new MatTableDataSource<any>(this.resourceTrackDetails);
        this.resourceTrackingData.paginator = this.resourceTrackingPaginator;
        this.resourceTrackingData.sortingDataAccessor = (data, sortHeaderId) => data[sortHeaderId] ? data[sortHeaderId].toLocaleLowerCase() : '';
        this.resourceTrackingData.sort = this.resourceTrackingSort;
      }
    }, err => { });
  }

  getAllTenants() {
    this.modService.getTenants().subscribe(res => {
      if (res.result) {
        this.tenantList = res.result;
        this.filteredTenantList = this.tenantList;
      }
    }, err => { });
  }

  resetFilter() {
    this.resourcesTabDetails = [];
    this.resourcesTabData = new MatTableDataSource<any>();
    this.createResourceForm.reset();
    this.selectedCreatedBy = 0;
    this.selectedSkillId = 0;
    this.selectedTenantId = 0;
    this.selectedreviewer = 0;
    if (!this.isSuperAdmin)
      this.getAllResources();
  }

  search(query: string): void {
    this.filteredTenantList = this.performFilter(query, this.tenantList, 'tenantName');
  }

  performFilter(query: string, filterArray: string[], filterBy: string): string[] {
    query = query.toLocaleLowerCase();
    return filterArray.filter(value => value[filterBy].toLocaleLowerCase().indexOf(query) !== -1);
  }

  uploadAssignment(resource) {
    if (resource.status === ResourceStatus[3]) {
      this.toastr.warning("Assignment is being reviewed");
      return;
    }
    else if (resource.status === ResourceStatus[4] || resource.status === ResourceStatus[5]) {
      this.toastr.warning("Assignment was reviewed already");
      return;
    }
    else {
      const UploadAssignmentDialog = this.dialog.open(MenteeUploadAssignmentComponent, {
        data: {
          assignmentAssigneeMappingId: resource.resourceTraineeMapId,
          assignmentTitle: resource.assignmentTitle,
          trainer: resource.trainer
        }
      });
      UploadAssignmentDialog.afterClosed().subscribe(result => {
        if (result && result.isUpdated) {
          this.dataService.isLoading = this.dataService.doneLoading();
          this.toastr.success("Assignment submitted successfully");
          this.getAllResourceForTrainee();
        }
      });
    }
  }

  navigateRosource() {
    if (this.createPermission) {
      this.router.navigate(["/app/share-resource/resource-assignment"]);
    }
    else {
      this.toastr.error("You do not have the permission to perform this action");
      return;
    }
  }

  shareResourcePage() {
    const shareResource = new MatDialogConfig();
    shareResource.autoFocus = false;
    shareResource.width = '68vw';
    shareResource.height = '32vw';
    const dialogRef = this.dialog.open(ShareComponent, shareResource);
  }

  showAssessmentUrl() {
    const assessmentUrl = new MatDialogConfig();
    assessmentUrl.autoFocus = false;
    assessmentUrl.width = '68vw';
    assessmentUrl.height = '12vw';
    const dialogRef = this.dialog.open(AssessmentUrlComponent, assessmentUrl);
  }

  downloadResource(resource: any) {
    this.dataService.isLoading = true;
    if (resource.resourceType !== "")
      this.resourceTypeId = this.resourceType.find(x => x.type === resource.resourceType).id;
    this.modService.getBlobDownloadURL(resource.resourceId, resource.resourceTraineeMapId, this.resourceTypeId, this.userId).pipe(
      finalize(() => { this.dataService.isLoading = this.dataService.doneLoading(); })
    ).subscribe(res => {
      if (res.result) {
        window.location.href = res.result;
        this.toastr.success("Document downloaded sucessfully");
        this.getAllResourceForTrainee();
      }
      else
        this.toastr.warning("No Document found");
    });
  }

  // openAssessment(URL: string) {
  //   window.open(URL, "_blank");
  // }

  downloadReadingMaterial() {

  }

  getAllResourceForTrainee() {
    this.dataService.isLoading = true;
    this.modService.getResourceShareStatusDetails(this.userId, this.tenantId, this.resourceTypeId, this.resourceShareId, this.readAllPermission).pipe(
      finalize(() => { this.dataService.isLoading = this.dataService.doneLoading(); })
    ).subscribe(res => {
      if (res.result) {
        let resourceList = [];
        if (this.tabLable == Constants.Assignmnet) {
          resourceList = res.result;
          this.getAssignmentList(resourceList);
        }
        if (this.tabLable == Constants.Assessment) {
          resourceList = res.result;
          this.getAssessmentList(resourceList);
        }
        if (this.tabLable == Constants.ReadingMaterial) {
          resourceList = res.result;
          this.getReadingMaterial(resourceList);
        }
      }
    });
  }

  getAssignmentList(assignmentList: any) {
    let traineeAssignmentList = [];
    assignmentList.forEach(resource => {
      let traineeAssignment: Assignment = {
        resourceId: resource.resourceDetails.id,
        resourceTraineeMapId: resource.traineeResourceDetails.id,
        assignmentTitle: resource.resourceDetails.resourceTitle,
        skill: resource.skill,
        trainer: resource.trainer,
        dueDate: resource.dueDate,
        resourceType: "",
        status: ResourceStatus[resource.traineeResourceDetails.status],
        documentUrl: resource.resourceDetails.resourceUrl,
        action: ""
      }
      traineeAssignmentList.push(traineeAssignment);
    });
    this.dataSourceTableForMenteeAssignment = new MatTableDataSource<Assignment>(traineeAssignmentList);
    this.dataSourceTableForMenteeAssignment.paginator = this.assignmentPaginator;
    this.dataSourceTableForMenteeAssignment.sortingDataAccessor = (data, sortHeaderId) => data[sortHeaderId] ? data[sortHeaderId].toLocaleLowerCase() : '';
    this.dataSourceTableForMenteeAssignment.sort = this.assignmentSort;
  }

  getAssessmentList(assessmentList: any) {
    let traineeAssessmentList = [];
    assessmentList.forEach(resource => {
      let traineeAssignment: Assessnment = {
        resourceId: resource.resourceDetails.id,
        resourceTraineeMapId: resource.traineeResourceDetails.id,
        assessmentTitle: resource.resourceDetails.resourceTitle,
        skill: resource.skill,
        trainer: resource.trainer,
        dueDate: resource.dueDate,
        resourceType: "",
        status: ResourceStatus[resource.traineeResourceDetails.status],
        documentUrl: resource.resourceDetails.resourceUrl,
        noOfAttempt: 0,
        progressJson: JSON.parse(resource.traineeResourceDetails.progressJson)
      }
      traineeAssessmentList.push(traineeAssignment);
    });
    this.dataSourceTableForMenteeAssessnment = new MatTableDataSource<Assessnment>(traineeAssessmentList);
    this.dataSourceTableForMenteeAssessnment.paginator = this.assessmentPaginator;
    this.dataSourceTableForMenteeAssessnment.sortingDataAccessor = (data, sortHeaderId) => data[sortHeaderId] ? data[sortHeaderId].toLocaleLowerCase() : '';
    this.dataSourceTableForMenteeAssessnment.sort = this.assessmentSort;
  }

  getReadingMaterial(readingMaterialList: any) {
    let traineeReadingMaterialList = [];
    readingMaterialList.forEach(resource => {
      let traineeAssignment: ReadingMaterial = {
        resourceId: resource.resourceDetails.id,
        resourceTraineeMapId: resource.traineeResourceDetails.id,
        readingMaterialtitle: resource.resourceDetails.resourceTitle,
        skill: resource.skill,
        trainer: resource.trainer,
        resourceType: "",
        sendOn: resource.traineeResourceDetails.sendOn,
        downlodedOn: resource.traineeResourceDetails.downlodedOn,
        documentUrl: resource.resourceDetails.resourceUrl,
      }
      traineeReadingMaterialList.push(traineeAssignment);
    });
    this.dataSourceTableForMenteeReadingMaterial = new MatTableDataSource<ReadingMaterial>(traineeReadingMaterialList);
    this.dataSourceTableForMenteeReadingMaterial.paginator = this.readingMaterialPaginator;
    this.dataSourceTableForMenteeReadingMaterial.sortingDataAccessor = (data, sortHeaderId) => data[sortHeaderId] ? data[sortHeaderId].toLocaleLowerCase() : '';
    this.dataSourceTableForMenteeReadingMaterial.sort = this.assessmentSort;
  }

  tabClicked(event) {
    this.tabLable = event.tab.textLabel;
    if (this.tabLable == Constants.Assignmnet) {
      this.resourceTypeId = this.resourceType.find(x => x.type == Constants.Assignmnet).id;
      this.dataSourceTableForMenteeReadingMaterial = new MatTableDataSource<ReadingMaterial>([]);
      this.dataSourceTableForMenteeAssessnment = new MatTableDataSource<Assessnment>([]);
      this.getAllResourceForTrainee();
    }
    if (this.tabLable == Constants.Assessment) {
      this.resourceTypeId = this.resourceType.find(x => x.type == Constants.Assessment).id;
      this.dataSourceTableForMenteeReadingMaterial = new MatTableDataSource<ReadingMaterial>([]);
      this.dataSourceTableForMenteeAssignment = new MatTableDataSource<Assignment>([]);
      this.getAllResourceForTrainee();
    }
    if (this.tabLable == Constants.ReadingMaterial) {
      this.resourceTypeId = this.resourceType.find(x => x.type == Constants.ReadingMaterial).id;
      this.dataSourceTableForMenteeAssignment = new MatTableDataSource<Assignment>([]);
      this.dataSourceTableForMenteeAssessnment = new MatTableDataSource<Assessnment>([]);
      this.getAllResourceForTrainee();
    }
  }
  
  //for global search
  loadGlobalSearchDetails(){
    this.seletedTabName=1;
     this.dataService.isLoading = true;
    this.modService.getGlobalResource(this.currentTenantId,this.searchInput).pipe(
      finalize(() => { this.dataService.isLoading = this.dataService.doneLoading(); })
    ).subscribe(res => {
      if (res.result) {
        this.resourceTrackDetails = res.result.map(x => {
          new Date(`${x.startDate}.000Z`);
          x.type = this.resourceType.find(y => y.id == x.resourceTypeId).type;
          x.status = x.isShared ? 'Shared' : 'Not-Shared';
          return x;
        });
        this.resourceTrackingData = new MatTableDataSource<any>(this.resourceTrackDetails);
        this.resourceTrackingData.paginator = this.resourceTrackingPaginator;
        this.resourceTrackingData.sortingDataAccessor = (data, sortHeaderId) => data[sortHeaderId] ? data[sortHeaderId].toLocaleLowerCase() : '';
        this.resourceTrackingData.sort = this.resourceTrackingSort;
      }
    }, err => { });
  }
}
