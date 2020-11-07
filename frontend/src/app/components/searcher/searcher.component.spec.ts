import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UploadService } from '@app/services/upload.service';

import { SearcherComponent } from './searcher.component';

describe('SearcherComponent', () => {
  let component: SearcherComponent;
  let fixture: ComponentFixture<SearcherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearcherComponent ],
      providers: [
        {
          provide: UploadService, useValue: {}
        },
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearcherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
