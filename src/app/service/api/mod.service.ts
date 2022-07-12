import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClientService } from '../common/api-client.service';
import { IFilters } from '@app/mod-sessions/mod-sessions.component';

const routes = {
    // MOD Path
    allConfig: 'mod/Configuration/GetAll',
    updateConfig: '/mod/Configuration/Update',
    getConfigurationDetails: 'mod/Configuration/Get',
    removeconfid: 'mod/Configuration/Delete',
    addconfig: 'mod/Configuration/Create',
    importCategories: 'mod/UserCategory/UploadCategoriesAsync',
    importUsers: 'mod/Users/UploadUserAsync',
    // importMentee: 'mod/Users/UploadMenteeAsync',
    // importTenantAdmin: 'mod/Users/UploadTenantAdminAsync',
    skillList: 'mod/Skill/GetAll',
    technologyList: 'mod/Technology/GetAll',
    microtutoringList: 'mod/MicroTutoring/GetAll',
    certificationList: 'mod/Certification/GetAll',
    accreditationList: 'mod/Accreditation/GetAll',
    mentorBySkill: 'mod/UserCategory/GetUserIdFromUserCategory',
    sessionCodeEmail: 'mod/Session/SendSessionCodeAsync',
    createSkill: 'mod/Skill/CreateMultiple',
    createSkillByUser: 'mod/Skill/UploadSkillsByUser',
    createMicroTutor: 'mod/MicroTutoring/CreateMultiple',
    createTechonology: 'mod/Technology/CreateMultiple',
    createExpertiese: 'mod/Expertise/CreateMultiple',
    getMentorByCriteriaWithMicrotutoring: 'mod/Session/SearchMentorWithMicroTutoring',
    createCertificate: 'mod/Certification/CreateMultiple',
    createAccreditation: 'mod/Accreditation/CreateMultiple',
    getUserDetails: 'mod/Users/GetUserByPlatformUserId',
    getProfileDetailsOfTrainer: 'mod/Users/GetUserProfileDetails',
    getToken: 'mod/TokenGenerator/Generate?identity=',
    generateTeamsMeeting: 'mod/Session/ScheduleTeamsMeeting',
    createSession: 'mod/Session/ScheduleSessionAsync',
    createApproval: 'mod/Session/CreateSessionApproval',
    getAllApprovals: 'mod/Session/GetAllApprovals',
    getAllRecordingApprovals: 'mod/Session/GetAllRecordingApprovals',
    updateApprovalStatus: 'mod/Session/UpdateSessionApprovalStatus',
    updateRecordingApprovalStatus: 'mod/Session/UpdateRecordingApprovalStatus',
    reScheduleSession: 'mod/Session/ReScheduleSessionAsync',
    getAllSession: 'mod/Session/GetAllSessionsAsync',
    getAllSessionScheduleDetails: 'mod/Session/GetSessionsAsync',
    getSessionByQueryString: 'mod/Session/GetSessionByQueryString',
    getCodeLabUrl: 'mod/Session/GetCodeLabUrl',
    allUsers: 'mod/Users/GetUsersByRole',
    //getAllScheduleAdmin: 'mod/Session/GetAllSessionsAsync',
    getMentorByCriteria: 'mod/Session/SearchMentorAsync',
    getAllSurvey: 'mod/SurveysAppServices/GetAllSurvey',
    surveyId: 'mod/SurveysAppServices/Get',
    takeSurveyById: 'mod/SurveysAppServices/GetSurveyById',
    updateSurevyQuestion: 'mod/SurveysAppServices/UpdateQuestion',
    createSurvey: 'mod/SurveysAppServices/CreateSurvey',
    CreateSurveyAnalysis: 'mod/SurveyAnalysisAppServices/CreateSurveyAnalysis',
    getUsersBySkill: 'mod/Users/GetUsersBySkill',
    getFeedbackQuestions: 'mod/Session/GetRatingParameters',
    getSessionByScheduleIdAndUserId: 'mod/Session/GetSession',
    createTenant: 'mod/Users/CreateTenant',
    getAllMenteesOfSession:'mod/Session/GetAllMenteesOfSession',
    checkIfBatchAssociatedWithSession:'mod/Session/CheckIfBatchAssociatedWithSession',
    getSessionDetailsForAttendanceAsync:'mod/Session/GetSessionDetailsForAttendanceAsync',

    //ruby auto attendance
    getAutoAttendanceReport:'attendance/AutoAttendanceReport',

    // Platform path
    allTenent: '/platform/Tenant/GetAll',

    //change password
    changepwd: 'platform/User/ChangePassword',
    //Update Profile
    updateProfile: 'mod/Users/UpdateUser',
    //Get all mapped role features
    getAllRolefeatures: 'mod/RoleFeatures/GetAllRoleFeature',
    //Delete Role Features
    deleteroleFeatures: 'mod/RoleFeatures/Delete',
    updateRoleFeature: 'mod/RoleFeatures/Update',
    //Get all Features
    getAllFeatures: 'mod/Feature/GetAll',
    //Get all Roles
    getroles: 'mod/Roles/GetAll',
    createRole: 'mod/Roles/Create',
    getUsersForSelectedRole: 'mod/Users/GetUsersForSelectedRole',
    delegateUserRoles: 'mod/Users/DelegateUserRoles',
    getAllDelegatedRoleUserDetails: 'mod/Users/GetAllDelegatedRoleUsers',
    removeDelegationForUser: 'mod/Users/RemoveDelegateUserRole',
    //Add new Role Feature Mapping
    addrolefeature: 'mod/RoleFeatures/Create',
    //Get my Role Feature
    getmyrolefeature: 'mod/RoleFeatures/Get',
    //Get my Role
    getMyRole: 'mod/Roles/Get',
    //Get my Feature
    //Update Feature
    editfeatures: 'mod/Feature/Update',
    //Get all rolefeatures
    getallrolefeatures: 'mod/RoleFeatures/GetAll',
    getallrolefeaturedetails: 'mod/RoleFeatures/GetFeaturesForRole',
    //Delete Feature
    delfeature: 'mod/Feature/Delete',
    //Add Features
    addfeatures: 'mod/Feature/Create',
    //PressRoom
    createPressRelease: 'mod/PressRoom/CreatePressRelease',
    AddThumbnail: 'mod/PressRoom/AddThumbnail',
    deletePressRelease: 'mod/PressRoom/DeletePressRelease',
    updatePressRelease: 'mod/PressRoom/UpdatePressRelease',
    getAllPressReleasesByTenant: 'mod/PressRoom/GetAllPressReleaseByTenant',
    getPressReleaseDetails: 'mod/PressRoom/GetPressRelease',
    getAllUserByTenant:'mod/PressRoom/GetAllUsersByTenant',
    searchPressRelease:'mod/PressRoom/SearchPressRelease',
    getTargetPressRelease:'mod/PressRoom/GetTargetPressRelease',
    UploadDocuments: 'mod/AssignmentDocuments/UploadToBlob',
    CreateAssignment: 'mod/Assignments/CreateAssignment',
    GetAllAssignmentsForAdmin: 'mod/Assignments/GetAllAssignmentsForAdmin',
    deleteAssignment: 'mod/Assignments/DeleteAssignment',
    populateAssignment: 'mod/Assignments/GetAssignmentsByAssignmentId',
    updateAssignments: 'mod/Assignments/Update',
    RemoveBlob: 'mod/AssignmentDocuments/DeleteBlob',
    UpdateSessionAssignment: 'mod/SessionAssignment/UpdateSessionAssignment',
    GetAllAssignmentForUser: 'mod/Assignments/GetAllAssignmentForUser',
    getAllAssignmentsForMentee: 'mod/SessionAssignment/GetAllAssignmentIdBySessionIdForMentee',
    submitAssignment: 'mod/AssignmentsSubmission/SubmitAssignmentAsync',
    reviewAssignments: 'mod/Assignments/GetAllAssignmentDetailBySessionId',
    submitFeedback: 'mod/AssignmentsEvaluation/SendFeedback',
    retryAssignment: 'mod/AssignmentsEvaluation/RetryAssignment',
    getAssignmentForSession: 'mod/SessionAssignment/GetAllAssignmensBySessionId',
    deleteSessionAssignment: 'mod/SessionAssignment/DeleteSessionAssignment',
    getDownloadURL: 'mod/AssignmentDocuments/GetBlobDownloadURL',
    getSessionJoiningMechanismStatus: 'mod/Session/GetSessionJoiningMechanismStatus',
    //create new announcement
    createAnnouncement: 'mod/Announcements/CreateAnnouncement',
    //Update Announcement
    updateAnnouncement: 'mod/Announcements/UpdateAnnouncement',
    //Get all announcements
    getAllAnnouncements: 'mod/Announcements/GetAllAnnouncements',
    getAllAnouncementsForUsers: 'mod/Announcements/GetAllAnnouncementsForUser',
    updateAnnouncementStatusForUser: 'mod/Announcements/UpdateAnnouncementStatus',
    //Populate Announcement
    getAnnouncement: 'mod/Announcements/GetAnnouncementDetails',
    deleteAnnouncement: 'mod/Announcements/DeleteAnnouncement',
    deleteSession: 'mod/Session/CancelSessionAsync',
    GetMentorEngagement: 'mod/Reports/GetMentorEngagements',
    GetTrendingSession: 'mod/Reports/GetTrendingSession',
    getTopTrainers: 'mod/Reports/GetTopTrainers',
    //Get user Details by abp user token
    getMe: 'platform/User/GetMe',
    logout: 'platform/UserLogout/UserLogout',
    getMentorOnlineHours: 'mod/Reports/GetMentorActiveHoursAsync',
    getOnlineUsers: 'mod/Reports/GetOnlineUserAsync',
    // for single user registration
    singleUserRegistration: 'mod/Users/SingleUserRegistration',
    UpdateExternalParticipant:'mod/Session/UpdateExternalParticipant',
    selfRegistration:'mod/Users/SelfRegisterUser',
    //survey notification by mail
    sendSurveyNotification: '/mod/SurveysAppServices/SendSurveyNotification',
    //survey analysis
    getSurveyResultById: 'mod/SurveyAnalysisAppServices/GetSurveyResultById',
    //polls
    createpoll: 'mod/PollsAppServices/Createpoll',
    updatePoll: 'mod/PollsAppServices/UpdatePollQuestion',
    getPollBySessionId: 'mod/PollsAppServices/GetPollBySession',
    getPollById: 'mod/PollsAppServices/Get',
    pollNotification: 'mod/PollsAppServices/SendNotificationData',
    createPollAnalysis: 'mod/PollAnalysisServices/CreatePollAnalysis',
    //InAppNotification
    notificationbutton: 'mod/Notification/NotifyUser',
    getNotifications:'mod/Notification/GetNotifications',
    mentorNotification:'mod/Notification/GetNewMentor',
    saveNotifySettings:'mod/Notification/SaveNotifySetings',
    getNotifySettings:'mod/Notification/GetNotifySettings',
    getPopupList:'mod/Notification/GetPopupList',
    sendEmailAlerts:'mod/Notification/SendScheduleEmailAlertsAsync',
    //Get all trainers
    getTrainers: 'mod/Reports/GetTrainers',
    getAllSessionsForTrainer: 'mod/Reports/GetTrainerSessions',
    getTrackResourceDetails: 'mod/ResourceSharing/GetResourcesTrackDetail',
    //Get all tenants
    getAllTenants: 'mod/Users/GetTenantsAsync',
    getAllTenantTypes: 'mod/Users/GetAllTenantTypes',
    //poll Analysis
    getPollResultById: 'mod/PollAnalysisServices/GetPollResultById',
    //Join Session
    joinSession: 'mod/Session/JoinSessionAsync',
    //Disconnect Sesison
    disconnectSession: 'mod/Session/DisconnectSessionAsync',
    connectSessionAsync: 'mod/Session/ConnectSessionAsync',
    updateSessionConnectStatusAsync: 'mod/Session/UpdateSessionConnectStatusAsync',
    getSessionDetailsForFeedbackAsync: 'mod/Session/GetSessionDetailsForFeedbackAsync',
    //Add Rating
    addRateSession: 'mod/Session/RateSessionAsync',
    //Get overall rating for a session
    getOverallRatingForSession: 'mod/Session/GetSessionAverageRatings',
    getSessionDetails: 'mod/Session/GetSessionByScheduleId',

    // UserAvilability feature for Mentee-Mentor
    getUserAvilability:'mod/Users/GetUserAvilability',
    updateUserAvilability:'mod/Users/UpdateUserAvilability',

    //Get individual feedback for a session
    getSessionRatings: 'mod/Session/GetSessionRatings',
    //get Video URL for BBB Recorded Session
    getVideoPlayBackDetails: 'mod/Session/GetBBBSessionRecordingsUrlAsync',  
    //to check the session is started
    isSessionInProgressAsync: 'mod/Session/IsSessionInProgressAsync',
    getSessionParticipantRole: 'mod/Session/GetSessionParticipantRole',
    //send survey notification based on tenant
    sendSurveyNotificationTenant: 'mod/SurveysAppServices/SendTenantNotifications',
    getAllTenantForSurvey: 'mod/SurveysAppServices/GetTenantNotification',
    reSendTenantNotification: 'mod/SurveysAppServices/ResendTenantNotification',
    sessionTiming: 'mod/Session/SessionTimingAsync',
    totalUsers: 'mod/Reports/GetTotalUsers',
    GetUserDetailsForSelectedTenant: 'mod/Reports/GetUserDetailsForSelectedTenant',
    getUsersWithTrainerPermission: 'mod/Reports/GetUsersWithTrainerPermission',
    //forums
    createForumTopicAsync: 'mod/Forum/CreateForumTopicAsync',
    updateForumTopic: 'mod/Forum/EditForumTopicAsync',
    filterForumTopicAsync: 'mod/Forum/SearchForumTopicsAsync',
    getForumTopic: 'mod/Forum/GetForumCommentByForumTopicIdAsync',
    forumVote: '/mod/Forum/VoteTitleOrComment',
    addCommentAndReply: 'mod/Forum/AddForumCommentAsync',
    trendingTopicSkills: 'mod/Forum/GetTrendingSkills',
    postCommentAndReply: 'mod/Forum/AddForumCommentAsync',
    deleteForumTopic: 'mod/Forum/DeleteForumTopicAsync',
    latestDiscussion: 'mod/Forum/GetUserLastView',
    editCommentOrReply: 'mod/Forum/EditForumCommentAsync',
    deleteCommentOrReply: 'mod/Forum/DeleteForumCommentAsync',
    //blogs 
    createBlog: 'mod/Blog/CreateBlog',
    updateBlog: 'mod/Blog/UpdateBlog',
    getAllBlogs: 'mod/Blog/GetAllBlogs',
    getBlog: 'mod/Blog/GetBlog',
    upVote: 'mod/Blog/UpVote',
    downVote: 'mod/Blog/DownVote',
    deleteBlog: 'mod/Blog/DeleteBlog',
    uploadToBlob: 'mod/Blog/UploadToBlobAsync',

    //blog comments
    addComment: 'mod/Blog/AddComment',
    deleteComment: 'mod/Blog/DeleteComment',
    updateComment: 'mod/Blog/UpdateComment',
    getAllComments: 'mod/Blog/GetAllComments',
    // get and update trainer profile
    getPersonalInfo: 'mod/Users/GetPersonalInformation',
    getEducationQualification: 'mod/Users/GetEducationQualification',
    getResearchDevelopment: 'mod/Users/GetResearchDevelopment',
    getOrganizationDetails: 'mod/Users/GetOrganizationDetails',
    getExperienceDetails: 'mod/Users/GetExperienceDetails',
    getCostCalCulationDetails: 'mod/Users/GetCostCalculation',
    getLanguages: 'mod/Language/GetLanguages',
    updatePersonalInfo: 'mod/Users/UpdatePersonalInformation',
    updateEducationQualification: 'mod/Users/UpdateEducationQualificaion',
    updateResearchDevelopment: 'mod/Users/UpdateResearchDevelopment',
    updateOrganizationDetails: 'mod/Users/UpdateOrganizationDetails',
    updateCostCalCulation: 'mod/Users/UpdateCostCalculation',
    updateExperienceDetails: 'mod/Users/UpdateExperienceDetails',
    updateUserProfileDocToBlob: 'mod/Users/UpdateUserProfileDocToBlob',
    getUploadUserDocument: 'mod/Users/GetAllUserProfileDocuments',
    //languages
    getAllLanguageId: 'mod/Language/GetLanguages',
    //costDetails
    getAllDurationType: 'mod/TrainingCostType/GetCostTypesAsync',
    //search session
    getSessionSchedulesByTenantId: 'mod/Session/GetSessionSchedule',
    searchUserSessionStatus: 'mod/Session/SearchSessionParticipantStatus',
    searchParticipantsLateForSession: 'mod/Session/SearchSessionStatus',
    // mentee-feedback
    getAllParticipantInSession: 'mod/Session/GetAllSessionParticipants',
    trainerFeedback: 'mod/Session/TraineeFeedbackByTrainer',
    trainerBulkFeedback: 'mod/session/BulkTraineeFeedbackByTrainer',
    getTraineeFeedbackByTraineeId: 'mod/Session/GetFeedbackDetailByTraineeId',
    getTraineeFeedbackByTrainerId: 'mod/Session/GetFeedbackDetailByTrainerId',
    getSiteAdminFeedback: 'mod/Session/GetSiteAdminFeedbackDetails',
    getSuperAdminFeedbackDetails: 'mod/Session/GetSuperAdminFeedbackDetails',
    //calendar
    getSessionDetailsById: '/mod/Session/GetSessionBasicDetailsAsync',
    getAbsentessDetailsById: 'mod/Session/GetAbsenteesDetailsAsync',
    createRecordingRequest: 'mod/Session/CreateRecordingRequest',
    getSessionParticipantDetailsById: 'mod/Session/GetSessionParticipantDetailsAsync',
    joinSessionDetails: 'mod/Session/GetJoinSessionDetails',
    emailVerification: 'mod/Users/GetEmailValidation',
    batchCreation: 'mod/Batch/CreateBatchAsync',
    getBatchList: 'mod/Batch/GetBatchesAsync',
    getBatchMemberList: 'mod/Batch/GetBatchMembersAsync',
    addMemberList: 'mod/Batch/UpdateBatchMembersAsync',
    deletebatch: 'mod/Batch/DeleteBatchAsync',
    updateBatch: 'mod/Batch/UpdateBatchAsync',
    getResourceDetail: 'mod/Batch/GetSessionResourceIdAsync',
    createBatchResourceSession: 'mod/Batch/CreateBatchResourceMappingAsync',
    //ResourceSharing
    getResourceType: 'mod/ResourceSharing/GetResourceType',
    createResource: 'mod/ResourceSharing/CreateResource',
    submitAssignmentAsync: 'mod/ResourceSharing/SubmitAssignmentAsync',
    updateAssignmentApprovalStatus: 'mod/ResourceSharing/UpdateAssignmentApprovalStatus',
    shareResources: 'mod/ResourceSharing/ShareResources',
    getCreatedBy: 'mod/ResourceSharing/GetCreatedBy',
    getReviewer: 'mod/ResourceSharing/GetReviewer',
    getResourcesTrackDetail: 'mod/ResourceSharing/GetResourcesTrackDetail',
    getAllResources: 'mod/ResourceSharing/GetAllResources',
    getBlobDownloadURL: 'mod/ResourceSharing/GetBlobDownloadURL',
    getResourceShareStatusDetails: 'mod/ResourceSharing/GetResourceShareStatusDetails',
    getResourceTypes: 'mod/ResourceSharing/GetResourceTypes',
    getAllSessionsForTenant: 'mod/ResourceSharing/GetAllSessionDetailsForTenant',
    getAllTrainerTraineeDetails: 'mod/ResourceSharing/GetUsersForTenant',

    //TraineeAttendance
    getSessionTitle: 'mod/Attendance/GetSessionTitle',
    getTraineeAttendance: 'mod/Attendance/GetAttendanceReport',
    uploadTraineeAttendance: 'mod/Attendance/UploadTraineeAttendanceAsync',
    getTenantId: 'mod/Attendance/GetTenantId',

    //Theme and Theme color
    saveThemeDetails:'mod/Theme/InsertThemeDetailsByTenantId',
    getThemeDetails:'mod/Theme/GetThemeDetailsAsync',   

     //Global Search
     getAutoCompleteSearch:'mod/GlobalSearch/GetMatchIndex',
     getFullTextSearch:'mod/GlobalSearch/GetFullTextSearch',
     getUsersByName:'mod/GlobalSearch/GetUsersByName',
     getGlobalResource:'mod/GlobalSearch/GetGlobalResource',
     getGlobalAssignment:'mod/GlobalSearch/GetAssignmentsGloballyByName',
     getGlobalAnnouncement:'mod/GlobalSearch/GetGlobalSearchAnnouncement',
     getGlobalServey:'mod/GlobalSearch/GetGlobalSearchSurvey',
     getGlobalPressRelease:'mod/GlobalSearch/GetGlobalSearchPressRelease',
     getGlobalBlog:'mod/GlobalSearch/GetGlobalSearchBlogs',
     getGlobalSession:'mod/GlobalSearch/GetGlobalSessionDetails',
     getGlobalBatch:'mod/GlobalSearch/GetGlobalBatch',

     //Guest User Session Join URL
     guestUserSessionJoinUrl:'mod/Session/GuestSessionJoinUrlAsync',

    //enablex api route
    createRoom: 'mod/Dialout/CreateRoom',
    getRoomData: 'mod/Dialout/GetRoomData',
    getAuthToken: 'mod/Dialout/getAuthToken',
    saveDialoutDetail:'mod/Dialout/saveDialoutDetail',
    getCLINumber:'mod/Dialout/GetCLINumber'

};

