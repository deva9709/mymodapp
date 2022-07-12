import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { ModService } from '@app/service';
import { dataService } from '@app/service/common/dataService';
import { ToastrService } from 'ngx-toastr';
import { WhiteSpaceValidators } from '@shared/validators/whitespace.validator';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-new-topic',
  templateUrl: './new-topic.component.html',
  styleUrls: ['./new-topic.component.css']
})
export class NewBlogTopicComponent implements OnInit {
  blogForm: FormGroup;
  thumpnail: any;
  isCommentDisabled: boolean = false;
  currentUserId: number = this.dataService.currentUserId;
  blog: any;
  isUpdate: boolean = false;
  newBlogPageTite: string = "Create New Blog";
  isPending: boolean = false;

  constructor(private modService: ModService,
    private dataService: dataService,
    private toastrService: ToastrService,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<NewBlogTopicComponent>) { }

  ngOnInit() {
    this.initBlogForm();
    if (this.blog) {
      this.newBlogPageTite = "Edit Blog"
      this.blogForm.setValue({
        blogTopic: this.blog.topic,
        blogContent: this.blog.content,
        tags: this.blog.tags,
      });
      this.isCommentDisabled = !this.blog.isCommentsEnabled;
      this.isUpdate = true;
    }
  }

  initBlogForm(): void {
    this.blogForm = this.formBuilder.group({
      blogTopic: ['', [Validators.required, WhiteSpaceValidators.emptySpace(), Validators.maxLength(50)]],
      blogContent: ['', [Validators.required, WhiteSpaceValidators.emptySpace()]],
      tags: ['', [Validators.required, WhiteSpaceValidators.emptySpace()]],
    });
  }

  selectThumpnail(event: any) {
    if (event.target.files.length) {
      this.thumpnail = event.target.files[0];
      let thumpnailType = event.target.files[0].type;
      if (thumpnailType == "image/png" || thumpnailType == "image/jpeg") {
        this.toastrService.success('Thumbnail selected');
      }
      else {
        this.toastrService.warning('Upload only image files');
      }
    }
    else {
      this.toastrService.warning('Please select a image');
    }
  }

  publish() {
    if (!this.thumpnail) {
      this.toastrService.warning("Please select thumbnail image");
    }
    else {
      this.isPending = true;
      const formData = new FormData();
      formData.append('file', this.thumpnail, this.thumpnail.name);
      this.dataService.isLoading = true;
      this.modService.uploadToBlob(formData).subscribe(res => {
        if (res.success) {
          let data = {
            "topic": this.blogForm.value.blogTopic.trim(),
            "thumbnailURL": res.result,
            "content": this.blogForm.value.blogContent.trim(),
            "isCommentsEnabled": !this.isCommentDisabled,
            "createdUserId": this.currentUserId,
            "tags": this.blogForm.value.tags.trim()
          };
          this.modService.createBlog(data).subscribe(res => {
            if (res.result) {
              this.toastrService.success(`${this.blogForm.value.blogTopic.trim()} has been published`);
              this.dataService.isLoading = this.dataService.doneLoading();
              this.dialogRef.close(true);
              this.isPending = false;
            }
          });
        }
      });
    }
  }

  updateBlog() {
    if (this.thumpnail) {
      const formData = new FormData();
      formData.append('file', this.thumpnail, this.thumpnail.name);
      this.modService.uploadToBlob(formData).subscribe(res => {
        if (res.success) {
          this.update(true, res.result);
        }
      });
    }
    else {
      this.update(false);
    }
  }

  update(isFileUpdate: boolean, thumbnailUrl?: string) {
    let data = {
      "topic": this.blogForm.value.blogTopic.trim(),
      "thumbnailURL": thumbnailUrl ? thumbnailUrl : this.blog.thumbnailURL,
      "content": this.blogForm.value.blogContent.trim(),
      "isCommentsEnabled": !this.isCommentDisabled,
      "tags": this.blogForm.value.tags.trim(),
      "modifiedUserId": this.currentUserId,
      "id": this.blog.id
    };
    this.modService.updateBlog(data, isFileUpdate).subscribe(res => {
      if (res.result) {
        this.toastrService.success(`${this.blogForm.value.blogTopic.trim()} has been updated`);
        this.dialogRef.close(true);
      }
    });
  }
}
