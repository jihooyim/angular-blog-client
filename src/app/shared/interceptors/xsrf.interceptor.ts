// xsrf.interceptor.ts (함수형)
import { HttpInterceptorFn } from '@angular/common/http';

export const xsrfInterceptor: HttpInterceptorFn = (req, next) => {
  // API만 대상으로 제한
  const isApi = req.url.startsWith('/api/') || req.url.startsWith('http://localhost:8080/api/');
  if (isApi) {
    req = req.clone({ withCredentials: true }); // ← 헤더 추가 금지!
  }
  return next(req);
};