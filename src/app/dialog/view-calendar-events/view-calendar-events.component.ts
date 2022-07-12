import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatTableDataSource, MatSort, MatPaginator, MatDialogRef } from '@angular/material';
import { ParticipantRole, SessionStatus, UserRoles } from '@app/enums/user-roles';
import { Router } from '@angular/router';
import { dataService } from "@app/service/common/dataService";


interface DateEventList {
  id: number;
  title: string;
  sessionStartDate: Date;
  sessionEndDate: Date;
  status: string;
}

@Component({
  selector: 'app-view-calendar-events',
  templateUrl: './view-calendar-events.component.html',
  styleUrls: ['./view-calendar-events.component.css']
})
export class ViewCalendarEventsComponent implements OnInit {
  calendarEventColumn: string[] = ['sessionTitle', 'sessionStartDate', 'sessionEndDate', 'sessionStatus', 'viewDetails', 'Alerts'];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('calendarEventPaginator') calendarEventPaginator: MatPaginator;
  calendarEventDataSource: MatTableDataSource<any>;
  clickedColumn: number;
  sessionEventDetails: any[] = [];
  selectedDateEventList: DateEventList[] = [];
  calSessionTitle: string;
  isNotifyMe:boolean=false;
  constructor(
    private _router: Router,
    private router: Router,
    private dataService: dataService,
    public viewCalendarEventsComponent: MatDialogRef<ViewCalendarEventsComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) { }

  ngOnInit() {    
    this.sessionEventDetails = this.data.sessionEventDetails;
    this.populateEventTable(this.data.calendarEvents);
  }

  populateEventTable(events) {
    this.selectedDateEventList = [];
    let sessionEventFiltered = this.sessionEventDetails.filter(sssionDetail => events.some(event => sssionDetail.sessionScheduleId === event.id));
    sessionEventFiltered.forEach(element => {
      let eventList: DateEventList = {
        id: element.sessionScheduleId,
        title: element.sessionTitle,
        sessionStartDate: new Date(`${element.startDate}.000Z`),
        sessionEndDate: new Date(`${element.endDate}.000Z`),
        status: SessionStatus[element.sessionStatus],
      }
      this.selectedDateEventList.push(eventList);
    });
    this.calendarEventDataSource = new MatTableDataSource<any>(this.selectedDateEventList);
    for(let i=0;i<this.calendarEventDataSource.data.length;i++){
      if((new Date()).getTime()-this.calendarEventDataSource.data[i].sessionStartDate.getTime()>=0){
        this.calendarEventDataSource.data[i]['isNotifyMe']=true;
      }
      else{
        this.calendarEventDataSource.data[i]['isNotifyMe']=false;
      }      
    }
    this.calendarEventDataSource.paginator = this.calendarEventPaginator;
    this.calendarEventDataSource.sort = this.sort;
  }

  routeToSessionDetailsTab(sessionId) {
    this.viewCalendarEventsComponent.close();
    let routerId = btoa(sessionId);
    this._router.navigate(['app/view-session-details', routerId]);
  }
  sendalerts(val) {
    if((new Date()).getTime()-val.sessionStartDate.getTime()>=0){
      val.isNotifyMe=true;
    }
    this.dataService.calSession = val;
    this.viewCalendarEventsComponent.close();
    this.router.navigate(["/app/noticationSetings"]);
  }
}
