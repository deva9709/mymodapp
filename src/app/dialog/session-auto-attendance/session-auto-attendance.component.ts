import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MatPaginator, MatTableDataSource, MAT_DIALOG_DATA } from '@angular/material';
import { ModService } from '@app/service';
import { dataService } from '@app/service/common/dataService';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-session-auto-attendance',
  templateUrl: './session-auto-attendance.component.html',
  styleUrls: ['./session-auto-attendance.component.css']
})
export class SessionAutoAttendanceComponent implements OnInit {
  dataSource: any;
  displayedColumns: string[] = ['createdDate', 'internalMeetingId'];
  @ViewChild('attendancePaginator') attendancePaginator: MatPaginator;
  constructor(
    private dataservice: dataService,
    private modService: ModService,
    private toastr: ToastrService,
    public rescheduleSessionDialog: MatDialogRef<SessionAutoAttendanceComponent>,
    @Inject(MAT_DIALOG_DATA) public sessionInternalMeetingsData: any
  ) { }

  ngOnInit() {
    this.sessionInternalMeetingsData.attendanceData.map(s => (s.createdDate = new Date(`${s.createdDate}Z`)))
    this.dataSource = new MatTableDataSource<any>(this.sessionInternalMeetingsData.attendanceData);
    this.dataSource.paginator = this.attendancePaginator;
  }
  downloadAutoAttendance(internalMeetingId: string) {
    this.dataservice.isLoading = true;
    this.modService.getAutoAttendanceReport(internalMeetingId, this.sessionInternalMeetingsData.sessionTitle, this.sessionInternalMeetingsData.sessionDate).pipe(finalize(() => {
      this.dataservice.isLoading = this.dataservice.doneLoading();
    })).subscribe(
      data => {
        const blob: any = new Blob([data], { type: 'text/csv;charset=utf-8' });
        let link = document.createElement("a");
        if (link.download !== undefined) {
          let url = URL.createObjectURL(blob);
          link.setAttribute("href", url);
          link.setAttribute("download", "Attendance.csv");
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      },
      err => {
        this.toastr.error(err.error);
      },
    )
  }

}
