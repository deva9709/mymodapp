import { Component, OnInit, Input } from '@angular/core';
import Twilio from '../../../node_modules/twilio-video/dist/twilio-video';
import { PollAnalysisComponent } from '@app/poll-analysis/poll-analysis.component';
import { PollCreatorComponent } from '@app/poll-creator/poll-creator.component';
import { PollType } from '@app/enums/poll-type';
import { UserRoles, SessionType, ParticipantRole } from '@app/enums/user-roles';
import { dataService } from '@app/service/common/dataService';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-collaboration-controls',
  templateUrl: './collaboration-controls.component.html',
  styleUrls: ['./collaboration-controls.component.css']
})
export class CollaborationControlsComponent implements OnInit {

  showVideoIcon: boolean = true;
  @Input() controls: any;
  iscreatePoll: boolean = false;
  constructor(private dataService: dataService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    if (this.dataService.currentSessionParticipantRole == ParticipantRole.Trainer) {
      this.iscreatePoll = true;
    }
  }

  renderValidControls() {
    let that = <any>this;
    if (that.dataService.sessionType === SessionType.Scheduled && that.dataService.currentSessionParticipantRole == ParticipantRole.Trainee) {
      that.videoStatus = false;
      that.disableVideoControl = true;
    }
  }

  leaveRoom() {
    let that = <any>this;
    //this.callStatus = !this.callStatus;
    if (that.activeRoom) {
      that.screenTrack && that.screenTrack.stop();
      that.isMentor = that.mentorDetails ? that.activeRoom.localParticipant.sid === that.mentorDetails.participantSID : false;
      that.isLeaveRoom = true;
      that.activeRoom.disconnect();
      that.chatComponent.leaveChatChannel();
      that.disconnectSession();
      that.sessionDisconnectTime();
    }
    if (that.dataService.isIntegratedApplication) {
      that.dataService.isCallDisconnected = true;
      that.cookieService.deleteAll('/');
      that.sessionService.user = null;
    }
    else {
      that.router.navigate(["/app/session-feedback"]);
    }
  }

  muteAudiotrack() {
    let that = <any>this;
    that.micStatus = !that.micStatus;
    let localMedia = that.activeRoom.localParticipant;
    localMedia.audioTracks.forEach(function (track) {
      if (track.isEnabled) {
        track.disable();
      } else {
        track.enable();
      }
    });
  }

  disableVideotrack() {
    let that = <any>this;
    that.videoStatus = !that.videoStatus;
    let localMedia = that.activeRoom.localParticipant;
    localMedia.videoTracks.forEach(function (track) {
      if (track.isEnabled) {
        track.disable();
      } else {
        track.enable();
      }
    });
  }

  async startScreenSharing() {
    let that = <any>this;
    if (that.screenShareStatus) {
      that.screenStream = await (<any>navigator.mediaDevices).getDisplayMedia();
      that.screenTrack = Twilio.LocalVideoTrack(that.screenStream.getTracks()[0], { name: "screenshare" });
      that.activeRoom.localParticipant.publishTrack(that.screenTrack);
      that.screenShareStatus = !that.screenShareStatus;
      that.screenTrack.once('stopped', that.stopScreenSharing.bind(that));
    }
    else {
      that.screenTrack.stop();
    }
  }

  viewchats() {
    let that = <any>this;
    that.isShowChat = !that.isShowChat;
    document.getElementById("chat-notification").setAttribute("class", "chat-noti d-none");
  }

  whiteboard() {
    let that = <any>this;
    that.whiteBoard = !that.whiteBoard;
    // if (that.whiteBoard) {
    //   let whiteBoardControl: HTMLElement = document.querySelectorAll("[id^='canvas_image_']")[0] as HTMLElement;
    //   whiteBoardControl.click();
    // }
  }

  newPoll() {
    this.dialog.closeAll();
    const pollCreatorDialog = this.dialog.open(PollCreatorComponent, {
      width: '50%',
      data: {
        associateId: this.dataService.sessionScheduleId,
        associateType: PollType.Session
      }
    });
  }

  getPollDetails() {
    this.dialog.closeAll();
    const pollAnalysisDialog = this.dialog.open(PollAnalysisComponent, {
      width: '50%',
      data: {
        associateId: this.dataService.sessionScheduleId,
        associateType: PollType.Session
      }
    });
  }
}
