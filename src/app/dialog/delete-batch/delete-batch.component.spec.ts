import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteBatchComponent } from './delete-batch.component';

describe('DeleteBatchComponent', () => {
  let component: DeleteBatchComponent;
  let fixture: ComponentFixture<DeleteBatchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteBatchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteBatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
