import { Component, Injector, HostListener, Inject, OnInit, ViewChild, OnChanges } from "@angular/core";
import { DOCUMENT } from '@angular/common';
import { BreakpointObserver } from "@angular/cdk/layout";
import { AppComponentBase } from "@shared/app-component-base";
import { AppAuthService } from "@shared/auth/app-auth.service";
import { AppSessionService } from "@shared/session/app-session.service";
import { dataService } from "@app/service/common/dataService";
import { UserServiceProxy, UserLoginInfoDto, TenantLoginInfoDto } from "@shared/service-proxies/service-proxies";
import { ModService } from "@app/service";
import { ActivatedRoute, Router } from "@angular/router";
import { CookieService } from 'ngx-cookie-service';
import { finalize } from "rxjs/operators";
import { Constants } from '@app/models/constants';
import { MatDialog } from "@angular/material";
import { PollResponseComponent } from "@app/poll-response/poll-response.component";
import { UserRoles, UserTypes } from "@app/enums/user-roles";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { WindowInterruptSource } from "@ng-idle/core";
import { ToastrService } from 'ngx-toastr';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {Observable} from 'rxjs';
import {startWith, map} from 'rxjs/operators';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { MatDialogConfig} from '@angular/material';
import { GlobalSearchresultComponent } from "@app/dialog/global-searchresult/global-searchresult.component";
export class QueryParameters {
  name: string;
  globalsearch: string;
}

