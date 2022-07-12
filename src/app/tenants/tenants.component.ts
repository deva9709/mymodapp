import { Component, Injector } from '@angular/core';
import { MatDialog } from '@angular/material';
import { finalize } from 'rxjs/operators';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { PagedListingComponentBase, PagedRequestDto } from 'shared/paged-listing-component-base';
import { TenantServiceProxy, TenantDto, PagedResultDtoOfTenantDto } from '@shared/service-proxies/service-proxies';
import { CreateTenantDialogComponent } from './create-tenant/create-tenant-dialog.component';
import { EditTenantDialogComponent } from './edit-tenant/edit-tenant-dialog.component';
import { ToastrService } from 'ngx-toastr';

class PagedTenantsRequestDto extends PagedRequestDto {
    keyword: string;
    isActive: boolean | null;
}

@Component({
    templateUrl: './tenants.component.html',
    animations: [appModuleAnimation()],
    styleUrls: ['./tenants.component.css']

})

export class TenantsComponent extends PagedListingComponentBase<TenantDto> {
    tenants: TenantDto[] = [];
    keyword = '';
    isActive: boolean | null;
    isLoading: boolean;

    constructor(
        injector: Injector,
        private _tenantService: TenantServiceProxy,
        private _dialog: MatDialog,
        private toastr: ToastrService
    ) {
        super(injector);
    }

    list(
        request: PagedTenantsRequestDto,
        pageNumber: number,
        finishedCallback: Function
    ): void {
        this.isLoading = true;
        request.keyword = this.keyword;
        request.isActive = this.isActive;
        this._tenantService
            .getAll(request.keyword, request.isActive, request.skipCount, request.maxResultCount)
            .pipe(
                finalize(() => {
                  this.doneLoading();
                }))
            .subscribe((result: PagedResultDtoOfTenantDto) => {
                if (result.totalCount == 0) {
                    this.toastr.warning("No matching records found");
                    this.keyword = '';
                    this.getDataPage(pageNumber);
                }
                else {
                    this.tenants = result.items;
                    this.showPaging(result, pageNumber);
                }
            });
    }

    delete(tenant: TenantDto): void {
        abp.message.confirm(
            this.l('TenantDeleteWarningMessage', "Do you want to delete the tenant " + tenant.name),
            (result: boolean) => {
                if (result) {
                    this._tenantService
                        .delete(tenant.id)
                        .pipe(
                            finalize(() => {
                                this.toastr.success("Successfully deleted");
                                this.refresh();
                            })
                        )
                        .subscribe(() => { });
                }
            }
        );
    }

    createTenant(): void {
        this.showCreateOrEditTenantDialog();
    }

    editTenant(tenant: TenantDto): void {
        this.showCreateOrEditTenantDialog(tenant.id);
    }

    showCreateOrEditTenantDialog(id?: number): void {
        let createOrEditTenantDialog;
        if (id === undefined || id <= 0) {
            createOrEditTenantDialog = this._dialog.open(CreateTenantDialogComponent);
        } else {
            createOrEditTenantDialog = this._dialog.open(EditTenantDialogComponent, {
                data: id
            });
        }

        createOrEditTenantDialog.afterClosed().subscribe(result => {
            if (result) {
                this.refresh();
            }
        });
    }

    onEnter(event) {
        if (event.keyCode == 13) {
            if (this.keyword == '') {
                this.toastr.warning("Enter tenant name");
            }
            else {
                this.getDataPage(this.pageNumber);
            }
        }
    }

    keywordChangeEvent() {
        if (this.keyword == '') {
            this.getDataPage(this.pageNumber);
        }
    }

    private doneLoading(): void {
        this.isLoading = false;
      }
}
