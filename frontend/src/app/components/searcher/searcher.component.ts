import { Component } from '@angular/core';
import { UploadService } from '@services/upload.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-searcher',
  templateUrl: './searcher.component.html',
  styleUrls: ['./searcher.component.css']
})
export class SearcherComponent {
  public searching: boolean = false;
  public errorMessage: string = '';
  public type: 'png' | 'jpeg' | 'All' = 'All';
  public descriptionQuery: string;
  public sizeQuery: number;

  constructor(
    private uploadService: UploadService,
  ) { }

  public search(): void {
    this.errorMessage = '';
    this.searching = true;
    const type = this.type === 'All' ? null : this.type;
    this.uploadService.fetchFiles(this.descriptionQuery, type, this.sizeQuery)
    .pipe(finalize(() => this.searching = false))
    .subscribe({ error: (err) => this.errorMessage = err.message });
  }
}
