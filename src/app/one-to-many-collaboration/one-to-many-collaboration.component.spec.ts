import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OneToManyCollaborationComponent } from './one-to-many-collaboration.component';

describe('OneToManyCollaborationComponent', () => {
  let component: OneToManyCollaborationComponent;
  let fixture: ComponentFixture<OneToManyCollaborationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OneToManyCollaborationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OneToManyCollaborationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
