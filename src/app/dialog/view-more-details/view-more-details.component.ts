import { Component, OnInit } from '@angular/core';
import { ModService } from '@app/service';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-view-more-details',
  templateUrl: './view-more-details.component.html',
  styleUrls: ['./view-more-details.component.css']
})
export class ViewMoreDetailsComponent implements OnInit {
  tanentValue: any;
  platFormUserId: number;
  allProfileDetails: any[];
  profileMicrotutoring: string = "";
  allProfileDetailsOfCertificate: any[] = [];
  profilecertificates: string = "";
  allProfileDetailsOflanguagesKnown: any;
  profilelanguages: any[] = [];
  costForTrainer: any[];
  costFor15Minutes: number;
  costFor1Hour: number;
  costFor30Minutes: number;
  costFor45Minutes: number;
  costFor4Hour: number;
  costFor8Hour: number;
  costForLongTerms: number;
  profileUserDetails: any;
  constructor(
    private modService: ModService,
    private _dialogRef: MatDialogRef<ViewMoreDetailsComponent>
  ) { }

  ngOnInit() {
    this.platFormUserId = this.tanentValue.platformUserId;
    this.getProfileDetailsOfTrainer();
  }

  // get Profile Details of trainer 
  getProfileDetailsOfTrainer() {
    this.modService.getUserProfileOfTrainer(this.platFormUserId).subscribe(data => {
      if (data.result) {
        this.profileUserDetails = data.result.userDetails;
        if (data.result.microTutoring) {
          this.allProfileDetails = data.result.microTutoring;
          this.profileMicrotutoring = this.allProfileDetails.map(res => res.topicName).join(',');
        }
        if (data.result.certificates) {
          this.allProfileDetailsOfCertificate = data.result.certificates;
          this.profilecertificates = this.allProfileDetailsOfCertificate.map(res => res.certificateName).join(',');
        }
        if (data.result.languagesKnown) {
          this.allProfileDetailsOflanguagesKnown = data.result.languagesKnown;
          this.profilelanguages = this.allProfileDetailsOflanguagesKnown.map(res => res.language).join(',');
        }
        if (data.result.cost) {
          this.costForTrainer = data.result.cost;
          this.costForTrainer.filter(cost => cost.costTypeId === 1).map(res => { this.costFor15Minutes = res.cost; });
          this.costForTrainer.filter(cost => cost.costTypeId === 2).map(res => { this.costFor30Minutes = res.cost; });
          this.costForTrainer.filter(cost => cost.costTypeId === 3).map(res => { this.costFor45Minutes = res.cost; });
          this.costForTrainer.filter(cost => cost.costTypeId === 4).map(res => { this.costFor1Hour = res.cost; });
          this.costForTrainer.filter(cost => cost.costTypeId === 5).map(res => { this.costFor4Hour = res.cost; });
          this.costForTrainer.filter(cost => cost.costTypeId === 6).map(res => { this.costFor8Hour = res.cost; });
          this.costForTrainer.filter(cost => cost.costTypeId === 7).map(res => { this.costForLongTerms = res.cost; });
        }
      }
    });
  }

  closePopup() {
    this._dialogRef.close();
  }
}
