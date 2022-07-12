import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionAutoAttendanceComponent } from './session-auto-attendance.component';

describe('SessionAutoAttendanceComponent', () => {
  let component: SessionAutoAttendanceComponent;
  let fixture: ComponentFixture<SessionAutoAttendanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SessionAutoAttendanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SessionAutoAttendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
