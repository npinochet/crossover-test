import { Component } from '@angular/core';
import { UploadService } from '@services/upload.service';
import { MAX_FILE_SIZE, ALLOWED_FILE_TYPES } from '@app/constants';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-uploader',
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.css']
})
export class UploaderComponent {
  public fileMaxSizeKB = MAX_FILE_SIZE;
  public uploading: boolean = false;
  public uploaded: boolean = false;
  public fileSelected: File;
  public errorMessage: string = '';
  public fileSrc: string;
  public fileDescription: string;

  constructor(
    private uploadService: UploadService
  ) { }

  public validateFile(file: File): boolean {
    if (!file) return false;
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      this.errorMessage = 'Can only accept .png, .jpg or .jpeg files';
      return false;
    }
    if (file.size > this.fileMaxSizeKB * 1000) {
      this.errorMessage = `Max file size exceeded (${this.fileMaxSizeKB}KB)`;
      return false;
    }
    this.errorMessage = '';
    return true;
  }

  public fileUploadOnChange(fileUpload: any): void {
    const file = fileUpload.files[0];
    this.fileSelected = this.validateFile(file) ? file : null;
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
      .subscribe(({ data }) => {
        this.fileSrc = data.url;
        this.uploaded = true;
      }, (err) => this.errorMessage = err.message);
  }

  public imageToBase64(fileToRead: File): Promise<string> {
    const fileReader = new FileReader();
    return new Promise(res => {
      fileReader.onload = () => res(fileReader.result as string);
      fileReader.readAsDataURL(fileToRead);
    });
  }
}
