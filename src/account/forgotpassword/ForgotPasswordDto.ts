export class ForgotPasswordDto {
    userName: string;
    tenantName: string;
    resetUrl: string;
 
    constructor() {
        this.userName = '';
        this.tenantName = '';
        this.resetUrl = '';
    }
}