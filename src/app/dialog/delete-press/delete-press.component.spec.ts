import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletePressComponent } from './delete-press.component';

describe('DeletePressComponent', () => {
  let component: DeletePressComponent;
  let fixture: ComponentFixture<DeletePressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeletePressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeletePressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
