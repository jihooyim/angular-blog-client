import { Injectable } from '@angular/core';
import { ApiService } from '../../shared/services/api.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class KoreaDictionaryService {
  private readonly baseUrl = '/diary/koreadictionary';

  constructor(private api: ApiService) {}

  getDictionaryList(params: any): Observable<any> {
    return this.api.get<any>(`${this.baseUrl}/list`, {
      params: { ...params },
    });
  }
}
