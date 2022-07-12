import { Constants } from "@app/models/constants";
import { AbpPaginationControlsComponent } from "@shared/pagination/abp-pagination-controls.component";
import { environment as en } from "environments/environment"
export class TenantHelper {
    /**
     * The URL requested, before initial routing.
     */
    static readonly instance1EnabledTenant = en.instance1EnabledTenant;
    static readonly currentTenant = abp.utils.getCookieValue(Constants.TenantName) ? abp.utils.getCookieValue(Constants.TenantName) : TenantHelper.getTenantName();

    static getEnvironmentBasedValue(property: string): any {
        if (this.instance1EnabledTenant.toLowerCase() ===
            this.currentTenant.toLowerCase()) {
            return en.instance1[property];
        }
        else {
            return en[property];
        }
    }

    static getTenantName(): string {
        var pathname = window.location.pathname
        const path = pathname.split('/')[1];

        if (path.length < 64) {
            const tenantName = path.replace(/^\/+/g, '');
            const format = /[!@#$%^&*()+\=\[\]{};':"\\|,.<>\/?]+/;
            if (!format.test(tenantName)) {
                return tenantName;
            }
        }
        return Constants.Default;
    }
}