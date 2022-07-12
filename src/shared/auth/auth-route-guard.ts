import { Injectable } from '@angular/core';
import { PermissionCheckerService } from '@abp/auth/permission-checker.service';
import { AppSessionService } from '../session/app-session.service';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { UtilsService } from 'abp-ng2-module/dist/src/utils/utils.service';

@Injectable()
export class AppRouteGuard implements CanActivate, CanActivateChild {
    url: string = "";

    constructor(
        private _permissionChecker: PermissionCheckerService,
        private _router: Router,
        private _sessionService: AppSessionService,
        private cookieService: CookieService,private _utilsService: UtilsService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        if (!this._sessionService.user) {
            this.url = state.url;
            let tenantName = route.queryParams.tenantname;
            let sessionCode=route.queryParams.sessioncode;
            if (tenantName) {
                if (!this.cookieService.get('tenantName'))
                    this.cookieService.set('tenantName', tenantName);
                    this._utilsService.setCookieValue("tenantName", tenantName);
            }
            if (sessionCode) {
                if (!this.cookieService.get('sessionCode'))
                this._utilsService.setCookieValue("sessionCode", sessionCode);
                let sessionco=this._utilsService.getCookieValue("sessionCode");
                console.log(sessionco)
            }

            this._router.navigate(['/account/landing']);
            return false;
        }

        if (!route.data || !route.data['permission']) {
            return true;
        }

        if (this._permissionChecker.isGranted(route.data['permission'])) {
            return true;
        }

        if (this.url) {
            this._router.navigate([this.url]);
        }
        else {
            this._router.navigate([this.selectBestRoute()]);
        }
        return false;
    }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        return this.canActivate(route, state);
    }

    selectBestRoute(): string {
        if (!this._sessionService.user) {
            return '/account/landing';
        }

        if (this._permissionChecker.isGranted('Admin.Users.Manage.All')) {
            return '/app/admin/users';
        }

        return '/app/home';
    }
}
