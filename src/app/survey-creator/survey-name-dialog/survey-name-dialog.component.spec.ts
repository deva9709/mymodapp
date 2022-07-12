import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyNameDialogComponent } from './survey-name-dialog.component';

describe('SurveyNameDialogComponent', () => {
  let component: SurveyNameDialogComponent;
  let fixture: ComponentFixture<SurveyNameDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SurveyNameDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SurveyNameDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
