import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForumTopicListComponent } from './forum-topic-list.component';

describe('ForumTopicListComponent', () => {
  let component: ForumTopicListComponent;
  let fixture: ComponentFixture<ForumTopicListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForumTopicListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForumTopicListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
