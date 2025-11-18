import { Injectable } from '@angular/core';
import { ApiService } from '../../shared/services/api.service';

import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SpellCheckService {
  private readonly baseUrl = '/spellcheck';

  constructor(private api: ApiService) {}

  checkWholeText(
    content: string,
    blogId: number,
    jobId: string
  ): Observable<any> {
    return this.api.post<any>(`${this.baseUrl}/check-spell-stream/${jobId}`, {
      content,
      blogId,
    });
  }
}
