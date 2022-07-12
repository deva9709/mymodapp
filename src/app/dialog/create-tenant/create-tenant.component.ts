import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { WhiteSpaceValidators } from '@shared/validators/whitespace.validator';
import { ModService } from '@app/service';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef } from '@angular/material';
import { dataService } from "@app/service/common/dataService";
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-create-tenant',
  templateUrl: './create-tenant.component.html',
  styleUrls: ['./create-tenant.component.css']
})
export class CreateTenantComponent implements OnInit {

  createTenantForm: FormGroup;
  tenantName: string = '';
  tenantDisplayName: string = '';
  tenantType: number;
  createTenantProcessing: boolean;
  externalTrainerStatus: boolean = false;
  tenantTypes: any[] = [];
  createTenantFormValidationMessages = {
    tenantNameRequired: 'Please provide a valid tenant name',
    tenantDisplayNameRequired: 'Please provide a valid tenant display name',
    tenantTypeRequired: 'Please select a tenant type'
  };

  constructor(private modService: ModService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    public dataService: dataService,
    private createTenantDialog: MatDialogRef<CreateTenantComponent>) { }

  ngOnInit() {
    this.createTenantForm = this.formBuilder.group({
      tenantName: ['', [Validators.required, WhiteSpaceValidators.emptySpace(), Validators.pattern("^[a-zA-Z0-9]*$"), Validators.maxLength(100)]],
      tenantDisplayName: ['', [Validators.required, WhiteSpaceValidators.emptySpace(), Validators.pattern("[a-zA-Z0-9 ]+"), Validators.maxLength(100)]],
      tenantType: ['', [Validators.required]]
    });
    this.getAllTenantTypes();
  }

  externalTrainer(event: any) {
    this.externalTrainerStatus = event.checked;
  }

  getAllTenantTypes() {
    this.modService.getAllTenantTypes().subscribe(res => {
      if (res.result) {
        this.tenantTypes = res.result;
      }
    });
  }

  addNewTenant() {
    this.createTenantProcessing = true;
    if (this.createTenantForm.valid && this.createTenantForm.value.tenantName.trim() && this.createTenantForm.value.tenantDisplayName.trim()) {
      let data = {
        "name": this.createTenantForm.value.tenantName.trim(),
        "tenancyName": this.createTenantForm.value.tenantDisplayName.trim(),
        "configJson": "",
        "tenantType": this.tenantType,
        "canOutsourceTrainers": this.externalTrainerStatus
      };
      let existingTenant: any[] = [];
      this.modService.getTenants().subscribe(res => {
        if (res.result) {
          existingTenant = res.result.filter(x => x.tenantName.toLowerCase() == data.name.toLowerCase());
          if (existingTenant.length) {
            this.toastr.warning("Similar tenant exists");
            this.createTenantProcessing = false;
          }
          else {
            this.dataService.isLoading = true;
            this.modService.createTenant(data).pipe(
              finalize(() => {
                this.dataService.isLoading = this.dataService.doneLoading();
              })
            ).subscribe(res => {
              if (res) {
                this.toastr.success(data.tenancyName + " tenant has been created successfully");
                this.createTenantProcessing = false;
                this.createTenantDialog.close({ isCreated: true });
              }
            }, err => {
              this.toastr.warning("Please try again later");
              this.createTenantProcessing = false;
            });
          }
        }
      }, err => {
        this.toastr.error("Something went wrong, try again later");
        this.createTenantProcessing = false;
      });
    }
  }

  cancelNewTenant() {
    this.createTenantDialog.close();
  }
}