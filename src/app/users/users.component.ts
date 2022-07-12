import { Component, Injector } from '@angular/core';
import { MatDialog } from '@angular/material';
import { finalize } from 'rxjs/operators';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { PagedListingComponentBase, PagedRequestDto } from 'shared/paged-listing-component-base';
import { UserServiceProxy, UserDto, PagedResultDtoOfUserDto } from '@shared/service-proxies/service-proxies';
import { CreateUserDialogComponent } from './create-user/create-user-dialog.component';
import { EditUserDialogComponent } from './edit-user/edit-user-dialog.component';
import { Moment } from 'moment';
import { ResetPasswordDialogComponent } from './reset-password/reset-password.component';
import { ToastrService } from 'ngx-toastr';

class PagedUsersRequestDto extends PagedRequestDto {
    keyword: string;
    isActive: boolean | null;
}

@Component({
    templateUrl: './users.component.html',
    animations: [appModuleAnimation()],
    styleUrls: ['./users.component.css']
})
export class UsersComponent extends PagedListingComponentBase<UserDto> {
    users: UserDto[] = [];
    keyword = '';
    isActive: boolean | null;
    selectedFile: any;
    file: any;
    fileTypeGranted: boolean = false;
    isLoading: boolean;

    constructor(
        injector: Injector,
        private _userService: UserServiceProxy,
        private _dialog: MatDialog,
        private toastr: ToastrService
    ) {
        super(injector);
    }

    onFileChange(event) {
        if (event.target.files.length > 0) {
            this.selectedFile = event.target.files[0].type;
            this.file = event.target.files[0];
            if (this.selectedFile == "application/vnd.ms-excel"
                || this.selectedFile == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
                this.fileTypeGranted = true;
                this.toastr.success('File selected, please click on the upload button to import users.');
            }
            else {
                this.toastr.warning('Upload only excel files');
            }
        }
        else {
            this.toastr.warning('Please select a file');
        }
    }

    uploadFile(): void {
        this.isLoading = true;
        const formData = new FormData();
        formData.append('file', this.file, this.file.name);
        this._userService.userImport(formData).pipe(
            finalize(() => {
                this.doneLoading();
            })
        ).subscribe(res => {
            this.toastr.success('File uploaded successfully, please check the logs for detailed information.');
        });
    }

    createUser(): void {
        this.showCreateOrEditUserDialog();
    }

    editUser(user: UserDto): void {
        this.showCreateOrEditUserDialog(user.id);
    }

    public resetPassword(user: UserDto): void {
        this.showResetPasswordUserDialog(user.id);
    }

    protected list(
        request: PagedUsersRequestDto,
        pageNumber: number,
        finishedCallback: Function
    ): void {

        request.keyword = this.keyword;
        request.isActive = this.isActive;

        this._userService
            .getAll(request.keyword, request.isActive, request.skipCount, request.maxResultCount)
            .pipe(
                finalize(() => {
                    finishedCallback();
                })
            )
            .subscribe((result: PagedResultDtoOfUserDto) => {
                this.users = result.items;
                this.showPaging(result, pageNumber);
            });
    }

    protected delete(user: UserDto): void {
        abp.message.confirm(
            this.l('UserDeleteWarningMessage', user.fullName),
            (result: boolean) => {
                if (result) {
                    this._userService.delete(user.id).subscribe(() => {
                        abp.notify.success(this.l('SuccessfullyDeleted'));
                        this.refresh();
                    });
                }
            }
        );
    }

    private showResetPasswordUserDialog(userId?: number): void {
        this._dialog.open(ResetPasswordDialogComponent, {
            data: userId
        });
    }

    private showCreateOrEditUserDialog(id?: number): void {
        let createOrEditUserDialog;
        if (id === undefined || id <= 0) {
            createOrEditUserDialog = this._dialog.open(CreateUserDialogComponent);
        } else {
            createOrEditUserDialog = this._dialog.open(EditUserDialogComponent, {
                data: id
            });
        }

        createOrEditUserDialog.afterClosed().subscribe(result => {
            if (result) {
                this.refresh();
            }
        });
    }
    private doneLoading(): void {
        this.isLoading = false;
    }
}
