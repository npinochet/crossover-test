import { Component } from '@angular/core';
import { UploadService } from '@services/upload.service';
import { IImage } from '@models/interfaces';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent {
  public fetching: boolean = false;
  public scrollDistance: number = 2;
  public scrollThrottle: number = 500;

  constructor(
    private uploadService: UploadService,
  ) { }

  public onScrollDown(): void {
    if (this.fetching || this.noResults) return;
    this.fetching = true;
    this.uploadService.fetchNext()
      .pipe(finalize(() => this.fetching = false))
      .subscribe();
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
