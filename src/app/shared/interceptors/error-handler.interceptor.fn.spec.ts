// import { HttpClientTestingModule } from '@angular/common/http/testing';
// import { NO_ERRORS_SCHEMA } from '@angular/core';
// import { RouterTestingModule } from '@angular/router/testing';
// // [AI-GENERATED | skill: manual-migration | ticket: BUG-MF-SEC-INTERCEPTORS | model: claude-sonnet-4-6]

// import {
//   HttpClient,
//   HttpErrorResponse,
//   provideHttpClient,
//   withInterceptors,
// } from '@angular/common/http';
// import {
//   HttpTestingController,
//   provideHttpClientTesting,
// } from '@angular/common/http/testing';
// import { TestBed } from '@angular/core/testing';
// import { Router } from '@angular/router';
// import Pubsub from 'pubsub-js';
// import { of } from 'rxjs';
// import { StorageEnum } from '../enum/storage.enum';
// import { AuthService } from '../services/auth.service';
// import { DayJSService } from '../services/date.service';
// import { StorageService } from '../services/storage.service';
// import {
//   _resetRefreshState,
//   errorHandlerInterceptor,
// } from './error-handler.interceptor.fn';

// describe('errorHandlerInterceptor (functional)', () => {
//   let httpClient: HttpClient;
//   let httpTesting: HttpTestingController;
//   let storageServiceSpy: jasmine.SpyObj<StorageService>;
//   let authServiceSpy: jasmine.SpyObj<AuthService>;
//   let dayJSServiceSpy: jasmine.SpyObj<DayJSService>;
//   let routerSpy: jasmine.SpyObj<Router>;
//   let pubsubSpy: jasmine.Spy;

//   beforeEach(() => {
//     _resetRefreshState();
//     storageServiceSpy = jasmine.createSpyObj('StorageService', [
//       'getLocalStorage',
//       'saveLocalStorage',
//       'deleteKeyStorage',
//     ]);

//     authServiceSpy = jasmine.createSpyObj('AuthService', ['refreshToken']);

//     dayJSServiceSpy = jasmine.createSpyObj('DayJSService', ['dayJs']);

//     routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);

//     pubsubSpy = spyOn(Pubsub, 'publish');

//     TestBed.configureTestingModule({
//       schemas: [NO_ERRORS_SCHEMA],
//       imports: [RouterTestingModule, HttpClientTestingModule],
//       providers: [
//         provideHttpClient(withInterceptors([errorHandlerInterceptor])),
//         provideHttpClientTesting(),
//         { provide: StorageService, useValue: storageServiceSpy },
//         { provide: AuthService, useValue: authServiceSpy },
//         { provide: DayJSService, useValue: dayJSServiceSpy },
//         { provide: Router, useValue: routerSpy },
//       ],
//     });

//     httpClient = TestBed.inject(HttpClient);
//     httpTesting = TestBed.inject(HttpTestingController);
//   });

//   afterEach(() => {
//     httpTesting.verify();
//   });

//   it('should pass through successful responses without error', () => {
//     let responseData: unknown;
//     httpClient.get('/api/test').subscribe((data) => {
//       responseData = data;
//     });

//     const req = httpTesting.expectOne('/api/test');
//     req.flush({ status: 'ok' });

//     expect(responseData).toEqual({ status: 'ok' });
//     expect(pubsubSpy).not.toHaveBeenCalledWith('error', jasmine.anything());
//   });

//   it('should publish error via Pubsub for non-401/403 errors', () => {
//     httpClient.get('/api/test').subscribe({
//       error: (err: HttpErrorResponse) => {
//         expect(err.status).toBe(500);
//       },
//     });

//     const req = httpTesting.expectOne('/api/test');
//     req.flush('Server Error', {
//       status: 500,
//       statusText: 'Internal Server Error',
//     });

//     expect(pubsubSpy).toHaveBeenCalledWith('error', jasmine.anything());
//   });

//   it('should NOT publish error for /ms-integrations/endpoint/test URL', () => {
//     httpClient.get('/ms-integrations/endpoint/test').subscribe({
//       error: () => {
//         // expected error
//       },
//     });

//     const req = httpTesting.expectOne('/ms-integrations/endpoint/test');
//     req.flush('Error', { status: 500, statusText: 'Internal Server Error' });

//     expect(pubsubSpy).not.toHaveBeenCalledWith('error', jasmine.anything());
//   });

//   it('should clear storage and navigate to /auth on refresh-token URL failure', () => {
//     httpClient.get('/ms-core/authentication/refresh-token').subscribe({
//       error: () => {
//         // expected error
//       },
//     });

//     // Use 400 to trigger the refresh-token URL check without also triggering 401 flow
//     const req = httpTesting.expectOne('/ms-core/authentication/refresh-token');
//     req.flush('Bad Request', { status: 400, statusText: 'Bad Request' });

