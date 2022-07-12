import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialoutComponent } from './dialout.component';

describe('DialoutComponent', () => {
  let component: DialoutComponent;
  let fixture: ComponentFixture<DialoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
