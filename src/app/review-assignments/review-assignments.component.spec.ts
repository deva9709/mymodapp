import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewAssignmentsComponent } from './review-assignments.component';

describe('ReviewAssignmentsComponent', () => {
  let component: ReviewAssignmentsComponent;
  let fixture: ComponentFixture<ReviewAssignmentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReviewAssignmentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewAssignmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
