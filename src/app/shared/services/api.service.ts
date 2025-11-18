import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

interface ApiOptions {
  params?: HttpParams | { [param: string]: string | string[] };
  headers?: HttpHeaders | { [header: string]: string | string[] };
  observe?: 'body';
  responseType?: 'json';
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private base = environment.apiBase;

  constructor(private http: HttpClient) {}

  public get<T>(url: string, options: ApiOptions = {}): Observable<T> {
    return this.http.get<T>(`${this.base}${url}`, {
      withCredentials: true,
      ...options,
    });
  }

  public post<T>(
    url: string,
    body: any,
    options: ApiOptions = {}
  ): Observable<T> {
    return this.http.post<T>(`${this.base}${url}`, body, {
      withCredentials: true,
      ...options,
    });
  }

  public put<T>(
    url: string,
    body: any,
    options: ApiOptions = {}
  ): Observable<T> {
    return this.http.put<T>(`${this.base}${url}`, body, {
      withCredentials: true,
      ...options,
    });
  }

  public delete<T>(url: string, options: ApiOptions = {}): Observable<T> {
    return this.http.delete<T>(`${this.base}${url}`, {
      withCredentials: true,
      ...options,
    });
  }
}
