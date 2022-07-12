import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewMoreDetailsComponent } from './view-more-details.component';

describe('ViewMoreDetailsComponent', () => {
  let component: ViewMoreDetailsComponent;
  let fixture: ComponentFixture<ViewMoreDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewMoreDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewMoreDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
