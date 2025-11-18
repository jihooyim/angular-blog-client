// src/app/shared/interceptors/auth-error.interceptor.ts
import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((err) => {
      if ((err.status === 403 && err.error?.message === 'INVALID_CSRF') || err.status === 401  ) {
        router.navigate(['/login']); // 로그인 페이지로 이동
      }
      return throwError(() => err);
    })
  );
};
