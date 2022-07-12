import { Injectable } from '@angular/core';
import { AppConsts } from '@shared/AppConsts';
import { CookieService } from 'ngx-cookie-service';
import { ModService } from '@app/service';

@Injectable()
export class AppAuthService {
    private cookieValue: string;
    constructor(private cookieService: CookieService, private modService: ModService) {
    }

    logout(reload?: boolean): void {
        let tenantName = abp.utils.getCookieValue("tenantName");
        this.modService.logout().subscribe(res => {
            this.cookieService.deleteAll('/');
            this.cookieService.deleteAll('/app');
            localStorage.clear();
            abp.auth.clearToken();

            // retrieve the tenancyname from cookie and set it back.
            if (tenantName) {
                abp.utils.setCookieValue("tenantName", tenantName, undefined, abp.appPath);
            }
            abp.utils.setCookieValue(AppConsts.authorization.encrptedAuthTokenName, undefined, undefined, abp.appPath);
            if (reload !== false) {
                location.href = AppConsts.appBaseUrl;
            }
        });
    }
}

