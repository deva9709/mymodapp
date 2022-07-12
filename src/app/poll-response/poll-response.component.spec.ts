import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PollResponseComponent } from './poll-response.component';

describe('PollResponseComponent', () => {
  let component: PollResponseComponent;
  let fixture: ComponentFixture<PollResponseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PollResponseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PollResponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
