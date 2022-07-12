import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ModService } from '@app/service';
import { ToastrService } from 'ngx-toastr';
import { dataService } from '@app/service/common/dataService';
import { finalize } from 'rxjs/operators';
import { AuthenticateModel } from '@shared/service-proxies/service-proxies';
import { WhiteSpaceValidators } from '@shared/validators/whitespace.validator';
import { TenantName, UserRoles } from '@app/enums/user-roles';
import { LoginService } from '../login/login.service';
import { AppAuthService } from "@shared/auth/app-auth.service";
import { UtilsService } from 'abp-ng2-module/dist/src/utils/utils.service';
@Component({
  selector: 'app-self-registration',
  templateUrl: './self-registration.component.html',
  
  styleUrls: ['./self-registration.component.css']
})
export class SelfRegistrationComponent implements OnInit {
  selfRegistrationForm:FormGroup;
  emailFlage: boolean;
  userRoles = UserRoles;
  tenantValue= TenantName;
  sessionCode:string;
  authenticateModel: AuthenticateModel;
  selfRegistrationFormValidationMessages = {
    firstNameRequired: 'Please enter the first name',
    lastNameRequired: 'Please enter the last name',
    emailRequired: 'Please enter the valid email'

  }

  constructor(
    private _router: Router,
    private formBuilder: FormBuilder,
    private modService: ModService,
    private toastr: ToastrService,
    private dataService: dataService,
    private _loginService: LoginService,
    private _authService: AppAuthService,
    private _utilsService: UtilsService
  ) { }
  ngOnInit() {
    this.inItFormForSelfRegistration();
  }
  inItFormForSelfRegistration() {
    this.selfRegistrationForm = this.formBuilder.group({
      firstName: ['', [Validators.required, WhiteSpaceValidators.emptySpace()]],
      lastName: ['', [Validators.required , WhiteSpaceValidators.emptySpace()]],
      email: ['', [Validators.required,Validators.email]]
    });
  }

  selfRegistration(){
    this.sessionCode=this._utilsService.getCookieValue("sessionCode");
    this._loginService.authenticateModel.userNameOrEmailAddress ='admin';
        this._loginService.authenticateModel.password = '123qwe';
    this._loginService.authenticateself(() => (
      console.log('Logged in')
    ));
    Object.keys(this.selfRegistrationForm.controls).forEach(field => {
      const control = this.selfRegistrationForm.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({
          onlySelf: true
        });
      }
    });
    this.modService.getEmailVerification(this.selfRegistrationForm.controls.email.value).subscribe(response => {
      this.emailFlage = response.result;
      if (this.emailFlage) {
        this.toastr.error("Email Id  allready exist");
        return;
      }
      else{
        let selfRegistrationObject={
          tenantName:this.tenantValue[1],
          modRole:UserRoles[11],
          name:this.selfRegistrationForm.controls.firstName.value,
          surName:this.selfRegistrationForm.controls.lastName.value,
          email: this.selfRegistrationForm.controls.email.value,
        }
        this.modService.selfRegistration(selfRegistrationObject).subscribe(data => {
          if (data) {
            if (data.result === "SUCCESS") {
              this.modService.UpdateExternalParticipant(this.selfRegistrationForm.controls.email.value,this.sessionCode).subscribe(data => {
                if (data) {
                  if (data.result === "SUCCESS") {
                    this.ngOnInit();
                    this.selfRegistrationForm.reset('');
                    this.toastr.success("User Registration has been updated successfully");
                    this._authService.logout(true);
                    this._router.navigate(['account/login']);
                  }
                }
              }, err => {
                this.toastr.error("Something went wrong, please try again");
              });
            }
          }
        }, err => {
          this.toastr.error("Something went wrong, please try again");
        });
        
      }
   });

  }

}
