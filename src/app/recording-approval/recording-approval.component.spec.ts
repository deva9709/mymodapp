import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordingApprovalComponent } from './recording-approval.component';

describe('RecordingApprovalComponent', () => {
  let component: RecordingApprovalComponent;
  let fixture: ComponentFixture<RecordingApprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecordingApprovalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordingApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
