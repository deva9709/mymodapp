import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenteeSessionDetailsComponent } from './mentee-session-details.component';

describe('MenteeSessionDetailsComponent', () => {
  let component: MenteeSessionDetailsComponent;
  let fixture: ComponentFixture<MenteeSessionDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenteeSessionDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenteeSessionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
