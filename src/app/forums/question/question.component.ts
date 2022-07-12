import { Component, OnInit, Injector, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { NewTopicComponent } from "../../dialog/new-topic/new-topic.component";
import { DeleteCommentComponent } from "../../dialog/delete-comment/delete-comment.component";
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ModService } from '@app/service';
import { dataService } from "@app/service/common/dataService";
import { AppComponentBase } from '@shared/app-component-base';
import { dashCaseToCamelCase } from '@angular/compiler/src/util';
import { DeleteForumTopicComponent } from '@app/dialog/delete-forum-topic/delete-forum-topic.component';
import { EditForumCommentComponent } from '@app/dialog/edit-forum-comment/edit-forum-comment.component';
import { ForumService } from '@app/service/api/forum.service';
import { UserRoles } from '@app/enums/user-roles';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { WhiteSpaceValidators } from '@shared/validators/whitespace.validator';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent extends AppComponentBase implements OnInit {
  postCommentStatus = false;
  postReplyStatus = false;
  routerId: number;
  forumData: any;
  voteData: any;
  forumTopic: any;
  createPermission: boolean;
  updatePermission: boolean;
  deletePermission: boolean;
  rolePermissions: any[] = [];
  Code: string = "FORUMS";
  forumComments: any[] = [];
  isVote: boolean = false;
  isForumEdit: boolean;
  userId = this.appSession.user.id;
  parentCommentId: number;
  parentComments: any[] = [];
  childComments: any[] = [];
  id: number;
  trendingSkillList: any[] = [];
  discussionList: any[] = [];
  isCommentVote: boolean = true;
  topicSkills: any[] = [];
  currentUserType: string = this.dataService.currentUserType;
  userRoles = UserRoles;
  routerTopicIds: any;
  @Input() routerTopicId: number;
  @Output() backToForumLists: EventEmitter<string> = new EventEmitter<string>();
  @Output() deleteForumTopicList: EventEmitter<string> = new EventEmitter<string>();
  commentForm: FormGroup;
  replyForm: FormGroup;
  isQuestionCreated: boolean = false;

  constructor(
    injector: Injector,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private modService: ModService,
    private dataService: dataService,
    private toastr: ToastrService,
    private _router: Router,
    private formBuilder: FormBuilder,
    public forumService: ForumService
  ) {
    super(injector);
  }

  ngOnInit() {
    this.initCommentForm();
    this.initReplyForm();
    this.dataService.isLoading = true;
    this.routerId = this.forumService.forumTopicId;
    this.loadForumTopic();
    this.getPermissions();
  }

  ngOnChanges() {
    this.initCommentForm();
    this.initReplyForm();
    this.loadForumTopic();
  }

  getPermissions() {
    if (this.dataService.currentUserRole === UserRoles[1]) {
      this.createPermission = this.updatePermission = this.deletePermission = true;
    }
    else {
      this.rolePermissions = this.dataService.rolePermissions;
      let permissions = this.rolePermissions.find(val => val.feature.featureCode === this.Code);
      if (permissions) {
        this.createPermission = permissions.create;
        this.updatePermission = permissions.update;
        this.deletePermission = permissions.delete;
      }
      else {
        this.createPermission = this.updatePermission = this.deletePermission = false;
      }
    }
  }

  loadForumTopic() {
    this.modService.getForumTopic(this.routerTopicId).subscribe(res => {
      this.forumData = res.result ? res.result : [];
      this.forumTopic = this.forumData.forumTopic;
      this.topicSkills = this.forumTopic.skills ? this.forumTopic.skills : [];
      this.isForumEdit = this.forumTopic.totalComment;
      this.forumComments = this.forumData.forumComments;
      this.parentComments = this.forumComments.filter(forumComment => forumComment.parentForumCommentId == null);
      this.childComments = this.forumComments.filter(forumComment => forumComment.parentForumCommentId);
      this.isQuestionCreated = true;
      this.dataService.isLoading = false;
      this.isVote = false;
    }, err => {
      this.toastr.warning("Please try again later");
    });
  }

  topicUpvote() {
    this.isVote = true;
    let upVoteTopic = {
      'topicId': this.forumTopic.id,
      'userId': this.userId,
      'upVote': true
    };
    this.forumVoteService(upVoteTopic);
  }

  topicDownVote() {
    this.isVote = true;
    let downVoteTopic = {
      'topicId': this.forumTopic.id,
      'userId': this.userId,
      'upVote': false
    };
    this.forumVoteService(downVoteTopic);
  }

  commentUpVote(commentId: number) {
    this.isCommentVote = true;
    let upVoteComment = {
      'commentId': commentId,
      'userId': this.userId,
      'upVote': true
    };
    this.forumVoteService(upVoteComment);
  }

  commentDownVote(commentId: number) {
    this.isCommentVote = true;
    let downVoteComment = {
      'commentId': commentId,
      'userId': this.userId,
      'upVote': false
    };
    this.forumVoteService(downVoteComment);
  }

  forumVoteService(data: any) {
    this.modService.forumVote(data).subscribe(res => {
      if (res.result) {
        if (this.isCommentVote) {
          this.loadForumTopic();
          this.isCommentVote = false;
        }
        else {
          this.loadForumTopic();
        }
        this.toastr.success("Thank you  for the vote");
      }
    }, err => {
      this.toastr.warning("Please try again later");
    });
  }

  editForumTopic() {
    if (this.updatePermission) {
      const dialogRef = this.dialog.open(NewTopicComponent, {
        width: '60vw',
        data: {
          selectedSkill: this.forumTopic.skills,
          forumTopic: this.forumTopic.title,
          forumDescription: this.forumTopic.description,
          forumTopicId: this.forumTopic.id
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result.isEdited) {
          this.loadForumTopic();
          this.deleteForumTopicList.next();
        }
      });
    }
    else {
      this.toastr.warning("You don't have permission to update a forum");
    }
  }

  deleteCommentDialog(id: number): void {
    const deleteCommentDialog = this.dialog.open(DeleteCommentComponent, {
      data: {
        deleteCommentId: id
      }
    });
    deleteCommentDialog.afterClosed().subscribe(result => {
      if (result.isDeleted) {
        this.toastr.success("Comment has been deleted successfully");
        this.loadForumTopic();
      }
    });
  }

  deleteForumTopic(id: number): void {
    if (this.deletePermission) {
      const deleteTopicDialog = this.dialog.open(DeleteForumTopicComponent, {
        data: {
          deleteTopicId: id
        }
      });
      deleteTopicDialog.afterClosed().subscribe(result => {
        if (result.isDeleted) {
          this.toastr.success("Forum topic  has been deleted successfully");
          this.deleteForumTopicList.next();
          this.backToForumLists.next();
          this.dataService.isLoading = true;
          this.forumService.showForumList = true;
          this.forumService.showForumDiscussion = false;
        }
      });
    }
    else {
      this.toastr.warning("You don't have permission to delete a forum");
    }
  }

  postComment(): void {
    let commentData = {
      'comment': this.commentForm.value.newComment,
      'forumTopicId': this.forumTopic.id,
      'addedBy': this.userId,
      'parentForumCommentId': null
    };
    this.modService.postCommentAndReply(commentData).subscribe(res => {
      if (res.success) {
        this.toastr.success("Comment posted ");
        this.loadForumTopic();
        this.commentForm.reset();
      }
    }, err => {
      this.toastr.warning("Please try again later");
    });
    this.postCommentStatus = !this.postCommentStatus;
  }

  postCommentToggle() {
    this.postCommentStatus = !this.postCommentStatus;
    this.commentForm.reset();
  }

  postReplyToggle(id) {
    this.postReplyStatus = !this.postReplyStatus;
    this.replyForm.reset();
    this.id = id;
  }

  editDialogButton(id: number, comment: string) {
    const editCommentOrReply = this.dialog.open(EditForumCommentComponent, {
      width: '60vw',
      data: {
        editCommentId: id,
        editCommentValue: comment
      }
    });
    editCommentOrReply.afterClosed().subscribe(result => {
      if (result.isEdited) {
        this.toastr.success("Comment edited");
        this.loadForumTopic();
      }
    });
  }

  postCommentCancel() {
    this.commentForm.reset();
    this.postCommentStatus = !this.postCommentStatus;
  }

  postReply(commentId: number) {
    let replyData = {
      'comment': this.replyForm.value.newReply,
      'forumTopicId': this.forumTopic.id,
      'addedBy': this.userId,
      'parentForumCommentId': commentId
    };
    this.modService.postCommentAndReply(replyData).subscribe(res => {
      if (res.success) {
        this.toastr.success("Reply posted");
        this.loadForumTopic();
        this.replyForm.reset();
      }
    },err=>{
      this.toastr.warning("Please try again later");
    });
    this.postReplyStatus = !this.postReplyStatus;
    
  }

  postReplyCancel() {
    this.replyForm.reset();
    this.postReplyStatus = !this.postReplyStatus;
  }

  initCommentForm(): void {
    this.commentForm = this.formBuilder.group({
      newComment: ['', [Validators.required, WhiteSpaceValidators.emptySpace()]]
    });
  }

  initReplyForm(): void {
    this.replyForm = this.formBuilder.group({
      newReply: ['', [Validators.required, WhiteSpaceValidators.emptySpace()]]
    });
  }

  backToForumList() {
    this.dataService.isLoading = true;
    this.forumService.showForumList = true;
    this.forumService.showForumDiscussion = false;
    this.backToForumLists.next();
    this.deleteForumTopicList.next();
  }
}