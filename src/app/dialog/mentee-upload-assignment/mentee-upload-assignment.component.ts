import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ModService } from '@app/service';
import { ToastrService } from 'ngx-toastr';
import { dataService } from "@app/service/common/dataService";

@Component({
  selector: 'app-mentee-upload-assignment',
  templateUrl: './mentee-upload-assignment.component.html',
  styleUrls: ['./mentee-upload-assignment.component.css']
})
export class MenteeUploadAssignmentComponent implements OnInit {
  assignmentTitle: string = "";
  trainer: string = "";
  isReadOnlyField: boolean = true;
  comments: string = "";
  file: any;
  isSubmitEnabled: boolean = false;
  
  constructor(private uploadAssignmentDialog: MatDialogRef<MenteeUploadAssignmentComponent>,
    public dataService: dataService,
    private modService: ModService,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public updateassignmentUploadData: any
  ) { }

  ngOnInit() {
    this.assignmentTitle = this.updateassignmentUploadData.assignmentTitle;
    this.trainer = this.updateassignmentUploadData.trainer;
  }

  submitAssignment() {
    const formData = new FormData();
    formData.append('file', this.file, this.file.name);
    this.dataService.isLoading = true;
    this.modService.submitAssignmentAsync(formData, this.updateassignmentUploadData.assignmentAssigneeMappingId, this.comments).subscribe(res => {
      if (res.result)
        this.uploadAssignmentDialog.close({ isUpdated: true })
    });
  }

  selectFiles(event) {
    this.file = event.target.files[0];
    this.isSubmitEnabled = true;
  }
}
