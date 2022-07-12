import { Component, OnInit } from '@angular/core';
import { dataService } from '@app/service/common/dataService';

@Component({
  selector: 'app-mentorreview',
  templateUrl: './mentorreview.component.html',
  styleUrls: ['./mentorreview.component.css']
})
export class MentorreviewComponent implements OnInit {
  profiles:boolean = false;
  slider:string = "domain";
  viewHide() {
    this.profiles = !this.profiles;
  }
  slideDetail(detail:string){
    this.slider = detail;
  }
  constructor(
    private dataService: dataService
  ) { }

  ngOnInit() {
    this.dataService.pageName = 'Mentor Review';
  }

}
