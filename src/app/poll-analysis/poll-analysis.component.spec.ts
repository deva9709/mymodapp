import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PollAnalysisComponent } from './poll-analysis.component';

describe('PollAnalysisComponent', () => {
  let component: PollAnalysisComponent;
  let fixture: ComponentFixture<PollAnalysisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PollAnalysisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PollAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
