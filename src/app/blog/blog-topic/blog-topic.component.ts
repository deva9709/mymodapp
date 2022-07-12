import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DeleteBlogComponent } from "../../dialog/delete-blog/delete-blog.component";
import { ActivatedRoute, Router } from '@angular/router';
import { ModService } from '@app/service';
import { ToastrService } from 'ngx-toastr';
import { dataService } from '@app/service/common/dataService';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WhiteSpaceValidators } from '@shared/validators/whitespace.validator';
import { NewBlogTopicComponent } from '../new-topic/new-topic.component';
import { UserRoles } from '@app/enums/user-roles';

@Component({
  selector: 'app-blog-topic',
  templateUrl: './blog-topic.component.html',
  styleUrls: ['./blog-topic.component.css']
})
export class BlogTopicComponent implements OnInit {
  commentForm: FormGroup;
  blogId: number;
  blog: any;
  blogComments: any = [];
  newComment: string;
  currentUserId: number = this.dataService.currentUserId;
  isEditComment: boolean = false;
  commentId: number;
  commentsEnabled: boolean = true;
  currentUserType: string = this.dataService.currentUserType;
  userRoles = UserRoles;
  @ViewChild("comment") comment: ElementRef;

  constructor(
    public dialog: MatDialog,
    private activeatedRoute: ActivatedRoute,
    private modService: ModService,
    private toastrService: ToastrService,
    private dataService: dataService,
    private formBuilder: FormBuilder,
    private router: Router) { }

  deleteBlog(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = false;
    dialogConfig.width = '40vw';
    const dialogRef = this.dialog.open(DeleteBlogComponent, dialogConfig);
    dialogRef.componentInstance.blogId = this.blogId;
    dialogRef.componentInstance.blogName = this.blog.topic;
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.router.navigate(['app/blogs']);
      }
    });
  }

  ngOnInit() {
    this.initCommentForm();
    this.activeatedRoute.params.subscribe((params) => {
      let id = atob(params['id']);
      this.blogId = parseInt(id);
      this.modService.getBlog(this.blogId).subscribe(res => {
        this.blog = res.result ? res.result : [];
        if (this.blog.isCommentsEnabled) {
          this.commentsEnabled = true;
          this.getComments();
        }
        else {
          this.commentsEnabled = false;
        }
      });
    });
  }

  initCommentForm(): void {
    this.commentForm = this.formBuilder.group({
      newComment: ['', [Validators.required, WhiteSpaceValidators.emptySpace()]]
    });
  }

  addComment() {
    let data = {
      "blogId": this.blogId,
      "userId": this.currentUserId,
      "comment": this.commentForm.value.newComment
    };
    this.modService.addComment(data).subscribe(res => {
      if (res.success) {
        this.toastrService.success("Comment has been added");
        this.getComments();
        this.commentForm.reset();
      }
    });
  }

  resetComment() {
    this.commentForm.reset();
    this.isEditComment = false;
  }

  like() {
    this.modService.upVote(this.blogId).subscribe(res => {
      if (res.success) {
        this.blog.upVoteCount = res.result;
      }
    });
  }

  dislike() {
    this.modService.downVote(this.blogId).subscribe(res => {
      if (res.success) {
        this.blog.downVoteCount = res.result;
      }
    });
  }

  deleteComment(id: number) {
    const deleteFeatureDialog = new MatDialogConfig();
    deleteFeatureDialog.disableClose = false;
    deleteFeatureDialog.autoFocus = false;
    deleteFeatureDialog.width = '40vw';
    const dialogRef = this.dialog.open(DeleteBlogComponent, deleteFeatureDialog);
    dialogRef.componentInstance.commentId = id;
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.toastrService.success("Comment has been removed successfully");
        this.getComments();
      }
    });
  }

  editComment(blogComment) {
    this.isEditComment = true;
    this.commentId = blogComment.id;
    this.commentForm.setValue({
      newComment: blogComment.comment,
    });
    this.focusComment();
  }

  updateComment() {
    let data = {
      "blogId": this.blogId,
      "userId": this.currentUserId,
      "comment": this.commentForm.value.newComment,
      "id": this.commentId
    };
    this.modService.updateComment(data).subscribe(res => {
      if (res.success) {
        this.toastrService.success("Comment has been updated");
        this.getComments();
        this.commentForm.reset();
        this.isEditComment = false;
      }
    });
  }

  getComments() {
    this.modService.getAllComments(this.blogId).subscribe(res => {
      this.blogComments = res.result ? res.result : [];
    });
  }

  editBlog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = false;
    dialogConfig.width = '80vw';
    const dialogRef = this.dialog.open(NewBlogTopicComponent, dialogConfig);
    dialogRef.componentInstance.blog = this.blog;
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.modService.getBlog(this.blogId).subscribe(res => {
          this.blog = res.result ? res.result : [];
          if (this.blog.isCommentsEnabled) {
            this.commentsEnabled = true;
            this.getComments();
          }
          else
            this.commentsEnabled = false;
        });
      }
    });
  }

  focusComment() {
    this.comment.nativeElement.focus();
  }
}