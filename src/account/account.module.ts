import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JsonpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { ModalModule } from 'ngx-bootstrap';
import { AbpModule } from '@abp/abp.module';
import { AccountRoutingModule } from './account-routing.module';
import { ServiceProxyModule } from '@shared/service-proxies/service-proxy.module';
import { SharedModule } from '@shared/shared.module';
import { AccountComponent } from './account.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { LoginService } from './login/login.service';
import { ParticlesModule } from 'angular-particle';
import { LandingComponent } from './landing/landing.component';
import { SelfRegistrationComponent } from './self-registration/self-registration.component';
import { ForgotPasswordComponent } from './forgotpassword/forgotpassword.component';
import { ResetpasswordComponent } from './resetpassword/resetpassword.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        HttpClientModule,
        JsonpModule,
        AbpModule,
        SharedModule,
        ServiceProxyModule,
        AccountRoutingModule,
        ModalModule.forRoot(),
        ParticlesModule,
        ReactiveFormsModule 
    ],
    declarations: [
        AccountComponent,
        LoginComponent,
        RegisterComponent,
        LandingComponent,
        SelfRegistrationComponent,
        ForgotPasswordComponent,
        ResetpasswordComponent
    ],
    providers: [
        LoginService
    ],
    entryComponents: [
        ForgotPasswordComponent
    ]
})
export class AccountModule {

}
