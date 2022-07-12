import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FullFeedbackdetailsComponent } from './full-feedbackdetails.component';

describe('FullFeedbackdetailsComponent', () => {
  let component: FullFeedbackdetailsComponent;
  let fixture: ComponentFixture<FullFeedbackdetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FullFeedbackdetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FullFeedbackdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
