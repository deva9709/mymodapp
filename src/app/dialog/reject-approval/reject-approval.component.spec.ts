import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectApprovalComponent } from './reject-approval.component';

describe('RejectApprovalComponent', () => {
  let component: RejectApprovalComponent;
  let fixture: ComponentFixture<RejectApprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RejectApprovalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RejectApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
