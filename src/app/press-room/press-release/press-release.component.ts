import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModService } from "@app/service";
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-press-release',
  templateUrl: './press-release.component.html',
  styleUrls: ['./press-release.component.css']
})
export class PressReleaseComponent implements OnInit {

  pressReleaseId: number;
  title: string;
  description: string;
  thumbnailUrl: string;
  constructor(
    private router: Router,
    private modService: ModService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      let id = atob(params['id']);
      this.pressReleaseId = parseInt(id);
    });
    this.showPressReleaseDetails();
  }

  showPressReleaseDetails() {
    this.modService.getPressReleaseDetails(this.pressReleaseId).subscribe(res => {
      if (res.result) {
        this.title = res.result.title;
        this.description = res.result.description;
        this.thumbnailUrl = res.result.thumbnailURL;
      }
    }, err => {
    });
  }

  back() {
    this.router.navigate(['/app/press-room']);
  }

}
