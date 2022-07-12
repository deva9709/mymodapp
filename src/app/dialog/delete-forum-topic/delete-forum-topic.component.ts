import { Component, OnInit, Inject, Injector } from '@angular/core';
import { ModService } from '@app/service';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AppComponentBase } from '@shared/app-component-base';

@Component({
  selector: 'app-delete-forum-topic',
  templateUrl: './delete-forum-topic.component.html',
  styleUrls: ['./delete-forum-topic.component.css']
})
export class DeleteForumTopicComponent extends AppComponentBase implements OnInit {

  userId = this.appSession.user.id;
  constructor(
    private modService: ModService,
    injector: Injector,
    private toastr: ToastrService,
    public deleteTopicDialog: MatDialogRef<DeleteForumTopicComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    super(injector);
  }

  ngOnInit() {
  }

  deleteTopic() {
    let deleteData = {
      'topicId': this.data.deleteTopicId,
      'deletedBy': this.userId
    };
    this.modService.deleteForumTopic(deleteData).subscribe(res => {
      this.deleteTopicDialog.close({ isDeleted: true });
    }, err => {
      this.toastr.warning("Please try again later");
    });
  }

  cancel() {
    this.deleteTopicDialog.close({ isDeleted: false });
  }
}
