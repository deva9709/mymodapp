import { Component, Injector, OnInit } from '@angular/core';
import { UserServiceProxy } from '@shared/service-proxies/service-proxies';
import { Router, ActivatedRoute } from '@angular/router';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { ToastrService } from 'ngx-toastr';
import { ResetPasswordDto } from './model/resetpassworddto'
import { AppComponentBase } from '@shared/app-component-base';
import { ErrorStateMatcher } from '@angular/material';
import { FormGroup, FormControl, Validators, AbstractControl, ValidationErrors, FormGroupDirective, NgForm } from '@angular/forms';

export class FormGroupErrorStateMatcher implements ErrorStateMatcher {
  constructor(private formGroup: FormGroup) { }

  public isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
      return control && control.dirty && control.touched && this.formGroup && this.formGroup.errors && this.formGroup.errors.areEqual;
  }
}

@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  animations: [accountModuleAnimation()],
  styleUrls: ['./resetpassword.component.css']
})


export class ResetpasswordComponent extends AppComponentBase implements OnInit{
  resetPasswordDto = new ResetPasswordDto();
  userInfo: any = {};
  confirmPassword:string;

  private static areEqual(c: AbstractControl): ValidationErrors | null {
    const keys: string[] = Object.keys(c.value);
    for (const i in keys) {
        if (i !== '0' && c.value[keys[+i - 1]] !== c.value[keys[i]]) {
            return { areEqual: true };
        }
    }
}
public parentFormGroup: FormGroup;
    public passwordsFormGroup: FormGroup;
    public isLoading: boolean;
    public equalMatcher: FormGroupErrorStateMatcher;

  constructor(
    injector: Injector,
    private userService: UserServiceProxy,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private _router: Router) {
      super(injector);
  }

  ngOnInit() {
    this.isLoading = true;
    this.activatedRoute.params.subscribe(params => {
      this.resetPasswordDto.encodedUrl = params['encodedUrl'];
      this.userInfo = atob(this.resetPasswordDto.encodedUrl).split('/');
    });
    this.passwordsFormGroup = new FormGroup({
      'newPassword': new FormControl('', [
          Validators.required,
          Validators.pattern('(?=^.{8,}$)(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\\s)[0-9a-zA-Z!@#$%^&*()]*$') ]),
      'confirmPassword': new FormControl('', [ Validators.required ])
  }, ResetpasswordComponent.areEqual);
  this.equalMatcher = new FormGroupErrorStateMatcher(this.passwordsFormGroup);

  this.doneLoading();
  }


  reset(form: NgForm): void {
    if(this.confirmPassword===this.resetPasswordDto.newPassword){
    this.userService.resetNewPassword(this.resetPasswordDto).subscribe(res => {
      if (res) {
        let tenantName = this.userInfo[0];
        this.toastr.success('Password reset successful');
        this._router.navigate([`${tenantName}/landing`]);
        abp.utils.setCookieValue("tenantName", tenantName, undefined, abp.appPath);
      }
      else {
        this.toastr.error('Your password reset link is invalid, try resetting your password again');
      }
    });
  }
  else{
    this.toastr.error('NewPassword & ConfirmPassword is different');
    form.resetForm();
  }
  }

  private doneLoading(): void {
    this.isLoading = false;
}
}
