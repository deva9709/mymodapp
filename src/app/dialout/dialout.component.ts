import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModService } from '@app/service';
declare var EnxRtc: any;

@Component({
  selector: 'app-dialout',
  templateUrl: './dialout.component.html',
  styleUrls: ['./dialout.component.css']
})
export class DialoutComponent implements OnInit, OnDestroy {
  roomData = null;
  roomInfo = null;
  roomId = "";
  localStream: any = null;
  callStatus: string = "";
  showAudioImg: boolean = true;
  isCallGoingOn: boolean = false;
  callingUser: number = null;
  calledUser: number = null;
  cliNumber: string = "";
  dialoutNumber: string = "";
  traineeName: string = "";
  calltimeInMilliSec: number = 120000;

  streamOpt = {
    video: false,
    audio: true,
    data: true
  };

  reConnectOpt = {
    "allow_recnnect": true,
    "number_of_attempts": 1,
    "timeout_interval": 10000
  };
  constructor(
    private modService: ModService) { }

  ngOnInit() {
    this.modService.getCLINumber().subscribe((res: any) => {
      this.cliNumber = res.result;
    });
  }
  async dialOut() {
    this.callStatus = "Call is in progress.";
    //create a room
    var createRoomData = {
      scheduled: false,
      adhoc: true,
      moderators: "1",
      participants: "2",
      duration: "30",
      quality: "SD",
      autoRecording: true,
      sipEnabled: false,
      callerUserId: this.callingUser,
      calledUserId: this.calledUser
    }
    this.modService.createRoom(createRoomData).subscribe((data: any) => {
      this.roomData = JSON.parse(data.result);
      this.roomId = this.roomData.room.room_id;

      //save dialout data
      var dialoutDto = {
        roomId: this.roomId,
        roomName: this.roomData.room.name,
        serviceId: this.roomData.room.service_id,
        ownerRef: this.roomData.room.owner_ref,
        callerUserId: this.callingUser,
        calledUserId: this.calledUser
      }
      this.modService.saveDialoutDetail(dialoutDto).subscribe();

      //get room data by roomId
      this.modService.getRoomData(this.roomId).subscribe((res: any) => {
        this.roomInfo = JSON.parse(res.result);
        var tokenData = {
          roomId: this.roomId,
          name: this.roomInfo.room.name,
          role: 'participant',
          user_ref: this.traineeName
        }
        this.getRoomToken(tokenData);
      });
    })
  }
  //get room auth token
  getRoomToken(tokenData: any) {
    this.modService.getAuthToken(tokenData).subscribe((data: any) => {
      this.joinRoomlocal(JSON.parse(data.result));
    })
  }

  joinRoomlocal(data: any) {
    const fromNumber = this.cliNumber;
    const toNumber = this.dialoutNumber;
    const callDuration = this.calltimeInMilliSec;
    this.isCallGoingOn = true;
    this.localStream = EnxRtc.joinRoom(data.token, this.streamOpt, function (success, error) {
      if (error && error != null) {
        console.log("Join Room Error Response : " + error);
        // Look for error.type and error.msg.name to handle Exception
        if (error.type == "media-access-denied") {
          // Media Media Inaccessibility
        }
      }

      if (success && success != null) {
        console.log("Join Room Success Response : " + success);
        const room = success.room;
        for (var i = 0; i < success.streams.length; i++) {
          room.subscribe(success.streams[i]);
        }
        const callRes = room.makeOutboundCall(toNumber, fromNumber, function (resp) {
          console.log(resp);
        })
        room.addEventListener("dial-state-events", function (evt) {
          // evnt JSON contains status of dial-out process
          if (evt.message.state == "connected") {
            setTimeout(() => {
              room.destroy();
            }, callDuration);
          }
        });

        if (room.waitRoom && room.me.role != "moderator") {
          // Wait for Moderator
        } else {
          const remoteStreams = success.room.streams;
        }
      }
    },
      this.reConnectOpt
    )
  }



  audioMute() {
    this.showAudioImg = false;
    this.localStream.muteAudio();
  }

  audioUnmute() {
    this.showAudioImg = true;
    this.localStream.unmuteAudio();
  }

  endCall() {
    this.localStream.close();
    this.isCallGoingOn = false;
  }
  ngOnDestroy() {
    if (this.localStream != null) {
      this.isCallGoingOn = false;
      this.localStream.close();
    }
  }
}