@Component({
  selector: "top-bar",
  templateUrl: "./topbar.component.html",
  styleUrls: ["./topbar.component.css"]
})
export class TopBarComponent extends AppComponentBase implements OnInit {
  askFor:string;
  globalSearchForm: FormGroup;
  globalSearchFormValidationMessages = {
    searchTextRequired: '',
  };
   control = new FormControl();
   autoCompleteSearchData:string[];
   filteredAutoComplete:Observable<string[]>;
   searchText:string;
   currentPageUrl:string;
   searchInput:string;
   isGlobalTextSearched:boolean;
   queryParameters:QueryParameters;
   isGlobalSearch:boolean;
   globalSearchList: any[] = [];
   globalSearchResultList: any[] = [];
   globalSearch: MatTableDataSource<any>;
   @ViewChild('globalSearchSort') globalSearchSort: MatSort;
   @ViewChild('globalSearchPagination') globalSearchPagination: MatPaginator;
  [x: string]: any;
  miniSidebar: boolean = false;
  showNotifications: boolean = false;
  loginUser: any;
  loadChild: boolean = false;
  Featureslist: any = [];
  RePresentFeatureslist: any = [];
  subMenuList: any = [];
  notificationlists: any[] = [];
  hasNotification: boolean = false;
  notificationCount: number;
  hasAnnouncement: boolean = false;
  codeLabUrl: string = "";
  iconsroutesList = [
    { code: "DASH", icon: "dashboard", path: '/app/home', order: 0 },
    { code: "IMPUSR", icon: "cloud_upload", path: '/app/import-user', order: 8 },
    { code: "VWUSER", icon: "list_alt", path: '/app/view-user', order: 9 },
    { code: "ROLMAN", icon: "recent_actors", path: '/app/role-management', order: 10 },
    { code: "TNRSRC", icon: "search", path: '/app/search-mentor', order: 7 },
    { code: "SESION", icon: "video_library", path: '/app/mod-sessions', order: 3 },
    { code: "ASSIGN", icon: "assignment", path: '/app/add-assignment', order: 5 },
    { code: "TNRCAT", icon: "library_add", path: '/app/mentor-categories', order: 7 },
    // { code: "TNRREV", icon: "rate_review", path: '/app/mentorreview', order: 11 },
    { code: "SYSCFG", icon: "build", path: '/app/sys-config', order: 12 },
    { code: "POLSUR", icon: "poll", path: '/app/survey-list', order: 6 },
    { code: "ANONCE", icon: "announcement", path: '/app/announcements', order: 4 },
    { code: "PRSROM", icon: "description", path: '/app/press-room', order: 11 },
    { code: "BLOGS", icon: "chrome_reader_mode", path: '/app/blogs', order: 13 },
    { code: "FORUMS", icon: "forum", path: '/app/forums', order: 14 },
    { code: "REPORTS", icon: "picture_as_pdf", path: '/app/reports', order: 2 },
    { code: "CALENDAR", icon: "date_range", path: '/app/calendar', order: 1 },
    { code: "RESOURCESHARING", icon: "description", path: '/app/share-resource', order: 15 },
    { code: "BATCH", icon: "groups", path: '/app/batch-creation', order: 1 }
  ];
  representiconsroutesList = [
    { code: "DASH", icon: "dashboard", path: '/app/home', featureName: 'Dashboard', order: 0, isDynamic: true },
    {
      code: "USMANG", icon: '', path: '', featureName: 'User Management', order: 1, isDynamic: false,
      submenu: [
        { code: "ROLMAN", icon: "recent_actors", path: '/app/role-management', featureName: 'Roles', order: 0, isDynamic: true },
        { code: "IMPUSR", icon: "cloud_upload", path: '/app/import-user', featureName: 'Import User', order: 1, isDynamic: true },
        { code: "VWUSER", icon: "list_alt", path: '/app/view-user', featureName: 'View User', order: 2, isDynamic: true }
      ]
    },
    {
      code: "SESIONST", icon: "", path: '', featureName: 'Session Management', order: 2, isDynamic: false,
      submenu: [
        { code: "BATCH", icon: "groups", path: '/app/batch-creation', featureName: 'Batch', order: 0, isDynamic: true },
        { code: "SESION", icon: "video_library", path: '/app/mod-sessions', featureName: 'Sessions', order: 1, isDynamic: true },
        { code: "CALENDAR", icon: "date_range", path: '/app/calendar', featureName: 'Calendar', order: 2, isDynamic: true }
      ]
    },
    {
      code: "ASSIGNST", icon: "", path: '', featureName: 'Assignment', order: 3, isDynamic: false,
      submenu: [
        { code: "ASSIGN", icon: "assignment", path: '/app/add-assignment', featureName: 'Assignment', order: 0, isDynamic: true },
        { code: "RESOURCESHARING", icon: "description", path: '/app/share-resource', featureName: 'Resource Sharing', order: 1, isDynamic: true }
      ]
    },
    { code: "REPORTS", icon: "picture_as_pdf", path: '/app/reports', featureName: 'Reports', order: 3, isDynamic: true, },
    {
      code: "MESSAGE", icon: "", path: '', featureName: 'Messsage', order: 4, isDynamic: false,
      submenu: [
        { code: "ANONCE", icon: "announcement", path: '/app/announcements', featureName: 'Announcements', order: 0, isDynamic: true },
        { code: "POLSUR", icon: "poll", path: '/app/survey-list', featureName: 'Surveys', order: 1, isDynamic: true },
        { code: "PRSROM", icon: "description", path: '/app/press-room', featureName: 'Press Room', order: 2, isDynamic: true },
        { code: "BLOGS", icon: "chrome_reader_mode", path: '/app/blogs', featureName: 'Blogs', order: 3, isDynamic: true },
        { code: "FORUMS", icon: "forum", path: '/app/forums', featureName: 'Forums', order: 4, isDynamic: true }
      ]
    },
    { code: "SYSCFG", icon: "build", path: '/app/sys-config', featureName: 'System Configuration', order: 5, isDynamic: true },
    {
      code: "TRAINER", icon: "", path: '', featureName: 'Trainer', order: 6, isDynamic: false,
      submenu: [
        { code: "TNRSRC", icon: "search", path: '/app/search-mentor', featureName: 'Trainer Search', order: 0, isDynamic: true },
        { code: "TNRCAT", icon: "library_add", path: '/app/mentor-categories', featureName: 'Tainer Categories', order: 1, isDynamic: true }
      ]
    }
  ];
  @ViewChild('childMenu') public submenu;
  currentUserRole: string = '';
  authToken: string;
  cookieValue = 'UNKNOWN';
  sessionData: any;
  sessionToken: string;
  isLoading: boolean;
  currentYear: number;
  announcementList: any[] = [];
  tenantList: any[] = [];
  filteredTenantList: any[] = [];
  tenantName: string = "";
  profileRole: string;
  isSearchButtonEnabled: boolean = false;
  canBeMentor: boolean = false;
  canBeMentee: boolean = false;
  isSuperAdmin = false;
  isSiteAdmin = false;
  tenantId: number;

  get isNavbarVisible(): boolean {
    return this.dataService.isNavbarVisible;
  }

  get userName(): string {
    return this.sessionService.user ? this.sessionService.user.name : "";
  }

  get pageName(): string {
    return this.dataService.pageName;
  }

