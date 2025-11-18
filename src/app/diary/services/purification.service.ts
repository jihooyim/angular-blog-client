import { Injectable } from '@angular/core';
import { ApiService } from '../../shared/services/api.service';

import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PurificationService {
  private readonly baseUrl = '/purification';

  constructor(private api: ApiService) {}

  purify(content: string): Observable<any> {
    return this.api.post<any>(`${this.baseUrl}`, { content });
  }

  save(blogId: number, refinedHtmlContent: string): Observable<any> {
    return this.api.post<any>(`${this.baseUrl}/save`, { blogId, refinedHtmlContent });
  }
}
