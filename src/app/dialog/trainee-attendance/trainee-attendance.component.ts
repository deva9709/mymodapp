import { Component, OnInit,Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { ModService } from '@app/service';
import { ToastrService } from 'ngx-toastr';
import { dataService } from '@app/service/common/dataService';
import { MatDialogConfig, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-trainee-attendance',
  templateUrl: './trainee-attendance.component.html',
  styleUrls: ['./trainee-attendance.component.css']
})
export class TraineeAttendanceComponent implements OnInit {

  TraineeAttendanceForm: FormGroup;
  selectedFile: any;
  file: any;
  fileTypeGranted: boolean = false;
  userType: string;
  isTraineeAttendanceFormSubmitted: boolean;
  tenantList: any[] = [];
  filteredTenantList: any[] = [];
  tenantId: number;
  scheduledSessionTenantId:number;
  selectedTenant: number;
  roleId: number;
  sessionTitle:string;
  scheduledSessionId:number;
  selectedTenantIdForSession: number;
  isSuperAdmin: boolean;
  isCorrectTenantSelected:boolean;
  showTenantDropDown:boolean;
  roles: any[] = [];
  tenantRoles: any[] = [];
  filteredRoles: any[] = [];
  rolePermissions: any[] = [];
  review_btn=true;
  createPermission: boolean;
  uploadAttendanceProcessing:boolean;
  code: string = "IMPUSR";
  TraineeAttendanceFormValidationMessages = {
    tenantRequired: 'Please select a tenant',
    attendanceFileRequired:'Please upload a file'
  };
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private modService: ModService,
    private toastr: ToastrService,
    public dataService: dataService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private traineeAttendanceDialog: MatDialogRef<TraineeAttendanceComponent>) { }

  ngOnInit() {
    this.dataService.isLoading = this.dataService.doneLoading();
    this.isSuperAdmin = this.dataService.isSuperAdmin;
    this.initForm();
    this.getPermissions();
    this.dataService.pageName = 'Upload Attendance';
    this.getAllRoles();
  }

  initForm() {
    if (this.isSuperAdmin) {
      this.showTenantDropDown=true;
      this.TraineeAttendanceForm = this.formBuilder.group({
        attendanceFile: ['', Validators.required],
        tenant: ['', Validators.required]
      });
      this.getAllTenants();
    }
    else {
      this.tenantId = this.dataService.currentTenentId;
      this.TraineeAttendanceForm = this.formBuilder.group({
        attendanceFile: ['', Validators.required]
      });
    }
  }
  getPermissions() {
    if (this.dataService.isSuperAdmin) {
      this.createPermission = true;
      this.showTenantDropDown = true;
      this.getAllTenants();
    }
    else {
      this.rolePermissions = this.dataService.rolePermissions;
      let permissions = this.rolePermissions.find(val => val.feature.featureCode === this.code);
      this.createPermission = permissions ? permissions.create : false;
    }
  }

  getAllRoles() {
    this.modService.getAllRoles().subscribe(res => {
      if (res.result) {
        this.roles = res.result.items;
        if (!this.isSuperAdmin) {
          this.filterTenantRoles(this.tenantId);
        }
      }
    }, err => { });
  }

  filterTenantRoles(tenantId) {
    this.tenantRoles = this.roles.filter(x => x.tenantId == tenantId);
    this.filteredRoles = this.tenantRoles;
  }
  
  getAllTenants() {
    this.dataService.isLoading = true;
    this.modService.getTenants().pipe(
      finalize(() => {
        this.dataService.isLoading = this.dataService.doneLoading();
      })).subscribe(res => {
        if (res.result) {
          this.tenantList = res.result;
          this.filteredTenantList = this.tenantList;
        }
      }, err => { });
  }

  search(query: string, filterFor: string): void {
    if (filterFor.toLowerCase() == 'tenant') {
      this.filteredTenantList = this.performFilter(query, this.tenantList, 'tenantName');
    }
    else if (filterFor.toLowerCase() == 'role') {
      this.filteredRoles = this.performFilter(query, this.tenantRoles, 'name');
    }
  }

  performFilter(query: string, filterArray: string[], filterBy: string): string[] {
    query = query.toLocaleLowerCase();
    return filterArray.filter(value => value[filterBy].toLocaleLowerCase().indexOf(query) !== -1);
  }

  onFileChange(event) {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0].type;
      this.file = event.target.files[0];

      if (this.selectedFile == "application/vnd.ms-excel"
        || this.selectedFile == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
        this.fileTypeGranted = true;
        this.toastr.success('File selected, please click on the upload button to import Trainee Manual Attendance.');
      }
      else {
        this.toastr.warning('Upload only excel files');
      }
    }
    else {
      this.toastr.warning('Please select a file/tenant ');
    }
  }

  uploadManualAttendance():void{
    if (this.dataService.isSuperAdmin){
        if(this.isCorrectTenantSelected){
        this.uploadTraineeAttendance();
        }
       else{
            this.toastr.warning('Please select correct Tenant for Session '+this.data.sessionTitle);
          }
    }
    else{
          this.uploadTraineeAttendance();
        }
  }

  uploadTraineeAttendance(): void {
    this.tenantId=this.isSuperAdmin?this.tenantId:this.dataService.currentTenentId;
      if (this.TraineeAttendanceForm.valid) {
        this.isTraineeAttendanceFormSubmitted = true;
        const formData = new FormData();
        formData.append('file', this.file, this.file.name);
        this.dataService.isLoading = true;
        this.modService.uploadTraineeAttendance(formData, this.tenantId).pipe(
          finalize(() => {
            this.isTraineeAttendanceFormSubmitted = false;
            this.dataService.isLoading = this.dataService.doneLoading();
          })
        ).subscribe(res => {
          if (res.result != '') {
            this.toastr.error(res.result);
          }
          else {
            this.toastr.success('Manual Attendance uploaded successfully, please check the logs for detailed information.');
            this.traineeAttendanceDialog.close();
          }
        });
    }
    else{
      this.toastr.error('Please select tenant / select a file');
    }
  }
  cancelAttendance() {
    this.traineeAttendanceDialog.close();
  }
  getTenantDetails(item){
    this.isCorrectTenantSelected=false;
    this.sessionTitle=this.data.sessionTitle;
    this.selectedTenantIdForSession=item.id;
    this.scheduledSessionId=Number(this.data.sessionId);
    this.onSelectTenant();
  }

  onSelectTenant()
  {
    this.modService.getTenantId(this.scheduledSessionId,this.sessionTitle).subscribe(res => {
      if (res.result) {
        this.scheduledSessionTenantId = res.result;
        if(this.scheduledSessionTenantId===this.selectedTenantIdForSession){
          this.tenantId=this.selectedTenantIdForSession;
          this.isCorrectTenantSelected=true;
          this.toastr.success('Tenant selected, please select Manual Attendance Sheet to Upload.');
        }
        else{
          this.toastr.error('Please select correct Tenant for Session '+this.data.sessionTitle);
        }
      }
    }, err => { });
  }
}


