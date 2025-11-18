import { Injectable } from '@angular/core';
import { ApiService } from '../../shared/services/api.service';

import { Observable, of } from 'rxjs';
import {
  Blog,
  BlogUserView,
  BlogView,
  BlogsRequestDto,
} from '../models/diary.model';
@Injectable({ providedIn: 'root' })
export class BlogService {
  private readonly baseUrl = '/diary';

  constructor(private api: ApiService) {}

  getBlogs(params?: BlogsRequestDto): Observable<Blog[]> {
    return this.api.get<Blog[]>(`${this.baseUrl}/list`, {
      params: params as any,
    });
  }

  getBlog(blogId: number): Observable<Blog> {
    return this.api.get<Blog>(`${this.baseUrl}/${blogId}`);
  }

  getBlogView(blogId: number): Observable<BlogView> {
    return this.api.get<BlogView>(`${this.baseUrl}/view/${blogId}`);
  }

  autoSaveBlog(blog: Blog): Observable<number> {
    return this.api.post<number>(`${this.baseUrl}/save/auto`, blog);
  }

  saveBlog(blog: Blog): Observable<number> {
    return this.api.post<number>(`${this.baseUrl}/save`, blog);
  }

  deleteBlog(blogId: number): Observable<void> {
    return this.api.put<void>(`${this.baseUrl}/delete/${blogId}`, {});
  }

  upload(file: File, jobId: any): Observable<any> {
    // 70MB = 70 * 1024 * 1024 bytes
    const maxSize = 70 * 1024 * 1024;

    if (file.size > maxSize) {
      alert('70MB를 초과하는 파일은 업로드할 수 없습니다.');
      return of(null);
    }

    const formData = new FormData();
    formData.append('file', file);

    return this.api.post(`${this.baseUrl}/file/upload/${jobId}`, formData);
  }

  getFileUploadActiveJob(): Observable<any> {
    return this.api.get<any>(`${this.baseUrl}/jobs/upload/active`);
  }

  getBlogByUserId(
    userId: string | undefined,
    sortUpFlag: boolean
  ): Observable<BlogUserView> {
    if (userId)
      return this.api.get<BlogUserView>(`${this.baseUrl}/user/${userId}`, {
        params: { sortUpFlag } as any,
      });
    else
      return this.api.get<BlogUserView>(`${this.baseUrl}/myblog`, {
        params: { sortUpFlag } as any,
      });
  }

  checkSession(): Observable<any> {
    return this.api.get('/session-check');
  }
}
