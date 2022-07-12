import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModService } from '@app/service';
import { Subscription } from 'rxjs';
import { dataService } from "@app/service/common/dataService";
import { JoinMechanism, SessionType } from '@app/enums/user-roles';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-session-details-tabs',
  templateUrl: './session-details-tabs.component.html',
  styleUrls: ['./session-details-tabs.component.css']
})

export class SessionDetailsTabsComponent implements OnInit {
  routeSub: Subscription;
  sessionId: string;
  userId: number = 0;
  sessionDetails: any[] = [];
  isJoinSessionEnabled: boolean = false;
  sessionTitle: string = "";

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dataService: dataService,
    private modService: ModService,
    private toastr: ToastrService) { }

  ngOnInit() {
    this.dataService.pageName = "Session";
    this.routeSub = this.route.params.subscribe(params => {
      if (params.id) {
        this.sessionId = atob(params['id']);
      }
    });
    this.userId = this.dataService.currentPlatformUserId;
    this.joinEnabled();
  }

  joinEnabled() {
    this.modService.joinSessionDetails(Number(this.sessionId), this.userId).subscribe(res => {
      if (res.result) {
        this.sessionDetails = res.result.sessionSchedule;
        this.sessionTitle = res.result.sessionSchedule.sessionTitle;
        this.isJoinSessionEnabled = res.result.isJoinEnabled;
      }
    });
  }

  joinSession(session): void {
    this.dataService.sessionCode = session.sessionCode;
    this.dataService.sessionTitle = session.sessionTitle;
    this.dataService.sessionScheduleId = session.id;
    this.dataService.sessionType = session.sessionType;
    this.router.navigate(['app/join-session'], { queryParams: { sessioncode: session.sessionCode } });
  }

  back() {
    this.router.navigate(['app/calendar']);
  }
}
