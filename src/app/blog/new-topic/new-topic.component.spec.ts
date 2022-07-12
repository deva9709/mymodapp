import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewBlogTopicComponent } from './new-topic.component';

describe('NewBlogTopicComponent', () => {
  let component: NewBlogTopicComponent;
  let fixture: ComponentFixture<NewBlogTopicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NewBlogTopicComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewBlogTopicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
