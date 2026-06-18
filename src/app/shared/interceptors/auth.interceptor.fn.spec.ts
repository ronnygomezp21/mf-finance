// import { HttpClientTestingModule } from '@angular/common/http/testing';
// import { NO_ERRORS_SCHEMA } from '@angular/core';
// import { RouterTestingModule } from '@angular/router/testing';
// // [AI-GENERATED | skill: manual-migration | ticket: BUG-MF-SEC-INTERCEPTORS | model: claude-sonnet-4-6]

// import {
//   HttpClient,
//   provideHttpClient,
//   withInterceptors,
// } from '@angular/common/http';
// import {
//   HttpTestingController,
//   provideHttpClientTesting,
// } from '@angular/common/http/testing';
// import { TestBed } from '@angular/core/testing';
// import { DeviceDetectorService } from 'ngx-device-detector';
// import { StorageEnum } from '../enum/storage.enum';
// import { StorageService } from '../services/storage.service';
// import { authInterceptor } from './auth.interceptor.fn';

// describe('authInterceptor (functional)', () => {
//   let httpClient: HttpClient;
//   let httpTesting: HttpTestingController;
//   let storageServiceSpy: jasmine.SpyObj<StorageService>;
//   let deviceServiceSpy: jasmine.SpyObj<DeviceDetectorService>;

//   beforeEach(() => {
//     storageServiceSpy = jasmine.createSpyObj('StorageService', [
//       'getLocalStorage',
//       'saveLocalStorage',
//       'deleteKeyStorage',
//     ]);

//     deviceServiceSpy = jasmine.createSpyObj('DeviceDetectorService', [
//       'getDeviceInfo',
//     ]);
//     deviceServiceSpy.getDeviceInfo.and.returnValue({
//       browser: 'Chrome',
//       os: 'Windows',
//     } as ReturnType<DeviceDetectorService['getDeviceInfo']>);

//     TestBed.configureTestingModule({
//       schemas: [NO_ERRORS_SCHEMA],
//       imports: [RouterTestingModule, HttpClientTestingModule],
//       providers: [
//         provideHttpClient(withInterceptors([authInterceptor])),
//         provideHttpClientTesting(),
//         { provide: StorageService, useValue: storageServiceSpy },
//         { provide: DeviceDetectorService, useValue: deviceServiceSpy },
//       ],
//     });

//     httpClient = TestBed.inject(HttpClient);
//     httpTesting = TestBed.inject(HttpTestingController);
//   });

//   afterEach(() => {
//     httpTesting.verify();
//   });

//   it('should add x-device-info header to every request', () => {
//     httpClient.get('/api/test').subscribe();

//     const req = httpTesting.expectOne('/api/test');
//     expect(req.request.headers.has('x-device-info')).toBeTrue();
//     expect(req.request.headers.get('x-device-info')).toContain(
//       'browser: Chrome',
//     );
//     expect(req.request.headers.get('x-device-info')).toContain('os: Windows');
//     req.flush({});
//   });

//   it('should add Authorization header when token exists', () => {
//     storageServiceSpy.getLocalStorage.and.returnValue('[TOKEN_MOCK]');

//     httpClient.get('/api/secure').subscribe();

//     const req = httpTesting.expectOne('/api/secure');
//     expect(req.request.headers.get('Authorization')).toBe(
//       'Bearer [TOKEN_MOCK]',
//     );
//     req.flush({});
//   });

//   it('should NOT add Authorization header when no token exists', () => {
//     storageServiceSpy.getLocalStorage.and.returnValue(undefined);

//     httpClient.get('/api/public').subscribe();

//     const req = httpTesting.expectOne('/api/public');
//     expect(req.request.headers.has('Authorization')).toBeFalse();
//     req.flush({});
//   });

//   it('should NOT override existing Authorization header', () => {
//     storageServiceSpy.getLocalStorage.and.returnValue('[TOKEN_MOCK]');

//     httpClient
//       .get('/api/custom', {
//         headers: { Authorization: 'Bearer custom-token' },
//       })
//       .subscribe();

//     const req = httpTesting.expectOne('/api/custom');
//     expect(req.request.headers.get('Authorization')).toBe(
//       'Bearer custom-token',
//     );
//     req.flush({});
//   });

//   it('should call StorageService.getLocalStorage with ACCESS_TOKEN key', () => {
//     storageServiceSpy.getLocalStorage.and.returnValue(undefined);

//     httpClient.get('/api/test').subscribe();

//     const req = httpTesting.expectOne('/api/test');
//     expect(storageServiceSpy.getLocalStorage).toHaveBeenCalledWith(
//       StorageEnum.ACCESS_TOKEN,
//     );
//     req.flush({});
//   });
// });
