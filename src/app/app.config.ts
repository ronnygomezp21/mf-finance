import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
// import { authInterceptor } from './shared/interceptors/auth.interceptor.fn';
// import { errorHandlerInterceptor } from './shared/interceptors/error-handler.interceptor.fn';
// import { loaderInterceptor } from './shared/interceptors/loader.interceptor.fn';
import { NgSelectModule } from '@ng-select/ng-select';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideAnimations(),
  importProvidersFrom(NgSelectModule),
  provideHttpClient(
    withInterceptors([
      // authInterceptor,
      // errorHandlerInterceptor,
      //loaderInterceptor,
    ]),
  ),]
};
