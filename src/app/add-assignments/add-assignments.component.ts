import { Component, OnInit, Injector, ViewChild, ElementRef } from '@angular/core';
import { dataService } from '@app/service/common/dataService';
import { MatPaginator, MatSort, MatTableDataSource } from "@angular/material";
import { ToastrService } from 'ngx-toastr';
import { ModService } from '@app/service';
import { UserRoles } from '@app/enums/user-roles';
import { DocumentFileType } from '@app/enums/document-type';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ViewAssignmentDocumentComponent } from "../view-assignment-document/view-assignment-document.component";
import { DeleteAssignmentComponent } from '../dialog/delete-assignment/delete-assignment.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { WhiteSpaceValidators } from '@shared/validators/whitespace.validator';
import { Observable } from 'rxjs';

export interface Assignment {
  tenantName: string;
  title: string;
  skills: string;
  createdDate: string;
  modifiedDate: string;
  documents: any;
  actions: string;
}

export interface PreviewDocs {
  document: string;
  documentName: number;
}

@Component({
  selector: 'app-add-assignments',
  templateUrl: './add-assignments.component.html',
  styleUrls: ['./add-assignments.component.css']
})

export class AddAssignmentsComponent implements OnInit {
  isNewAssignment: boolean = false;
  dataSource: MatTableDataSource<Assignment>;
  assignmentList: Assignment[];
  createPermission: boolean;
  updatePermission: boolean;
  deletePermission: boolean;
  rolePermissions: any[] = [];
  Code: string = "ASSIGN";
  showNoAssignments: boolean = false;
  showDelete: boolean = false;
  showEdit: boolean = false;
  showPreviewDocuments: boolean = false;
  totalFiles: number = 0;
  totalResources: number = 0;
  editAssignmentId: number;
  deleteAssignmentId: number;
  createdDate: Date;
  currentUserType: string;
  isDocumentsAvailble: boolean;
  previewAssignmentTitle: string;
  updateDocuments: any[];
  updateResources: any[];
  documentDeleteFromBlob: any = [];
  documents: any[];
  documentNames: any = [];
  resourses: any[];
  resourseNames: any = [];
  isDocumentsDeleted: boolean;
  assignmentForm: FormGroup;
  userRoles = UserRoles;
  selectedTenantName: string;
  titleSearchText: string = "";
  tenantsList: any[] = [];
  filterAssignments: any[] = [];
  filterAssignmentsObservable: Observable<any>;
  documentFileType = DocumentFileType;
  isPending: boolean = false;
  displayedColumns: string[] = this.dataService.currentUserType !== UserRoles[1] ? ['title', 'skill', 'create', 'modify', 'attachments', 'actions'] : ['tenantName','title', 'skill', 'create', 'modify', 'attachments'];
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild("title") title: ElementRef;

  constructor(
    private dataService: dataService,
    public dialog: MatDialog,
    injector: Injector,
    private toastrService: ToastrService,
    private modService: ModService,
    private formBuilder: FormBuilder
  ) {
  }

  ngOnInit() {
    this.initAssignmentForm();
    this.getPermissions();
    this.dataService.pageName = 'Assignments';
    this.dataService.isLoading = true;
    this.currentUserType = this.dataService.currentUserType;
    if (this.currentUserType === UserRoles['1']) {
      this.getAllTenants();
      this.modService.GetAllAssignmentsForAdmin().subscribe(res => {
        this.assignmentList = res.result ? res.result : [];
        this.onload();
        this.dataService.isLoading = this.dataService.doneLoading();
        this.showNoAssignments = !this.assignmentList.length;
      });
    }
    else {
      this.modService.GetAllAssignmentForUser(this.dataService.currentUserId).subscribe(res => {
        this.assignmentList = res.result ? res.result : [];
        this.dataService.isLoading = this.dataService.doneLoading();
        this.showNoAssignments = !this.assignmentList.length;
        this.onload();
      });
    }
  }

