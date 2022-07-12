import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModSessionDetailsComponent } from './mod-session-details.component';

describe('ModSessionDetailsComponent', () => {
  let component: ModSessionDetailsComponent;
  let fixture: ComponentFixture<ModSessionDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModSessionDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModSessionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
