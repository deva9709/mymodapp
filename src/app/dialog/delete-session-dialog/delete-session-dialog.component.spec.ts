import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteSessionDialogComponent } from './delete-session-dialog.component';

describe('DeleteSessionDialogComponent', () => {
  let component: DeleteSessionDialogComponent;
  let fixture: ComponentFixture<DeleteSessionDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteSessionDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteSessionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
