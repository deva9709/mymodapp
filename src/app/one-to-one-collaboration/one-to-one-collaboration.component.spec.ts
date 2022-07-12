import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OneToOneCollaborationComponent } from './one-to-one-collaboration.component';

describe('OneToOneCollaborationComponent', () => {
  let component: OneToOneCollaborationComponent;
  let fixture: ComponentFixture<OneToOneCollaborationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OneToOneCollaborationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OneToOneCollaborationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
