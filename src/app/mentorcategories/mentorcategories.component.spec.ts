import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MentorcategoriesComponent } from './mentorcategories.component';

describe('MentorcategoriesComponent', () => {
  let component: MentorcategoriesComponent;
  let fixture: ComponentFixture<MentorcategoriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MentorcategoriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MentorcategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
