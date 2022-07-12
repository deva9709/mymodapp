import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionDetailCardComponent } from './session-detail-card.component';

describe('SessionDetailCardComponent', () => {
  let component: SessionDetailCardComponent;
  let fixture: ComponentFixture<SessionDetailCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SessionDetailCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SessionDetailCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