//     expect(storageServiceSpy.deleteKeyStorage).toHaveBeenCalledWith(
//       StorageEnum.ACCESS_TOKEN,
//     );
//     expect(storageServiceSpy.deleteKeyStorage).toHaveBeenCalledWith(
//       StorageEnum.REFRESH_TOKEN,
//     );
//     expect(storageServiceSpy.deleteKeyStorage).toHaveBeenCalledWith(
//       StorageEnum.ROLES_TOKEN,
//     );
//     expect(storageServiceSpy.deleteKeyStorage).toHaveBeenCalledWith(
//       StorageEnum.USER_SESSION,
//     );
//     expect(storageServiceSpy.deleteKeyStorage).toHaveBeenCalledWith(
//       StorageEnum.TYPE_ID,
//     );
//     expect(storageServiceSpy.deleteKeyStorage).toHaveBeenCalledWith(
//       'PERMISSION',
//     );
//     expect(storageServiceSpy.deleteKeyStorage).toHaveBeenCalledWith(
//       'NAVIGATION',
//     );
//     expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/auth');
//   });

//   it('should attempt refresh on 401 and retry original request', () => {
//     // Create a minimal valid JWT with sessionId for jwtDecode
//     // JWT payload: {"sessionId": 123, "exp": 9999999999}
//     const fakeToken =
//       'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZXNzaW9uSWQiOjEyMywiZXhwIjo5OTk5OTk5OTk5fQ.signature';
//     storageServiceSpy.getLocalStorage.and.returnValue(fakeToken);

//     authServiceSpy.refreshToken.and.returnValue(
//       of({ data: '[TOKEN_MOCK]', message: 'ok' }),
//     );

//     httpClient.get('/api/protected').subscribe();

//     // First request → 401
//     const req = httpTesting.expectOne('/api/protected');
//     req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });

//     // After refresh, interceptor retries the original request
//     expect(authServiceSpy.refreshToken).toHaveBeenCalledWith(123);
//     expect(storageServiceSpy.saveLocalStorage).toHaveBeenCalledWith(
//       StorageEnum.ACCESS_TOKEN,
//       '[TOKEN_MOCK]',
//     );

//     // Flush the retried request
//     const retriedReq = httpTesting.expectOne('/api/protected');
//     retriedReq.flush({ data: 'success' });
//   });

//   it('should handle 403 with expired JWT by clearing storage and navigating to /auth', () => {
//     // JWT with expired timestamp (exp = 1000, way in the past)
//     const expiredToken =
//       'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZXNzaW9uSWQiOjEyMywiZXhwIjoxMDAwfQ.signature';
//     storageServiceSpy.getLocalStorage.and.returnValue(expiredToken);

//     // Mock dayJS to return isSameOrAfter = true (token is expired)
//     const mockDayJS = (val?: unknown) => ({
//       isSameOrAfter: () => true,
//     });
//     dayJSServiceSpy.dayJs.and.returnValue(
//       mockDayJS as ReturnType<DayJSService['dayJs']>,
//     );

//     httpClient.get('/api/forbidden').subscribe({
//       error: (err: HttpErrorResponse) => {
//         expect(err.status).toBe(403);
//       },
//     });

//     const req = httpTesting.expectOne('/api/forbidden');
//     req.flush('Forbidden', { status: 403, statusText: 'Forbidden' });

//     expect(storageServiceSpy.deleteKeyStorage).toHaveBeenCalledWith(
//       StorageEnum.ACCESS_TOKEN,
//     );
//     expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/auth');
//   });

//   it('should NOT logout on 403 when JWT is still valid', () => {
//     // JWT with future expiration (exp = 9999999999)
//     const validToken =
//       'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZXNzaW9uSWQiOjEyMywiZXhwIjo5OTk5OTk5OTk5fQ.signature';
//     storageServiceSpy.getLocalStorage.and.returnValue(validToken);

//     // Mock dayJS to return isSameOrAfter = false (token is NOT expired)
//     const mockDayJS = (val?: unknown) => ({
//       isSameOrAfter: () => false,
//     });
//     dayJSServiceSpy.dayJs.and.returnValue(
//       mockDayJS as ReturnType<DayJSService['dayJs']>,
//     );

//     httpClient.get('/api/forbidden').subscribe({
//       error: (err: HttpErrorResponse) => {
//         expect(err.status).toBe(403);
//       },
//     });

//     const req = httpTesting.expectOne('/api/forbidden');
//     req.flush('Forbidden', { status: 403, statusText: 'Forbidden' });

//     expect(routerSpy.navigateByUrl).not.toHaveBeenCalledWith('/auth');
//   });

//   it('should use StorageService.deleteKeyStorage instead of localStorage.clear (BUG-MF-SEC-005)', () => {
//     // Verify that clearAllStorageKeys uses StorageService not localStorage.clear
//     httpClient.get('/ms-core/authentication/refresh-token').subscribe({
//       error: () => {
//         // expected error
//       },
//     });

//     const req = httpTesting.expectOne('/ms-core/authentication/refresh-token');
//     req.flush('Error', { status: 400, statusText: 'Bad Request' });

//     // Verify all 7 keys are cleared individually
//     const deleteCallArgs = storageServiceSpy.deleteKeyStorage.calls
//       .allArgs()
//       .map((args) => args[0]);
//     expect(deleteCallArgs).toContain(StorageEnum.ACCESS_TOKEN);
//     expect(deleteCallArgs).toContain(StorageEnum.REFRESH_TOKEN);
//     expect(deleteCallArgs).toContain(StorageEnum.ROLES_TOKEN);
//     expect(deleteCallArgs).toContain(StorageEnum.USER_SESSION);
//     expect(deleteCallArgs).toContain(StorageEnum.TYPE_ID);
//     expect(deleteCallArgs).toContain('PERMISSION');
//     expect(deleteCallArgs).toContain('NAVIGATION');
//   });
// });
