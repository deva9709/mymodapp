import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionRecordingsComponent } from './session-recordings.component';

describe('SessionRecordingsComponent', () => {
  let component: SessionRecordingsComponent;
  let fixture: ComponentFixture<SessionRecordingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SessionRecordingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SessionRecordingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
