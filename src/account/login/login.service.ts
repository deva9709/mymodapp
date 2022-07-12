import { TokenService } from '@abp/auth/token.service';
import { LogService } from '@abp/log/log.service';
import { UtilsService } from '@abp/utils/utils.service';
import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppConsts } from '@shared/AppConsts';
import { AuthenticateModel, AuthenticateResultModel, TokenAuthServiceProxy, TenantServiceProxy, ExternalAuthenticateResultModel } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';
import { AppSessionService } from '@shared/session/app-session.service';
import { environment as en } from 'environments/environment';
import { UrlHelper } from '@shared/helpers/UrlHelper';
import { ToastrService } from 'ngx-toastr';

const PLATFORM_BASE_URL = en.apiPlatformBaseUrl;

@Injectable()
export class LoginService {

    static readonly twoFactorRememberClientTokenName = 'TwoFactorRememberClientToken';

    authenticateModel: AuthenticateModel;
    authenticateResult: AuthenticateResultModel;
    isLoading: boolean;

    rememberMe: boolean;


    constructor(
        private _tokenAuthService: TokenAuthServiceProxy,
        private _router: Router,
        private _utilsService: UtilsService,
        private _tokenService: TokenService,
        private _logService: LogService,
        private _appSessionService: AppSessionService,
        private _activatedRoute: ActivatedRoute,
        private _tenantServiceProxy: TenantServiceProxy,
        private toastrService: ToastrService
    ) {
        this.clear();
    }

    authenticate(finallyCallback?: () => void): void {
        finallyCallback = finallyCallback || (() => { });

        this.authenticateModel.tenancyName = this._utilsService.getCookieValue("tenantName");

        this._tokenAuthService
            .authenticate(this.authenticateModel)
            .pipe(
                finalize(() => {
                    this.doneLoading();
                }))
            .subscribe({
                next: (result: AuthenticateResultModel) => {
                    this.processAuthenticateResult(result);
                },
                error: err => {
                    this.toastrService.warning(`Please enter valid credentials`);
                    console.log(`${err}`);
                }
            });
    }
    //Authorizing on self-registration
    authenticateself(finallyCallback?: () => void): void {
        finallyCallback = finallyCallback || (() => { });

        this.authenticateModel.tenancyName = this._utilsService.getCookieValue("tenantName");

        this._tokenAuthService
            .authenticate(this.authenticateModel)
            .pipe(
                finalize(() => {
                    this.doneLoading();
                }))
            .subscribe({
                next: (result: AuthenticateResultModel) => {
                    this.processSelfAuthenticateResult(result);
                },
                error: err => {
                    this.toastrService.warning(`Please enter valid credentials`);
                    console.log(`${err}`);
                }
            });
    }

    private doneLoading(): void {
        this.isLoading = false;
    }

    authenticateExternalToken(finallyCallback?: () => void): void {

    }

    getToken(finallyCallback?: () => void): void {
        this._tokenService.getToken();
    }

    private processAuthenticateResult(authenticateResult: AuthenticateResultModel) {
        this.authenticateResult = authenticateResult;
        if (authenticateResult.accessToken) {
            // Successfully logged in
            this.login(
                authenticateResult.accessToken,
                authenticateResult.encryptedAccessToken,
                authenticateResult.expireInSeconds,
                this.rememberMe);

        } else {
            // Unexpected result!
            this._logService.warn('Unexpected authenticateResult!');
            this.toastrService.warning('Please enter valid credentials');
        }
    }

    private processSelfAuthenticateResult(authenticateResult: AuthenticateResultModel) {
        this.authenticateResult = authenticateResult;
        if (authenticateResult.accessToken) {
            // Successfully logged in
            this.loginSelf(
                authenticateResult.accessToken,
                authenticateResult.encryptedAccessToken,
                authenticateResult.expireInSeconds,
                this.rememberMe);
        } 
    }

    private login(accessToken: string, encryptedAccessToken: string, expireInSeconds: number, rememberMe?: boolean): void {
        const tokenExpireDate = rememberMe ? (new Date(new Date().getTime() + 1000 * expireInSeconds)) : undefined;

        this._tokenService.setToken(
            accessToken,
            tokenExpireDate
        );
        this._tokenService.getToken();

        this._utilsService.setCookieValue(
            AppConsts.authorization.encrptedAuthTokenName,
            encryptedAccessToken,
            tokenExpireDate,
            abp.appPath
        );

        let initialUrl = UrlHelper.initialUrl;
        if (initialUrl.indexOf('/landing') > 0) {
            initialUrl = AppConsts.appBaseUrl;
        }
         //To login into app after successfully resetting password in forgot password 
         if (initialUrl.indexOf('/resetpassword') > 0) {
            initialUrl = AppConsts.appBaseUrl;
        }
        location.href = initialUrl;
    }

    private loginSelf(accessToken: string, encryptedAccessToken: string, expireInSeconds: number, rememberMe?: boolean): void {
        const tokenExpireDate = rememberMe ? (new Date(new Date().getTime() + 1000 * expireInSeconds)) : undefined;
        this._tokenService.setToken(
            accessToken,
            tokenExpireDate
        );
        this._tokenService.getToken();

        this._utilsService.setCookieValue(
            AppConsts.authorization.encrptedAuthTokenName,
            encryptedAccessToken,
            tokenExpireDate,
            abp.appPath
        );
    }	
    
    private clear(): void {
        this.authenticateModel = new AuthenticateModel();
        this.authenticateModel.rememberClient = false;
        this.authenticateResult = null;
        this.rememberMe = false;
    }
}
