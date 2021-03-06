import { Injectable } from '@angular/core';
import { BASE_BACKEND } from '@environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { IImage, IResponse } from '@models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  public pageSize: number = 20;
  public currentPage: number = 0;
  public results: IImage[] = [];
  public lastQuery: HttpParams;
  public fetchedNoResults: boolean = false;

  constructor(
    private http: HttpClient,
  ) { }

  public uploadFile(file: string, description: string): Observable<any> {
    const body = { file, description };
    return this.http.post(BASE_BACKEND + '/upload', body).pipe(
      map((res: IResponse) => { if (!res.ok) throw Error(); return res; }),
      catchError(() => { throw Error('There was an error uploading your image'); })
    );
  }

  public fetchFiles(descQuery: string, type: string, maxSize: number, page: number = 0): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', this.pageSize.toString());

    if (descQuery) params = params.set('q', descQuery);
    if (maxSize) params = params.set('maxSize', maxSize.toString());
    if (type) params = params.set('type', type);

    return this.http.get(BASE_BACKEND + '/images', { params }).pipe(
      map((res: IResponse) => {
        if (!res.ok) throw Error();
        this.reset();
        this.lastQuery = params;
        this.results = res.data;
        this.fetchedNoResults = res.data.length < this.pageSize;
        return res;
      }),
      catchError(() => { throw Error('There was an error fetching the images'); })
    );
  }

  public fetchNext(): Observable<any> {
    this.currentPage += 1;
    this.lastQuery = this.lastQuery.set('page', this.currentPage.toString());
    return this.http.get(BASE_BACKEND + '/images', { params: this.lastQuery }).pipe(
      map((res: IResponse) => {
        if (!res.ok) throw Error();
        this.results = this.results.concat(res.data);
        this.fetchedNoResults = res.data.length <= 0;
        return res;
      }),
      catchError(() => { throw Error('There was an error fetching the next page of images'); })
    );
  }

  public reset(): void {
    this.results = [];
    this.lastQuery = null;
    this.currentPage = 0;
  }
}
