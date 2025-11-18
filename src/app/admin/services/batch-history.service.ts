import { Injectable } from '@angular/core';
import { ApiService } from '../../shared/services/api.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BatchHistoryService {
  private readonly baseUrl = '/admin/batch';

  constructor(private api: ApiService) {}

  /** Job 목록 조회 */
  getJobNames(): Observable<string[]> {
    return this.api.get<string[]>(`${this.baseUrl}/jobs`);
  }

  /** Job 실행 이력 조회 */
  getExecutionHistories(jobName?: string): Observable<any[]> {
    return this.api.get<any[]>(`${this.baseUrl}/job/executions`, {
      params: jobName && jobName !== 'all' ? { jobName } : {},
    });
  }
}
