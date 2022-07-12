import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-assessment-url',
  templateUrl: './assessment-url.component.html',
  styleUrls: ['./assessment-url.component.css']
})
export class AssessmentUrlComponent implements OnInit {

  assessmentUrl: string;
  constructor(
    private assessmentDialog: MatDialogRef<AssessmentUrlComponent>
  ) { }

  ngOnInit() {
  }

}
