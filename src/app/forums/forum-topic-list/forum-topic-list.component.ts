import { Component, OnInit, Injector, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { MatDialog, MatPaginator, MatTableDataSource } from '@angular/material';
import { ModService } from '@app/service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { dataService } from "@app/service/common/dataService";
import { AppComponentBase } from '@shared/app-component-base';
import { Observable } from 'rxjs';
import { ForumService } from '@app/service/api/forum.service';
import { FormControl } from '@angular/forms';


export interface SkillTopicData {
  tenantId: number
  searchText: string,
  skillId: number,
  userId: number,
  isActiveQuestion: boolean,
  isActiveSkill: boolean
}

@Component({
  selector: 'app-forum-topic-list',
  templateUrl: './forum-topic-list.component.html',
  styleUrls: ['./forum-topic-list.component.css']
})
export class ForumTopicListComponent extends AppComponentBase implements OnInit {
  userId = this.appSession.user.id;
  searchWord: string = "";
  forumTopicList: any[] = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  filterforumDataSource: MatTableDataSource<any>;
  filterforumObservable: Observable<any>;
  pageSize: number = 10;
  pageIndex: number = 0;
  forumTopicTotalCount: number = 0;
  isSearch: boolean = false;
  isSkillTopic: boolean = false;
  isMyQuestionTopic: boolean = false;
  @Output() topicId: EventEmitter<number> = new EventEmitter<number>();
  @Input() topicData: SkillTopicData;
  skillList: string[] = [];
  skillSet = new FormControl();
  forumSelectedSkills: number = 0;

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

  ngOnInit() {
    this.modService.getAllSkill().subscribe(res => {
      this.skillList = res.result ? res.result.items : [];
    });
    this.pageIndex = 0;
    this.pageSize = 10;
    if (!this.topicData) {
      this.isSearch = false;
      this.loadAllForumTopic();
    }
    else if (this.topicData.isActiveSkill === true && this.topicData.isActiveQuestion === false) {
      this.isSkillTopic = true;
      this.loadAllSkillTopic();
    }
    else {
      this.isMyQuestionTopic = true;
      this.loadAllMyQuestionTopic();
    }
  }

  ngOnChanges() {
    this.modService.getAllSkill().subscribe(res => {
      this.skillList = res.result ? res.result.items : [];
    });
    this.pageIndex = 0;
    this.pageSize = 10;
    if (!this.topicData) {
      this.isSearch = false;
      this.loadAllForumTopic();
    }
    else if (this.topicData.isActiveSkill === true && this.topicData.isActiveQuestion === false) {
      this.isSkillTopic = true;
      this.loadAllSkillTopic();
    }
    else {
      this.isMyQuestionTopic = true;
      this.loadAllMyQuestionTopic();
    }
  }

  loadAllForumTopic() {
    this.forumSelectedSkills = 0;
    this.isSearch = false;
    let allTopic = {
      'tenantId': this.dataService.currentTenentId ? this.dataService.currentTenentId : 0,
      'searchText': this.searchWord,
      'pageSize': this.pageSize,
      'pageNumber': this.pageIndex + 1
    };
    this.loadForumTopicService(allTopic);
  }

  loadsearchTopic(isSearchClicked: boolean) {
    if (isSearchClicked) {
      this.pageIndex = 0;
      this.pageSize = 10;
    }
    this.isSearch = true;
    this.dataService.isLoading = true;
    let myTopic = {
      'tenantId': this.dataService.currentTenentId ? this.dataService.currentTenentId : 0,
      'searchText': this.searchWord,
      'skillId': this.forumSelectedSkills,
      'pageSize': this.pageSize,
      'pageNumber': this.pageIndex + 1
    };
    this.loadForumTopicService(myTopic);
  }

  loadAllSkillTopic() {
    this.forumSelectedSkills = 0;
    this.isSkillTopic = true;
    this.isSearch = false;
    this.isMyQuestionTopic = false;
    this.dataService.isLoading = true;
    let skillTopic = {
      'tenantId': this.topicData.tenantId,
      'searchText': this.topicData.searchText,
      'skillId': this.topicData.skillId,
      'pageSize': this.pageSize,
      'pageNumber': this.pageIndex + 1
    };
    this.loadForumTopicService(skillTopic);
  }

  loadAllMyQuestionTopic() {
    this.forumSelectedSkills = 0;
    this.isMyQuestionTopic = true;
    this.isSearch = false;
    this.isSkillTopic = false;
    this.dataService.isLoading = true;
    let myQuestionTopic = {
      'tenantId': this.topicData.tenantId,
      'searchText': this.topicData.searchText,
      'userId': this.topicData.userId,
      'pageSize': this.pageSize,
      'pageNumber': this.pageIndex + 1
    };
    this.loadForumTopicService(myQuestionTopic);
  }

  loadForumTopicService(data: any) {
    this.modService.filterForumTopicAsync(data).subscribe(res => {
      if (res.result) {
        this.forumTopicList = res.result.forumTopics ? res.result.forumTopics : [];
        this.forumTopicTotalCount = res.result ? res.result.totalCount : 0;
        this.filterforumDataSource = new MatTableDataSource<any>(this.forumTopicList);
        this.filterforumObservable = this.filterforumDataSource.connect();
        this.dataService.isLoading = false;
      }
    }, err => {
      this.toastr.warning("Please try again later");
    });
  }

  pageChangeEvent(event) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.dataService.isLoading = true;
    if (this.isSearch) {
      this.loadsearchTopic(false);
    }
    else if (this.isSkillTopic) {
      this.loadAllSkillTopic();
    }
    else if (this.isMyQuestionTopic) {
      this.loadAllMyQuestionTopic();
    }
    else {
      this.loadAllForumTopic();
    }
  }

  routeToForumComponent(id: number) {
    this.topicId.emit(id);
  }
}
