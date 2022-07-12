import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RescheduleSessionDialogComponent } from './reschedule-session-dialog.component';

describe('RescheduleSessionDialogComponent', () => {
  let component: RescheduleSessionDialogComponent;
  let fixture: ComponentFixture<RescheduleSessionDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RescheduleSessionDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RescheduleSessionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
