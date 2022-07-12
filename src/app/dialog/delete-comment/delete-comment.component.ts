import { Component, OnInit, Inject, Injector } from '@angular/core';
import { ModService } from '@app/service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AppComponentBase } from '@shared/app-component-base';

@Component({
  selector: 'app-delete-comment',
  templateUrl: './delete-comment.component.html',
  styleUrls: ['./delete-comment.component.css']
})
export class DeleteCommentComponent extends AppComponentBase implements OnInit {
  userId = this.appSession.user.id;
  constructor(
    injector: Injector,
    private modService: ModService,
    private toastr: ToastrService,
    private _router: Router,
    private deleteCommentDialog: MatDialogRef<DeleteCommentComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {
    super(injector);
  }

  ngOnInit() {
  }

  deleteComment() {
    let deleteData = {
      'commentId': this.data.deleteCommentId,
      'deletedBy': this.userId
    };
    this.modService.deleteCommentOrReply(deleteData).subscribe(res => {
      this.deleteCommentDialog.close({ isDeleted: true });
    }, err => {
      this.toastr.warning("Please try again later");
    });
  }

  cancel() {
    this.deleteCommentDialog.close();
  }
}
