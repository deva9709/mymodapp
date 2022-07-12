import { Component, OnInit } from '@angular/core';
import { dataService } from '@app/service/common/dataService';

@Component({
  selector: 'app-my-sessions',
  templateUrl: './my-sessions.component.html',
  styleUrls: ['./my-sessions.component.css']
})
export class MySessionsComponent implements OnInit {
  sessions = false;
  createEdit = false;
  editSession(a: number) {
    if (a == 1) {
      this.createEdit = !this.createEdit;
    } else {
      this.createEdit = false;
    }
    this.sessions = !this.sessions;
  }
  constructor(
    private dataService: dataService
  ) { }

  ngOnInit() {
    this.dataService.pageName = 'My Sessions';
  }

}