@Injectable({
    providedIn: 'root'
})
export class ModService {

    constructor(private apiClient: ApiClientService) { }

    // ===== MOD API Calls =====  

    UploadDocuments(file: any, kind: string, assignmentId: number, type: string): Observable<any> {
        return this.apiClient.postFile(routes.UploadDocuments + '?DocumentKind=' + kind + '&Type=' + type + '&AssignmentId=' + assignmentId, file);
    }
    CreateAssignment(data: any): Observable<any> {
        return this.apiClient.post(routes.CreateAssignment, data);
    }
    GetAllAssignmentsForAdmin(): Observable<any> {
        return this.apiClient.get(routes.GetAllAssignmentsForAdmin);
    }
    deleteAssignment(id: number): Observable<any> {
        return this.apiClient.delete(routes.deleteAssignment + '?AssignmentId=' + id);
    }
    populateAssignment(id: number): Observable<any> {
        return this.apiClient.get(routes.populateAssignment + '?AssignmentId=' + id);
    }
    updateAssignments(data: any): Observable<any> {
        return this.apiClient.put(routes.updateAssignments, data);
    }
    //PressRoom
    getPressReleaseDetails(id: number): Observable<any> {
        return this.apiClient.get(routes.getPressReleaseDetails + '?pressReleaseId=' + id);
    }
    getAllPressReleasesByTenant(tenantId): Observable<any> {
        return this.apiClient.get(routes.getAllPressReleasesByTenant+'?tenantId='+tenantId);
    }
    createPressRelease(data: any): Observable<any> {
        return this.apiClient.post(routes.createPressRelease, data);
    }
    updatePressRelease(data: any): Observable<any> {
        return this.apiClient.post(routes.updatePressRelease, data);
    }
    addThumbnail(file: any, id: number): Observable<any> {
        return this.apiClient.postFile(routes.AddThumbnail + '?pressReleaseId=' + id, file);
    }
    deletePressRelease(pressReleaseId: number, userId: number): Observable<any> {
        return this.apiClient.delete(routes.deletePressRelease + '?pressReleaseId=' + pressReleaseId + '&userId=' + userId);
    }
    RemoveBlob(data: any): Observable<any> {
        return this.apiClient.post(routes.RemoveBlob, data);
    }
    getDownloadURL(data: any): Observable<any> {
        return this.apiClient.post(routes.getDownloadURL, data);
    }
    getAllUserByTenant(tenantId:number){
        return this.apiClient.get(routes.getAllUserByTenant + '?tenantId=' + tenantId);
    }
    SearchPressRelease(tenantId, roleId, batchId){
        return this.apiClient.get(routes.searchPressRelease + '?tenantId=' + tenantId+'&roleId='+roleId+'&batchId='+batchId); 
    }
    getTargetPressRelease(tenantId, platformUserId, startDate, endDate){
        return this.apiClient.get(routes.getTargetPressRelease+ '?tenantId=' + tenantId+'&platformUserId='+platformUserId+'&startDate='+startDate+'&endDate='+endDate);
    }
    UpdateSessionAssignment(data: any): Observable<any> {
        return this.apiClient.post(routes.UpdateSessionAssignment, data);
    }
    cancelSession(data: any): Observable<any> {
        return this.apiClient.post(routes.deleteSession, data);
    }
    GetAllAssignmentForUser(id: number): Observable<any> {
        return this.apiClient.get(routes.GetAllAssignmentForUser + '?userId=' + id);
    }
    getAllAssignmentsForMentee(sessionId: number, userId: number): Observable<any> {
        return this.apiClient.get(routes.getAllAssignmentsForMentee + '?sessionId=' + sessionId + '&userId=' + userId);
    }
    submitAssignment(file: any, assignmentId: number, sessionId: number, userId: number): Observable<any> {
        return this.apiClient.postFile(routes.submitAssignment + '?assignmentId=' + assignmentId + '&sessionId=' + sessionId + '&userId=' + userId, file);
    }
    reviewAssignments(id: number): Observable<any> {
        return this.apiClient.get(routes.reviewAssignments + '?sessionId=' + id);
    }
    submitFeedback(data: any): Observable<any> {
        return this.apiClient.post(routes.submitFeedback, data);
    }
    retryAssignment(data: any): Observable<any> {
        return this.apiClient.post(routes.retryAssignment, data);
    }
    getAssignmentForSession(id: number): Observable<any> {
        return this.apiClient.get(routes.getAssignmentForSession + '?sessionId=' + id);
    }
    deleteSessionAssignment(assignmentId: number, sessionId: number): Observable<any> {
        return this.apiClient.delete(routes.deleteSessionAssignment + '?AssignmentId=' + assignmentId + '&SessionId=' + sessionId);
    }
    GetMentorEngagement(data: any): Observable<any> {
        return this.apiClient.get(routes.GetMentorEngagement, data);
    }
    GetTrendingSession(data: any): Observable<any> {
        return this.apiClient.get(routes.GetTrendingSession, data);
    }
    getTopTrainers(tenantId: number): Observable<any> {
        return this.apiClient.get(routes.getTopTrainers + '?tenantId=' + tenantId);
    }
    //RoleFeature
    getAllRoleFeatures(): Observable<any> {
        return this.apiClient.get(routes.getAllRolefeatures);
    }
    getallrolefeaturedetails(tenantId: number, roleId: number): Observable<any> {
        return this.apiClient.get(routes.getallrolefeaturedetails + '?tenantId=' + tenantId + '&roleId=' + roleId);
    }
    updateRoleFeature(data: any): Observable<any> {
        return this.apiClient.put(routes.updateRoleFeature, data);
    }
    // Delete Role Feature
    deleteRoleFeature(id: number): Observable<any> {
        return this.apiClient.delete(routes.deleteroleFeatures + '?Id=' + id);
    }
    //Get All Roles
    getAllRoles() {
        return this.apiClient.get(routes.getroles);
    }
    //Create Roles
    createRole(data: any): Observable<any> {
        return this.apiClient.post(routes.createRole, data);
    }

