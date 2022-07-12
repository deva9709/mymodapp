export enum UserRoles {
    SUPERADMIN = 1,
    HOSTTENANTMANAGER = 2,
    COURSECREATOR = 3,
    EDITINGTEACHER = 4,
    TEACHER = 5,
    HOSTUSER = 6,
    TENANTADMIN = 7,
    TENANTUSER = 8,
    MENTOR = 9,
    MENTEE = 10,
    Trainee= 11
}

export enum UserTypes {
    Trainer = 1,
    Trainee = 2,
    SiteAdmin = 3,
}

export enum JoinMechanism {
    Teams = 1,
    Twilio = 2
}

export enum SessionStatus {
    Requested = 1,
    Scheduled = 2,
    InProgress = 3,
    Completed = 4,
    Rejected = 5,
    Canceled = 6
}

export enum SessionType {
    OnDemand = 1,
    Scheduled = 2,
    Webinar = 3
}

export enum SessionApprovalStatus {
    "Approved" = 1,
    "Pending..." = 2,
    "Rejected" = 3,
    "TimeOut" = 4
}

//Enum value added for recording options
export enum RecordingApprovalStatus {
    Requested = 1,
    Approved = 2,
    Rejected = 3,
}
export enum SessionRecurrence {
    Once = 1
}

export enum AnnouncementType {
    Trainer = 1,
    Trainee = 2,
    All = 3
}

export enum RequestSessionErrorMessages {
    NOMENTOR = "Please select a trainer",
    MENTORSCHEDULECONFLICT = "Session cannot be created, because there is a conflict in trainer schedule",
    EMPTYSESSIONURL = "Unable to create session, please try again",
    NODATECHANGE = "Please change date and time"
}

export enum AttendanceStatus {
    All = 1,
    Present = 2,
    Absent = 3
}

export enum CostType {
    Min15 = "15 Min",
    Min30 = "30 Min",
    Min45 = "45 Min",
    Min60 = "60 Min",
    Min240 = "240 Min",
    Min480 = "480 Min",
    LongTerm = "Long term agrement"
}

export enum ParticipantRole {
    Trainer = 1,
    Trainee = 2
}

export enum ChannelType {
    Individual = 1,
    Session = 2,
    Batch = 3
}

export enum TenantName{
    Yaksha = 1
}