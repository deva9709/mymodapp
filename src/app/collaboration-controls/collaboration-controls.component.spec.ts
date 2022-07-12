import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollaborationControlsComponent } from './collaboration-controls.component';

describe('CollaborationControlsComponent', () => {
  let component: CollaborationControlsComponent;
  let fixture: ComponentFixture<CollaborationControlsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollaborationControlsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollaborationControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
