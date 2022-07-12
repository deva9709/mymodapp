import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenteeUploadAssignmentComponent } from './mentee-upload-assignment.component';

describe('MenteeUploadAssignmentComponent', () => {
  let component: MenteeUploadAssignmentComponent;
  let fixture: ComponentFixture<MenteeUploadAssignmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenteeUploadAssignmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenteeUploadAssignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
