import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ForumService {

  showForumList: boolean = true;
  showForumDiscussion: boolean = false;
  forumTopicId: number;

  constructor() { }
}