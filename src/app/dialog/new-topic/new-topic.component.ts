import { Component, OnInit, Injector, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AppComponentBase } from '@shared/app-component-base';
import { ModService } from '@app/service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { dataService } from "@app/service/common/dataService";
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-topic',
  templateUrl: './new-topic.component.html',
  styleUrls: ['./new-topic.component.css']
})
export class NewTopicComponent extends AppComponentBase implements OnInit {
  skillSet = new FormControl();
  forumSelectedSkills: string[] = [];
  forumQuestion: string = "";
  forumDescription: string = "";
  forumTopicId: any;
  skillList: string[] = [];
  userId = this.appSession.user.id;
  skillId: number;
  value: number;
  dialogTitle = "New Topic";
  isUpdate: boolean = false;
  constructor(
    injector: Injector,
    private modService: ModService,
    private dataService: dataService,
    private toastr: ToastrService,
    private _router: Router,
    private NewTopicDialog: MatDialogRef<NewTopicComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {
    super(injector);
  }

  ngOnInit() {
    this.dataService.isLoading = false;
    this.modService.getAllSkill().subscribe(res => {
      this.skillList = res.result.items;
    });
    if (this.data) {
      this.forumQuestion = this.data.forumTopic;
      this.forumTopicId = this.data.forumTopicId;
      this.forumDescription = this.data.forumDescription;
      this.data.selectedSkill.forEach(element => {
        this.forumSelectedSkills.push(element.id);
      });
      this.dialogTitle = this.forumQuestion;
      this.isUpdate = true;
    }
  }

  createQuestion() {
    if (this.forumSelectedSkills.length && this.forumQuestion.trim() && this.forumDescription.trim()) {
      let data = {
        'tenantId': this.dataService.currentTenentId,
        'title': this.forumQuestion,
        'description': this.forumDescription,
        'skillIds': this.forumSelectedSkills,
        'createdByUserId': this.userId
      };
      this.modService.createForumTopicAsync(data).subscribe(res => {
        if (res.result) {
          let id = res.result.id
          this.toastr.success("New topic has been created successfully");
          this.NewTopicDialog.close({ isCreated: true, topicId: id });
        }
        else {
          this.toastr.warning("Forum creation failed.Please try again");
        }
      }, err => {
        this.toastr.warning("Please try again later");
      });
    }
    else {
      this.toastr.warning("Invalid Data");
    }
  }

  updateQuestion() {
    if (this.forumSelectedSkills.length && this.forumQuestion && this.forumDescription) {
      let data = {
        'topicId': this.forumTopicId,
        'title': this.forumQuestion,
        'description': this.forumDescription,
        'skillIds': this.forumSelectedSkills,
        'editedBy': this.userId
      };
      this.modService.updateForumTopicAsync(data).subscribe(res => {
        if (res.success) {
          this.toastr.success("Topic has been Updated successfully")
          this.NewTopicDialog.close({ isEdited: true });
        }
        else {
          this.toastr.warning("Forum creation failed.Please try again");
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
    this.NewTopicDialog.close();
  }
}