    getUsersForSelectedRole(tenantId: number, roleId: number): Observable<any> {
        return this.apiClient.get(routes.getUsersForSelectedRole + '?tenantId=' + tenantId + '&roleId=' + roleId);
    }

    delegateUserRoles(data: any): Observable<any> {
        return this.apiClient.put(routes.delegateUserRoles, data);
    }

    getAllDelegatedRoleUserDetails(): Observable<any> {
        return this.apiClient.get(routes.getAllDelegatedRoleUserDetails);
    }

    removeDelegationForUser(data: any): Observable<any> {
        return this.apiClient.put(routes.removeDelegationForUser, data);
    }

    //Get my Role features
    getMyRoleFeature(id: number): Observable<any> {
        return this.apiClient.get(routes.getmyrolefeature + '?Id=' + id);
    }
    //Add features
    addFeatures(data: any): Observable<any> {
        return this.apiClient.post(routes.addfeatures, data);
    }
    //Update features
    updateFeatures(data: any): Observable<any> {
        return this.apiClient.put(routes.editfeatures, data);
    }
    //Delete features
    deleteFeature(id: number): Observable<any> {
        return this.apiClient.delete(routes.delfeature + '?Id=' + id);
    }

    //Get session details for scheduleId
    getSessionDetails(id: number): Observable<any> {
        return this.apiClient.get(routes.getSessionDetails + '?sessionScheduleId=' + id);
    }

