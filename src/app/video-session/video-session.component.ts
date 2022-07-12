import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import Twilio from '../../../node_modules/twilio-video/dist/twilio-video';
import { dataService } from '@app/service/common/dataService';
import { AppSessionService } from '@shared/session/app-session.service';
import { ModService } from '@app/service';
import { ChatComponent } from "@app/chat/chat.component";
import { Router } from "@angular/router";
import { JoinSessionComponent } from "@app/join-session/join-session.component";
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: "app-video-session",
  templateUrl: "./video-session.component.html",
  styleUrls: ["./video-session.component.css"],
  encapsulation: ViewEncapsulation.None
})
export class VideoSessionComponent implements OnInit {
  @ViewChild(ChatComponent) child: ChatComponent;
  openchat: boolean = false;
  memberlist: boolean = false;
  whiteBoard = false;
  callStatus = false;
  roomName: string;
  sessionTitle: string;
  videoStatus: boolean = true;
  micStatus: boolean = true;
  screenShareStatus: boolean = true;
  activeRoom: any;
  mentorDetails: any;
  screenStream: any;
  screenTrack: any;
  isMentor: boolean = false;
  isLeaveRoom = false;

  get loginUserName(): string {
    return this.sessionService.user.emailAddress;
  }
  whiteboard() {
    this.whiteBoard = !this.whiteBoard;
  }
  viewchats() {
    if (this.memberlist) {
      this.memberlist = !this.memberlist;
    }
    this.openchat = !this.openchat;
  }

  viewmember() {
    if (this.openchat) {
      this.openchat = !this.openchat;
    }
    this.memberlist = !this.memberlist;
  }
  constructor(private modservice: ModService,
    private dataService: dataService,
    private sessionService: AppSessionService,
    private router: Router,
    private cookieService: CookieService
  ) { }

