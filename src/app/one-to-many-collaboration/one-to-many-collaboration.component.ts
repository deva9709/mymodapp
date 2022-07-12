import { Component, OnInit, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { ModService } from '@app/service';
import { AppSessionService } from '@shared/session/app-session.service';
import { Router } from '@angular/router';
import { dataService } from '@app/service/common/dataService';
import { ChatComponent } from '@app/chat/chat.component';
import Twilio from '../../../node_modules/twilio-video/dist/twilio-video';
import { CollaborationControlsComponent } from '@app/collaboration-controls/collaboration-controls.component';
import { ParticipantRole, UserRoles } from '@app/enums/user-roles';

@Component({
  selector: 'app-one-to-many-collaboration',
  templateUrl: './one-to-many-collaboration.component.html',
  styleUrls: ['./one-to-many-collaboration.component.css']
})
export class OneToManyCollaborationComponent implements OnInit {

  roomName: string;
  sessionTitle: string;
  activeRoom: any;
  screenTrack: any;
  mentorDetails: any;
  audioIndex: number = -1;
  videoIndex: number = -1;
  isLeaveRoom = false;
  isMentor: boolean = false;
  videoStatus: boolean = true;
  micStatus: boolean = true;
  screenShareStatus: boolean = true;
  isCollaborationStart: boolean;
  isShowChat: boolean = false;
  whiteBoard: boolean = false;
  disableVideoControl: boolean = false;
  isCurrentUserJoined: boolean = false;


  get loginUserName(): string {
    return this.sessionService.user.emailAddress;
  }

  get controls(): any {
    return { videoStatus: this.videoStatus, micStatus: this.micStatus, screenShareStatus: this.screenShareStatus, disableVideoControl: this.disableVideoControl }
  }

  @ViewChild('localmedia') localMedia: ElementRef;
  @ViewChild('localMediaDiv') localMediaDiv: ElementRef;
  @ViewChild(CollaborationControlsComponent) collaborationControlsComponent: CollaborationControlsComponent;
  @ViewChild(ChatComponent) chatComponent: ChatComponent;

  constructor(private modservice: ModService,
    private dataService: dataService,
    private sessionService: AppSessionService,
    private renderer: Renderer2,
    private router: Router) { }

  ngOnInit() {
    this.InitializeSession();
    $(".master-container > .main-content").addClass('one-to-many-video-screen');

    let item = document.getElementsByClassName('participants-row')[0];

    item.addEventListener('wheel', function (e: MouseWheelEvent) {
      if (e.deltaY > 0) item.scrollLeft += 100;
      else item.scrollLeft -= 100;
    });
  }

  InitializeSession() {
    this.modservice.getToken(this.loginUserName).subscribe(data => {
      this.dataService.token = data.result;
      this.roomName = this.dataService.sessionCode;
      this.sessionTitle = this.dataService.sessionTitle;
      this.dataService.pageName = this.dataService.sessionTitle;

      this.chatComponent.createChatInstance();
      //document.getElementById('chat-control').addEventListener('click', this.viewchats);

      console.log("roomName", this.roomName);
      if (this.roomName) {      //if mentor:true else false
        let connectOptions = { name: this.roomName, logLevel: 'debug', tracks: undefined, audio: true, video: this.dataService.currentSessionParticipantRole == ParticipantRole.Trainer }; // video flag should be set based on business logic
        // if (previewTracks) {
        //   connectOptions.tracks = previewTracks;
        // }

        Twilio.connect(data.result, connectOptions).then(this.roomJoined.bind(this), function (error) {
          console.log("Error- VC" + error);
        });
      }
    });
  }

  roomJoined(room) {
    // Draw local video, if not already previewing
    let previewContainer = this.localMedia.nativeElement;
    if (!previewContainer.querySelector('video')) {
      this.attachParticipantTracks(room.localParticipant, previewContainer);
    }

    room.participants.forEach((participant) => {
      this.attachParticipantTracks(participant, previewContainer);
    });

    //When a participant joins, draw their video on screen
    room.on('participantConnected', (participant) => {
    });

    room.on('trackAdded', (track, participant) => {
      //var previewContainer = document.getElementById('remote-media');
      let previewContainer;
      if (track.kind === "video" && track.name !== "screenshare") {
        this.videoIndex++;
        let element = document.createElement("div");
        // element.className = 'col-md-6';
        element.setAttribute('data-val', this.videoIndex.toString());
        element.id = "remote-media-section";
        let element2 = element.appendChild(document.createElement("div"));
        element2.className = "remote-media";
        document.getElementById("collaboration-section").appendChild(element);
        previewContainer = document.getElementsByClassName('remote-media')[this.videoIndex];
        //local media screen size switching
        let localMediaDiv = this.localMediaDiv.nativeElement;
        let localMediaChild = localMediaDiv.children[0];
        //this.renderer.removeClass(localMediaDiv, "local-media-self");
        this.renderer.setAttribute(localMediaDiv, 'class', 'row justify-content-end local-media align-items-end');
        this.renderer.setAttribute(localMediaChild, 'class', 'col-2');
        // this.renderer.removeClass(localMediaChild, "col-12");
        // this.renderer.addClass(localMediaChild, "col-2");
      }
      if (track.kind === "video" && track.name === "screenshare") {
        this.videoIndex++;
        let element = document.createElement("div");
        // element.className = 'col-md-6';
        element.setAttribute('data-val', this.videoIndex.toString());
        let element2 = element.appendChild(document.createElement("div"));
        element2.className = "remote-media";
        element2.id = "screen-share";
        document.getElementById("collaboration-section").appendChild(element);
        previewContainer = document.getElementsByClassName('remote-media')[this.videoIndex];

        //remote video resize
        let remoteMediaDiv = document.getElementById("remote-media-section");
        if (remoteMediaDiv) {
          remoteMediaDiv.className = "min-remote-media";
          let remoteMediaDivChild = remoteMediaDiv.children[0];
          this.renderer.setStyle(remoteMediaDivChild, 'height', 'auto');
        }

        //local media display none
        let localMediaDiv = this.localMediaDiv.nativeElement;
        this.renderer.addClass(localMediaDiv, "d-none");

      }
      else if (track.kind === "audio") {
        this.audioIndex++
        let audioelement = document.createElement("div");
        audioelement.className = 'audio-track';
        document.getElementById("audio-tracks").appendChild(audioelement);
        previewContainer = document.getElementsByClassName("audio-track")[this.audioIndex];

        let localMediaDiv = this.localMediaDiv.nativeElement;
        this.renderer.setAttribute(localMediaDiv, "class", "local-media-self-participants");

        let participantContent = document.getElementById("participants-content");
        let participantSection = document.createElement("div");
        participantSection.className = "col-1 participants-section";
        participantSection.id = `participant${participant.sid}`;
        let participantName = document.createElement("p");
        participantName.className = "participant";
        //if current user is mentor for current session
        if (this.dataService.currentSessionParticipantRole == ParticipantRole.Trainer) {
          participantName.innerText = participant.identity.charAt(0).toLocaleUpperCase();
          participantSection.title = participant.identity;
        }//if current user is mentee for current session
        else if (this.isCurrentUserJoined && this.dataService.currentSessionParticipantRole == ParticipantRole.Trainee) {
          participantName.innerText = participant.identity.charAt(0).toLocaleUpperCase();
          participantSection.title = participant.identity;
        }
        else if (!this.isCurrentUserJoined) {
          participantName.innerText = this.activeRoom.localParticipant.identity.charAt(0).toLocaleUpperCase();
          participantSection.title = this.activeRoom.localParticipant.identity;
          this.isCurrentUserJoined = true;
        }
        participantSection.appendChild(participantName);
        participantContent.appendChild(participantSection);

        if (this.dataService.isIntegratedApplication) {
          $('.main-content-full #local-media video').css("height", "calc(100vh - 7rem)");
        }
      }

      this.attachTracks([track], previewContainer);
    });

    room.on('trackRemoved', (track, participant) => {
      this.detachTracks([track]);
      if (track.kind === 'video' && track.name !== "screenshare") {
        this.videoIndex--;
        let localMediaDiv = this.localMediaDiv.nativeElement;
        let localMediaChild = localMediaDiv.children[0];
        this.renderer.setAttribute(localMediaDiv, "class", "row local-media-self");
        this.renderer.addClass(localMediaChild, "col-12");
      }
      if (track.kind === 'video' && track.name === "screenshare") {
        this.videoIndex--;
        let remoteMediaDiv = document.getElementById("remote-media-section");
        if (remoteMediaDiv) {
          remoteMediaDiv.className = ""; //removed min-remote-media
          let remoteMediaDivChild = remoteMediaDiv.children[0];
          this.renderer.setStyle(remoteMediaDivChild, 'height', 'calc(90vh - 100px)');
        }

        let localMediaDiv = this.localMediaDiv.nativeElement;
        this.renderer.removeClass(localMediaDiv, 'd-none');
      }
      if (track.kind === 'audio') {
        this.audioIndex--;
        let participantId = `participant${participant.sid}`;
        let participantDiv = document.getElementById(participantId);
        participantDiv.parentNode.removeChild(participantDiv);

        let localMediaDiv = this.localMediaDiv.nativeElement;
        this.renderer.setAttribute(localMediaDiv, "class", "row local-media-self");

        if (this.dataService.isIntegratedApplication) {
          $('.main-content-full #local-media video').css("height", "calc(100vh - 0.25rem)");
        }
      }
    });

    // When a participant disconnects, note in log
    room.on('participantDisconnected', (participant) => {
      this.detachParticipantTracks(participant);
      if (this.mentorDetails.participantSID === participant.sid) {
        this.collaborationControlsComponent.leaveRoom.call(this);
        this.disconnectSession();
        this.sessionDisconnectTime();
      }
    });

    // When we are disconnected, stop capturing local video
    // Also remove media for all remote participants
    room.on('disconnected', () => {
      this.detachParticipantTracks(room.localParticipant);
      room.participants.forEach(this.detachParticipantTracks, this);
      this.activeRoom = null;
    });

    document.getElementById("leave-room").onclick = this.collaborationControlsComponent.leaveRoom.bind(this);
    document.getElementById("audio-mute").onclick = this.collaborationControlsComponent.muteAudiotrack.bind(this);
    document.getElementById("video-disable").onclick = this.collaborationControlsComponent.disableVideotrack.bind(this);
    document.getElementById("screen-share").onclick = this.collaborationControlsComponent.startScreenSharing.bind(this);
    document.getElementById("chat-control").onclick = this.collaborationControlsComponent.viewchats.bind(this);
    document.getElementById("white-board").onclick = this.collaborationControlsComponent.whiteboard.bind(this);

    this.activeRoom = room;
    this.joinSession(room);

    this.collaborationControlsComponent.renderValidControls.call(this);
  }

  sessionDisconnectTime() {
    let currentDate = new Date();
    let sessionDisconnectTime = {
      "userId": this.dataService.currentUserId,
      "sessionScheduleId": this.dataService.sessionScheduleId,
      "endTime": currentDate
    };
    this.modservice.sessionTiming(sessionDisconnectTime).subscribe(res => { }, err => { });
  }

  joinSession(room) {
    let joinSesisonData = { SessionScheduleId: this.dataService.sessionScheduleId, ParticipantUserId: this.sessionService.userId, RoomSID: room.sid, ParticipantSID: room.localParticipant.sid };
    this.modservice.joinSession(joinSesisonData).subscribe({
      next: (res) => {
        this.mentorDetails = res.result;
        let date = new Date();
        let joinSessionTime = {
          "userId": this.dataService.currentUserId,
          "sessionScheduleId": this.dataService.sessionScheduleId,
          "startTime": date
        };
        this.modservice.sessionTiming(joinSessionTime).subscribe(res => { }, err => { });
      },
      error: (err) => { console.log(err); }
    });
  }

  attachParticipantTracks(participant, container) {
    let tracks = Array.from(participant.tracks.values());
    this.attachTracks(tracks, container);
  }

  attachTracks(tracks, container) {
    tracks.forEach(function (track) {
      container.appendChild(track.attach());
    });
  }

  detachTracks(tracks) {
    tracks.forEach(function (track) {
      track.detach().forEach(function (detachedElement) {
        detachedElement.remove();
      });
    });

    for (let i = 0; i < document.getElementsByClassName('remote-media').length; i++) {
      if (document.getElementsByClassName("remote-media")[i].children.length === 0)
        document.getElementsByClassName("remote-media")[i].parentElement.remove();
    }
  }

  detachParticipantTracks(participant) {
    let tracks = Array.from(participant.tracks.values());
    this.detachTracks(tracks);
  }

  disconnectSession() {
    let disconnectSessionDate = { SessionScheduleId: this.dataService.sessionScheduleId, ParticipantUserId: this.sessionService.userId };
    this.modservice.disconnectSession(disconnectSessionDate).subscribe({
      next: (res) => {
        if (res.success) {
          console.log(res);
        }
      },
      error: (err) => { console.log(err); }
    });
  }

  stopScreenSharing() {
    this.activeRoom.localParticipant.unpublishTrack(this.screenTrack);
    this.screenShareStatus = !this.screenShareStatus;
    this.screenTrack = null;
  }

  // viewchats() {
  //   this.openchat = !this.openchat;
  // }

  ngOnDestroy() {
    // var styles = {
    //   "margin": "65px 0px 30px 70px !important"
    // };

    $(".master-container > .main-content").removeClass('one-to-many-video-screen');


    let that = this;
    (function () {
      if (that.activeRoom) {
        that.activeRoom.disconnect();
        that.chatComponent.leaveChatChannel();
      }
      if (!that.dataService.isIntegratedApplication) {
        if (that.isMentor && that.isLeaveRoom) {
          that.router.navigate(["/app/session-feedback"]);
        }
        else if (that.isLeaveRoom) {
          that.router.navigate(["/app/session-feedback"]);
        }
      }
    })();
  }
}
