import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TenantloginComponent } from 'shared/tenantlogin/tenantlogin.component';

const routes: Routes = [
    { path: '', redirectTo: '/app/home', pathMatch: 'full' },
    {
        path: 'app',
        loadChildren: 'app/app.module#AppModule', // Lazy load account module
        data: { preload: true }
    },
    {
        path: 'account',
        loadChildren: 'account/account.module#AccountModule', // Lazy load account module,
        data: { preload: true }
    },
     // path added to display resetpassword
     {
        path: ':tenantName/account',
        loadChildren: 'account/account.module#AccountModule', 
        data: { preload: true }
    },
    { path: '**', component: TenantloginComponent, pathMatch: 'full' },

];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: []
})
export class RootRoutingModule { }
