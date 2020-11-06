import { Injectable } from '@angular/core';
import { BASE_BACKEND } from '@environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  constructor(
    private http: HttpClient,
  ) { }

  public uploadFile(file: string, description: string): Observable<any> {
    const body = { file, description };
    return this.http.post(BASE_BACKEND + '/upload', body);
  }
}
