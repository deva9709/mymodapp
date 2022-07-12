import { Component, OnInit } from '@angular/core';
import { dataService } from '@app/service/common/dataService';
import { ActivatedRoute } from '@angular/router';
import { ModService } from "@app/service";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.css']
})
export class VideoPlayerComponent implements OnInit {
  videoPlayerUrl: any[] = [];
  sessionScheduleId: number;
  constructor(public dataService: dataService,
    private route: ActivatedRoute,
    private modService: ModService,
    private toastr: ToastrService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      let sessionId = atob(params['id']);
      this.sessionScheduleId = parseInt(sessionId);
    });
    this.getSessionDetails(this.sessionScheduleId);
    this.getPlayBackVideos(this.sessionScheduleId);
  }

  getSessionDetails(scheduleId: number) {
    this.modService.getSessionDetails(scheduleId).subscribe(res => {
      this.dataService.pageName = res.result.sessionTitle;
    });
  }

  getPlayBackVideos(scheduledId: number) {
    this.modService.getVideoPlayBackDetails(scheduledId).subscribe(res => {
      if (res.success && res.result) {
        if (res.result.sessionCompositions.length > 0) {
          res.result.sessionCompositions.forEach(element => {
            this.videoPlayerUrl.push(element.primaryDownloadUrl);
          });
          let video: HTMLMediaElement = document.querySelector("#video_player video");
          video.removeAttribute("poster");
          let source: any = document.querySelectorAll("#video_player video source");
          source[0].src = this.videoPlayerUrl[0];
          video.load();
          video.play();
          video.setAttribute("controlsList", "nodownload");
        }
      }
    }, err => {
      this.toastr.warning("Please try again later");
    });
  }

  onRightClick(event) {
    event.preventDefault();
  }

  handler(e) {
    e.preventDefault();
    let firstVideo = document.getElementsByClassName("showFirstVideoHighlighted")[0];
    firstVideo && firstVideo.setAttribute("class", "");
    let videotarget = e.target.parentNode.getAttribute("href");
    let filename = videotarget.substr(0, videotarget.lastIndexOf('.')) || videotarget;
    let video: HTMLMediaElement = document.querySelector("#video_player video");
    video.removeAttribute("poster");
    video.setAttribute("controlsList", "nodownload");
    let source: any = document.querySelectorAll("#video_player video source");
    source[0].src = filename + ".mp4";
    video.load();
    video.play();
  }
}
