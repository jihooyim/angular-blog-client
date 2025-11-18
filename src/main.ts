import { bootstrapApplication } from '@angular/platform-browser';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
  withXsrfConfiguration,
} from '@angular/common/http';
import { importProvidersFrom, inject } from '@angular/core';
import { provideAppInitializer } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { xsrfInterceptor } from './app/shared/interceptors/xsrf.interceptor';
import { CsrfTokenService } from './app/auth/services/csrf-token.service';
import { authRedirectInterceptor } from './app/shared/interceptors/auth-redirect.interceptor';
import { LucideAngularModule, Copy, Check } from 'lucide-angular';

import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { App } from './app/app';
import { authErrorInterceptor } from './app/shared/interceptors/auth-error.interceptor';

bootstrapApplication(App, {
  providers: [
    provideRouter(routes),
    importProvidersFrom(LucideAngularModule.pick({ Copy, Check })),
    importProvidersFrom(FormsModule),
    provideHttpClient(
      withXsrfConfiguration({
        cookieName: 'XSRF-TOKEN',
        headerName: 'X-XSRF-TOKEN',
      }),
      withInterceptors([authErrorInterceptor])
    ),
    // provideAppInitializer(async () => {
    //   const svc = inject(CsrfTokenService);
    //   await firstValueFrom(svc.ensure$());
    // }),
  ],
}).catch(console.error);
