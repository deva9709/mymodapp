import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCalendarEventsComponent } from './view-calendar-events.component';

describe('ViewCalendarEventsComponent', () => {
  let component: ViewCalendarEventsComponent;
  let fixture: ComponentFixture<ViewCalendarEventsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewCalendarEventsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCalendarEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
