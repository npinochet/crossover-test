import { Component } from '@angular/core';
import { UploadService } from '@services/upload.service';
import { IImage } from '@models/interfaces';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent {
  public scrollDistance: number = 2;
  public scrollThrottle: number = 300;

  constructor(
    private uploadService: UploadService,
  ) { }

  public onScrollDown(): void {
    console.log('Scrolled down!');
    this.uploadService.fetchNext();
  }

  public format_size(size: number): string {
    return Math.floor(size / 1000).toString();
  }

  public get images(): IImage[] {
    return this.uploadService.results;
  }

  public get noResults(): boolean {
    return this.uploadService.fetchedNoResults;
  }
}
