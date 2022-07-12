import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LandingComponent } from './landing/landing.component';
import { AccountComponent } from './account.component';
import { TenantloginComponent } from '@shared/tenantlogin/tenantlogin.component';
import { SelfRegistrationComponent } from './self-registration/self-registration.component';
import { ResetpasswordComponent } from './resetpassword/resetpassword.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: AccountComponent,
                children: [
                    { path: 'landing', component: LandingComponent },
                    { path: 'login', redirectTo: 'landing', pathMatch: 'full' },
                    { path: 'register', component: RegisterComponent },
                    { path: 'resetpassword/:encodedUrl', component: ResetpasswordComponent },
                    { path: 'self-registration', component: SelfRegistrationComponent },
                    { path: '**', component: TenantloginComponent }
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class AccountRoutingModule { }
