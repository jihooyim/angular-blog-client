import { Injectable } from '@angular/core';
import { ApiService } from '../../shared/services/api.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class KoreaDictionaryUploadFileService {
  private readonly baseUrl = '/admin/koreadictionary/uplodadfile';

  constructor(private api: ApiService) {}

  getDictionaryUploadFileList(params: any): Observable<any> {
    return this.api.get<any>(`${this.baseUrl}/list`, {
      params: { ...params },
    });
  }
}
