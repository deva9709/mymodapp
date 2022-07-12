import { Component, Injector, OnInit } from '@angular/core';
import { AbpSessionService } from '@abp/session/abp-session.service';
import { AppComponentBase } from '@shared/app-component-base';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { LoginService } from './login.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig, MatDialog } from '@angular/material';
import{ForgotPasswordComponent} from 'account/forgotpassword/forgotpassword.component'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  animations: [accountModuleAnimation()]
})
export class LoginComponent extends AppComponentBase implements OnInit {
  loginFormValidationMessages = {
    userNameRequired: 'Please enter the username',
    passwordRequired: 'Please enter the password'
  }
  constructor(
    public dialog: MatDialog,
    injector: Injector,
    public loginService: LoginService,
    private _sessionService: AbpSessionService
  ) {
    super(injector);
  }

  ngOnInit() {
  }
  get multiTenancySideIsTeanant(): boolean {
    return this._sessionService.tenantId > 0;
  }

  get isSelfRegistrationAllowed(): boolean {
    if (!this._sessionService.tenantId) {
      return false;
    }

    return true;
  }

  login(): void {
    this.loginService.authenticate(() => (
      console.log('Logged in')
    ));
  }
//code to open forgot password popup
  openForgotPassword():void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false;
    dialogConfig.width = '40vw';
    dialogConfig.height = '21vw';
    const dialogRef = this.dialog.open(ForgotPasswordComponent, dialogConfig);
  }
}