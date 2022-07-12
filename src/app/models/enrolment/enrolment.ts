export class Enrolment {
    id: number;
    courseId: number;
    userId: number;
    userName: string;
    enroledMethod: any;
    otherEnroledMethod: any;
    enrolmentEnd: Date;
    enrolmentStart: Date;
    creationTime: Date;
    status: any;
    tenantId: number
    tenantName: string

    constructor() {
        this.id = 0;
        this.courseId = 0;
        this.userId = 0;
        this.userName = "";
        this.enroledMethod = "1";
        this.otherEnroledMethod = "Default";
        this.enrolmentEnd = new Date();
        this.enrolmentStart = new Date();
        this.creationTime = new Date();
        this.status = "";
        this.tenantId = 1;
        this.tenantName = "Default";
    }
}