  constructor(
    injector: Injector,
    private breakpointObserver: BreakpointObserver,
    private _authService: AppAuthService,
    private sessionService: AppSessionService,
    private userService: UserServiceProxy,
    public dataService: dataService,
    private modService: ModService,
    private activateRoute: ActivatedRoute,
    private cookieService: CookieService,
    public dialog: MatDialog,
    private router: Router, private formBuilder: FormBuilder,
    private toastr: ToastrService,
    @Inject(DOCUMENT) private document: Document
  ) {
    super(injector);
  }
  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (document.body.scrollTop > 219 || document.documentElement.scrollTop > 219) {
      document.getElementById('sideNavigation').classList.add('fix');
    } else {
      document.getElementById('sideNavigation').classList.remove('fix');
    }
  }
  
  ngOnInit() {    
    this.activateRoute.params.subscribe(params => {
      this.isGlobalSearch = params['globalsearch'];
  });
  this.CustomizedAlert();
   //global search validation
   this.globalSearchForm = this.formBuilder.group({
    searchText: ['', [Validators.required]],
  });
    this.initForm();
    this.sessionToken = this.activateRoute.snapshot.queryParamMap.get('conferencetoken');
    this.getCodeLabUrl();
    if (this.sessionToken) {
      this.sessionService.user = null;
    }
    if (!this.sessionService.user) {
      this.dataService.isNavbarVisible = false;
      this.dataService.isIntegratedApplication = true;
      this.authToken = this.activateRoute.snapshot.queryParamMap.get('authToken');
      this.tenantName = this.activateRoute.snapshot.queryParamMap.get('tenantname');
      this.cookieService.set('Abp.AuthToken', this.authToken, null, null, null, true, "None");
      this.cookieService.set('tenantName', this.tenantName, null, null, null, true, "None");
      this.modService.getMe().subscribe(
        (res) => {
          this.appSession.user = <UserLoginInfoDto>{
            emailAddress: res.emailAddress,
            id: res.id,
            name: res.name,
            surname: res.surname,
            tenantId: res.tenantId,
            userName: res.userName
          };
          this.sessionService.user = this.appSession.user;
          this.appSession.tenant = <TenantLoginInfoDto>{
            id: res.tenantId,
            name: this.tenantName,
            tenancyName: this.tenantName
          };
          this.userDetails();
          this.getSessionDetails();
        },
        (error) => console.log(error)
      )
    }
    else {
      this.userDetails();
      setInterval(this.notifyUsers.bind(this), Constants.TimeInterval);
      this.currentYear = new Date().getFullYear();
      if (this.sessionToken)
        this.getSessionDetails();
    }
  }
  roleForm: FormGroup;
  roleFormValidationMessages = {
    roleName: 'Please provide a valid name',   
  };
  initForm() {
    this.roleForm = this.formBuilder.group({
      tenant: ['', [Validators.required]],
      
    });
  }
  initTheme(id) {
    this.modService.getThemeDetails(id).subscribe(data => {
      this.ChangeTheme(data.result.themeName);
      this.ChangeThemeColor(data.result.themeColor);
    });
  }
  getAllTenants() {
    this.modService.getTenants().subscribe(res => {
      if (res.result) {
        this.tenantList = res.result;
        this.filteredTenantList = this.tenantList;
      }
    }, err => { });
  }
  search(query: string, filterFor: string): void {
    if (filterFor === 'tenant') {
      this.filteredTenantList = this.performFilter(query, this.tenantList, 'tenantName');
    }
  }
  performFilter(query: string, filterArray: string[], filterBy: string): string[] {
    query = query.toLocaleLowerCase();
    return filterArray.filter(value => value[filterBy].toLocaleLowerCase().indexOf(query) !== -1);
  }
  saveChanges() {
    if (this.isSiteAdmin == true) {
      this.tenantId = this.appSession.user.tenantId;     
    }
    this.modService.saveThemeDetails(this.tenantId, this.theme, this.color, this.appSession.user.id).subscribe(data => {  //   
    });    
    this.toastr.success("Theme and Theme color Updated sucessfully");
  }
  getAllAnnouncements() {
    this.modService.getAnnouncementsForUser(this.dataService.currentUserId, this.dataService.currentTenentId, this.dataService.currentRoleId).subscribe(res => {
      if (res.result) {
        this.announcementList = res.result;
        this.hasAnnouncement = true;
      }
    });
  }  

  closeAnnouncement(event: any, announcementId: number) {
    this.modService.updateAnnouncementStatusForUser(this.dataService.currentUserId, announcementId, this.dataService.currentTenentId, this.dataService.currentRoleId).subscribe(res => { });
    event.currentTarget.parentNode.remove();
  }

  userDetails() {    
    this.dataService.isLoading = true;
    this.dataService.currentPlatformUserId = this.appSession.user.id;
    this.dataService.tenantId=this.appSession.user.tenantId;
    this.initTheme(this.appSession.user.tenantId);
    this.userService.get(this.appSession.user.id).subscribe(
      res => {
        if (res) {
          this.dataService.setUserRole(res.roleNames);
        }
        this.dataService.userRole.subscribe(res => {
          this.currentUserRole = res[0];
          this.dataService.currentUserType = this.currentUserRole;
        });
        if (this.currentUserRole == "SUPERADMIN") {
          this.modService.getUserDetails(this.appSession.user.id).subscribe(
            res => {
              if (res.result)
                this.dataService.currentUserId = res.result.userId;
            });
          this.isSuperAdmin = true;
          this.getAllTenants();
          this.dataService.currentUserRole = this.currentUserRole;
          this.dataService.isSuperAdmin = true;
          let iconRoutes: Object = {};
          this.Featureslist = [];
          this.RePresentFeatureslist = [];
          this.modService.getAllFeature().pipe(
            finalize(() => {
              this.dataService.isLoading = this.dataService.doneLoading();
            })).subscribe(res => {
              res.result.items.forEach(item => {
                iconRoutes = this.iconsroutesList.find(val => val.code === item.featureCode);
                if (iconRoutes)
                  this.Featureslist.push({ ...iconRoutes, ...item, read: true, create: true, update: true, delete: true });
              });

              // only for representation
              this.representiconsroutesList.forEach(iconRoutes => {                
                this.subMenuList = [];
                const item = res.result.items.find(val => val.featureCode == iconRoutes.code)
                if (iconRoutes.submenu) {
                  iconRoutes.submenu.forEach(subIcr => {
                    if (res.result.items.findIndex(x => x.featureCode == subIcr.code) != -1) {
                      this.subMenuList.push(subIcr);
                    }                   
                  })
                  iconRoutes.submenu = this.subMenuList;
                  iconRoutes.submenu.sort(this.predicateBy("order"));
                }
                if ((iconRoutes.isDynamic == false && this.subMenuList.length != 0) || (iconRoutes.isDynamic == true && item != null)) {
                  this.RePresentFeatureslist.push({ ...iconRoutes, ...item, read: true, create: true, update: true, delete: true });
                }                
              });
              this.RePresentFeatureslist.sort(this.predicateBy("order"));
              this.Featureslist.sort(this.predicateBy("order"));
              this.loadChild = true;
            });
          this.profileRole = "Super Admin";
          this.isSearchButtonEnabled = true;
        }
        if (this.currentUserRole.toUpperCase() === 'TENANTADMIN' || this.currentUserRole.toUpperCase() === 'TENANTUSER') {
          let iconRoutes: Object = {};
          this.Featureslist = [];
          this.RePresentFeatureslist = [];
          this.modService.getUserDetails(this.appSession.user.id).subscribe(
            res => {
              if (res.result) {
                this.dataService.currentRoleId = res.result.role.id;
                this.dataService.currentTenantName = res.result.tenant.tenantName;
                this.dataService.currentTenentId = res.result.tenant.id;
                this.dataService.currentUserId = res.result.userId;
                // this.dataService.userCanBeMentee = res.result.canBeMentee;
                // this.dataService.userCanBeMentor = res.result.canBeMentor;
                this.isSearchButtonEnabled = res.result.canBeMentor;
                this.dataService.canBeMentor = res.result.canBeMentor;
                this.dataService.canBeMentee = res.result.canBeMentee;

                this.modService.getallrolefeaturedetails(this.dataService.currentTenentId, this.dataService.currentRoleId).subscribe(response => {
                  if (response.result) {
                    response.result.forEach(item => {
                      iconRoutes = this.iconsroutesList.find(val => val.code === item.feature.featureCode);
                      if (iconRoutes)
                        this.Featureslist.push({ ...iconRoutes, ...item, featureName: item.feature.featureName });
                    });
                    //only for menu representation 
                    this.representiconsroutesList.forEach(iconRoutes => {                      
                      this.subMenuList = [];
                      const item = response.result.find(val => val.feature.featureCode == iconRoutes.code)
                      if (iconRoutes.submenu) {
                        iconRoutes.submenu.forEach(subIcr => {
                          if (response.result.findIndex(x => x.feature.featureCode == subIcr.code) != -1) {
                            this.subMenuList.push(subIcr);
                          }
                        })
                        iconRoutes.submenu = this.subMenuList;                        
                        iconRoutes.submenu.sort(this.predicateBy("order"));
                      }
                      if ((iconRoutes.isDynamic == false && this.subMenuList.length != 0) || (iconRoutes.isDynamic == true && item != null)) {
                        this.RePresentFeatureslist.push({ ...iconRoutes, ...item, read: true, create: true, update: true, delete: true });
                      }
                    });
                  }
                  this.Featureslist.sort(this.predicateBy("order"));
                  this.RePresentFeatureslist.sort(this.predicateBy("order"));
                  this.dataService.rolePermissions = this.Featureslist;
                  this.loadChild = response.success;
                });
                this.currentUserRole = res.result.role.name;
                if (this.currentUserRole == "Site Admin") {
                  this.isSiteAdmin = true;
                  this.GetMentorNotification();
                  this.dataService.isSiteAdmin=true;
                }
                this.profileRole = res.result.role.name;
                this.dataService.currentUserRole = this.currentUserRole;
                this.getAllAnnouncements();
              }
            }
          );
        }
      },
      err => { }
    );
  }

  getCodeLabUrl() {
    this.modService.getCodeLabUrl().subscribe(res => {
      if (res.result) {
        this.codeLabUrl = res.result;
      }
    });
  }
  
  GetMentorNotification(){    
    this.modService.getMentorNotification(this.sessionService.userId).subscribe(res=>{      
      if (res.result) {        
        this.notificationlists.push({name:res.result.name+" joined as a new Trainer"});
        this.notificationCount=this.notificationlists.length;
        this.hasNotification = !this.notificationCount;      
        
      }
    }, err => { console.log(err); 
    });    
  }

  CustomizedAlert(){
    this.dataService.notificationShare.subscribe(res=>{
      this.notificationlists=res;
      this.notificationCount=this.notificationlists.length;
       this.hasNotification = !this.notificationCount;
    });
    this.dataService.popupShare.subscribe(res=>{
      this.announcementList=res;
      this.hasAnnouncement = true;
    })
  }

  GetNotificationlist(){   
   this.notificationlists;
   this.showNotifications = !this.showNotifications;
       
  }
  notificationEvent() {    
    this.GetNotificationlist();       
  }
  launchCodeLab() {
    window.open(this.codeLabUrl, "_blank");
  }

  getSessionDetails(): void {
    let inputData = { "QueryString": this.sessionToken, "UserId": this.sessionService.userId };

    this.modService.getSession(inputData).subscribe(response => {
      if (response.result) {
        this.sessionData = response.result;
        if (this.isSessionStarted(this.sessionData)) {
          this.dataService.sessionCode = this.sessionData.sessionCode;
          this.dataService.sessionTitle = this.sessionData.sessionTitle;
          this.dataService.sessionScheduleId = this.sessionData.sessionScheduleId;
          this.dataService.isSessionStarted = true;
          this.dataService.isSessionParticipant = true;
        }
        else {
          this.dataService.isSessionStarted = false;
          this.dataService.isSessionParticipant = true;
        }
      }
      else {
        this.dataService.isSessionStarted = false;
        this.dataService.isSessionParticipant = false;
      }
      this.dataService.isLoading = false;
    });
  }

  isSessionStarted(data) {
    var timeRemainingtoStartSession = new Date(data.startDate).getTime() - new Date().getTime();
    if (timeRemainingtoStartSession < 0)
      return true;
    return timeRemainingtoStartSession > 900000;
  }

  predicateBy(value) {
    return function (a, b) {
      if (a[value] > b[value]) {
        return 1;
      } else if (a[value] < b[value]) {
        return -1;
      }
      return 0;
    }
  }
  clickEvent() {
    this.miniSidebar = !this.miniSidebar;
  }

  notifyUsers() {
    this.notificationlists = [];
    this.modService.getNotification(this.sessionService.userId).subscribe(res => {
      if (res.result) {
        this.hasNotification = !res.result.length;
        this.notificationCount = res.result.length;
        this.notificationlists = res.result || [];
      }
    }, err => { console.log(err); });
  }


  routeToPollResponse(routerId): void {
    this.showNotifications = !this.showNotifications;
    const pollResponceDialog = this.dialog.open(PollResponseComponent, {
      width: '450px',
      height: '250px',
      position: {
        bottom: '20px',
        right: '20px'
      },
      data: { routerId: routerId }
    });
  }

  routeToSearch() {
    this.router.navigate(['app/user-search']);
  }

  logout(): void {
    this._authService.logout(true);
  }
  imgClick() {
    // this.dropdownmenuright=!this.dropdownmenuright
    $('.profile-pic').on('click', function () {
      $('.profile-pic').next('.dropdown-menu-right').addClass('active');

      $('body').on('click', function (e: any) {
        var container = $('.dropdown-menu-right');
        // if the target of the click isn't the container nor a descendant of the container
        if (!container.is(e.target) && container.has(e.target).length === 0) {
          container.removeClass('active');
        }
      });

      return false;
    });
  }
  ChangeNav(navSwitch: string) {

    var navSwitch = navSwitch;
    if (navSwitch === 'horizontalNav') {
      $('.main-section').removeClass('left-nav right-nav').addClass('horizontal-nav');
    } else if (navSwitch === 'leftSideNav') {
      $('.main-section').removeClass('horizontal-nav right-nav').addClass('left-nav');
    } else if (navSwitch === 'rightSideNav') {
      $('.main-section').removeClass('horizontal-nav left-nav').addClass('right-nav');
    }

  }
  theme: string = "lightTheme";
  color: string = "blue";
  isLightTheme = true;
  isDarkTheme = false;
  isBlue = true;
  isGreen = false;
  isPurple = false;
  isOrange = false;
  ChangeTheme(theme: string) {
    var themeSwitch = theme;
    this.theme = theme;
    if (themeSwitch === 'lightTheme') {
      $('#themeSwitcher').attr('href', 'css/themes/light-theme.css');
      $('body').removeClass('dark-theme').addClass('light-theme');
      this.isLightTheme = true;
    } else {
      $('#themeSwitcher').attr('href', 'css/themes/dark-theme.css');
      $('body').removeClass('light-theme').addClass('dark-theme');
      this.isDarkTheme = true;
    }
    }
  ChangeThemeColor(item: string) {
    var themeColor = item;
    this.color = themeColor;
    if (themeColor === 'blue') {
      this.isBlue = true;
      $('body').removeClass('purple-color green-color orange-color').addClass('blue-color');
    } else if (themeColor === 'purple') {
      this.isPurple = true;
      $('body').removeClass('blue-color green-color orange-color').addClass('purple-color');
    } else if (themeColor === 'green') {
      this.isGreen = true;
      $('body').removeClass('purple-color blue-color orange-color').addClass('green-color');
    } else if (themeColor === 'orange') {
      this.isOrange = true;
      $('body').removeClass('purple-color green-color blue-color').addClass('orange-color');
    }
  }
  
  disableSelect = new FormControl(false);
