import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatePressreleaseComponent } from './update-pressrelease.component';

describe('UpdatePressreleaseComponent', () => {
  let component: UpdatePressreleaseComponent;
  let fixture: ComponentFixture<UpdatePressreleaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdatePressreleaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdatePressreleaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
