import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UploadService } from '@app/services/upload.service';

import { ResultsComponent } from './results.component';

describe('ResultsComponent', () => {
  let component: ResultsComponent;
  let fixture: ComponentFixture<ResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResultsComponent ],
      providers: [
        {
          provide: UploadService, useValue: {
            results: [],
          }
        },
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
