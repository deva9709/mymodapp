import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadReadingmaterialComponent } from './download-readingmaterial.component';

describe('DownloadReadingmaterialComponent', () => {
  let component: DownloadReadingmaterialComponent;
  let fixture: ComponentFixture<DownloadReadingmaterialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DownloadReadingmaterialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadReadingmaterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
