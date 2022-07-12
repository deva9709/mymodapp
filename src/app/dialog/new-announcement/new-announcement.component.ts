import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms";
import { dataService } from "@app/service/common/dataService";
import { ModService } from "@app/service";
import { ToastrService } from "ngx-toastr";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { WhiteSpaceValidators } from '@shared/validators/whitespace.validator';

@Component({
  selector: 'app-new-announcement',
  templateUrl: './new-announcement.component.html',
  styleUrls: ['./new-announcement.component.css']
})
export class NewAnnouncementComponent implements OnInit {
  announcementForm: FormGroup;
  selectedTenant: number;
  title: string;
  minDate = new Date();
  endMinDate = new Date();
  submitButtonName: string;
  currentDate = new Date();
  showTenantField: boolean = true;
  tenantList: any[] = [];
  message: string;
  endDate: Date;
  startDate: Date;
  dialogTitle: string;
  updateAnnouncementId: number;
  filteredTenantList: any[] = [];
  roles: any[] = [];
  tenantRoles: any[] = [];
  roleId: number;
  isSuperAdmin: boolean;
  announcementFormValidationMessages = {
    titleRequired: 'Please provide a valid title',
    startDateRequired: 'Please select a valid date',
    endDateRequired: 'Please select a valid date',
    tenantRequired: 'Please select a tenant',
    roleRequired: 'Please select a role',
    messageRequired: 'Please provide a valid message'
  };

  constructor(public dataService: dataService,
    private modService: ModService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private createAnnouncementDialog: MatDialogRef<NewAnnouncementComponent>,
    public updateAnnouncementDialog: MatDialogRef<NewAnnouncementComponent>,
    @Inject(MAT_DIALOG_DATA) public updateData: any) { }

  ngOnInit() {
    this.getAllRoles();
    this.isSuperAdmin = this.dataService.isSuperAdmin;
    if (this.isSuperAdmin) {
      this.getAllTenants();
      this.initAnnouncementForm();
    }
    else {
      this.showTenantField = false;
      this.initTenantAdminAnnouncementForm();
      this.selectedTenant = this.dataService.currentTenentId;
    }
    if (this.updateData) {
      this.title = this.updateData.title;
      this.message = this.updateData.message;
      this.startDate = this.updateData.startDate;
      this.endDate = this.updateData.endDate;
      this.selectedTenant = this.updateData.selectedTenant;
      this.roleId = this.updateData.roleId;
      this.updateAnnouncementId = this.updateData.id;
      this.dialogTitle = "Update Announcement";
      this.submitButtonName = "Update";
    }
    else {
      this.dialogTitle = "Create Announcement";
      this.submitButtonName = "Publish";
    }
  }

  initTenantAdminAnnouncementForm(): void {
    this.announcementForm = this.formBuilder.group({
      title: ['', [Validators.required, WhiteSpaceValidators.emptySpace(), Validators.maxLength(100)]],
      message: ['', [Validators.required, WhiteSpaceValidators.emptySpace(), Validators.maxLength(300)]],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
      role: ['', [Validators.required]]
    });
  }

  initAnnouncementForm(): void {
    this.announcementForm = this.formBuilder.group({
      title: ['', [Validators.required, WhiteSpaceValidators.emptySpace(), Validators.maxLength(100)]],
      message: ['', [Validators.required, WhiteSpaceValidators.emptySpace(), Validators.maxLength(300)]],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
      tenant: ['', [Validators.required]],
      role: ['', [Validators.required]]
    });
  }

  getAllRoles() {
    this.modService.getAllRoles().subscribe(res => {
      if (res.result) {
        this.roles = res.result.items;
        if (this.updateData) {
          this.filterTenantRoles(this.updateData.selectedTenant);
        }
        else if (!this.updateData && !this.isSuperAdmin) {
          this.filterTenantRoles(this.selectedTenant);
        }
      }
    }, err => { });
  }

  filterTenantRoles(tenantId: number) {
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

  search(query: string, filterFor: string): void {
    if (filterFor === 'tenant') {
      this.filteredTenantList = this.performFilter(query, this.tenantList, 'tenantName');
    }
  }

  performFilter(query: string, filterArray: string[], filterBy: string): string[] {
    query = query.toLocaleLowerCase();
    return filterArray.filter(value => value[filterBy].toLocaleLowerCase().indexOf(query) !== -1);
  }

  addAnnouncements() {
    if (this.announcementForm.valid && this.announcementForm.value.title.trim() && this.announcementForm.value.message.trim()) {
      let data = {
        createdByUserId: this.dataService.currentUserId,
        startDate: this.getFormattedDate(this.startDate),
        endDate: this.getFormattedDate(this.endDate),
        title: this.title.trim(),
        message: this.message.trim(),
        tenantId: this.selectedTenant,
        roleId: this.roleId,
      };
      if (data.message && data.title && this.startDate <= this.endDate) {
        this.modService.addAnnouncement(data).subscribe(res => {
          this.createAnnouncementDialog.close({ isCreated: true, isUpdated: false, announcementTitle: data.title });
        }, err => {
          this.toastr.warning("Please try again later");
        });
      }
      else {
        this.toastr.error("Invalid data");
      }
    }
  }

  onSessionTimeChange(type, value) {
    if (type === "startDate") {
      this.endMinDate = value;
    }
  }

  getFormattedDate(date: Date) {
    let year = date.getFullYear();
    let month = (date.getMonth() + 1);
    let day = date.getDate();
    return `${month}/${day}/${year}`;
  }

  updateAnnouncement() {
    var data = {
      modifiedByUserId: this.dataService.currentUserId,
      startDate: this.getFormattedDate(new Date(this.startDate)),
      endDate: this.getFormattedDate(new Date(this.endDate)),
      title: this.title.trim(),
      message: this.message.trim(),
      tenantId: this.selectedTenant,
      roleId: this.roleId,
      id: this.updateAnnouncementId
    };

    if (data.title && data.message) {
      this.modService.updateAnnouncement(data).subscribe(res => {
        this.updateAnnouncementDialog.close({ isCreated: false, isUpdated: true, announcementTitle: data.title });
      },
        err => {
          this.toastr.warning("Please try again later");
        });
    }
    else {
      this.toastr.error("Invalid data");
    }
  }

  cancelAnnouncements() {
    this.createAnnouncementDialog.close({ isCreated: false, isUpdated: false });
  }
}
