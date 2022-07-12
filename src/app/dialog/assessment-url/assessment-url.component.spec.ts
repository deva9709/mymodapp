import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmentUrlComponent } from './assessment-url.component';

describe('AssessmentUrlComponent', () => {
  let component: AssessmentUrlComponent;
  let fixture: ComponentFixture<AssessmentUrlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssessmentUrlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssessmentUrlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
