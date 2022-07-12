import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PressRoomComponent } from './press-room.component';

describe('PressRoomComponent', () => {
  let component: PressRoomComponent;
  let fixture: ComponentFixture<PressRoomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PressRoomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PressRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
