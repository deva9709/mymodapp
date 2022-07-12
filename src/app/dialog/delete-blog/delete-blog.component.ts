import { Component, OnInit } from '@angular/core';
import { ModService } from '@app/service';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef } from '@angular/material';
import { dataService } from '@app/service/common/dataService';

@Component({
  selector: 'app-delete-blog',
  templateUrl: './delete-blog.component.html',
  styleUrls: ['./delete-blog.component.css']
})
export class DeleteBlogComponent implements OnInit {
  blogId: number;
  currentUserId: number;
  title: string;
  deleteBlogPost: boolean;
  commentId: number;
  blogName: string;

  constructor(private modService: ModService,
    private toastrService: ToastrService,
    private dataService: dataService,
    public deleteBlogDialog: MatDialogRef<DeleteBlogComponent>) { }

  ngOnInit() {
    this.currentUserId = this.dataService.currentUserId ? this.dataService.currentUserId : 1;
    if (this.blogId) {
      this.deleteBlogPost = true;
      this.title = this.blogName;
    }
    else {
      this.deleteBlogPost = false;
      this.title = "comment";
    }
  }

  deleteBlog() {
    this.modService.deleteBlog(this.blogId, this.currentUserId).subscribe(res => {
      if (res.success) {
        this.toastrService.success(`${this.blogName} has been deleted successfully`);
        this.deleteBlogDialog.close(true);
      }
    });
  }

  deleteComment() {
    this.modService.deleteComment(this.commentId).subscribe(res => {
      if (res.success) {
        this.deleteBlogDialog.close(true);
      }
    });
  }
}