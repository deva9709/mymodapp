import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareResourceComponent } from './share-resource.component';

describe('ShareResourceComponent', () => {
  let component: ShareResourceComponent;
  let fixture: ComponentFixture<ShareResourceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShareResourceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareResourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
