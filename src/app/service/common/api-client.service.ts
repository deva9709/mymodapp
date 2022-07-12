import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TenantHelper } from '@shared/helpers/TenantHelper';

const BASE_URL = TenantHelper.getEnvironmentBasedValue('apiServerBaseUrl');
const PLATFORM_URL = TenantHelper.getEnvironmentBasedValue('apiPlatformUrl');
const RUBY_BASE_URL = TenantHelper.getEnvironmentBasedValue('rubyBaseUrl');

@Injectable({
  providedIn: 'root'
})
export class ApiClientService {

  private options = { headers: new HttpHeaders().set('Content-Type', 'application/json') };
  private fileHeaderOptions = { headers: new HttpHeaders().set('Content-Type', 'multipart/form-data') };

  constructor(private httpClient: HttpClient) { }

  public get(path: string, params: HttpParams = new HttpParams()): Observable<any> {
    return this.httpClient.get(BASE_URL + path, { params }).pipe(catchError(this.formatErrors));
  }

  public patch(path: string, body: object = {}): Observable<any> {
    return this.httpClient
      .patch(BASE_URL + path, JSON.stringify(body), this.options)
      .pipe(catchError(this.formatErrors));
  }

  public put(path: string, body: object = {}): Observable<any> {
    return this.httpClient
      .put(BASE_URL + path, JSON.stringify(body), this.options)
      .pipe(catchError(this.formatErrors));
  }

  public post(path: string, body: object = {}): Observable<any> {
    return this.httpClient
      .post(BASE_URL + path, JSON.stringify(body), this.options)
      .pipe(catchError(this.formatErrors));
  }

  public platPost(path: string, body: object = {}): Observable<any> {
    return this.httpClient
      .post(PLATFORM_URL + path, JSON.stringify(body), this.options)
      .pipe(catchError(this.formatErrors));
  }

  public delete(path: string): Observable<any> {
    return this.httpClient.delete(BASE_URL + path).pipe(catchError(this.formatErrors));
  }

  public postFile(path: string, body: object = {}): Observable<any> {
    return this.httpClient.post(BASE_URL + path, body).pipe(catchError(this.formatErrors));
  }
  public putFile(path: string, body: object = {}): Observable<any> {
    return this.httpClient.put(BASE_URL + path, body).pipe(catchError(this.formatErrors));
  }

  public platGet(path: string, params: HttpParams = new HttpParams()): Observable<any> {
    return this.httpClient.get(PLATFORM_URL + path, { params }).pipe(catchError(this.formatErrors));
  }

  public platPostFile(path: string, body: object = {}): Observable<any> {
    return this.httpClient.post(PLATFORM_URL + path, body).pipe(catchError(this.formatErrors));
  }

  formatErrors(error: any): Observable<any> {
    return throwError(error);
  }

  public rubyGetFile(path: string, params: HttpParams = new HttpParams()): Observable<any> {
    return this.httpClient.get(RUBY_BASE_URL + path, { params, responseType:'text' }).pipe(catchError(this.formatErrors));
  }
}
