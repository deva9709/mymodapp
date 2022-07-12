import { Component, OnInit, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { TenantServiceProxy } from '@shared/service-proxies/service-proxies';
import { UtilsService } from 'abp-ng2-module/dist/src/utils/utils.service';
import { AppComponentBase } from '@shared/app-component-base';

@Component({
  selector: 'app-tenantlogin',
  templateUrl: './tenantlogin.component.html',
  styles: []
})
export class TenantloginComponent extends AppComponentBase implements OnInit {

  constructor(injector: Injector,
    private router: Router,
    private tenantServiceProxy: TenantServiceProxy,
    private _utilsService: UtilsService) {
    super(injector);
  }

  ngOnInit() {
    const path = this.router.url;
    if (this.appSession.user && this.appSession.user.id) {
      this.router.navigate(['/app/home']);
    }
    else if (path.length < 64) {
      let tenantName = path.replace(/^\/+/g, '');
     // tenantName = (tenantName.includes("account")) ? "default" : tenantName;
      this.checkTenantName(tenantName);
      console.log(tenantName);
    }
    else {
      // Perform action based on demand
    }
  }

  checkTenantName(tenantName: string): void {
    const format = /[!@#$%^&*()+\=\[\]{};':"\\|,.<>\/?]+/;
    if (format.test(tenantName)) {
      this.router.navigate(['/account/landing']);
    } else {
      this.tenantServiceProxy.GetIDProvider(tenantName).
        subscribe(() => {
          if (tenantName) {
            this._utilsService.setCookieValue("tenantName", tenantName);
          }
          this.router.navigate(['/account/landing']);
        })
    }
  }
}
