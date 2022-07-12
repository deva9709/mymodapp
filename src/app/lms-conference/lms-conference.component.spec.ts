import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LmsConferenceComponent } from './lms-conference.component';

describe('LmsConferenceComponent', () => {
  let component: LmsConferenceComponent;
  let fixture: ComponentFixture<LmsConferenceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LmsConferenceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LmsConferenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