    //Get session details for scheduleId and userId
    getSessionByScheduleIdAndUserId(id: number, platformUserId: number): Observable<any> {
        return this.apiClient.get(`${routes.getSessionDetails}?sessionScheduleId=${id}&userId=${platformUserId}`);
    }

    //Get My Role
    getMyRole(id: number): Observable<any> {
        return this.apiClient.get(routes.getMyRole + '?Id=' + id);
    }
    //Get features
    getAllFeature(): Observable<any> {
        return this.apiClient.get(routes.getAllFeatures);
    }
    //Get All RoleFeatures
    getallrolefeatures() {
        return this.apiClient.get(routes.getallrolefeatures);
    }
    //Add Role Feature Mapping
    addRoleFeature(data): Observable<any> {
        return this.apiClient.post(routes.addrolefeature, data);
    }
    //SystemConfig
    getAllConfig(): Observable<any> {
        return this.apiClient.get(routes.allConfig);
    }
    getConfigurationDetails(id: number): Observable<any> {
        return this.apiClient.get(routes.getConfigurationDetails + '?Id=' + id);
    }

    //Get overall Rating for a session
    getOverallRatingForSession(id: number): Observable<any> {
        return this.apiClient.get(routes.getOverallRatingForSession + '?sessionScheduleId=' + id);
    }

    //Get individual General Feedbacks for a session
    getSessionRatings(id: number): Observable<any> {
        return this.apiClient.get(routes.getSessionRatings + '?sessionScheduleId=' + id);
    }

    //add feedback
    rateSession(data): Observable<any> {
        return this.apiClient.post(routes.addRateSession, data);
    }
    //remove config
    removeConfigId(id): Observable<any> {
        return this.apiClient.delete(routes.removeconfid + '?Id=' + id);
    }
    //Create Config
    addConfig(data): Observable<any> {
        return this.apiClient.post(routes.addconfig, data);
    }
    updateConfigDetails(data): Observable<any> {
        return this.apiClient.put(routes.updateConfig, data);
    }
    // Get user details by platform user id
    getUserDetails(userId: number): Observable<any> {
        return this.apiClient.get(routes.getUserDetails + '?platformUserId=' + userId);
    }

    // getProfile Details
    getUserProfileOfTrainer(platformId: number): Observable<any> {
        return this.apiClient.get(routes.getProfileDetailsOfTrainer + '?platformUserId=' + platformId);
    }
    //Get all tenants
    getTenants(): Observable<any> {
        return this.apiClient.get(routes.getAllTenants);
    }

    getAllTenantTypes(): Observable<any> {
        return this.apiClient.get(routes.getAllTenantTypes);
    }

    getTrainers(tenantId: number): Observable<any> {
        return this.apiClient.get(routes.getTrainers + '?tenantId=' + tenantId);
    }

    getAllSessionsForTrainer(data: any): Observable<any> {
        return this.apiClient.get(routes.getAllSessionsForTrainer, data);
    }

    //Get all Resource tracking details
    getTrackResourceDetails(tenantId: number): Observable<any> {
        return this.apiClient.get(routes.getTrackResourceDetails + '?tenantId=' + tenantId);
    }
    //get SessionTitle
    getSessionTitle(tenantId: number): Observable<any> {
        return this.apiClient.get(routes.getSessionTitle + '?tenantId=' + tenantId);
    }

