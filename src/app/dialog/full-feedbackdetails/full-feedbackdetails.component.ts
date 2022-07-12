import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-full-feedbackdetails',
  templateUrl: './full-feedbackdetails.component.html',
  styleUrls: ['./full-feedbackdetails.component.css']
})
export class FullFeedbackdetailsComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<FullFeedbackdetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }
  fullFeedBackDetails: string;
  ngOnInit() {
    this.fullFeedBackDetails = this.data;
  }
}
