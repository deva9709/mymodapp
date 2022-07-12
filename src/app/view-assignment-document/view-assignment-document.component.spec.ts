import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAssignmentDocumentComponent } from './view-assignment-document.component';

describe('ViewAssignmentDocumentComponent', () => {
  let component: ViewAssignmentDocumentComponent;
  let fixture: ComponentFixture<ViewAssignmentDocumentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewAssignmentDocumentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAssignmentDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
