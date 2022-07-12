import { Component, OnInit, Injector, Inject } from '@angular/core';
import { ModService } from '@app/service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { dataService } from "@app/service/common/dataService";
import { AppComponentBase } from '@shared/app-component-base';

@Component({
  selector: 'app-edit-forum-comment',
  templateUrl: './edit-forum-comment.component.html',
  styleUrls: ['./edit-forum-comment.component.css']
})
export class EditForumCommentComponent extends AppComponentBase implements OnInit {
  userId = this.appSession.user.id;
  editReply: string = "";
  constructor(
    injector: Injector,
    private modService: ModService,
    private dataService: dataService,
    private toastr: ToastrService,
    private _router: Router,
    private editCommentDialog: MatDialogRef<EditForumCommentComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {
    super(injector);
  }

  ngOnInit() {
    this.editReply = this.data.editCommentValue;
  }

  editComment() {
    if (this.editReply) {
      let data = {
        'commentId': this.data.editCommentId,
        'comment': this.editReply,
        'editedBy': this.userId
      };
      this.modService.editCommentOrReply(data).subscribe(res => {
        if (res.success) {
          this.toastr.success("Comment has been edited successfully");
          this.editCommentDialog.close({ isEdited: true });
        }
        else {
          this.toastr.warning("Comment creation failed.Please try again");
        }
      }, err => {
        this.toastr.warning("Please try again later");
      });
    }
    else {
      this.toastr.warning("Invalid Data");
    }
  }

  cancel() {
    this.editCommentDialog.close();
  }
}