    getTraineeAttendance(tenantId: number, sessionTitle: string): Observable<any> {
        return this.apiClient.get(routes.getTraineeAttendance + '?tenantId=' + tenantId + '&sessionTitle=' + sessionTitle)
    }
    uploadTraineeAttendance(file, tenantId: number): Observable<any> {
        return this.apiClient.postFile(routes.uploadTraineeAttendance + '?tenantId=' + tenantId, file)
    }
    getTenantId(scheduledSessionId: number, sessionTitle: string): Observable<any> {
        return this.apiClient.get(routes.getTenantId + '?scheduledSessionId=' + scheduledSessionId + '&sessionTitle=' + sessionTitle)
    }

    // Get feedback question_actions
    getFeedbackQuestionList(type: number): Observable<any> {
        return this.apiClient.get(routes.getFeedbackQuestions + '?ratingType=' + type);
    }

    // Import categories
    categoriesImport(file): Observable<any> {
        return this.apiClient.postFile(routes.importCategories, file);
    }

    // Import users
    userImport(file, tenantId: number, roleId: number): Observable<any> {
        return this.apiClient.postFile(routes.importUsers + '?tenantId=' + tenantId + '&roleId=' + roleId, file);
    }
    //Change passwords
    changePassword(data): Observable<any> {
        return this.apiClient.platPost(routes.changepwd, data);
    }

    //Update profile
    updateProfile(data): Observable<any> {
        return this.apiClient.post(routes.updateProfile, data);
    }
    // Import mentee
    // menteeImport(file): Observable<any> {
    //     return this.apiClient.postFile(routes.importMentee, file);
    // }

    // tenantAdminImport(file): Observable<any> {
    //     return this.apiClient.postFile(routes.importTenantAdmin, file);
    // }

    // Get skill list
    getAllSkill(): Observable<any> {
        return this.apiClient.get(routes.skillList);
    }

    // Get Technology List
    getAllTechnology(): Observable<any> {
        return this.apiClient.get(routes.technologyList);
    }

    // Get Micro Tutoring list
    getAllMicroTutorings(): Observable<any> {
        return this.apiClient.get(routes.microtutoringList);
    }

    // Get Certification List
    getAllCertification(): Observable<any> {
        return this.apiClient.get(routes.certificationList);
    }

    // Get Accreditation list
    getAllAccreditation(): Observable<any> {
        return this.apiClient.get(routes.accreditationList);
    }

    // Get mentor by skill
    getMentorSkill(skillId: number): Observable<any> {
        return this.apiClient.get(routes.mentorBySkill + "?id=" + skillId);
    }

    // Send mentor / mentee id and room id
    sendSessionDetails(sessionData): Observable<any> {
        return this.apiClient.post(routes.sessionCodeEmail, sessionData);
    }

    // Create skill
    createSkill(skillData): Observable<any> {
        return this.apiClient.post(routes.createSkill, skillData);
    }

    // Create skill for trainer
    createSkillByUser(userId:number,skillName:string,technologyName:string): Observable<any> {
        return this.apiClient.post(routes.createSkillByUser+ "?userId=" + userId+"&skillName="+skillName+"&technologyName="+technologyName);
    }

    // Create Technology
    createTechonology(techonologyData): Observable<any> {
        return this.apiClient.post(routes.createTechonology, techonologyData);
    }

    // Create Micro Tutoring
    createMicroTutor(microtutoringData): Observable<any> {
        return this.apiClient.post(routes.createMicroTutor, microtutoringData);
    }

    // Create Expertiese
    createExpertise(expertiseData): Observable<any> {
        return this.apiClient.post(routes.createExpertiese, expertiseData);
    }

    // Create Certificate
    createCertificate(certificateData): Observable<any> {
        return this.apiClient.post(routes.createCertificate, certificateData);
    }

    // Create Accreditation
    createAccreditation(accreditationData): Observable<any> {
        return this.apiClient.post(routes.createAccreditation, accreditationData);
    }

    // Generate Teams Meeting link
    generateTeamsMeeting(sessionData): Observable<any> {
        return this.apiClient.post(routes.generateTeamsMeeting, sessionData);
    }

    //Create Approval for External / Outsource Session
    createApproval(approvalData): Observable<any> {
        return this.apiClient.post(routes.createApproval, approvalData);
    }

    //Get all Approvals for a tenant
    getAllApprovals(tenantId: number): Observable<any> {
        return this.apiClient.get(routes.getAllApprovals + '?tenantId=' + tenantId);
    }
    //getAllRecordingApprovals mehtod for get api request
    getAllRecordingApprovals(approverId : number): Observable<any> {
        return this.apiClient.get(routes.getAllRecordingApprovals + '?approverId=' + approverId);
    }
    updateApprovalStatus(approvalData: any): Observable<any> {
        return this.apiClient.put(routes.updateApprovalStatus, approvalData);
    }

    //update recording approvals updated for update api in recording approval
    updateRecordingApprovalStatus(approveRecording: any): Observable<any> {
        return this.apiClient.put(routes.updateRecordingApprovalStatus, approveRecording);
    }

    // Create Schedule one to many
    createScheduleMany(scheduleData): Observable<any> {
        return this.apiClient.post(routes.createSession, scheduleData);
    }

    reScheduleSession(reScheduleData): Observable<any> {
        return this.apiClient.post(routes.reScheduleSession, reScheduleData);
    }

    createScheduleTeamsMeeting(scheduleData): Observable<any> {
        return this.apiClient.post(routes.generateTeamsMeeting, scheduleData);
    }

    // Get Schedules of particuler user
    getAllSchedule(data: IFilters): Observable<any> {
        return this.apiClient.post(routes.getAllSession, data);
    }

    getAllSessionScheduleDetails(data: IFilters): Observable<any> {
        return this.apiClient.post(routes.getAllSessionScheduleDetails, data);
    }

    getJoiningMechanismStatus(tenantId: number): Observable<any> {
        return this.apiClient.get(routes.getSessionJoiningMechanismStatus + '?tenantId=' + tenantId);
    }

    getToken(identity): Observable<any> {
        return this.apiClient.post(routes.getToken + identity);
    }

    getMentorByCriteria(mentorCriteria): Observable<any> {
        return this.apiClient.post(routes.getMentorByCriteria, mentorCriteria);
    }

    getMentorByCriteriaWithMicroTutoring(mentorCriteria): Observable<any> {
        return this.apiClient.post(routes.getMentorByCriteriaWithMicrotutoring, mentorCriteria);
    }

    getAllMenteesOfSession(sessionId:number){
        return this.apiClient.get(routes.getAllMenteesOfSession + '?sessionId=' + sessionId);
    }
    
    checkIfBatchAssociatedWithSession(sessionId:number){
        return this.apiClient.get(routes.checkIfBatchAssociatedWithSession + '?sessionId=' + sessionId);
    }

    getSessionDetailsForAttendanceAsync(sessionScheduleId:number, timeZone:string){
        return this.apiClient.get(routes.getSessionDetailsForAttendanceAsync + '?sessionScheduleId=' + sessionScheduleId+"&timeZone="+timeZone);
    }

    // Get method to find the absentees
    // GetAbsenteesDetailsAsync(sessionId: number, userId: number) {
    //     return this.apiClient.get(routes.getAbsentessDetailsById + '?sessionScheduleId=' + sessionId + '&userId=' + userId);
    // }

    GetAbsenteesDetailsAsync(sessionId: number, userId: number) {
        return this.apiClient.get(routes.getAbsentessDetailsById + '?sessionScheduleId=' + sessionId + '&userId=' + userId);
    }

    
    //create api request for request for recording approval
     createRecordingRequest(data: any): Observable<any> {
        debugger;
        return this.apiClient.post(routes.createRecordingRequest, data);
    }

    getAutoAttendanceReport(internalMeetingId,sessionTitle,sessionDate){
        return this.apiClient.rubyGetFile(routes.getAutoAttendanceReport + '?InternalMeetingId=' + internalMeetingId+"&SessionTitle="+sessionTitle+"&SessionDate="+sessionDate);
    }

    //Add new announcements
    addAnnouncement(announcement: any): Observable<any> {
        return this.apiClient.post(routes.createAnnouncement, announcement);
    }
    //Update Announcement
    updateAnnouncement(updateData: any): Observable<any> {
        return this.apiClient.put(routes.updateAnnouncement, updateData);
    }

