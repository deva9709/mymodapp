import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceAssignmentComponent } from './resource-assignment.component';

describe('ResourceAssignmentComponent', () => {
  let component: ResourceAssignmentComponent;
  let fixture: ComponentFixture<ResourceAssignmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResourceAssignmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceAssignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
