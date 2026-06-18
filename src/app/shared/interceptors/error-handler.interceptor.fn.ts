// // [AI-GENERATED | skill: manual-migration | ticket: BUG-MF-SEC-INTERCEPTORS | model: claude-sonnet-4-6]

// import type { HttpHandlerFn, HttpRequest } from '@angular/common/http';
// import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
// import { inject } from '@angular/core';
// import { Router } from '@angular/router';
// import { jwtDecode } from 'jwt-decode';
// import Pubsub from 'pubsub-js';
// import { BehaviorSubject, throwError } from 'rxjs';
// import {
//   catchError,
//   filter,
//   finalize,
//   switchMap,
//   take,
//   tap,
// } from 'rxjs/operators';
// import { StorageEnum } from '../enum/storage.enum';
// import { AuthService } from '../services/auth.service';
// import { DayJSService } from '../services/date.service';
// import { StorageService } from '../services/storage.service';

// let isRefreshing = false;
// const refreshTokenSubject = new BehaviorSubject<string | null>(null);

// /**
//  * Resets module-level refresh state. Only for use in tests.
//  * @internal
//  */
// export function _resetRefreshState(): void {
//   isRefreshing = false;
//   refreshTokenSubject.next(null);
// }

// /**
//  * Clears all known storage keys via StorageService.
//  * Replaces the unsafe localStorage.clear() pattern (fix BUG-MF-SEC-005).
//  */
// function clearAllStorageKeys(storageService: StorageService): void {
//   storageService.deleteKeyStorage(StorageEnum.ACCESS_TOKEN);
//   storageService.deleteKeyStorage(StorageEnum.REFRESH_TOKEN);
//   storageService.deleteKeyStorage(StorageEnum.ROLES_TOKEN);
//   storageService.deleteKeyStorage(StorageEnum.USER_SESSION);
//   storageService.deleteKeyStorage(StorageEnum.TYPE_ID);
//   storageService.deleteKeyStorage('PERMISSION');
//   storageService.deleteKeyStorage('NAVIGATION');
// }

// function addToken(
//   request: HttpRequest<unknown>,
//   token: string | null,
// ): HttpRequest<unknown> {
//   if (token) {
//     return request.clone({
//       setHeaders: {
//         Authorization: `Bearer ${token}`,
//       },
//     });
//   }
//   return request;
// }

// function handle401Error(
//   request: HttpRequest<unknown>,
//   next: HttpHandlerFn,
//   storageService: StorageService,
//   authService: AuthService,
//   router: Router,
// ): ReturnType<HttpInterceptorFn> {
//   if (!isRefreshing) {
//     isRefreshing = true;
//     refreshTokenSubject.next(null);

//     const token = storageService.getLocalStorage(StorageEnum.ACCESS_TOKEN);
//     const sessionId = (jwtDecode(token!) as Record<string, unknown>)[
//       'sessionId'
//     ] as number;

//     return authService.refreshToken(sessionId).pipe(
//       tap((res) => {
//         const newAccessToken = res.data;

//         if (newAccessToken) {
//           storageService.deleteKeyStorage(StorageEnum.ACCESS_TOKEN);
//           storageService.saveLocalStorage(
//             StorageEnum.ACCESS_TOKEN,
//             newAccessToken,
//           );
//           refreshTokenSubject.next(newAccessToken);
//         }
//       }),
//       switchMap(() => {
//         return next(request).pipe(
//           catchError((err: HttpErrorResponse) => {
//             return throwError(() => err);
//           }),
//         );
//       }),
//       catchError((err: unknown) => {
//         Pubsub.publish('error', err);
//         clearAllStorageKeys(storageService);
//         location.reload();
//         return throwError(() => err);
//       }),
//       finalize(() => {
//         isRefreshing = false;
//       }),
//     );
//   } else {
//     return refreshTokenSubject.pipe(
//       filter((token) => token !== null),
//       take(1),
//       switchMap(() => {
//         return next(
//           addToken(
//             request,
//             storageService.getLocalStorage(StorageEnum.ACCESS_TOKEN)!,
//           ),
//         );
//       }),
//     );
//   }
// }

// export const errorHandlerInterceptor: HttpInterceptorFn = (req, next) => {
//   const storageService = inject(StorageService);
//   const dayJSService = inject(DayJSService);
//   const authService = inject(AuthService);
//   const router = inject(Router);

//   return next(req).pipe(
//     catchError((err: unknown) => {
//       if (err instanceof HttpErrorResponse) {
//         if (err.url?.includes('/ms-core/authentication/refresh-token')) {
//           clearAllStorageKeys(storageService);
//           router.navigateByUrl('/auth');
//         }

//         if (err.status === 401) {
//           return handle401Error(req, next, storageService, authService, router);
//         } else if (err.status === 403) {
//           const jwtToken = storageService.getLocalStorage(
//             StorageEnum.ACCESS_TOKEN,
//           );
//           if (jwtToken) {
//             const exp = jwtDecode<{ exp: string }>(jwtToken)?.exp;
//             const dayJS = dayJSService.dayJs();
//             const expDate = dayJS(Number(exp) * 1000);
//             if (expDate) {
//               const after = dayJS().isSameOrAfter(expDate);
//               if (after) {
//                 clearAllStorageKeys(storageService);
//                 router.navigateByUrl('/auth');
//               }
//             }
//           }
//         }
//       }

//       if (!req.url.includes('/ms-integrations/endpoint/test')) {
//         Pubsub.publish('error', err);
//       }
//       return throwError(() => err);
//     }),
//   );
// };