    //Get all announcements
    getAllAnnouncements(): Observable<any> {
        return this.apiClient.get(routes.getAllAnnouncements);
    }
    //Update Announcement Status for user
    updateAnnouncementStatusForUser(userId: number, announcementId: number, tenantId: number, roleId: number) {
        return this.apiClient.post(routes.updateAnnouncementStatusForUser + '?UserId=' + userId + '&announcementId=' + announcementId + '&TenantId=' + tenantId + '&RoleId=' + roleId)
    }
    //Get Announcements for user-details
    getAnnouncementsForUser(userId: number, tenantId: number, roleId: number): Observable<any> {
        return this.apiClient.get(routes.getAllAnouncementsForUsers + '?UserId=' + userId + '&TenantId=' + tenantId + '&RoleId=' + roleId);
    }
    getAnnouncement(id: number): Observable<any> {
        return this.apiClient.get(routes.getAnnouncement + '?Id=' + id);
    }
    //Delete announcements
    deleteAnnouncement(data: any): Observable<any> {
        return this.apiClient.post(routes.deleteAnnouncement, data);
    }
    // Get User By Skill
    getUserBySkill(data): Observable<any> {
        return this.apiClient.post(routes.getUsersBySkill, data);
    }
    //Create Tenant
    createTenant(data: any): Observable<any> {
        return this.apiClient.post(routes.createTenant, data);
    }


    // =====Platform API Calls=====

    // Get all tenant details
    getAllTenent(): Observable<any> {
        return this.apiClient.platGet(routes.allTenent);
    }

    // Get user details based on tenant id
    getUser(roleName: string): Observable<any> {
        return this.apiClient.get(routes.allUsers + "?roleName=" + roleName);
    }

    getSession(sessionDetails): Observable<any> {
        return this.apiClient.post(routes.getSessionByQueryString, sessionDetails);
    }

    getCodeLabUrl(): Observable<any> {
        return this.apiClient.get(routes.getCodeLabUrl);
    }

    //Survey
    getAllSurveyList(platformUserId): Observable<any> {
        return this.apiClient.get(routes.getAllSurvey + '?platformUserId=' + platformUserId);
    }

    getSurveyId(id): Observable<any> {
        return this.apiClient.get(routes.surveyId + '?Id=' + id);
    }

    takeSurveyId(surveyData): Observable<any> {
        return this.apiClient.post(routes.takeSurveyById, surveyData);
    }
    updateSurveyQuestion(data): Observable<any> {
        return this.apiClient.post(routes.updateSurevyQuestion, data);
    }
    createSurvey(surveyData): Observable<any> {
        return this.apiClient.post(routes.createSurvey, surveyData);
    }
    createSurveyAnalysis(surveyAnalysisData): Observable<any> {
        return this.apiClient.post(routes.CreateSurveyAnalysis, surveyAnalysisData);
    }

    getMe(): Observable<any> {
        return this.apiClient.platGet(routes.getMe);
    }

    sendSurveyNotification(id: number): Observable<any> {
        return this.apiClient.get(routes.sendSurveyNotification + '?surveyId=' + id);
    }
    sendSurveyNotificationTenant(notificationData): Observable<any> {
        return this.apiClient.post(routes.sendSurveyNotificationTenant, notificationData);
    }

    getSurveyResutById(surveyData): Observable<any> {
        return this.apiClient.post(routes.getSurveyResultById, surveyData);
    }

    //Poll
    createPoll(pollData): Observable<any> {
        return this.apiClient.post(routes.createpoll, pollData);
    }

    updatePoll(pollData): Observable<any> {
        return this.apiClient.post(routes.updatePoll, pollData);
    }

    getPollBySessionId(data): Observable<any> {
        return this.apiClient.post(routes.getPollBySessionId, data);
    }

    getPollById(id): Observable<any> {
        return this.apiClient.get(routes.getPollById + '?Id=' + id);
    }

    //pollAnalysis
    createPollAnalysis(pollAnalysisData): Observable<any> {
        return this.apiClient.post(routes.createPollAnalysis, pollAnalysisData);
    }
    getPollResutById(pollId: number): Observable<any> {
        return this.apiClient.get(routes.getPollResultById + '?pollId=' + pollId);
    }

    //InAppNotification
    sendPollNotification(data): Observable<any> {
        return this.apiClient.post(routes.pollNotification, data)
    }

    getNotification(id: number): Observable<any> {
        return this.apiClient.get(routes.notificationbutton + '?platformUserId=' + id);
    }
    getNotificationsList(id: number): Observable<any> {
        return this.apiClient.get(routes.getNotifications + '?platformUserId=' + id);
    }
    getPopupList(id: number): Observable<any> {
        return this.apiClient.get(routes.getPopupList + '?platformUserId=' + id);
        
    }
    SendEmailAlerts(Name:string,Email:string,Title:string,StartDate:Date,EndDate:Date,SessionUrl:string,platformUserId:number,SessionId:number): Observable<any> {
        return this.apiClient.get(routes.sendEmailAlerts + '?Name=' + Name+"&Email="+ Email+"&Title="+Title+"&StartDate="+StartDate+"&EndDate="+EndDate+"&SessionUrl="+SessionUrl+"&platformUserId="+platformUserId+"&SessionId="+SessionId);
        
    }
    getMentorNotification(id: number): Observable<any> {
        return this.apiClient.get(routes.mentorNotification+ '?platformUserId=' + id );
    }
    SaveNotifySettings(data:any[],type): Observable<any>{
        return this.apiClient.post(routes.saveNotifySettings+'?Type='+type, data);
    }
    getNotifySettings(userid: number,sessionid:number): Observable<any> {
        return this.apiClient.get(routes.getNotifySettings + '?platformUserId=' + userid+'&sessionScheduledId='+sessionid);
    }
   
    joinSession(sessionInputData: any) {
        return this.apiClient.post(routes.joinSession, sessionInputData);
    }

    disconnectSession(disconnectSessionDate: any) {
        return this.apiClient.post(routes.disconnectSession, disconnectSessionDate);
    }

    getVideoPlayBackDetails(scheduleId: number) {
        return this.apiClient.get(`${routes.getVideoPlayBackDetails}?sessionScheduleId=${scheduleId}`);
    }

    isSessionInProgressAsync(sessionScheduleId: number, participantUserId: number) {
        return this.apiClient.get(`${routes.isSessionInProgressAsync}?sessionScheduleId=${sessionScheduleId}&participantUserId=${participantUserId}`);
    }

    connectSessionAsync(connectSession: any) {
        return this.apiClient.post(routes.connectSessionAsync, connectSession);
    }

    updateSessionConnectStatusAsync(updateConnectSession: any) {
        return this.apiClient.post(routes.updateSessionConnectStatusAsync, updateConnectSession);
    }

    getSessionDetailsForFeedbackAsync(sessionDetails: any) {
        return this.apiClient.post(routes.getSessionDetailsForFeedbackAsync, sessionDetails);
    }



    getSessionParticipantRole(sessionScheduleId: number, platformUserId): Observable<any> {
        return this.apiClient.get(routes.getSessionParticipantRole + '?sessionScheduleId=' + sessionScheduleId + '&platformUserId=' + platformUserId);
    }

    logout(): Observable<any> {
        return this.apiClient.platPost(routes.logout);
    }

    getMentorOnlineHours(data: any): Observable<any> {
        return this.apiClient.post(routes.getMentorOnlineHours, data);
    }

    getOnlineUsers(tenantId: number): Observable<any> {
        return this.apiClient.get(routes.getOnlineUsers + '?tenantId=' + tenantId);
    }

    getAllTenantsForSurvey(surveyId: number): Observable<any> {
        return this.apiClient.get(routes.getAllTenantForSurvey + '?surveyId=' + surveyId);
    }

    reSendTenantNotification(notificationData: any): Observable<any> {
        return this.apiClient.post(routes.reSendTenantNotification, notificationData);
    }

    sessionTiming(data: any): Observable<any> {
        return this.apiClient.post(routes.sessionTiming, data);
    }

    totalUsers(tenantId: number): Observable<any> {
        return this.apiClient.get(routes.totalUsers + '?tenantId=' + tenantId);
    }