//global search
keyuphit(event)
{
 this.searchInput= event.target.value;
 this.getAutoCompleteData();
}
getAutoCompleteData():void{
  this.isGlobalTextSearched=false;
  this.modService.getAutoCompleteSearch(this.searchInput).pipe(
    finalize(() => {
      this.dataService.isLoading = this.dataService.doneLoading();
    })
  ).subscribe(res => {
    if (res.result) {
      this.autoCompleteSearchData = [];
      this.autoCompleteSearchData = res.result;
      //this.loadTraineeAttendance();
    }
  }, err => {
    this.toastr.error("Please try again later");
  });
  this.filteredAutoComplete = this.control.valueChanges.pipe(
    startWith(''),
    map(value => this._filterAuto(value))
  );
}
private _filterAuto(value: string): string[] {
  const filterValue = this._normalizeValue(value);
  return this.autoCompleteSearchData.filter(autoCompleteSearchData => this._normalizeValueAuto(autoCompleteSearchData).includes(filterValue));
}
private _normalizeValueAuto(value: string): string {
  return value.toLowerCase().replace(/\s/g, '');
}
private _normalizeValue(value: string): string {
  return value.toLowerCase().replace(/\s/g, '');
}

globalSearchDialog(): void
 {
    const createTenantDialog = new MatDialogConfig();
    createTenantDialog.disableClose = true;
    createTenantDialog.autoFocus = false;
    createTenantDialog.width = '40vw';
    const dialogRef = this.dialog.open(GlobalSearchresultComponent,{width:'60vw',height:'40vw',autoFocus:false,disableClose:false,
    closeOnNavigation: true,data:{searchString:this.searchText,currentPageUrl:this.router.url}});
    this.searchText='';
 }
}