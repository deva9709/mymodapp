import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteForumTopicComponent } from './delete-forum-topic.component';

describe('DeleteForumTopicComponent', () => {
  let component: DeleteForumTopicComponent;
  let fixture: ComponentFixture<DeleteForumTopicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteForumTopicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteForumTopicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
