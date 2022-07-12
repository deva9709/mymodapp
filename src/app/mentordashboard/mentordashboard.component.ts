import { Component, OnInit } from '@angular/core';
import { dataService } from '@app/service/common/dataService';

@Component({
  selector: 'app-mentordashboard',
  templateUrl: './mentordashboard.component.html',
  styleUrls: ['./mentordashboard.component.css']
})
export class MentordashboardComponent implements OnInit {

  constructor(
    private dataService: dataService
  ) { }

  ngOnInit() {
    this.dataService.pageName = 'Mentor Dashboard';
  }

}