    GetUserDetailsForSelectedTenant(tenantId: number): Observable<any> {
        return this.apiClient.get(routes.GetUserDetailsForSelectedTenant + '?tenantId=' + tenantId);
    }

    getUsersWithTrainerPermission(tenantId: number): Observable<any> {
        return this.apiClient.get(routes.getUsersWithTrainerPermission + '?tenantId=' + tenantId);
    }

    createForumTopicAsync(forumData: any): Observable<any> {
        return this.apiClient.post(routes.createForumTopicAsync, forumData);
    }

    updateForumTopicAsync(forumData: any): Observable<any> {
        return this.apiClient.post(routes.updateForumTopic, forumData);
    }

    filterForumTopicAsync(forumData: any): Observable<any> {
        return this.apiClient.post(routes.filterForumTopicAsync, forumData);
    }

    getForumTopic(id: number): Observable<any> {
        return this.apiClient.get(routes.getForumTopic + '?topicId=' + id);
    }

    forumVote(forumData: any): Observable<any> {
        return this.apiClient.post(routes.forumVote, forumData);
    }

    addCommentAndReply(commentData: any): Observable<any> {
        return this.apiClient.post(routes.addCommentAndReply, commentData);
    }

    trendingTopicSkills(tenantId: number): Observable<any> {
        return this.apiClient.get(routes.trendingTopicSkills + '?tenantId=' + tenantId);
    }

    postCommentAndReply(commentData: any): Observable<any> {
        return this.apiClient.post(routes.postCommentAndReply, commentData);
    }

    deleteForumTopic(deleteData: any): Observable<any> {
        return this.apiClient.post(routes.deleteForumTopic, deleteData);
    }

    loadMyDiscussion(userId: number): Observable<any> {
        return this.apiClient.get(routes.latestDiscussion + '?platformUserId=' + userId);
    }

    editCommentOrReply(editData: any): Observable<any> {
        return this.apiClient.post(routes.editCommentOrReply, editData);
    }

    deleteCommentOrReply(deleteData: any): Observable<any> {
        return this.apiClient.post(routes.deleteCommentOrReply, deleteData);
    }

    createBlog(data: any): Observable<any> {
        return this.apiClient.post(routes.createBlog, data);
    }

    updateBlog(data: any, isFileUpdate: boolean): Observable<any> {
        return this.apiClient.post(routes.updateBlog + '?isFileUpdated=' + isFileUpdate, data);
    }

    getAllBlogs(): Observable<any> {
        return this.apiClient.get(routes.getAllBlogs);
    }

    getBlog(id: number): Observable<any> {
        return this.apiClient.get(routes.getBlog + '?blogId=' + id);
    }

    downVote(id: number): Observable<any> {
        return this.apiClient.get(routes.downVote + '?blogId=' + id);
    }

    upVote(id: number): Observable<any> {
        return this.apiClient.get(routes.upVote + '?blogId=' + id);
    }

    deleteBlog(id: number, userId: number): Observable<any> {
        return this.apiClient.delete(routes.deleteBlog + '?blogId=' + id + '&userId=' + userId);
    }

    addComment(data: any): Observable<any> {
        return this.apiClient.post(routes.addComment, data);
    }

    deleteComment(id: number): Observable<any> {
        return this.apiClient.delete(routes.deleteComment + '?blogId=' + id);
    }

    updateComment(data: any): Observable<any> {
        return this.apiClient.post(routes.updateComment, data);
    }

    getAllComments(blogId: number): Observable<any> {
        return this.apiClient.get(routes.getAllComments + '?blogId=' + blogId);
    }
    uploadToBlob(file: any): Observable<any> {
        return this.apiClient.postFile(routes.uploadToBlob, file);
    }
    // for registration Method
    singleRegistration(data: any): Observable<any> {
        return this.apiClient.postFile(routes.singleUserRegistration, data);
    }

    selfRegistration(data: any): Observable<any> {
        return this.apiClient.postFile(routes.selfRegistration, data);
    }
    //
    UpdateExternalParticipant(email:string,sessionCode:string):Observable<any>{
        return this.apiClient.postFile(routes.UpdateExternalParticipant + '?email=' + email + '&sessionCode=' + sessionCode);
    }

    getEmailVerification(email: string) {
        return this.apiClient.get(routes.emailVerification + '?email=' + email);
    }

    getPersonalInfo(platformId: number): Observable<any> {
        return this.apiClient.get(routes.getPersonalInfo + '?platformUserId=' + platformId);
    }

    getEducationQualification(plateformId: number): Observable<any> {
        return this.apiClient.get(routes.getEducationQualification + '?platformUserId=' + plateformId);
    }

    getResearchDevelopment(plateformId: number): Observable<any> {
        return this.apiClient.get(routes.getResearchDevelopment + '?platformUserId=' + plateformId);
    }

    updatePersonalInfo(plateformId: number, data: any) {
        return this.apiClient.put(routes.updatePersonalInfo + '?platformUserId=' + plateformId, data);
    }

    updateEducationQualification(plateformId: number, data: any) {
        return this.apiClient.put(routes.updateEducationQualification + '?platformUserId=' + plateformId, data);
    }

    updateResearchDevelopmentInfo(plateformId: number, data: any) {
        return this.apiClient.put(routes.updateResearchDevelopment + '?platformUserId=' + plateformId, data);
    }

    getExperienceDetails(plateformId: number): Observable<any> {
        return this.apiClient.get(routes.getExperienceDetails + '?platformUserId=' + plateformId);
    }

    getCostCalCulationDetails(plateformId: number): Observable<any> {
        return this.apiClient.get(routes.getCostCalCulationDetails + '?platformUserId=' + plateformId);
    }

    getOrganizationDetails(plateformId: number): Observable<any> {
        return this.apiClient.get(routes.getOrganizationDetails + '?platformUserId=' + plateformId);
    }

    getLanguages(): Observable<any> {
        return this.apiClient.get(routes.getLanguages);
    }

    updateExperienceDetails(plateformId: number, data: any) {
        return this.apiClient.put(routes.updateExperienceDetails + '?platformUserId=' + plateformId, data);
    }

    updateCostCalCulation(plateformId: number, data: any) {
        return this.apiClient.put(routes.updateCostCalCulation + '?platformUserId=' + plateformId, data);
    }

    updateOrganizationDetails(plateformId: number, data: any) {
        return this.apiClient.put(routes.updateOrganizationDetails + '?platformUserId=' + plateformId, data);
    }
    updateUserUploadDocument(file: any, plateformId: any) {
        return this.apiClient.putFile(routes.updateUserProfileDocToBlob + '?userId=' + plateformId, file);
    }

    getAllLanguageList(): Observable<any> {
        return this.apiClient.get(routes.getAllLanguageId);
    }

    getAllDurationType(): Observable<any> {
        return this.apiClient.get(routes.getAllDurationType);
    }

    getSessionSchedulesByTenantId(tenantId: number) {
        return this.apiClient.get(routes.getSessionSchedulesByTenantId + '?tenantId=' + tenantId);
    }

    searchUserSessionStatus(data: any) {
        return this.apiClient.post(routes.searchUserSessionStatus, data);
    }

    searchParticipantsLateForSession(data: any) {
        return this.apiClient.post(routes.searchParticipantsLateForSession, data);
    }

    getAllParticipantInSession(sessionScheduleId: any): Observable<any> {
        return this.apiClient.get(routes.getAllParticipantInSession + '?sessionScheduleId=' + sessionScheduleId)
    }

    trainerFeedback(data: any): Observable<any> {
        return this.apiClient.post(routes.trainerFeedback, data);
    }

    trainerBulkFeedback(data: any): Observable<any> {
        return this.apiClient.post(routes.trainerBulkFeedback, data);
    }

    getSessionDetailsById(sessionId: number) {
        return this.apiClient.get(routes.getSessionDetailsById + '?sessionScheduleId=' + sessionId);
    }

    getSessionParticipantDetailsById(sessionId: number, userId: number) {
        return this.apiClient.get(routes.getSessionParticipantDetailsById + '?sessionScheduleId=' + sessionId + '&userId=' + userId);
    }

    joinSessionDetails(sessionId: number, userId: number) {
        return this.apiClient.get(routes.joinSessionDetails + '?sessionScheduleId=' + sessionId + '&platformUserId=' + userId);
    }

