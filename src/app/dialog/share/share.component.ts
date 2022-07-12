import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatDatepickerModule } from '@angular/material';
import { ModService } from '@app/service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { dataService } from "@app/service/common/dataService";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { ParticipantRole, UserRoles, ChannelType } from '@app/enums/user-roles';
import { Router } from '@angular/router';

@Component({
  selector: 'app-share',
  templateUrl: './share.component.html',
  styleUrls: ['./share.component.css']
})
export class ShareComponent implements OnInit {
  resourceIds: number[] = [];
  filteredTenantList: any[] = [];
  showTenantDropDown: boolean;
  tenantsList: any = [];
  allSessions: any[] = [];
  shareResourceForm: FormGroup;
  selectedTrainer: number;
  selectedDueDate: Date;
  minDate = new Date();
  allTrainers: any[] = [];
  allTrainees: any[] = [];
  selectedTrainees: any[] = [];
  selectedTraineeDetails: any[] = [];
  selectedTenantId: number;
  traineeDropdownSettings: IDropdownSettings = {};
  constructor(
    private modService: ModService,
    public dataService: dataService,
    private formBuilder: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private shareResourceDialog: MatDialogRef<ShareComponent>) { }

  ngOnInit() {
    if (this.dataService.isSuperAdmin) {
      this.shareResourceForm = this.formBuilder.group({
        tenant: ['', [Validators.required]],
        session: [''],
        selectedTrainer: ['', [Validators.required]],
        selectedTrainee: ['', [Validators.required]],
        dueDate: ['', [Validators.required]]
      });
      this.showTenantDropDown = true;
      this.getAllTenants();
    }
    else {
      this.shareResourceForm = this.formBuilder.group({
        session: [''],
        selectedTrainer: ['', [Validators.required]],
        selectedTrainee: ['', [Validators.required]],
        dueDate: ['', [Validators.required]]
      });
      this.getAllTrainerTraineeDetails(this.dataService.currentTenentId);
      this.showTenantDropDown = false;
      this.getAllSessions(this.dataService.currentTenentId);
    }
    this.traineeDropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 5,
      allowSearchFilter: true
    };
  }
  getFormattedDate(date) {
    let year = date.getFullYear();
    let month = (1 + date.getMonth()).toString().padStart(2, '0');
    let day = date.getDate().toString().padStart(2, '0');
    return month + '/' + day + '/' + year;
  }

  getTimeZone() {
    return /\((.*)\)/.exec(new Date().toString())[1];
  }

  getFormattedTime(date) {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let AmOrPm = hours >= 12 ? 'PM' : 'AM';
    hours = (hours % 12) || 12;
    hours = hours <= 9 ? `0${hours}` : hours;
    minutes <= 9 ? `0${minutes}` : minutes;
    return `${hours}:${minutes} ${AmOrPm}`;
  }

  onSessionTimeChange(value) {
    this.selectedDueDate = value;
  }

  sessionUnSelected() {
    if (this.selectedTenantId) {
      this.getAllTrainerTraineeDetails(this.selectedTenantId);
    }
    else {
      this.allTrainers = [];
      this.allTrainees = [];
    }
  }

  showSessionParticipants(session: any) {
    this.allTrainees = session.participantDetails.sessionTraineeDetails;
    this.allTrainers = session.participantDetails.sessionTrainerDetails;
  }

  getAllTrainerTraineeDetails(tenantId: number) {
    this.selectedTenantId = tenantId;
    this.modService.getAllTrainerTraineeDetails(tenantId).subscribe(res => {
      if (res.result) {
        this.getAllSessions(tenantId);
        this.allTrainers = res.result.trainerEligibleUsers;
        this.allTrainees = res.result.traineeEligibleUsers;
      }
    });
  }

  getAllSessions(tenantId: number) {
    this.modService.getAllSessionsForTenant(tenantId).pipe(
      finalize(() => {
        this.dataService.isLoading = this.dataService.doneLoading();
      })).subscribe(res => {
        if (res.result) {
          this.allSessions = res.result;
        }
      }, err => {
        this.toastr.error("Please try again later");
      });
  }

  getAllTenants() {
    this.dataService.isLoading = true;
    this.modService.getTenants().pipe(
      finalize(() => {
        this.dataService.isLoading = this.dataService.doneLoading();
      })).subscribe(res => {
        if (res.result) {
          this.tenantsList = res.result;
          this.filteredTenantList = this.tenantsList;
        }
      }, err => {
        this.toastr.error("Please try again later");
      });
  }

  search(query: string, filterFor: string): void {
    if (filterFor.toLowerCase() === 'tenant') {
      this.filteredTenantList = this.performFilter(query, this.tenantsList, 'tenantName');
    }
  }

  performFilter(query: string, filterArray: string[], filterBy: string): string[] {
    query = query.toLocaleLowerCase();
    return filterArray.filter(value => value[filterBy].toLocaleLowerCase().indexOf(query) !== -1);
  }

  onTraineeSelect(item: any) {
    this.selectedTraineeDetails = [];
    for (let selectedTrainee of this.selectedTrainees) {
      this.selectedTraineeDetails.push(this.allTrainees.filter(trainee => trainee.id === selectedTrainee.id)[0]);
    }
  }

  onTraineeDeSelect(item: any) {
    this.selectedTraineeDetails = this.selectedTraineeDetails.filter(deselectTrainee => deselectTrainee.id !== item.id);
  }

  onDeselectAllTrainee() {
    this.selectedTraineeDetails = [];
  }

  onTraineeSelectAll(items: any) {
    this.selectedTraineeDetails = [...this.allTrainees];
  }

  shareResource() {
    let data = {
      resourceIds: this.resourceIds,
      channelType: ChannelType.Individual,
      tenanatId: this.selectedTenantId,
      trainerId: this.selectedTrainer,
      traineeIds: this.selectedTraineeDetails.map(x => x.id),
      dueDate: `${this.getFormattedDate(this.selectedDueDate)} ${this.getFormattedTime(new Date())}`,
      timeZone: this.getTimeZone()
    }
    this.modService.shareResources(data).subscribe(res => {
      if (res.result) {
        this.toastr.success("Resource has been shared sucessfully");
        this.shareResourceDialog.close({ isUpdated: true });
      }
    }, err => {
      this.toastr.error("Try again later");
    });
  }
}
