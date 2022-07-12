import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UtilsService } from 'abp-ng2-module/dist/src/utils/utils.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class LandingComponent implements OnInit {
  hide = true;
  isYakshaTenant:boolean;
  constructor(private _utilsService: UtilsService) { }

  ngOnInit() {
    if(this._utilsService.getCookieValue("tenantName")==='Yaksha'||this._utilsService.getCookieValue("tenantName")==='YAKSHA'||this._utilsService.getCookieValue("tenantName")==='yaksha'){
      this.isYakshaTenant=true;
    }
  }

}
