import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UploadService } from '@services/upload.service';

import { UploaderComponent } from './uploader.component';

describe('UploaderComponent', () => {
  let component: UploaderComponent;
  let fixture: ComponentFixture<UploaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploaderComponent ],
      providers: [
        {
          provide: UploadService, useValue: {}
        },
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
