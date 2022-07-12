import { NgModule, Component } from "@angular/core";
import { RouterModule } from "@angular/router";
import { AppComponent } from "./app.component";
import { AppRouteGuard } from "@shared/auth/auth-route-guard";
import { HomeComponent } from "./home/home.component";
import { UsersComponent } from "./users/users.component";
import { TenantsComponent } from "./tenants/tenants.component";
import { RolesComponent } from "app/roles/roles.component";
import { ChangePasswordComponent } from "./users/change-password/change-password.component";
import { TopBarComponent } from "./layout/topbar.component";
import { ChatComponent } from "./chat/chat.component";
import { AdmindashboardComponent } from "./admindashboard/admindashboard.component";
import { MentordashboardComponent } from "./mentordashboard/mentordashboard.component";
import { MentorcategoriesComponent } from "./mentorcategories/mentorcategories.component";
import { ImportUserComponent } from "./import-user/import-user.component";
import { ViewUserComponent } from "./view-user/view-user.component";
import { MentorreviewComponent } from "./mentorreview/mentorreview.component";
import { SysConfigComponent } from "./sys-config/sys-config.component";
import { SearchMentorComponent } from "./search-mentor/search-mentor.component";
import { MyProfileComponent } from "./my-profile/my-profile.component";
import { MySessionsComponent } from "./my-sessions/my-sessions.component";
import { ModSessionsComponent } from "./mod-sessions/mod-sessions.component";
import { VideoSessionComponent } from "./video-session/video-session.component";
import { JoinSessionComponent } from './join-session/join-session.component';
import { RoleManagementComponent } from "./role-management/role-management.component";
import { SurveyListComponent } from "./survey-list/survey-list.component";
import { SurveyComponent } from "./survey/survey.component";
import { SurveyCreatorComponent } from "./survey-creator/survey-creator.component";
import { WhiteboardComponent } from './whiteboard/whiteboard.component';
import { AddAssignmentsComponent } from "./add-assignments/add-assignments.component";
import { LmsConferenceComponent } from "./lms-conference/lms-conference.component";
import { PollResponseComponent } from "./poll-response/poll-response.component";
import { SessionFeedbackComponent } from "./session-feedback/session-feedback.component";
import { SurveyAnalysisComponent } from "./survey-analysis/survey-analysis.component";
import { OverallFeedbackComponent } from "./overall-feedback/overall-feedback.component";
import { PollCreatorComponent } from "./poll-creator/poll-creator.component";
import { PollAnalysisComponent } from "./poll-analysis/poll-analysis.component";
import { VideoPlayerComponent } from "./video-player/video-player.component";
import { OneToOneCollaborationComponent } from "./one-to-one-collaboration/one-to-one-collaboration.component";
import { ReviewAssignmentsComponent } from "./review-assignments/review-assignments.component";
import { AnnouncementsComponent } from "./announcements/announcements.component";
import { ModSessionDetailsComponent } from "./mod-session-details/mod-session-details.component";
import { OneToManyCollaborationComponent } from "./one-to-many-collaboration/one-to-many-collaboration.component";
import { ForumsComponent } from "./forums/forums.component";
import { QuestionComponent } from "./forums/question/question.component";
import { PressRoomComponent } from "./press-room/press-room.component";
import { BlogComponent } from "./blog/blog.component";
import { NewBlogTopicComponent } from "./blog/new-topic/new-topic.component";
import { BlogTopicComponent } from "./blog/blog-topic/blog-topic.component";
import { PressReleaseComponent } from "./press-room/press-release/press-release.component";
import { ReportsComponent } from "./reports/reports.component";
import { UserSearchComponent } from "./user-search/user-search.component";
import { CalendarViewComponent } from "./calendar-view/calendar-view.component";
import { SessionDetailsTabsComponent } from "./session-details-tabs/session-details-tabs.component"
import { ShareResourceComponent } from "./share-resource/share-resource.component";
import { ResourceAssignmentComponent } from "./share-resource/resource-assignment/resource-assignment.component";
import { ShareComponent } from "./dialog/share/share.component";
import { ViewResourceComponent } from "./view-resource/view-resource.component";
import { ResourceUploadComponent } from "./view-resource/resource-upload/resource-upload.component";
import { BatchCreationComponent } from "./batch-creation/batch-creation.component";
import { FeedbackComponent } from "./feedback/feedback.component";
import { ExternalJoinSessionComponent } from "./external-join-session/external-join-session.component";
import { NotificationSettingsComponent } from "./notification-settings/notification-settings.component";
import { DialoutComponent } from "./dialout/dialout.component";

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: "",
        component: AppComponent,
        children: [
          { path: "home", component: HomeComponent, canActivate: [AppRouteGuard] },
          { path: "users", component: UsersComponent, data: { permission: "Admin.Users.Manage.All" }, canActivate: [AppRouteGuard] },
          { path: "roles", component: RolesComponent, data: { permission: "Admin.Roles.Manage.All" }, canActivate: [AppRouteGuard] },
          { path: "tenants", component: TenantsComponent, data: { permission: "Admin.Tenants.Manage.All" }, canActivate: [AppRouteGuard] },
          { path: "change-password", component: ChangePasswordComponent, canActivate: [AppRouteGuard] },
          { path: "chat", component: ChatComponent, canActivate: [AppRouteGuard] },
          { path: "import-user", component: ImportUserComponent, canActivate: [AppRouteGuard] },
          { path: "view-user", component: ViewUserComponent, canActivate: [AppRouteGuard] },
          { path: "admindashboard", component: AdmindashboardComponent, canActivate: [AppRouteGuard] },
          { path: "mentordashboard", component: MentordashboardComponent, canActivate: [AppRouteGuard] },
          { path: "search-mentor", component: SearchMentorComponent, canActivate: [AppRouteGuard] },
          { path: "mentor-categories", component: MentorcategoriesComponent, canActivate: [AppRouteGuard] },
          { path: "mentorreview", component: MentorreviewComponent, canActivate: [AppRouteGuard] },
          { path: "sys-config", component: SysConfigComponent, canActivate: [AppRouteGuard] },
          { path: "my-profile", component: MyProfileComponent, canActivate: [AppRouteGuard] },
          { path: "my-sessions", component: MySessionsComponent, canActivate: [AppRouteGuard] },
          { path: "mod-sessions", component: ModSessionsComponent, canActivate: [AppRouteGuard] },
          { path: "video-session", component: VideoSessionComponent, canActivate: [AppRouteGuard] },
          { path: "join-session", component: JoinSessionComponent, canActivate: [AppRouteGuard] },
          { path: "role-management", component: RoleManagementComponent, canActivate: [AppRouteGuard] },
          { path: "survey-list", component: SurveyListComponent, canActivate: [AppRouteGuard] },
          { path: "survey", component: SurveyComponent, canActivate: [AppRouteGuard] },
          { path: "survey-analysis/:id", component: SurveyAnalysisComponent, canActivate: [AppRouteGuard] },
          { path: "poll-creator", component: PollCreatorComponent, canActivate: [AppRouteGuard] },
          { path: "poll-analysis", component: PollAnalysisComponent, canActivate: [AppRouteGuard] },
          { path: "survey-creator/:id", component: SurveyCreatorComponent, canActivate: [AppRouteGuard] },
          { path: "whiteboard", component: WhiteboardComponent, canActivate: [AppRouteGuard] },
          { path: "add-assignment", component: AddAssignmentsComponent, canActivate: [AppRouteGuard] },
          { path: "poll-response", component: PollResponseComponent, canActivate: [AppRouteGuard] },
          { path: "conference", component: LmsConferenceComponent }, //Don't add can activate guard
         //{ path: "session-feedback", component: SessionFeedbackComponent, canActivate: [AppRouteGuard] },
          { path: "overall-feedback/:id", component: OverallFeedbackComponent, canActivate: [AppRouteGuard] },
          { path: "video-player/:id", component: VideoPlayerComponent, canActivate: [AppRouteGuard] },
          { path: "one-to-one-session", component: OneToOneCollaborationComponent, canActivate: [AppRouteGuard] },
          { path: "review-assignments/:id", component: ReviewAssignmentsComponent, canActivate: [AppRouteGuard] },
          { path: "announcements", component: AnnouncementsComponent, canActivate: [AppRouteGuard] },
          { path: "session-details/:id", component: ModSessionDetailsComponent, canActivate: [AppRouteGuard] },
          { path: "one-to-many-session", component: OneToManyCollaborationComponent, canActivate: [AppRouteGuard] },
          { path: "forums", component: ForumsComponent, canActivate: [AppRouteGuard] },
          { path: "forums-question", component: QuestionComponent, canActivate: [AppRouteGuard] },
          { path: "press-room", component: PressRoomComponent, canActivate: [AppRouteGuard] },
          { path: "blogs", component: BlogComponent, canActivate: [AppRouteGuard] },
          { path: "blogs-new-topic", component: NewBlogTopicComponent, canActivate: [AppRouteGuard] },
          { path: "press-release/:id", component: PressReleaseComponent, canActivate: [AppRouteGuard] },
          { path: "blogs-topic/:id", component: BlogTopicComponent, canActivate: [AppRouteGuard] },
          { path: "reports", component: ReportsComponent, canActivate: [AppRouteGuard] },
          { path: "user-search", component: UserSearchComponent, canActivate: [AppRouteGuard] },
          { path: "calendar", component: CalendarViewComponent, canActivate: [AppRouteGuard] },
          { path: "view-session-details/:id", component: SessionDetailsTabsComponent, canActivate: [AppRouteGuard] },
          { path: "share-resource", component: ShareResourceComponent, canActivate: [AppRouteGuard] },
          { path: "share-resource/resource-assignment", component: ResourceAssignmentComponent, canActivate: [AppRouteGuard] },
          { path: "share-resource/share", component: ShareComponent, canActivate: [AppRouteGuard] },
          { path: "view-resource", component: ViewResourceComponent, canActivate: [AppRouteGuard] },
          { path: "view-resource/resource-upload", component: ResourceUploadComponent, canActivate: [AppRouteGuard] },   
          { path: "batch-creation", component: BatchCreationComponent, canActivate: [AppRouteGuard] },
          { path:'feedback',component:FeedbackComponent, canActivate: [AppRouteGuard]},
          { path: "external-join-session", component:ExternalJoinSessionComponent },
          { path: "noticationSetings", component: NotificationSettingsComponent,  canActivate:[AppRouteGuard]},
          { path: "dialout", component:DialoutComponent}

        ]
      },
      //The following path is outside Appcomponent to avoid display of Menu bar
      { path: "session-feedback", component: SessionFeedbackComponent, canActivate: [AppRouteGuard] },
    ])
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
