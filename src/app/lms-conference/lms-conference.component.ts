import { Component, OnInit, OnDestroy } from '@angular/core';
import { dataService } from '@app/service/common/dataService';
import { Guid } from "guid-typescript";

@Component({
  selector: 'app-lms-conference',
  templateUrl: './lms-conference.component.html',
  styleUrls: ['./lms-conference.component.css']
})
export class LmsConferenceComponent implements OnInit, OnDestroy {
  openchat: boolean = false;
  memberlist: boolean = false;
  viewchats() {
    if (this.memberlist) {
      this.memberlist = !this.memberlist;
    }
    this.openchat = !this.openchat;
  }
  constructor(public dataService: dataService) { }

  ngOnInit() {
    //this.dataService.isNavbarVisible = false;

  }

  ngOnDestroy() {
    this.dataService.isNavbarVisible = true;
  }

}
