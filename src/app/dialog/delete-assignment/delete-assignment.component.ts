import { Component, OnInit } from '@angular/core';
import { ModService } from '@app/service';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef } from '@angular/material';

@Component({
    selector: 'app-delete-assignment',
    templateUrl: './delete-assignment.component.html',
    styleUrls: ['./delete-assignment.component.css']
})

export class DeleteAssignmentComponent implements OnInit {
    assignmentId: number;
    constructor(private modService: ModService,
        private toastrService: ToastrService,
        private dialogRef: MatDialogRef<DeleteAssignmentComponent>) {

    }

    ngOnInit() {
    }

    deleteAssignment() {
        this.modService.deleteAssignment(this.assignmentId).subscribe(res => {
            if (res.result) {
                this.toastrService.success("Assignment has been deleted successfully");
                this.dialogRef.close(true);
            }
            else {
                this.toastrService.warning("Unable to delete assignment since it is already assigned to Sessions");
                this.dialogRef.close(false);
            }
        });
    }
}