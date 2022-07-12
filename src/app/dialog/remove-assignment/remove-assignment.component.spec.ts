import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveAssignmentComponent } from './remove-assignment.component';

describe('RemoveAssignmentComponent', () => {
  let component: RemoveAssignmentComponent;
  let fixture: ComponentFixture<RemoveAssignmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemoveAssignmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemoveAssignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
