import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewApprovalDetailsComponent } from './view-approval-details.component';

describe('ViewApprovalDetailsComponent', () => {
  let component: ViewApprovalDetailsComponent;
  let fixture: ComponentFixture<ViewApprovalDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewApprovalDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewApprovalDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
