import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MatPaginator, MatTableDataSource, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-session-recordings',
  templateUrl: './session-recordings.component.html',
  styleUrls: ['./session-recordings.component.css']
})
export class SessionRecordingsComponent implements OnInit {
  dataSource: any;
  displayedColumns: string[] = ['startTime', 'endTime', 'url'];
  @ViewChild('recordingsPaginator') recordingsPaginator: MatPaginator;
  constructor(
    public rescheduleSessionDialog: MatDialogRef<SessionRecordingsComponent>,
    @Inject(MAT_DIALOG_DATA) public sessionRecordingsData: any
  ) { }

  ngOnInit() {
    this.dataSource = new MatTableDataSource<any>(this.sessionRecordingsData.recordingData);
    this.dataSource.paginator = this.recordingsPaginator;
  }
  openRecording(url: any) {
    window.open(url, '_blank');
  }

}
