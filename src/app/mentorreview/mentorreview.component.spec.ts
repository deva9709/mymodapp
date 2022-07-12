import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MentorreviewComponent } from './mentorreview.component';

describe('MentorreviewComponent', () => {
  let component: MentorreviewComponent;
  let fixture: ComponentFixture<MentorreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MentorreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MentorreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
