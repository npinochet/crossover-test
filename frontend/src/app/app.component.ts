import { Component, OnInit } from '@angular/core';
import { UploadService } from '@services/upload.service';
import { MAX_FILE_SIZE, ALLOWED_FILE_TYPES } from './constants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public fileMaxSizeKB = MAX_FILE_SIZE;
  public file: File;
  public errorMessage: string = '';

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
    return true;
  }

  public fileUploadOnChange(fileUpload: any): void {
    const file = fileUpload.files[0];
    if (this.validateFile(file)) {
      this.file = file;
      this.errorMessage = '';
    }
  }

  public async uploadFile(): Promise<any> {
    if (!this.file) return false;
    const uploadFileBody = {
      file: await this.imageToBase64(this.file),
    };
    return this.uploadService.uploadFile(uploadFileBody).toPromise();
  }

  public imageToBase64(fileToRead: File): Promise<string> {
    const fileReader = new FileReader();
    return new Promise(res => {
      fileReader.onload = () => res(fileReader.result as string);
      fileReader.readAsDataURL(fileToRead);
    });
  }
}
