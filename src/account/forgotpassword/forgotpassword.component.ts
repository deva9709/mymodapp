import { Component, Inject, OnInit,Injector } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UserServiceProxy } from '@shared/service-proxies/service-proxies';
import { LoginService } from 'account/login/login.service';
import { ToastrService } from 'ngx-toastr';
import{ForgotPasswordDto} from './ForgotPasswordDto'
import { AppConsts } from '@shared/AppConsts';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordDto = new ForgotPasswordDto()
  public parentFormGroup: FormGroup;
  constructor(
    injector: Injector,
    public dialogRef: MatDialogRef<ForgotPasswordComponent>,
    public loginService: LoginService,
    public dialog: MatDialog,
    private userService: UserServiceProxy,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.parentFormGroup = new FormGroup({
      'userName': new FormControl('', [Validators.required]),
    });
  }
  
  forgotPassword(formValue: any) {
    this.forgotPasswordDto.userName=formValue.userName;
    this.forgotPasswordDto.tenantName = abp.utils.getCookieValue("tenantName");
    this.forgotPasswordDto.resetUrl = AppConsts.appBaseUrl + '/' + this.forgotPasswordDto.tenantName + '/account/resetpassword';
    this.userService.forgotPassword(this.forgotPasswordDto).subscribe(res => {
      if (res)
        this.toastr.info("Please check your mail for password reset link");
      else 
        this.toastr.error("Invalid Username");
    });
    this.dialogRef.close();
  }

}