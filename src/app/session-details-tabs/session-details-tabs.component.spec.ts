import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionDetailsTabsComponent } from './session-details-tabs.component';

describe('SessionDetailsTabsComponent', () => {
  let component: SessionDetailsTabsComponent;
  let fixture: ComponentFixture<SessionDetailsTabsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SessionDetailsTabsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SessionDetailsTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
