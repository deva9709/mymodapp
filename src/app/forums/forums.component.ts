import { Component, OnInit, Injector, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { NewTopicComponent } from "../dialog/new-topic/new-topic.component";
import { ToastrService } from 'ngx-toastr';
import { ModService } from '@app/service';
import { dataService } from "@app/service/common/dataService";
import { AppComponentBase } from '@shared/app-component-base';
import { Router } from '@angular/router';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { Observable } from 'rxjs';
import { ForumService } from '@app/service/api/forum.service';
import { UserRoles } from '@app/enums/user-roles';

export interface SkillTopicData {
  tenantId: number
  searchText: string,
  skillId: number,
  userId: number,
  isActiveQuestion: boolean,
  isActiveSkill: boolean
}

@Component({
  selector: 'app-forums',
  templateUrl: './forums.component.html',
  styleUrls: ['./forums.component.css']
})

export class ForumsComponent extends AppComponentBase implements OnInit {
  forumTopicList: any[] = [];
  userId = this.appSession.user.id;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  filterforumDataSource: MatTableDataSource<any>;
  filterforumObservable: Observable<any>;
  pageSize: number = 10;
  pageIndex: number = 0;
  forumTopicTotalCount: number = 0;
  searchWord: string = "";
  trendingSkillList: any[] = [];
  discussionList: any[] = [];
  isForumList: boolean = true;
  isForumDiscussion: boolean;
  discussionTopicId: number;
  routeId: number;
  topicRouteData: SkillTopicData;
  createPermission: boolean;
  updatePermission: boolean;
  deletePermission: boolean;
  rolePermissions: any[] = [];
  Code: string = "FORUMS";

  constructor(
    injector: Injector,
    public dialog: MatDialog,
    private modService: ModService,
    private dataService: dataService,
    private toastr: ToastrService,
    private _router: Router,
    public forumService: ForumService
  ) {
    super(injector);
  }

  newTopic(): void {
    if (this.createPermission) {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = false;
      dialogConfig.autoFocus = false;
      dialogConfig.width = '60vw';
      const dialogRef = this.dialog.open(NewTopicComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(result => {
        if (result.isCreated) {
          this.routeId = result.topicId;
          this.loadTrendingSkillTopic();
          this.loadMyDiscussion();
          this.forumService.showForumList = false;
          this.forumService.showForumDiscussion = true;
        }
      });
    }
    else {
      this.toastr.warning("You don't have permission to create a forum");
    }
  }

  ngOnInit() {
    this.dataService.pageName = "Forums";
    this.dataService.isLoading = true;
    this.forumService.showForumList = true;
    this.forumService.showForumDiscussion = false;
    this.loadTrendingSkillTopic();
    this.loadMyDiscussion();
    this.getPermissions();
  }

  loadTrendingSkillTopic() {
    this.modService.trendingTopicSkills(this.dataService.currentTenentId != undefined ? this.dataService.currentTenentId : 0).subscribe(res => {
      this.trendingSkillList = res.result ? res.result : [];
    }, err => {
      this.toastr.warning("Please try again later");
    });
  }

  getPermissions() {
    if (this.dataService.currentUserRole === UserRoles[1]) {
      this.createPermission = true;
    }
    else {
      this.rolePermissions = this.dataService.rolePermissions;
      let permissions = this.rolePermissions.find(val => val.feature.featureCode === this.Code);
      if (permissions) {
        this.createPermission = permissions.create;
      }
      else {
        this.createPermission = false;
      }
    }
  }

  loadMyDiscussion() {
    this.modService.loadMyDiscussion(this.userId).subscribe(res => {
      this.discussionList = [];
      let discussionData = res.result ? res.result : [];
      discussionData.forEach(forum => {
        if (forum) {
          this.discussionList.push(forum);
        }
      });
    }, err => {
      this.toastr.warning("Please try again later");
    });
  }

  pageChangeEvent(event) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.dataService.isLoading = true;
  }

  loadMyQuestion() {
    this.dataService.isLoading = true;
    this.topicRouteData = {
      'tenantId': this.dataService.currentTenentId ? this.dataService.currentTenentId : 0,
      'userId': this.userId,
      'searchText': "",
      'skillId': 1,
      'isActiveQuestion': true,
      'isActiveSkill': false
    };
    this.forumService.showForumDiscussion = false;
    this.forumService.showForumList = true;
  }

  loadTopicForSkill(skillId: number) {
    this.dataService.isLoading = true;
    this.loadTrendingSkillTopic();
    this.loadMyDiscussion();
    this.topicRouteData = {
      'tenantId': this.dataService.currentTenentId ? this.dataService.currentTenentId : 0,
      'searchText': "",
      'skillId': skillId,
      'userId': this.userId,
      'isActiveQuestion': false,
      'isActiveSkill': true
    };
    this.forumService.showForumDiscussion = false;
    this.forumService.showForumList = true;
  }

  idFromForumList(id: number) {
    this.forumService.showForumList = false;
    this.forumService.showForumDiscussion = true;
    this.routeId = id;
  }

  routeToQuestionComponent(id: number) {
    this.routeId = id;
    this.forumService.showForumList = false;
    this.forumService.showForumDiscussion = true;
  }
}
