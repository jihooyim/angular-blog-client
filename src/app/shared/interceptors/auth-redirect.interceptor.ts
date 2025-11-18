import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

const EXCLUDE = [
  '/login',
  '/logout',
  '/csrf'
];

export const authRedirectInterceptor: HttpInterceptorFn = (req, next) => {
  // 로그인/CSRF 호출 자체는 제외 (루프 방지)
  const skip = EXCLUDE.some(x =>
    req.url.startsWith(x) || req.url.includes(x)
  );

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      if (!skip) {
        // 세션 만료(401), 토큰 만료(419) 등 → 로그인 페이지로 이동
        if (err.status === 401 || err.status === 419 || err.status === 403) {
          const router = inject(Router);

          // 현재 URL을 쿼리로 넘겨, 로그인 후 돌아올 수 있게
          const redirectUrl = typeof location !== 'undefined' ? location.pathname + location.search : '/';
          router.navigate(['/login'], { queryParams: { redirectUrl } });
        }
      }
      return throwError(() => err);
    })
  );
};
