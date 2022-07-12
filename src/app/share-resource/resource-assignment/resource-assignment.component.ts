import { dataService } from '@app/service/common/dataService';
import { Result } from '@app/enums/document-type';
import { Component, OnInit } from '@angular/core';
import { MatInputModule, MatFormFieldModule, MatSelectModule, MatDialog, MatDialogConfig } from '@angular/material';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { Router } from '@angular/router';
import { MenteeUploadAssignmentComponent } from '@app/dialog/mentee-upload-assignment/mentee-upload-assignment.component';
import { ShareComponent } from '../../dialog/share/share.component';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModService } from '@app/service';
import { ToastrService } from 'ngx-toastr';
import { ResourceType } from '@app/enums/resource-status';

@Component({
  selector: 'app-resource-assignment',
  templateUrl: './resource-assignment.component.html',
  styleUrls: ['./resource-assignment.component.css']
})

export class ResourceAssignmentComponent implements OnInit {
  selectedFileList: any = [];
  isValidFile: boolean = false;
  resourceAssignmentForm: FormGroup;
  resourceAssignmentFormForAssessment: FormGroup;
  skills: any[] = [];
  resourceType: any[] = [];
  addMoreRow: boolean;
  control: any[] = [];
  showFileUpload: boolean[] = [false];
  tenants: any[] = [];
  selectedTenant: number = this.dataService.currentTenentId;
  files: any[] = [];
  documents: any[] = [];
  createdResourceIds: number[] = [];
  isSuperAdmin: boolean;

  constructor(
    private router: Router,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private modService: ModService,
    private toastr: ToastrService,
    private dataService: dataService
  ) { }

  ngOnInit() {
    if (!this.dataService.currentTenentId)
      this.isSuperAdmin = true;
    this.initForm();
    this.getResourceType();
    this.getAllSkills();
    this.getTenants();
  }

  getTenants() {
    this.modService.getTenants().subscribe(res => {
      if (res.result.length) {
        this.tenants = res.result;
      }
    }, err => {
      this.toastr.error("Something went wrong try again later");
    });
  }

  getResourceType() {
    this.modService.getResourceType().subscribe(res => {
      if (res.result) {
        this.resourceType = res.result;
      }
    }, err => {
      this.toastr.error("Something went wrong try again later");
    });
  }

  getAllSkills() {
    this.modService.getAllSkill().subscribe(res => {
      if (res.result) {
        this.skills = res.result.items;
      }
    }, err => {
      this.toastr.error("Something went wrong try again later");
    });
  }

  selectedTenantName(value) {
    this.selectedTenant = value;
  }

  resourceTypeChange(resourceType, i) {
    this.showFileUpload[i] = resourceType.type == 'Assessment' ? false : true;
  }

  onFileChange(event, index) {
    if (event.target.files.length) {
      let file = event.target.files[0];
      this.documents[index] = file;
      this.toastr.success('Resource file has been selected');
    }
  }

  navigateShare() {
    this.router.navigate(["/app/share-resource/share"]);
  }
  navigateBack() {
    this.router.navigate(["/app/share-resource"]);
  }

  openShareResourcePopup() {
    const shareResource = new MatDialogConfig();
    shareResource.autoFocus = false;
    shareResource.width = '57vw';
    shareResource.height = '32vw';
    const dialogRef = this.dialog.open(ShareComponent, shareResource);
    dialogRef.componentInstance.resourceIds = this.createdResourceIds;
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.isUpdated) {
        this.dataService.isLoading = this.dataService.doneLoading();
        this.router.navigate(["/app/share-resource"]);
      }
    });
  }

  createResource() {
    let invalidFileOrUrl: boolean = false;
    if (!this.selectedTenant) {
      this.toastr.error("Invalid Tenant");
      return;
    }
    if (!this.resourceAssignmentForm.valid) {
      this.toastr.error("Please enter valid details");
      return;
    }
    this.createdResourceIds = [];
    this.resourceAssignmentForm.value.addAssignmentData.forEach((item, index) => {
      if (ResourceType[item.selectedResourceType] === "Assignment" || ResourceType[item.selectedResourceType] === "ReadingMaterial") {
        if (!this.documents[index]) {
          this.toastr.warning(`Please upload file for resource ${item.assignmentTitle}`);
          invalidFileOrUrl = true;
          return;
        }
      }
      else if (ResourceType[item.selectedResourceType] === "Assessment") {
        if (!item.assessmentUrl) {
          this.toastr.warning(`Please enter url for resource ${item.assignmentTitle}`);
          invalidFileOrUrl = true;
          return;
        }
      }
    });
    if (invalidFileOrUrl)
      return;
    this.resourceAssignmentForm.value.addAssignmentData.forEach((item, index) => {
      let resourceDetails = { 'ResourceTitle': item.assignmentTitle, 'TenantId': this.selectedTenant, 'CreatedBy': this.dataService.currentPlatformUserId, 'ResourceTypeId': item.selectedResourceType, 'ResourceUrl': item.assessmentUrl, 'SkillId': item.selectedSkills };
      const formData = new FormData();
      if (this.documents[index])
        formData.append('resourceFile', this.documents[index], this.documents[index].name);
      formData.append('UploadResourceDetails', JSON.stringify(resourceDetails));
      this.modService.createResource(formData).subscribe(res => {
        if (res.result.resourceId != null) {
          this.createdResourceIds.push(res.result.resourceId);
          this.toastr.success(res.result.message);
          if (index === this.resourceAssignmentForm.value.addAssignmentData.length - 1)
            this.openShareResourcePopup();
        }
        else
          this.toastr.error(res.result.message);
      }, err => {
        console.log(err);
      });
    });
  }

  initForm() {
    this.resourceAssignmentForm = this.formBuilder.group({
      addAssignmentData: this.formBuilder.array([
        this.initResourceForm(),
      ])
    });
  }

  initResourceForm() {
    return this.formBuilder.group({
      assignmentTitle: ['', [Validators.required]],
      selectedSkills: ['', [Validators.required]],
      selectedResourceType: ['', [Validators.required]],
      assessmentUrl: ['']
    });
  }

  get resourceControl(): FormArray {
    return this.resourceAssignmentForm.get('addAssignmentData') as FormArray;
  }

  addResouceRow() {
    this.resourceControl.push(this.initResourceForm());
    this.showFileUpload.push(false);
  }

  addButtonClick() {
    this.addMoreRow = true;
  }

  removeInput(index) {
    this.resourceControl.removeAt(index);
    this.showFileUpload.splice(index, 1);
    this.documents.splice(index, 1);
  }
}