    getTraineeFeedbackByTraineeId(traineeUserId: any): Observable<any> {
        return this.apiClient.get(routes.getTraineeFeedbackByTraineeId + '?traineeUserId=' + traineeUserId)
    }
    getTraineeFeedbackByTrainerId(trainerUserId: any): Observable<any> {
        return this.apiClient.get(routes.getTraineeFeedbackByTrainerId + '?trainerUserId=' + trainerUserId)
    }
    getSiteAdminFeedback() {
        return this.apiClient.get(routes.getSiteAdminFeedback);
    }
    GetSuperAdminFeedbackDetails(tenantId) {
        return this.apiClient.get(routes.getSuperAdminFeedbackDetails + '?tenantId=' + tenantId)
    }

    getUploadUserDocuments(plateformId: any) {
        return this.apiClient.get(routes.getUploadUserDocument + '?userId=' + plateformId);
    }

    createBatch(data: any): Observable<any> {
        return this.apiClient.post(routes.batchCreation, data);
    }

    addMemmbersListToBatch(data: any) {
        return this.apiClient.post(routes.addMemberList, data);
    }

    getBatchList(tenetId: number) {
        return this.apiClient.get(routes.getBatchList + '?tenantId=' + tenetId);
    }

    deleteBatch(data: any): Observable<any> {
        return this.apiClient.post(routes.deletebatch, data);
    }

    getMembersList(batchId: number) {
        return this.apiClient.get(routes.getBatchMemberList + '?batchId=' + batchId);
    }

    deleteMembersListFromBatch(data: any) {
        return this.apiClient.post(routes.addMemberList, data);
    }

    updatebatch(data: any) {
        return this.apiClient.post(routes.updateBatch, data);
    }

    getResourceID(tenantId: number, sessionTitleName: string) {
        return this.apiClient.get(routes.getResourceDetail + '?tenantId=' + tenantId + '&sessionTitleName=' + sessionTitleName);
    }

    createBatchResourceForSession(data: any) {
        return this.apiClient.post(routes.createBatchResourceSession, data);
    }

    getResourceType(): Observable<any> {
        return this.apiClient.get(routes.getResourceType);
    }

    //ResourceSharing
    createResource(data: any): Observable<any> {
        return this.apiClient.postFile(routes.createResource, data);
    }

    submitAssignmentAsync(file, assignmentAssigneeMappingId: number, submissionNotes: string): Observable<any> {
        return this.apiClient.postFile(routes.submitAssignmentAsync + '?assignmentAssigneeMappingId=' + assignmentAssigneeMappingId + '&submissionNotes=' + submissionNotes, file);
    }

    updateAssignmentApprovalStatus(data: any): Observable<any> {
        return this.apiClient.post(routes.updateAssignmentApprovalStatus, data);
    }

    shareResources(data: any): Observable<any> {
        return this.apiClient.post(routes.shareResources, data);
    }

    getCreatedBy(tenantId: number, userId: number, isReadAllPermission: boolean) {
        return this.apiClient.get(routes.getCreatedBy + '?tenantId=' + tenantId + '&userId=' + userId + '&isReadAllPermission=' + isReadAllPermission);
    }

    getReviewer(tenantId: number, userId: number, isReadAllPermission: boolean) {
        return this.apiClient.get(routes.getReviewer + '?tenantId=' + tenantId + '&userId=' + userId + '&isReadAllPermission=' + isReadAllPermission);
    }

    getResourcesTrackDetail(): Observable<any> {
        return this.apiClient.get(routes.getResourcesTrackDetail);
    }

    getAllResources(tenantId: number, skillId: number, createdBy: number, reviewerId: number): Observable<any> {
        return this.apiClient.get(routes.getAllResources + '?tenantId=' + tenantId + '&skillId=' + skillId + '&createdBy=' + createdBy + '&reviewerId=' + reviewerId);
    }

    getBlobDownloadURL(resourceId: number, assigneeMappingId: number, resourceTypeId: number, userId: number) {
        return this.apiClient.get(routes.getBlobDownloadURL + '?resourceId=' + resourceId + '&assigneeMappingId=' + assigneeMappingId + '&resourceTypeId=' + resourceTypeId + '&userId=' + userId);
    }

    getResourceShareStatusDetails(traineeId: number, tenantId: number, resourceShareTypeId: number, resourceShareId: number, isReadAllPermission: boolean) {
        return this.apiClient.get(routes.getResourceShareStatusDetails + '?traineeId=' + traineeId + '&tenantId=' + tenantId + '&resourceShareTypeId=' + resourceShareTypeId + '&resourceShareId=' + resourceShareId + '&readAllPermission=' + isReadAllPermission);
    }

    getResourceTypes() {
        return this.apiClient.get(routes.getResourceTypes);
    }

    getAllSessionsForTenant(tenantId: number): Observable<any> {
        return this.apiClient.get(routes.getAllSessionsForTenant + '?tenantId=' + tenantId);
    }

    getAllTrainerTraineeDetails(tenantId: number): Observable<any> {
        return this.apiClient.get(routes.getAllTrainerTraineeDetails + '?tenantId=' + tenantId);
    }
    saveThemeDetails(tenantId: number,theme:string,color:string,CreatedBy:number){
        return this.apiClient.post(routes.saveThemeDetails + '?tenantId=' + tenantId + '&theme=' + theme+'&color='+color+'&CreatedBy='+CreatedBy);
    }
    getThemeDetails(tenantId: number): Observable<any> {
        return this.apiClient.get(routes.getThemeDetails + '?tenantId=' + tenantId);
    }
    getAutoCompleteSearch(name:string):Observable<any>{
        return this.apiClient.get(routes.getAutoCompleteSearch+'?name='+name);
    }
    getFullTextSearch(name:string):Observable<any>{
        return this.apiClient.get(routes.getFullTextSearch+'?name='+name);
    }
    getUsersByName(name:string):Observable<any>{
        return this.apiClient.get(routes.getUsersByName+'?name='+name);
    }
    getGlobalResource(tenantId:number,name:string):Observable<any>{
        return this.apiClient.get(routes.getGlobalResource+'?tenantId='+tenantId+'&name='+name);
    }
    getGlobalAssignment(name:string):Observable<any>{
        return this.apiClient.get(routes.getGlobalAssignment+'?name='+name);
    }
    getGlobalAnnouncement(name:string):Observable<any>{
        return this.apiClient.get(routes.getGlobalAnnouncement+'?name='+name);
    }
    getGlobalServey(name:string):Observable<any>{
        return this.apiClient.get(routes.getGlobalServey+'?name='+name);
    }
    getGlobalPressRelease(name:string):Observable<any>{
        return this.apiClient.get(routes.getGlobalPressRelease+'?name='+name);
    }
    getGlobalBlog(name:string):Observable<any>{
        return this.apiClient.get(routes.getGlobalBlog+'?name='+name);
    }
    getGlobalBatch(tenantId:number,name:string):Observable<any>{
        return this.apiClient.get(routes.getGlobalBatch+'?tenantId='+tenantId+'&name='+name);
    }
    guestUserSessionJoinUrl(sessionCode:string,firstName:string,lastName:string):Observable<any>{
        return this.apiClient.get(routes.guestUserSessionJoinUrl+'?sessionCode='+sessionCode+'&firstName='+firstName+'&lastName='+lastName);
    }

    //Enablex dialout service class
    createRoom(createRoomData:any):Observable<any> {
        return this.apiClient.post(routes.createRoom, createRoomData);
    }
    getAuthToken(tokenData:any):Observable<any> {
        return this.apiClient.post(routes.getAuthToken, tokenData);
    }
    getRoomData(roomId: string):Observable<any> {
        return this.apiClient.get(routes.getRoomData + '?roomId=' + roomId);
    }
    saveDialoutDetail(dialoutDto:any):Observable<any>{
        return this.apiClient.post(routes.saveDialoutDetail, dialoutDto);
    }
    getCLINumber():Observable<any>{
        return this.apiClient.get(routes.getCLINumber);
    }
    getUserAvilability(plateformId: any) {
        return this.apiClient.get(routes.getUserAvilability + '?platformUserId=' + plateformId);
    }

    updateUserAvilability(data){
        return this.apiClient.post(routes.updateUserAvilability, data);
    }

}
