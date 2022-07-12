import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModSessionsComponent } from './mod-sessions.component';

describe('ModSessionsComponent', () => {
  let component: ModSessionsComponent;
  let fixture: ComponentFixture<ModSessionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModSessionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModSessionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
