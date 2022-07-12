import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalJoinSessionComponent } from './external-join-session.component';

describe('ExternalJoinSessionComponent', () => {
  let component: ExternalJoinSessionComponent;
  let fixture: ComponentFixture<ExternalJoinSessionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExternalJoinSessionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExternalJoinSessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
