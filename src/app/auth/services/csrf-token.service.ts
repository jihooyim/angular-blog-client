import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CsrfTokenService {
  private loaded = false;
  private base = environment.apiBase;

  constructor(private http: HttpClient) {}

  /** XSRF-TOKEN 쿠키가 없으면 /api/csrf를 GET해서 받아둠 */
  ensure$(): Observable<void> {
    if (this.loaded && hasCookie('XSRF-TOKEN')) return of(void 0);
    return this.http.get(`${this.base}/csrf`, { withCredentials: true }).pipe(
      tap(() => (this.loaded = true)),
      map(() => void 0)
    );
  }
}

function hasCookie(name: string): boolean {
  return document.cookie.split('; ').some((c) => c.startsWith(name + '='));
}
