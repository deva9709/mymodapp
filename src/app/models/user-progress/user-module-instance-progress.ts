import { UserModuleStatus } from "@app/enums/user-module-status";

export class UserModuleInstanceProgress {
    id: number;
    sectionModuleInstanceId: number;
    userId: number;
    totalTimeSpent: number;
    startDateTime?: Date;
    endDateTime?: Date;
    lastAccessedTime?: Date;
    progressJson: string;
    status: UserModuleStatus;

    constructor() {
        this.id = 0;
        this.sectionModuleInstanceId = 0;
        this.userId = 1;
        this.totalTimeSpent = 0;
        this.progressJson = "";
        this.status = UserModuleStatus.NotCompleted;
    }
}