  addNewAssignment() {
    if (this.createPermission) {
      this.isNewAssignment = !this.isNewAssignment;
      this.documents = [];
      this.documentNames = [];
      this.resourses = [];
      this.resourseNames = [];
      this.documentDeleteFromBlob = [];
      this.totalFiles = this.totalResources = 0;
      this.isPending = false;
      this.assignmentForm.reset();
    }
    else {
      this.toastrService.warning("You don't have permission to create an assignment");
    }
  }

  viewDocuments(asignment: any, documentType: string): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = false;
    dialogConfig.width = '80vw';
    const dialogRef = this.dialog.open(ViewAssignmentDocumentComponent, dialogConfig);
    dialogRef.componentInstance.assignment = asignment;
    dialogRef.componentInstance.documentType = documentType;
  }

  onload() {
    this.dataSource = new MatTableDataSource<Assignment>(this.assignmentList);
    this.paginator.firstPage();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sortingDataAccessor = (data, sortHeaderId) => data[sortHeaderId].toLocaleLowerCase();
    this.dataSource.sort = this.sort;
  }

  removeFromArray(key: number) {
    this.documents.splice(key, 1);
    this.documentNames.splice(key, 1);
    this.totalFiles = this.documents.length;
  }

  removeFromResourceArray(key: number) {
    this.resourses.splice(key, 1);
    this.resourseNames.splice(key, 1);
    this.totalResources = this.resourses.length;
  }

  createAssignment() {
    this.isPending = true;
    let currentDate = new Date();
    let data = {
      "UserId": this.dataService.currentUserId,
      "title": this.assignmentForm.value.assignmentTitle,
      "skills": this.assignmentForm.value.skills,
      "createdDate": this.getFormattedDate(currentDate),
      "modifiedDate": this.getFormattedDate(currentDate),
    }
    this.dataService.isLoading = true;
    this.modService.CreateAssignment(data).subscribe(res => {
      if (res.result) {
        let assignmentId = res.result.id;
        this.documents.forEach(element => {
          this.dataService.isLoading = true;
          const formData = new FormData();
          formData.append('file', element, element.name);
          this.modService.UploadDocuments(formData, this.currentUserType, assignmentId, DocumentFileType[1]).subscribe(res => {
            if (res) {
              this.modService.GetAllAssignmentForUser(this.dataService.currentUserId).subscribe(res => {
                this.assignmentList = res.result ? res.result : [];
                this.showNoAssignments = !this.assignmentList.length;
                this.onload();
                this.refresh();
                this.dataService.isLoading = this.dataService.doneLoading();
              });
            }
          });
        });

        this.resourses.forEach(element => {
          this.dataService.isLoading = true;
          const formData = new FormData();
          formData.append('file', element, element.name);
          this.modService.UploadDocuments(formData, this.currentUserType, assignmentId, DocumentFileType[2]).subscribe(res => {
            if (res) {
              this.modService.GetAllAssignmentForUser(this.dataService.currentUserId).subscribe(res => {
                this.assignmentList = res.result ? res.result : [];
                this.showNoAssignments = !this.assignmentList.length;
                this.onload();
                this.refresh();
                this.dataService.isLoading = this.dataService.doneLoading();
              });
            }
          });
        });
        this.toastrService.success("Assignment has been created successfully");
      }
    });
  }

  getFormattedDate(date: Date) {
    let year = date.getFullYear();
    let month = (date.getMonth() + 1);
    let day = date.getDate();
    return `${month}-${day}-${year}`;
  }

  delete(id: number) {
    if (this.deletePermission) {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = false;
      dialogConfig.autoFocus = false;
      dialogConfig.width = '40vw';
      const dialogRef = this.dialog.open(DeleteAssignmentComponent, dialogConfig);
      dialogRef.componentInstance.assignmentId = id;
      dialogRef.afterClosed().subscribe(res => {
        if (res) {
          this.modService.GetAllAssignmentForUser(this.dataService.currentUserId).subscribe(res => {
            this.assignmentList = res.result ? res.result : [];
            this.showNoAssignments = !this.assignmentList.length;
            this.onload();
          });
          this.refresh();
        }
      });
    }
    else {
      this.toastrService.warning("You don't have permission to delete an assignment");
    }
  }

  getPermissions() {
    if (this.dataService.currentUserRole === UserRoles[1]) {
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

  selectFiles(event: any) {
    if (event.target.files.length) {
      for (let i = 0; i < event.target.files.length; i++) {
        let file = event.target.files[i];
        if (!this.documentNames.includes(file.name)) {
          this.documentNames.push(file.name);
          this.documents.push(file);
          this.toastrService.success('Documents selected');
        }
        else
          this.toastrService.warning(`${file.name} already exists`);
      }
      this.totalFiles = this.documents.length;
    }
    else {
      this.toastrService.warning('Please select a file');
    }
  }

  selectResources(event: any) {
    if (event.target.files.length) {
      for (let i = 0; i < event.target.files.length; i++) {
        let selectedResource = event.target.files[i].type;
        let Resourse = event.target.files[i];
        if (!this.resourseNames.includes(Resourse.name)) {
          if (selectedResource == "image/png" || selectedResource == "image/jpeg") {
            this.resourseNames.push(Resourse.name);
            this.resourses.push(Resourse);
            this.toastrService.success('Resources selected');
          }
          else {
            this.toastrService.warning('Upload only image files');
          }
        }
        else
          this.toastrService.warning(`${Resourse.name} already exists`);
      }
      this.totalResources = this.resourses.length;
    }
    else {
      this.toastrService.warning('Please select a file');
    }
  }

  populate(id: number) {
    if (this.updatePermission) {
      this.isNewAssignment = true;
      this.showEdit = true;
      this.editAssignmentId = id;
      this.updateDocuments = [];
      this.updateResources = [];
      this.resourses = [];
      this.documents = [];
      this.resourseNames = [];
      this.documentNames = [];
      this.modService.populateAssignment(id).subscribe(res => {
        if (res.result) {
          this.assignmentForm.setValue({
            assignmentTitle: res.result.title,
            skills: res.result.skills
          });
          this.createdDate = res.result.createdDate;
          res.result.documents.forEach(element => {
            if (element.type == DocumentFileType[1]) {
              this.updateDocuments.push(element);
              this.totalFiles = this.updateDocuments.length;
            }
            if (element.type == DocumentFileType[2]) {
              this.updateResources.push(element);
              this.totalResources = this.updateResources.length;
            }
          });
        }
      });
      this.title.nativeElement.focus();
    }
    else {
      this.toastrService.warning("You don't have permission to update an assignment");
    }
  }

  updateAssignment() {
    if (this.documents.length || this.updateDocuments.length) {
      let currentDate = new Date();
      let data = {
        "title": this.assignmentForm.value.assignmentTitle,
        "skills": this.assignmentForm.value.skills,
        "createdDate": this.createdDate,
        "modifiedDate": this.getFormattedDate(currentDate),
        "id": this.editAssignmentId
      }
      if (this.documentDeleteFromBlob.length) {
        let blobDetails = {
          "blobURLs": this.documentDeleteFromBlob,
          "assignmentId": this.editAssignmentId
        }
        this.modService.RemoveBlob(blobDetails).subscribe(res => {
          this.isDocumentsDeleted = res.result;
        }, err => {
          console.log(err);
        });
      }
      this.modService.updateAssignments(data).subscribe(res => {
        this.documents.forEach(element => {
          const formData = new FormData();
          formData.append('file', element, element.name);
          this.dataService.isLoading = true;
          this.modService.UploadDocuments(formData, this.currentUserType, this.editAssignmentId, DocumentFileType[1]).subscribe(res => {
            if (res.result) {
              this.modService.GetAllAssignmentForUser(this.dataService.currentUserId).subscribe(res => {
                this.assignmentList = res.result ? res.result : [];
                this.showNoAssignments = !this.assignmentList.length;
                this.onload();
                this.refresh();
                this.dataService.isLoading = this.dataService.doneLoading();
              });
            }
          });
        });

        this.resourses.forEach(element => {
          const formData = new FormData();
          formData.append('file', element, element.name);
          this.dataService.isLoading = true;
          this.modService.UploadDocuments(formData, this.currentUserType, this.editAssignmentId, DocumentFileType[2]).subscribe(res => {
            if (res.result) {
              this.modService.GetAllAssignmentForUser(this.dataService.currentUserId).subscribe(res => {
                this.assignmentList = res.result ? res.result : [];
                this.showNoAssignments = !this.assignmentList.length;
                this.onload();
                this.refresh();
                this.dataService.isLoading = this.dataService.doneLoading();
              });
            }
          });
        });
        if (!this.documents.length && !this.resourses.length) {
          this.dataService.isLoading = true;
          this.modService.GetAllAssignmentForUser(this.dataService.currentUserId).subscribe(res => {
            this.assignmentList = res.result ? res.result : [];
            this.showNoAssignments = !this.assignmentList.length;
            this.onload();
            this.refresh();
            this.dataService.isLoading = this.dataService.doneLoading();
          });
        }
        this.toastrService.success("Assignment has been updated successfully");
      });
      this.showEdit = !this.showEdit;
      this.isNewAssignment = !this.isNewAssignment;
    }
    else {
      this.toastrService.warning("Please upload documents");
    }
  }

  refresh() {
    this.assignmentForm.reset();
    this.totalFiles = this.totalResources = 0;
    this.isNewAssignment = false;
    this.documents = [];
    this.documentNames = [];
    this.resourses = [];
    this.resourseNames = [];
    this.documentDeleteFromBlob = [];
  }

  cancelEdit() {
    this.showEdit = !this.showEdit;
    this.refresh();
  }

  removeFromDocument(uri: string, index: number) {
    this.documentDeleteFromBlob.push(uri);
    this.updateDocuments.splice(index, 1);
  }

  removeFromResource(uri: string, index: number) {
    this.documentDeleteFromBlob.push(uri);
    this.updateResources.splice(index, 1);
  }

  initAssignmentForm(): void {
    this.assignmentForm = this.formBuilder.group({
      assignmentTitle: ['', [Validators.required, WhiteSpaceValidators.emptySpace(), Validators.maxLength(50)]],
      skills: ['', [Validators.required, WhiteSpaceValidators.emptySpace(), Validators.maxLength(50)]],
    });
  }

  getAllTenants() {
    this.modService.getTenants().subscribe(res => {
      if (res.result) {
        this.tenantsList = res.result;
      }
    }, err => { });
  }

  filterByAssignmentTitle(){ 
    if(this.selectedTenantName && this.titleSearchText){
      this.filterAssignments = this.assignmentList.filter((data) => data.tenantName == this.selectedTenantName &&
                                                                    data.title.toLowerCase().includes(this.titleSearchText.trim().toLowerCase()) );
    }
    else if(this.selectedTenantName && !this.titleSearchText){
      this.filterAssignments = this.assignmentList.filter((data) => data.tenantName == this.selectedTenantName );
    }
    else{
      this.filterAssignments = this.assignmentList;
    }
    this.showNoAssignments = !this.filterAssignments.length;
    this.dataSource = new MatTableDataSource<any>(this.filterAssignments);
    this.dataSource.paginator = this.paginator;
    this.filterAssignmentsObservable = this.dataSource.connect();
    this.dataSource.sortingDataAccessor = (data, sortHeaderId) => data[sortHeaderId].toLocaleLowerCase();
    this.dataSource.sort = this.sort;
  }  
  
  downloadResources(id: number) {
    let blobURL: any = [];
    this.modService.populateAssignment(id).subscribe(res => {
      let documents = res.result ? res.result.documents : [];
      documents.forEach(element => {
        if (element.type == DocumentFileType[2]) {
          blobURL.push(element.document);
        }
      });
      if (blobURL.length) {
        let data = {
          "blobURLs": blobURL,
          "assignmentId": id
        }
        this.modService.getDownloadURL(data).subscribe(res => {
          let documents = res.result ? res.result : [];
          documents.forEach(element => {
            window.open(element);
          });
        });
      }
      else {
        this.toastrService.warning("No Resources found");
      }
    });
  }
}