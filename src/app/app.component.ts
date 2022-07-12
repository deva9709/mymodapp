import { Component, ViewContainerRef, Injector, OnInit, AfterViewInit, ChangeDetectorRef, Inject, PLATFORM_ID } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { Router, Event, NavigationStart, NavigationEnd, NavigationError, NavigationCancel } from '@angular/router';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { ToastrService } from 'ngx-toastr';
import { AppAuthService } from '@shared/auth/app-auth.service';

import { SignalRAspNetCoreHelper } from '@shared/helpers/SignalRAspNetCoreHelper';
import { isPlatformBrowser } from '@angular/common';
// import { OAuthService, JwksValidationHandler } from 'angular-oauth2-oidc'
// import { UserProfileService } from './users/userprofile.service';
// import { authConfig } from 'config/auth.config';
import { environment } from 'environments/environment';
import { dataService } from './service/common/dataService';

@Component({
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],

})
export class AppComponent extends AppComponentBase implements OnInit, AfterViewInit {
    isLoading: boolean = true;

    private viewContainerRef: ViewContainerRef;

    constructor(private idle: Idle, private router: Router, private toastr: ToastrService, private authService: AppAuthService,
        injector: Injector,
        public dataService: dataService,
        @Inject(PLATFORM_ID) private platformId: Object,
        // private _oauthService: OAuthService
        //private _userProfileService: UserProfileServices
    ) {
        super(injector);
        //checking for session timeout on user idle
        // idle.setIdle(1200);
        // idle.setTimeout(10);
        // idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);
        // idle.onTimeoutWarning.subscribe((countdown) => {
        //     if (countdown == 10) {
        //         this.toastr.warning("Your session will expire in " + countdown + " seconds!");
        //     }
        // });
        // idle.onTimeout.subscribe(() => {
        //     this.authService.logout(true);
        //     this.toastr.error("Session got expired. Please login into the session again");
        // });
        // this.reset();

        router.events.subscribe((routerEvent: Event) => {
            this.checkRouterEvent(routerEvent);
        });

        // if (isPlatformBrowser(this.platformId)) {
        //     this._oauthService.configure(authConfig);
        //     this._oauthService.tokenValidationHandler = new JwksValidationHandler();
        //     if (!environment.production) {
        //         this._oauthService.events.subscribe(e => {
        //             console.log("oauth/oidc event", e);
        //         });
        //     }
        // }      
    }
    reset() {
        this.idle.watch();
    }

    checkRouterEvent(routerEvent: Event): void {
        if (routerEvent instanceof NavigationStart) {
            this.dataService.isLoading = true;
        }
        if (routerEvent instanceof NavigationEnd ||
            routerEvent instanceof NavigationCancel ||
            routerEvent instanceof NavigationError) {
            this.dataService.isLoading = false;
        }
    }

    ngOnInit(): void {
        // if (isPlatformBrowser(this.platformId)) {
        //     this._oauthService.loadDiscoveryDocumentAndTryLogin().then(_ => {
        //         if (!this._oauthService.hasValidIdToken() || !this._oauthService.hasValidAccessToken()) {
        //             this._oauthService.initImplicitFlow();
        //         } else {
        //             this._userProfileService.onIdentityClaimsReadyChanged(this._oauthService.getIdentityClaims());
        //         }
        //     });
        // }
        SignalRAspNetCoreHelper.initSignalR();

        abp.event.on('abp.notifications.received', userNotification => {
            abp.notifications.showUiNotifyForUserNotification(userNotification);

            // Desktop notification
            Push.create('AbpZeroTemplate', {
                body: userNotification.notification.data.message,
                icon: abp.appPath + 'assets/app-logo-small.png',
                timeout: 6000,
                onClick: function () {
                    window.focus();
                    this.close();
                }
            });
        });
    }


    ngAfterViewInit(): void {
        $.AdminBSB.activateAll();
        $.AdminBSB.activateDemo();
    }

    onResize(event) {
        // exported from $.AdminBSB.activateAll
        $.AdminBSB.leftSideBar.setMenuHeight();
        $.AdminBSB.leftSideBar.checkStatuForResize(false);

        // exported from $.AdminBSB.activateDemo
        $.AdminBSB.demo.setSkinListHeightAndScroll();
        $.AdminBSB.demo.setSettingListHeightAndScroll();
    }


}
