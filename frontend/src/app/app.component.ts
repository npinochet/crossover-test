import { Component, OnInit } from '@angular/core';
import { UploadService } from '@services/upload.service';
import { MAX_FILE_SIZE, ALLOWED_FILE_TYPES } from './constants';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public fileMaxSizeKB = MAX_FILE_SIZE;
  public fileSelected: File;
  public errorMessage: string = '';
  public uploading: boolean = false;
  public uploaded: boolean = false;
  public fileSrc: string;
  public fileDescription: string;

  constructor(
    private uploadService: UploadService
  ) { }

  public ngOnInit(): void {

  }

  public validateFile(file: File): boolean {
    if (!file) return false;
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      this.errorMessage = 'Can only accept .png, .jpg or .jpeg files';
      return false;
    }
    if (file.size > this.fileMaxSizeKB * 1000) {
      this.errorMessage = 'File max size exceeded';
      return false;
    }
    this.errorMessage = '';
    return true;
  }

  public fileUploadOnChange(fileUpload: any): void {
    const file = fileUpload.files[0];
    if (this.validateFile(file)) this.fileSelected = file;
  }

  public async uploadFile(): Promise<void> {
    this.errorMessage = '';
    if (this.uploading) return;
    if (!this.fileSelected || !this.fileDescription) {
      this.errorMessage = 'An image and description is required';
      return;
    }
    this.uploading = true;
    this.uploadService.uploadFile(await this.imageToBase64(this.fileSelected), this.fileDescription)
      .pipe(finalize(() => this.uploading = false))
      .subscribe(({ ok, data }) => {
        if (!ok) {
          this.errorMessage = 'There was an error uploading your image';
          return;
        }
        this.fileSrc = data.url;
        this.uploaded = true;
      });
  }

  public imageToBase64(fileToRead: File): Promise<string> {
    const fileReader = new FileReader();
    return new Promise(res => {
      fileReader.onload = () => res(fileReader.result as string);
      fileReader.readAsDataURL(fileToRead);
    });
  }
}
