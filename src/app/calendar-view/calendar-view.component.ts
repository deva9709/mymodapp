import { Component, OnInit, ChangeDetectionStrategy, ViewEncapsulation, ViewChild } from '@angular/core';
import { CalendarView, CalendarEvent } from 'angular-calendar';
import { dataService } from "@app/service/common/dataService";
import { Subject } from 'rxjs';
import { isSameMonth, isSameDay, startOfMonth, endOfMonth, startOfWeek, endOfWeek, startOfDay, endOfDay } from 'date-fns';
import { finalize } from 'rxjs/operators';
import { SessionStatus, SessionType, UserRoles } from '@app/enums/user-roles';
import { ModService } from '@app/service';
import { MatSort, MatPaginator, MatTableDataSource, MatDialog } from '@angular/material';
import { ViewCalendarEventsComponent } from '@app/dialog/view-calendar-events/view-calendar-events.component';
import { ToastrService } from 'ngx-toastr';
import { Session } from 'twilio-chat/lib/session';

interface DateEventList {
  id: number;
  title: string;
  sessionStartDate: Date;
  sessionEndDate: Date;
  status: string;
  trainerName: string;
  traineeName: string;
}

export interface IFilters {
  pageSize: number;
  pageNumber: number;
  tenantId: number;
  timeZone: string;
  sessionStatus: number[];
  startDate: string;
  endDate: string;
  platformUserId: number;
  sessionType: number;
  readAll: boolean;
}

@Component({
  selector: 'app-calendar-view',
  templateUrl: './calendar-view.component.html',
  styleUrls: ['./calendar-view.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CalendarViewComponent implements OnInit {

  view: CalendarView = CalendarView.Month;
  viewDate: Date = new Date();
  CalendarView = CalendarView;
  events: CalendarEvent[] = [];
  activeDayIsOpen: boolean = false;
  filters: IFilters;
  readAllPermission: boolean;
  refresh: Subject<any> = new Subject();
  startDate: string;
  endDate: string;
  calendarEventColumn: string[] = ['sessionTitle', 'sessionStartDate', 'sessionEndDate', 'sessionStatus', 'trainerName', 'traineeName'];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('calendarEventPaginator') calendarEventPaginator: MatPaginator;
  calendarEventDataSource: MatTableDataSource<any>;
  clickedColumn: number;
  sessionEventDetails: any[] = [];
  Code: string = "CALENDAR";
  rolePermissions: any[] = [];

  constructor(
    public dataService: dataService,
    private modService: ModService,
    private toastr: ToastrService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.startDate = new Date(startOfMonth(this.viewDate)).toLocaleString();
    this.endDate = new Date(endOfMonth(this.viewDate)).toLocaleString();
    this.rolePermissions = this.dataService.rolePermissions;
    let permissions = this.rolePermissions.find(val => val.feature.featureCode === this.Code);
    if (permissions) {
      this.readAllPermission = permissions.readAll;
    }
    this.getAllSessions();
  }

  getAllSessions() {
    this.events = [];
    this.filters = {
      pageSize: 1000,
      pageNumber: 1,
      tenantId: this.dataService.currentTenentId ? this.dataService.currentTenentId : 0,
      timeZone: this.getTimeZone(),
      sessionStatus: [SessionStatus.Requested, SessionStatus.Scheduled, SessionStatus.InProgress, SessionStatus.Completed],
      sessionType: SessionType.Scheduled,
      startDate: this.startDate,
      endDate: this.endDate,
      platformUserId: this.dataService.currentUserRole == UserRoles[1] ? 0 : this.dataService.currentPlatformUserId,
      readAll: this.readAllPermission
    };
    this.modService.getAllSessionScheduleDetails(this.filters).pipe(
      finalize(() => { this.dataService.isLoading = this.dataService.doneLoading(); })
    ).subscribe(res => {
      this.sessionEventDetails = res.result ? res.result.sessions : [];
      this.events = this.sessionEventDetails.map(function (session) {
        return {
          id: session.sessionScheduleId,
          title: session.sessionTitle,
          start: new Date(`${session.startDate}.000Z`),
          end: new Date(`${session.endDate}.000Z`),
        }
      });
      this.refresh.next();
    });
  }

  getTimeZone() {
    return /\((.*)\)/.exec(new Date().toString())[1];
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if ((isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) || events.length === 0) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
        this.dialog.open(ViewCalendarEventsComponent, {
          width: '75vw',
          data: {
            calendarEvents: events,
            sessionEventDetails: this.sessionEventDetails
          }
        });
      }
      this.viewDate = date;
    }
  }

  setView(view: CalendarView) {
    this.view = view;
    this.closeOpenMonthViewDay();
  }

  handleEvent(event) {
    let selectedEvent = [];
    selectedEvent.push(event);
    this.dialog.open(ViewCalendarEventsComponent, {
      width: '60vw',
      data: {
        calendarEvents: selectedEvent,
        sessionEventDetails: this.sessionEventDetails
      }
    });
  }

  closeOpenMonthViewDay() {
    switch (this.view) {
      case "month":
        this.startDate = new Date(startOfMonth(this.viewDate)).toLocaleString();
        this.endDate = new Date(endOfMonth(this.viewDate)).toLocaleString();
        break;
      case "week":
        this.startDate = new Date(startOfWeek(this.viewDate)).toLocaleString();
        this.endDate = new Date(endOfWeek(this.viewDate)).toLocaleString();
        break;
      case "day":
        this.startDate = new Date(startOfDay(this.viewDate)).toLocaleString();
        this.endDate = new Date(endOfDay(this.viewDate)).toLocaleString();
        break;
      default: this.toastr.warning("Select Month view in the calendar tab");
    }
    this.getAllSessions();
    this.activeDayIsOpen = false;
  }
}