  ngOnInit() {
    let previewTracks;
    let identity;
    let that = this;
    let audioIndex: number = -1;
    let videoIndex: number = -1;

    let element: HTMLElement = document.getElementsByClassName('shrink-sidebar')[0] as HTMLElement;
    element && element.click();

    function attachTracks(tracks, container) {
      tracks.forEach(function (track) {
        container.appendChild(track.attach());
      });
    }

    function attachParticipantTracks(participant, container) {
      let tracks = Array.from(participant.tracks.values());
      attachTracks(tracks, container);
    }

    function detachTracks(tracks) {
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

    function detachParticipantTracks(participant) {
      let tracks = Array.from(participant.tracks.values());
      detachTracks(tracks);
    }

    // Check for WebRTC
    // if (!navigator.webkitGetUserMedia && !navigator.mozGetUserMedia) {
    //     alert('WebRTC is not available in your browser.');
    // }

    // When we are about to transition away from this page, disconnect
    // from the room, if joined.
    window.addEventListener('beforeunload', leaveRoom);

    // Successfully connected!
    function roomJoined(room) {
      // Draw local video, if not already previewing
      let previewContainer = document.getElementById('local-media');
      previewContainer.ondblclick = function (event) { openfullscreen(event, "", "") };
      if (!previewContainer.querySelector('video')) {
        attachParticipantTracks(room.localParticipant, previewContainer);
      }

      //need to check
      room.participants.forEach(function (participant) {
        attachParticipantTracks(participant, previewContainer);
      });

      // When a participant joins, draw their video on screen
      room.on('participantConnected', function (participant) {
      });

      room.on('trackAdded', function (track, participant) {
        //var previewContainer = document.getElementById('remote-media');
        let previewContainer;
        if (track.kind === "video") {
          videoIndex++;
          let element = document.createElement("div");
          element.className = 'col-md-6';
          element.setAttribute('data-val', videoIndex.toString());
          let element2 = element.appendChild(document.createElement("div"));
          element2.className = "remote-media";
          document.getElementById("collaboration-section").appendChild(element);
          previewContainer = document.getElementsByClassName('remote-media')[videoIndex];
        }
        else if (track.kind === "audio") {
          audioIndex++
          let audioelement = document.createElement("div");
          audioelement.className = 'audio-track';
          document.getElementById("audio-tracks").appendChild(audioelement);
          previewContainer = document.getElementsByClassName("audio-track")[audioIndex];
        }


        // document.getElementById('local-media').style.bottom = '25%';
        // document.getElementById('local-media').style.padding = '10px';
        attachTracks([track], previewContainer);
        // if (!previewContainer.querySelector('video')) {
        //   console.log('test' + participant);
        //   attachTracks([track], previewContainer);
        // }
        if (track.kind === "video") {
          let video = document.getElementsByClassName('remote-media')[videoIndex] as HTMLElement;;
          video.ondblclick = function (event) { openfullscreen(event, "remote-media", videoIndex) };
        }
      });

      room.on('trackRemoved', function (track, participant) {
        detachTracks([track]);
        if (track.kind === 'video')
          videoIndex--;
        if (track.kind === 'audio')
          audioIndex--;
      });

      // When a participant disconnects, note in log
      room.on('participantDisconnected', function (participant) {
        detachParticipantTracks(participant);
        if (that.mentorDetails.participantSID === participant.sid) {
          leaveRoom();
          disconnectSession();
        }
      });

      // When we are disconnected, stop capturing local video
      // Also remove media for all remote participants
      room.on('disconnected', function () {
        detachParticipantTracks(room.localParticipant);
        room.participants.forEach(detachParticipantTracks);
        that.activeRoom = null;
      });

      document.getElementById("leave-room").onclick = leaveRoom;
      document.getElementById("audio-mute").onclick = muteAudiotrack;
      document.getElementById("video-disable").onclick = disableVideotrack;
      document.getElementById("screen-share").onclick = startScreenSharing;

      that.activeRoom = room;
      joinSession(room);
    }

    function joinSession(room) {
      let joinSesisonData = { SessionScheduleId: that.dataService.sessionScheduleId, ParticipantUserId: that.sessionService.userId, RoomSID: room.sid, ParticipantSID: room.localParticipant.sid };
      that.modservice.joinSession(joinSesisonData).subscribe({
        next: (res) => {
          that.mentorDetails = res.result;
        },
        error: (err) => { console.log(err); }
      });
    }

    function disconnectSession() {
      let disconnectSessionDate = { SessionScheduleId: that.dataService.sessionScheduleId, ParticipantUserId: that.sessionService.userId };
      that.modservice.disconnectSession(disconnectSessionDate).subscribe({
        next: (res) => {
          if (res.success) {
            console.log(res);
          }
        },
        error: (err) => { console.log(err); }
      });
    }

    function muteAudiotrack() {
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

    function disableVideotrack() {
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

    async function startScreenSharing() {
      if (that.screenShareStatus) {
        that.screenStream = await (<any>navigator.mediaDevices).getDisplayMedia();
        that.screenTrack = Twilio.LocalVideoTrack(that.screenStream.getTracks()[0]);
        that.activeRoom.localParticipant.publishTrack(that.screenTrack);
        that.screenShareStatus = !that.screenShareStatus;
        that.screenTrack.once('stopped', stopScreenSharing);
      }
      else {
        that.screenTrack.stop();
      }
    }

    function stopScreenSharing() {
      that.activeRoom.localParticipant.unpublishTrack(that.screenTrack);
      that.screenShareStatus = !that.screenShareStatus;
      that.screenTrack = null;
    }

    function openfullscreen(event, className, index) {
      // Trigger fullscreen
      let docElmWithBrowsersFullScreenFunctions;
      if (className) {
        let video_index = parseInt(event.target.parentElement.parentElement.getAttribute("data-val"));
        docElmWithBrowsersFullScreenFunctions = document.getElementsByClassName(className)[video_index] as HTMLElement & {
          mozRequestFullScreen(): Promise<void>;
          webkitRequestFullscreen(): Promise<void>;
          msRequestFullscreen(): Promise<void>;
        };
      }
      else {
        docElmWithBrowsersFullScreenFunctions = document.getElementById("local-media") as HTMLElement & {
          mozRequestFullScreen(): Promise<void>;
          webkitRequestFullscreen(): Promise<void>;
          msRequestFullscreen(): Promise<void>;
        };
      }


      if (docElmWithBrowsersFullScreenFunctions) {
        if (docElmWithBrowsersFullScreenFunctions.requestFullscreen) {
          docElmWithBrowsersFullScreenFunctions.requestFullscreen();
        } else if (docElmWithBrowsersFullScreenFunctions.mozRequestFullScreen) { /* Firefox */
          docElmWithBrowsersFullScreenFunctions.mozRequestFullScreen();
        } else if (docElmWithBrowsersFullScreenFunctions.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
          docElmWithBrowsersFullScreenFunctions.webkitRequestFullscreen();
        } else if (docElmWithBrowsersFullScreenFunctions.msRequestFullscreen) { /* IE/Edge */
          docElmWithBrowsersFullScreenFunctions.msRequestFullscreen();
        }
      }
    }

    function leaveRoom() {
      that.callStatus = !that.callStatus;
      if (that.activeRoom) {
        that.screenTrack && that.screenTrack.stop();
        that.isMentor = that.activeRoom.localParticipant.sid === that.mentorDetails.participantSID;
        that.isLeaveRoom = true;
        that.activeRoom.disconnect();
        that.child.leaveChatChannel();
        disconnectSession();
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

    (function () {
      identity = that.loginUserName;
      that.modservice.getToken(identity).subscribe(data => {
        that.dataService.token = data.result;
        that.roomName = that.dataService.sessionCode;
        that.sessionTitle = that.dataService.sessionTitle;
        that.dataService.pageName = that.dataService.sessionTitle;

        that.child.createChatInstance();

        console.log("roomName", that.roomName);
        if (that.roomName) {
          //document.getElementById('room-id').innerHTML = that.roomName.toString();
          let connectOptions = { name: that.roomName, logLevel: 'debug', tracks: undefined, audio: true, video: true }; // video flag should be set based on business logic
          if (previewTracks) {
            connectOptions.tracks = previewTracks;
          }

          Twilio.connect(data.result, connectOptions).then(roomJoined, function (error) {
            console.log("Error- VC" + error);
          });

          //for demo purpose pulling mentor by default
        }
      });
    })();
  }

  ngOnDestroy() {
    let that = this;
    (function () {
      if (that.activeRoom) {
        that.activeRoom.disconnect();
        that.child.leaveChatChannel();
      }
      if (!that.dataService.isIntegratedApplication) {
        if (that.isMentor && that.isLeaveRoom) {
          that.router.navigate(["/app/home"]);
        }
        else if (that.isLeaveRoom) {
          that.router.navigate(["/app/session-feedback"]);
        }
      }
    })();
  }
}
