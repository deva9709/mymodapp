import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { JsonpModule } from "@angular/http";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { ModalModule } from "ngx-bootstrap";
import { NgxPaginationModule } from "ngx-pagination";
import { Ng2SearchPipeModule } from "ng2-search-filter";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { AbpModule } from "@abp/abp.module";
import { ServiceProxyModule } from "@shared/service-proxies/service-proxy.module";
import { SharedModule } from "@shared/shared.module";
import { NgIdleKeepaliveModule } from "@ng-idle/keepalive";
import { LoginService } from "../account/login/login.service";
import { HomeComponent } from "@app/home/home.component";
import { TopBarComponent } from "@app/layout/topbar.component";
import { ChatComponent } from "@app/chat/chat.component";
// tenants
import { TenantsComponent } from "@app/tenants/tenants.component";
import { CreateTenantDialogComponent } from "./tenants/create-tenant/create-tenant-dialog.component";
import { EditTenantDialogComponent } from "./tenants/edit-tenant/edit-tenant-dialog.component";
// roles
import { RolesComponent } from "@app/roles/roles.component";
import { CreateRoleDialogComponent } from "./roles/create-role/create-role-dialog.component";
import { EditRoleDialogComponent } from "./roles/edit-role/edit-role-dialog.component";
// users
import { UsersComponent } from "@app/users/users.component";
import { CreateUserDialogComponent } from "@app/users/create-user/create-user-dialog.component";
import { EditUserDialogComponent } from "@app/users/edit-user/edit-user-dialog.component";
import { ChangePasswordComponent } from "./users/change-password/change-password.component";
import { ResetPasswordDialogComponent } from "./users/reset-password/reset-password.component";
import { TokenizedInterceptor } from "@shared/Interceptor/TokenizedInterceptor";
import { SafePipe } from "./service/common/safe.pipe";
import { RatingModule } from "ng-starrating";
import { ScrollTopComponent } from "./shared/scroll-top/scroll-top.component";
import { DragDropDirective } from "./drag-drop.directive";
import { CookieService } from "ngx-cookie-service";
import { SearchComponent } from "./search/search.component";
import { AdmindashboardComponent } from "./admindashboard/admindashboard.component";
import { MentordashboardComponent } from "./mentordashboard/mentordashboard.component";
import { MentorcategoriesComponent } from "./mentorcategories/mentorcategories.component";
import { SysConfigComponent } from "./sys-config/sys-config.component";
import { ImportUserComponent } from "./import-user/import-user.component";
import { ViewUserComponent } from "./view-user/view-user.component";
import { MentorreviewComponent } from "./mentorreview/mentorreview.component";
import { SearchMentorComponent } from "./search-mentor/search-mentor.component";
import { MyProfileComponent } from "./my-profile/my-profile.component";
import { MySessionsComponent } from "./my-sessions/my-sessions.component";
// Third Party
import { TabsModule } from "ngx-bootstrap/tabs";
import { ModSessionsComponent } from "./mod-sessions/mod-sessions.component";
import { VideoSessionComponent } from './video-session/video-session.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { JoinSessionComponent } from './join-session/join-session.component';
import { RoleManagementComponent } from './role-management/role-management.component';
import { SurveyListComponent } from './survey-list/survey-list.component';
import { SurveyComponent } from './survey/survey.component';
import { SurveyCreatorComponent } from './survey-creator/survey-creator.component';
import { WhiteboardComponent } from './whiteboard/whiteboard.component';
import { AddAssignmentsComponent } from './add-assignments/add-assignments.component';
import { LmsConferenceComponent } from './lms-conference/lms-conference.component';
import { PollResponseComponent } from './poll-response/poll-response.component';
import { SessionFeedbackComponent } from './session-feedback/session-feedback.component';
import { SurveyAnalysisComponent } from './survey-analysis/survey-analysis.component';
import { OverallFeedbackComponent } from './overall-feedback/overall-feedback.component';
import { PollCreatorComponent } from './poll-creator/poll-creator.component';
import { PollAnalysisComponent } from './poll-analysis/poll-analysis.component';
import { VideoPlayerComponent } from './video-player/video-player.component';
import { OneToOneCollaborationComponent } from './one-to-one-collaboration/one-to-one-collaboration.component';
import { CollaborationControlsComponent } from './collaboration-controls/collaboration-controls.component';
import { TenantNotificationModalComponent } from './survey-list/tenant-notification-modal/tenant-notification-modal.component';
import { ReviewAssignmentsComponent } from './review-assignments/review-assignments.component';
import { AnnouncementsComponent } from './announcements/announcements.component';
import { ModSessionDetailsComponent } from './mod-session-details/mod-session-details.component';
import { MenteeSessionDetailsComponent } from './mod-sessions/mentee-session-details/mentee-session-details.component';
import { DeleteFeatureComponent } from './dialog/delete-feature/delete-feature.component';
import { ViewAssignmentDocumentComponent } from './view-assignment-document/view-assignment-document.component';
import { UpdateConfigComponent } from './dialog/update-config/update-config.component';
import { DeleteConfigComponent } from './dialog/delete-config/delete-config.component';
import { SessionDetailCardComponent } from './session-detail-card/session-detail-card.component';
import { DeleteAssignmentComponent } from "./dialog/delete-assignment/delete-assignment.component";
import { NewAnnouncementComponent } from "./dialog/new-announcement/new-announcement.component";
import { DeleteAnnouncementComponent } from "./dialog/delete-announcement/delete-announcement.component";
import { OneToManyCollaborationComponent } from './one-to-many-collaboration/one-to-many-collaboration.component';
import { ForumsComponent } from './forums/forums.component';
import { NewTopicComponent } from './dialog/new-topic/new-topic.component';
import { QuestionComponent } from './forums/question/question.component';
import { DeleteSessionDialogComponent } from "./dialog/delete-session-dialog/delete-session-dialog.component";
import { RescheduleSessionDialogComponent } from './dialog/reschedule-session-dialog/reschedule-session-dialog.component'
import { PressRoomComponent } from './press-room/press-room.component';
import { SurveyNameDialogComponent } from './survey-creator/survey-name-dialog/survey-name-dialog.component';
import { DeleteCommentComponent } from './dialog/delete-comment/delete-comment.component';
import { BlogComponent } from './blog/blog.component';
import { BlogTopicComponent } from './blog/blog-topic/blog-topic.component';
import { NewBlogTopicComponent } from "./blog/new-topic/new-topic.component";
import { DeleteBlogComponent } from './dialog/delete-blog/delete-blog.component';
import { PressReleaseComponent } from './press-room/press-release/press-release.component';
import { DeletePressComponent } from './dialog/delete-press/delete-press.component';
import { DeleteForumTopicComponent } from './dialog/delete-forum-topic/delete-forum-topic.component';
import { EditForumCommentComponent } from './dialog/edit-forum-comment/edit-forum-comment.component';
import { RemoveAssignmentComponent } from './dialog/remove-assignment/remove-assignment.component';
import { UpdatePressreleaseComponent } from './dialog/update-pressrelease/update-pressrelease.component';
import { ForumTopicListComponent } from './forums/forum-topic-list/forum-topic-list.component';
import { QuillModule } from 'ngx-quill';
import { UpdatePasswordComponent } from './my-profile/update-password/update-password.component';
import { MAT_DATE_LOCALE } from "@angular/material";
import { ViewMoreDetailsComponent } from "./dialog/view-more-details/view-more-details.component";
import { UserRegistrationComponent } from './user-registration/user-registration.component';
import { ReportsComponent } from './reports/reports.component';
import { RemoveDelegationComponent } from './dialog/remove-delegation/remove-delegation.component';
import { CreateTenantComponent } from './dialog/create-tenant/create-tenant.component';
import { UserSearchComponent } from './user-search/user-search.component';
//calendar
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { CalendarViewComponent } from './calendar-view/calendar-view.component';
import { ViewCalendarEventsComponent } from './dialog/view-calendar-events/view-calendar-events.component';
import { SessionDetailsComponent } from './session-details/session-details.component';
import { SessionDetailsTabsComponent } from './session-details-tabs/session-details-tabs.component';
import { ParticipantDetailsComponent } from './participant-details/participant-details.component';
import { MaterialFileInputModule } from 'ngx-material-file-input';
import { ShareResourceComponent } from './share-resource/share-resource.component';
import { ResourceAssignmentComponent } from './share-resource/resource-assignment/resource-assignment.component';
import { ShareComponent } from './dialog/share/share.component';
import { MenteeUploadAssignmentComponent } from './dialog/mentee-upload-assignment/mentee-upload-assignment.component';
import { ViewResourceComponent } from './view-resource/view-resource.component';
import { ResourceUploadComponent } from './view-resource/resource-upload/resource-upload.component';
import { DownloadDocumentComponent } from './dialog/download-document/download-document.component';
import { DownloadReadingmaterialComponent } from './dialog/download-readingmaterial/download-readingmaterial.component';
import { AssessmentUrlComponent } from './dialog/assessment-url/assessment-url.component';
import { ViewApprovalDetailsComponent } from './dialog/view-approval-details/view-approval-details.component';
import { RejectApprovalComponent } from './dialog/reject-approval/reject-approval.component';
import { BatchCreationComponent } from './batch-creation/batch-creation.component';
import { AddMembersComponent } from './dialog/add-members/add-members.component';
import { DeleteBatchComponent } from './dialog/delete-batch/delete-batch.component';
import { TraineeAttendanceComponent } from './dialog/trainee-attendance/trainee-attendance.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { FullFeedbackdetailsComponent } from './dialog/full-feedbackdetails/full-feedbackdetails.component';
import { AddSkillComponent } from './dialog/add-skill/add-skill.component';
//time picker
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import {MatPaginatorModule} from '@angular/material/paginator';
import { ExternalJoinSessionComponent } from './external-join-session/external-join-session.component';
import { MenuItemComponent } from './menu-item/menu-item.component';
import { ChartsModule } from "ng2-charts";
import { GlobalSearchresultComponent } from './dialog/global-searchresult/global-searchresult.component';
import { SessionRecordingsComponent } from './dialog/session-recordings/session-recordings.component';
import { SessionAutoAttendanceComponent } from './dialog/session-auto-attendance/session-auto-attendance.component';
import { NotificationSettingsComponent } from './notification-settings/notification-settings.component';
import { EnumToArrayPipe } from './pipes/enum-to-array.pipe';
import { DialoutComponent } from './dialout/dialout.component';
import { RecordingApprovalComponent } from './recording-approval/recording-approval.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    TopBarComponent,
    SafePipe,
    ChatComponent,
    // tenants
    TenantsComponent,
    CreateTenantDialogComponent,
    EditTenantDialogComponent,
    // roles
    RolesComponent,
    CreateRoleDialogComponent,
    EditRoleDialogComponent,
    // users
    UsersComponent,
    CreateUserDialogComponent,
    EditUserDialogComponent,
    ChangePasswordComponent,
    ResetPasswordDialogComponent,
    ScrollTopComponent,
    DragDropDirective,
    SearchComponent,
    AdmindashboardComponent,
    MentordashboardComponent,
    MentorcategoriesComponent,
    SysConfigComponent,
    ImportUserComponent,
    ViewUserComponent,
    MentorreviewComponent,
    SearchMentorComponent,
    MyProfileComponent,
    MySessionsComponent,
    ModSessionsComponent,
    VideoSessionComponent,
    JoinSessionComponent,
    RoleManagementComponent,
    SurveyListComponent,
    SurveyComponent,
    SurveyCreatorComponent,
    WhiteboardComponent,
    AddAssignmentsComponent,
    LmsConferenceComponent,
    PollResponseComponent,
    SessionFeedbackComponent,
    SurveyAnalysisComponent,
    PollCreatorComponent,
    PollAnalysisComponent,
    OverallFeedbackComponent,
    VideoPlayerComponent,
    OneToOneCollaborationComponent,
    CollaborationControlsComponent,
    TenantNotificationModalComponent,
    TenantNotificationModalComponent,
    ReviewAssignmentsComponent,
    AnnouncementsComponent,
    NewAnnouncementComponent,
    ModSessionDetailsComponent,
    MenteeSessionDetailsComponent,
    DeleteFeatureComponent,
    ViewAssignmentDocumentComponent,
    UpdateConfigComponent,
    DeleteConfigComponent,
    SessionDetailCardComponent,
    DeleteAssignmentComponent,
    DeleteAnnouncementComponent,
    OneToManyCollaborationComponent,
    DeleteSessionDialogComponent,
    RescheduleSessionDialogComponent,
    ForumsComponent,
    NewTopicComponent,
    QuestionComponent,
    DeleteCommentComponent,
    PressRoomComponent,
    SurveyNameDialogComponent,
    BlogComponent,
    BlogTopicComponent,
    NewBlogTopicComponent,
    DeleteBlogComponent,
    PressReleaseComponent,
    DeletePressComponent,
    DeleteForumTopicComponent,
    EditForumCommentComponent,
    UpdatePressreleaseComponent,
    ForumTopicListComponent,
    UpdatePressreleaseComponent,
    RemoveAssignmentComponent,
    UpdatePasswordComponent,
    ViewMoreDetailsComponent,
    UserRegistrationComponent,
    ReportsComponent,
    RemoveDelegationComponent,
    CreateTenantComponent,
    UserSearchComponent,
    CalendarViewComponent,
    ViewCalendarEventsComponent,
    SessionDetailsComponent,
    SessionDetailsTabsComponent,
    ParticipantDetailsComponent,
    ShareResourceComponent,
    ResourceAssignmentComponent,
    ShareComponent,
    MenteeUploadAssignmentComponent,
    ViewResourceComponent,
    ResourceUploadComponent,
    DownloadDocumentComponent,
    DownloadReadingmaterialComponent,
    AssessmentUrlComponent,
    ViewApprovalDetailsComponent,
    RejectApprovalComponent,
    BatchCreationComponent,
    AddMembersComponent,
    DeleteBatchComponent,
    TraineeAttendanceComponent,
    FeedbackComponent,
    FullFeedbackdetailsComponent,
    AddSkillComponent,
    ExternalJoinSessionComponent,
    MenuItemComponent,
    GlobalSearchresultComponent,
    SessionRecordingsComponent,
    SessionAutoAttendanceComponent,
    NotificationSettingsComponent,
    EnumToArrayPipe,
    DialoutComponent,
    RecordingApprovalComponent    
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    JsonpModule,
    ModalModule.forRoot(),
    AbpModule,
    AppRoutingModule,
    ServiceProxyModule,
    SharedModule,
    NgxPaginationModule,
    Ng2SearchPipeModule,
    RatingModule,
    MatPaginatorModule,
    NgIdleKeepaliveModule.forRoot(),
    TabsModule.forRoot(),
    NgMultiSelectDropDownModule.forRoot(),    
    QuillModule.forRoot(),
    //BrowserAnimationsModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    MaterialFileInputModule,
    NgxMaterialTimepickerModule,
    ChartsModule
  ],
  exports:[MatPaginatorModule],
  providers: [
    CookieService,
    LoginService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenizedInterceptor,
      multi: true
    },
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }
  ],
  entryComponents: [
    // tenants
    CreateTenantDialogComponent,
    EditTenantDialogComponent,
    // roles
    CreateRoleDialogComponent,
    EditRoleDialogComponent,
    // users
    CreateUserDialogComponent,
    EditUserDialogComponent,
    ResetPasswordDialogComponent,
    //survey
    TenantNotificationModalComponent,
    SurveyNameDialogComponent,
    // Announcements
    NewAnnouncementComponent,
    DeleteAnnouncementComponent,
    MenteeSessionDetailsComponent,
    DeleteFeatureComponent,
    ViewAssignmentDocumentComponent,
    UpdateConfigComponent,
    DeleteConfigComponent,
    DeleteAssignmentComponent,
    DeleteSessionDialogComponent,
    RescheduleSessionDialogComponent,
    NewTopicComponent,
    DeleteCommentComponent,
    DeleteForumTopicComponent,
    DeleteBlogComponent,
    DeletePressComponent,
    EditForumCommentComponent,
    RemoveAssignmentComponent,
    UpdatePressreleaseComponent,
    UpdatePasswordComponent,
    NewBlogTopicComponent,
    ViewMoreDetailsComponent,
    RemoveDelegationComponent,
    CreateTenantComponent,
    //calendar
    ViewCalendarEventsComponent,
    MenteeUploadAssignmentComponent,
    ResourceUploadComponent,
    MenteeUploadAssignmentComponent,
    ShareComponent,
    DownloadDocumentComponent,
    DownloadReadingmaterialComponent,
    AssessmentUrlComponent,
    ViewApprovalDetailsComponent,
    RejectApprovalComponent,
    AddMembersComponent,
    DeleteBatchComponent,
    TraineeAttendanceComponent,
    FullFeedbackdetailsComponent,
    AddSkillComponent,
    GlobalSearchresultComponent,
    SessionRecordingsComponent,
    SessionAutoAttendanceComponent
  ]
})
export class AppModule { }
