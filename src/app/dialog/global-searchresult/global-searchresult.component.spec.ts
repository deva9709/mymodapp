import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalSearchresultComponent } from './global-searchresult.component';

describe('GlobalSearchresultComponent', () => {
  let component: GlobalSearchresultComponent;
  let fixture: ComponentFixture<GlobalSearchresultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GlobalSearchresultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GlobalSearchresultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
