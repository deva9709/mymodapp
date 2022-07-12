import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TraineeAttendanceComponent } from './trainee-attendance.component';

describe('TraineeAttendanceComponent', () => {
  let component: TraineeAttendanceComponent;
  let fixture: ComponentFixture<TraineeAttendanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TraineeAttendanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TraineeAttendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
