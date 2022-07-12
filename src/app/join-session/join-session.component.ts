import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModService } from '@app/service';
import { AppSessionService } from '@shared/session/app-session.service';
import { dataService } from "@app/service/common/dataService";
import { CookieService } from 'ngx-cookie-service';
import { SessionType } from '@app/enums/user-roles';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-join-session',
  templateUrl: './join-session.component.html',
  styleUrls: ['./join-session.component.css']
})
export class JoinSessionComponent implements OnInit {
  sessionCode: string;

  constructor(
    public dataService: dataService,
    private activateRoute: ActivatedRoute,
    private modService: ModService,
    private sessionService: AppSessionService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.sessionCode = this.activateRoute.snapshot.queryParamMap.get('sessioncode');
    let sessionDetails = {
      'SessionCode': this.sessionCode,
      'ParticipantUserId': this.sessionService.userId
    };
    this.modService.connectSessionAsync(sessionDetails).subscribe(response => {
      if (response.result) {
        if (this.isSessionStarted(response.result)) {
          localStorage.setItem(btoa(this.sessionCode), btoa("true"));
          window.open(response.result.participantSessionUrl, '_blank');
          this.dataService.isLoading = false;
        }
        else {
          this.toastr.warning("The host can allow attendees to join up to 5 minutes prior to the scheduled start time.");
          this.router.navigate(['app/mod-sessions']);
        }
      }
      else {
        this.toastr.warning("Please check if session is valid.");
        this.router.navigate(['app/mod-sessions']);
      }

    });
  }
  isSessionStarted(data) {
    let timeRemainingtoStartSession = new Date(`${data.startDate}.000Z`).getTime() - new Date().getTime();
    return timeRemainingtoStartSession < 300000;
  }
}



