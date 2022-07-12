import { Component, OnInit, Injector, Inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AppComponentBase } from '@shared/app-component-base';
import { ModService } from '@app/service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-survey-name-dialog',
  templateUrl: './survey-name-dialog.component.html',
  styleUrls: ['./survey-name-dialog.component.css']
})
export class SurveyNameDialogComponent extends AppComponentBase implements OnInit {
  surveyName: "";
  userId = this.appSession.user.id;
  surveyId: any;
  sendActive: boolean = false;
  constructor(
    injector: Injector,
    private toastr: ToastrService,
    private _router: Router,
    private modService: ModService,
    public surveyNameDialog: MatDialogRef<SurveyNameDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any) {
    super(injector);
  }

  ngOnInit() {
  }

  newSurvey() {
    this.sendActive = true;
    if (!this.surveyName.trim()) {
      this.toastr.warning("Please enter the survey name");
      this.sendActive = false;
    }
    else {
      var data = {
        'surveyName': this.surveyName,
        'createdBy': this.userId,
      };
      this.modService.createSurvey(data).subscribe(res => {
        this.surveyId = res.result.id;
        let routerId = btoa(this.surveyId);
        this.surveyNameDialog.close();
        this._router.navigate(['app/survey-creator', routerId]);
      }, err => {
        console.log(err);
      });
    }
  }

  close() {
    this.surveyNameDialog.close();

  }
}