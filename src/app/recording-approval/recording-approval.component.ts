import { Component, Input, OnInit } from '@angular/core';
import { ModService } from '@app/service';
import { dataService } from '@app/service/common/dataService';

@Component({
  selector: 'app-recording-approval',
  templateUrl: './recording-approval.component.html',
  styleUrls: ['./recording-approval.component.css']
})
export class RecordingApprovalComponent implements OnInit {
  //@Input() sessionScheduleId;
  sessionTitle: string = "";

  constructor( 
     ) { 
    
  }

  ngOnInit() {
    //this.dataService.isLoading = true;
    //this.getApprovalDetailsById(this.sessionScheduleId);
  }

  // getApprovalDetailsById(sessionId: number) {
  //   this.modService.getapp(sessionId).pipe(
  //     finalize(() => { this.dataService.isLoading = this.dataService.doneLoading(); })
  //   ).subscribe(res => {
  //     if (res.result) {
  //       this.sessionDetails = res.result;
  //       this.sessionTitle = this.sessionDetails.sessionTitle;
  //       this.sessionStartDate = new Date(`${this.sessionDetails.startDate}.000Z`);
  //       this.sessionEndDate = new Date(`${this.sessionDetails.endDate}.000Z`);
  //       this.sessionJoinUrl = this.sessionDetails.sessionUrl;
  //       this.sessionStatus = SessionStatus[this.sessionDetails.sessionStatus];
  //       this.requestedBy = `${this.sessionDetails.sessionRequestor.name} ${this.sessionDetails.sessionRequestor.surName} (${this.sessionDetails.sessionRequestor.email})`;
  //     }
  //   });
  // }



}
