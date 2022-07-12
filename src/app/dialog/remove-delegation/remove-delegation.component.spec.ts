import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveDelegationComponent } from './remove-delegation.component';

describe('RemoveDelegationComponent', () => {
  let component: RemoveDelegationComponent;
  let fixture: ComponentFixture<RemoveDelegationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemoveDelegationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemoveDelegationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
