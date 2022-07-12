import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ParticipantRole, SessionType } from '@app/enums/user-roles';
import { ISessionList } from '@app/mod-sessions/mod-sessions.component';

@Injectable({
  providedIn: 'root'
})
export class dataService {
  private errorMessageSource = new BehaviorSubject(null);
  private coursesToEnroll = new BehaviorSubject([]);
  private _userRole = new BehaviorSubject("");
  mentorDetails: any;
  currentUserId: number;
  currentPlatformUserId: number;
  sessionCode: string;
  sessionTitle: string;
  calSession: any;
  token: string;
  currentTenantName: string = "";
  currentTenentId: number;
  pageName: string;
  tenantList: any[] = [];
  currentRoleId: number;
  currentUserRole: string;
  isNavbarVisible: boolean = true;
  currentUserRoleId: number;
  isSuperAdmin: boolean = false;
  isSiteAdmin: boolean = false;
  tenantId: number;
  canBeMentor: boolean;
  canBeMentee: boolean = false;
  sessionScheduleId: number;
  rolePermissions: any[] = [];
  sessionPlayBackURL: any[] = [];
  sessionType: SessionType;
  currentUserType: string;
  selectedTenant: number;
  currentSessionParticipantRole: ParticipantRole;

  // LMS-MOD integration Iframe
  isSessionStarted: boolean;
  isSessionParticipant: boolean;
  isLoading: boolean = true;
  isIntegratedApplication: boolean;
  isCallDisconnected: boolean;

  //Card view tab data
  upcomingSessionList: ISessionList;
  completedSessionList: ISessionList;
  webinarSessionList: ISessionList;

  errorMessage = this.errorMessageSource.asObservable();
  courseToEnroll = this.coursesToEnroll.asObservable();
  userRole = this._userRole.asObservable();

  constructor() { }

  public notificationContent = new BehaviorSubject<any[]>([]);
  public notificationShare = this.notificationContent.asObservable();

  public popupContent = new BehaviorSubject<any[]>([]);
  public popupShare = this.popupContent.asObservable();
  
  getPopupContxt(data) {
    return this.popupContent.next(data);
  }
  getNotificationContxt(data) {
    return this.notificationContent.next(data);
  }
  setErrorMessage(errorMessage) {
    this.errorMessageSource.next(errorMessage);
  }

  setCoursesToEnroll(course) {
    this.coursesToEnroll.next(course);
  }

  setUserRole(role) {
    this._userRole.next(role);
  }

  doneLoading() {
    return false;
  }
}


