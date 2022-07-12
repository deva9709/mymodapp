import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditForumCommentComponent } from './edit-forum-comment.component';

describe('EditForumCommentComponent', () => {
  let component: EditForumCommentComponent;
  let fixture: ComponentFixture<EditForumCommentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditForumCommentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditForumCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
