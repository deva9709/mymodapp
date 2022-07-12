import { Component, OnInit, Input } from '@angular/core';
import { ModService } from '@app/service';
import { finalize } from 'rxjs/operators';
import { dataService } from "@app/service/common/dataService";
import { SessionStatus } from '@app/enums/user-roles';

@Component({
  selector: 'app-session-details',
  templateUrl: './session-details.component.html',
  styleUrls: ['./session-details.component.css']
})

export class SessionDetailsComponent implements OnInit {
  @Input() sessionScheduleId;
  sessionDetails: any;
  sessionTitle: string = "";
  sessionStartDate: Date;
  sessionEndDate: Date;
  sessionJoinUrl: string = "";
  requestedBy: string = "";
  sessionStatus: string = "";

  constructor(private modService: ModService,
    private dataService: dataService) { }

  ngOnInit() {
    this.dataService.isLoading = true;
    this.getSessionDetailsById(this.sessionScheduleId);
  }

  getSessionDetailsById(sessionId: number) {
    this.modService.getSessionDetailsById(sessionId).pipe(
      finalize(() => { this.dataService.isLoading = this.dataService.doneLoading(); })
    ).subscribe(res => {
      if (res.result) {
        this.sessionDetails = res.result;
        this.sessionTitle = this.sessionDetails.sessionTitle;
        this.sessionStartDate = new Date(`${this.sessionDetails.startDate}.000Z`);
        this.sessionEndDate = new Date(`${this.sessionDetails.endDate}.000Z`);
        this.sessionJoinUrl = this.sessionDetails.sessionUrl;
        this.sessionStatus = SessionStatus[this.sessionDetails.sessionStatus];
        this.requestedBy = `${this.sessionDetails.sessionRequestor.name} ${this.sessionDetails.sessionRequestor.surName} (${this.sessionDetails.sessionRequestor.email})`;
      }
    });
  }
}
