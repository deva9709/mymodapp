import { Component, Injector, AfterViewInit, Input, OnInit, Injectable } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { Client } from '../../../node_modules/twilio-chat/lib/client';
import { AppSessionService } from '@shared/session/app-session.service';
import { dataService } from '@app/service/common/dataService';
import { ModService } from '@app/service';

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    animations: [appModuleAnimation()],
    styleUrls: ['./chat.component.css']
})

@Injectable({
    providedIn: 'root'
})

export class ChatComponent implements OnInit {
    messages: boolean = true;
    @Input() roomId: string;
    createChatInstance: any;
    fileName: any = '';
    leaveChatChannel: any;

    get loginUserName(): string {
        return this.sessionService.user.emailAddress;
    }

    viewHide() {
        this.messages = !this.messages;
    }

    constructor(
        injector: Injector,
        private modService: ModService,
        private sessionService: AppSessionService,
        private dataservice: dataService
    ) { }

    ngOnInit() {


        let that = this;
        var _client;
        var typingMembers = new Set();
        var ChatChannel;

        var activeChannelPage;

        var userContext = { identity: null };

        function createChannel() {
            var isPrivate = false;
            var friendlyName = that.roomId;
            var uniqueName = that.roomId;
            _client.createChannel({
                friendlyName: friendlyName,
                isPrivate: isPrivate,
                uniqueName: uniqueName
            }).then(function joinChannel(channel) {
                $('#create-channel').hide();
                $('#overlay').hide();
                return channel.join().then(activeChannel).catch(function (err) {
                    console.error(
                        "Couldn't join channel " + channel.friendlyName + ' because ' + err
                    );
                });;
            });
        }
        document.getElementById('message-body-input').addEventListener("keyup", function (event) {
            if (event.keyCode === 13) {
                event.preventDefault();
                document.getElementById("send-message").click();
            }
        });

        function activeChannel(channel) {
            ChatChannel = channel;
            //ChatChannel.on('messageAdded', addMessage);
            console.log('Channel Joined' + channel);

            $('#send-message').off('click');
            $('#send-message').on('click', function () {
                const formData = new FormData();
                let file = (<HTMLInputElement>$('#file-upload')[0]).files[0];
                formData.append('file', file);
                if (!file)
                    var body = $('#message-body-input').val();
                else
                    document.getElementById('message-body-input').removeAttribute('readonly');
                if (body || file)
                    ChatChannel.sendMessage(body || formData).then(function () {
                        $('#file-upload').val('');
                        $('#message-body-input').val('').focus();
                        $('#channel-messages').scrollTop($('#channel-messages ul').height());
                        $('#channel-messages li.last-read').removeClass('last-read');
                    });
            });

            channel.getMessages(30).then(function (page) {
                activeChannelPage = page;
                page.items.forEach(addMessage);

                channel.on('messageAdded', addMessage);
                //channel.on('messageUpdated', updateMessage);
                //channel.on('messageRemoved', removeMessage);

                var newestMessageIndex = page.items.length ? page.items[page.items.length - 1].index : 0;
                var lastIndex = channel.lastConsumedMessageIndex;
                if (lastIndex && lastIndex !== newestMessageIndex) {
                    var $li = $('li[data-index=' + lastIndex + ']');
                    var top = $li.position() && $li.position().top;
                    $li.addClass('last-read');
                    $('#channel-messages').scrollTop(top + $('#channel-messages').scrollTop());
                }

                // if ($('#channel-messages ul').height() <= $('#channel-messages').height()) {
                //   channel.updateLastConsumedMessageIndex(newestMessageIndex).then(updateChannels);
                // }

                //return channel.getMembers();
            });

            channel.on('typingStarted', function (member) {
                console.log("typingStarted");
            });

            channel.on('typingEnded', function (member) {
                console.log("typingEnded");
            });
        }

        that.leaveChatChannel = function (channel) {
            if (ChatChannel)
                ChatChannel.removeAllListeners();
            // channel.delete().then(function (channel) {
            //     console.log('Deleted channel: ' + channel.sid);
            // });
        }

        function addMessage(message) {
            if (message.media) {
                message.media.getContentUrl().then(function (url) {
                    // log media temporary URL
                    console.log('Media temporary URL is ' + url);
                    appendMessage(message, url);
                });
            }
            else {
                appendMessage(message);
            }
        }

        function appendMessage(message, url = '') {
            var $messages = $('#channel-messages');
            //var initHeight = $('#channel-messages ul').height();
            var $el = $();
            if (that.loginUserName == message.author) {
                $el = $('<div/>').attr('data-index', message.index).attr('class', 'sender');
            }
            else {
                $el = $('<div/>').attr('class', 'receiver');
                //$el = $('<li/>').attr('data-index', message.index).append('<span class="pic"/>');
            }
            // var $avatar = $('<span />').attr('class', 'user-avator').append($el);
            createMessage(message, $el, url);

            $('#channel-messages').append($el);

            // if (initHeight - 50 < $messages.scrollTop() + $messages.height()) {
            //     $messages.scrollTop($('#channel-messages ul').height());
            // }

            if ($('#channel-messages ul').height() <= $messages.height() &&
                message.index > message.channel.lastConsumedMessageIndex) {
                message.channel.updateLastConsumedMessageIndex(message.index);
            }
        }

        function createMessage(message, $el, url) {

            var time = message.timestamp;
            var minutes = time.getMinutes();
            var ampm = Math.floor(time.getHours() / 12) ? 'PM' : 'AM';

            if (minutes < 10) { minutes = '0' + minutes; }
            if (that.loginUserName === message.author) {
                var $timestamp = $('<div class="time-stamp"/>')
                    .text((time.getHours() % 12) + ':' + minutes + ' ' + ampm)
                    .appendTo($el);
            }

            if (that.loginUserName !== message.author) {
                // var $author = $('<p class="message"/>')
                //     .text(message.author)
                //     .appendTo($timestamp);
                var $identity = $('<div class="identity" />').appendTo($el);
                var $list_inline = $('<ul class="list-inline"/>').appendTo($identity);
                var $li_authorName = $('<li class="list-inline-item name"/>').text(message.author).appendTo($list_inline);
                var $li_timeStamp = $('<li class="list-inline-item time-stamp"/>').text('(' + (time.getHours() % 12) + ':' + minutes + ' ' + ampm + ')').appendTo($list_inline);
                document.getElementById("chat-notification").setAttribute("class","chat-noti");
            }

            var $body;
            if (url) {
                $body = $('<div class="message"/>').append($('<a/>')
                    .attr('href', url)
                    .attr('target', '_blank')
                    .text(message.media.filename)).appendTo($el);
            }
            else {
                $body = $('<div class="message"/>')
                    .text(message.body)
                    .appendTo($el);
            }
        }

        that.createChatInstance = function () {
            Client.create(that.dataservice.token, { logLevel: 'info' })
                .then(function (createdClient) {
                    let isChannelExist = false;
                    _client = createdClient;
                    _client.on('tokenAboutToExpire', () => {
                        that.modService.getToken(that.loginUserName).subscribe(tokenExpireData => {
                            if (!tokenExpireData.success)
                                throw new Error(tokenExpireData.error);
                            _client.updateToken(tokenExpireData.result);
                        });
                    });

                    //delete user
                    // _client.getSubscribedChannels().then(function(paginator) {
                    //     for (var i = 0; i < paginator.items.length; i++) {
                    //       const channel = paginator.items[i];
                    //       channel.delete().then(function(channel) {
                    //         console.log('Deleted channel: ' + channel.sid);
                    //       });
                    //     }
                    //   });

                    _client.getChannelByUniqueName(that.roomId).then(function (channel) {
                        channel.leave().then(lc => {
                            console.log("left" + lc);
                            lc.join().then(activeChannel).catch(function (err) {
                                console.error(
                                    "Couldn't join channel " + channel.friendlyName + ' because ' + err
                                );
                            });
                        });
                        // channel.join().then(activeChannel).catch(function (err) {
                        //     console.error(
                        //         "Couldn't join channel " + channel.friendlyName + ' because ' + err
                        //     );
                        // });
                    }).catch(function (err) {
                        if (err.body && err.body.message == "Channel not found" && err.body.status == 404) {
                            createChannel();
                        }
                        else {
                            console.log(err);
                        }
                    });

                    // client.user.on('updated', function () {
                    //     $('#profile label').text(client.user.friendlyName || client.user.identity);
                    // });

                    // var connectionInfo = $('#profile #presence');
                    // connectionInfo
                    //     .removeClass('online offline connecting denied')
                    //     .addClass(client.connectionState);
                    // client.on('connectionStateChanged', function (state) {
                    //     connectionInfo
                    //         .removeClass('online offline connecting denied')
                    //         .addClass(client.connectionState);
                    // });

                    // //client.getSubscribedChannels().then(updateChannels);

                    // client.on('channelJoined', function (channel) {
                    //     channel.on('messageAdded', updateUnreadMessages);
                    //     channel.on('messageAdded', updateChannels);
                    //     updateChannels();
                    // });

                    // //client.on('channelInvited', updateChannels);
                    // //client.on('channelAdded', updateChannels);
                    // //client.on('channelUpdated', updateChannels);
                    _client.on('channelLeft', that.leaveChatChannel);
                    // client.on('channelRemoved', leaveChannel);
                })
                .catch(function (err) {
                    console.log('chat error' + err);
                });
        };
    }

    onFileChange(event): void {
        $('#message-body-input').focus();
        $('#message-body-input').val(event.target.files[0].name);
        $('#message-body-input').attr('readonly', 'true');
    }
}
