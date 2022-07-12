import { Component, OnInit } from '@angular/core';
import { ModService } from '@app/service';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-remove-assignment',
  templateUrl: './remove-assignment.component.html',
  styleUrls: ['./remove-assignment.component.css']
})
export class RemoveAssignmentComponent implements OnInit {
  assignmentId: number;
  sessionId: number;

  constructor(private modService: ModService,
    private toastrService: ToastrService,
    private dialogRef: MatDialogRef<RemoveAssignmentComponent>) { }

  ngOnInit() {
  }

  removeAssignment() {
    this.modService.deleteSessionAssignment(this.assignmentId, this.sessionId).subscribe(res => {
      if (res.success) {
        this.toastrService.success("Assignment has been removed successfully");
        this.dialogRef.close(true);
      }
    });
  }
}