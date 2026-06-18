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
// import Pubsub from 'pubsub-js';
// import { loaderInterceptor } from './loader.interceptor.fn';

// describe('loaderInterceptor (functional)', () => {
//   let httpClient: HttpClient;
//   let httpTesting: HttpTestingController;
//   let pubsubSpy: jasmine.Spy;

//   beforeEach(() => {
//     pubsubSpy = spyOn(Pubsub, 'publish');

//     TestBed.configureTestingModule({
//       schemas: [NO_ERRORS_SCHEMA],
//       imports: [RouterTestingModule, HttpClientTestingModule],
//       providers: [
//         provideHttpClient(withInterceptors([loaderInterceptor])),
//         provideHttpClientTesting(),
//       ],
//     });

//     httpClient = TestBed.inject(HttpClient);
//     httpTesting = TestBed.inject(HttpTestingController);
//   });

//   afterEach(() => {
//     httpTesting.verify();
//   });

//   it('should publish loading=true on first request', () => {
//     httpClient.get('/api/test').subscribe();

//     expect(pubsubSpy).toHaveBeenCalledWith('loading', true);

//     const req = httpTesting.expectOne('/api/test');
//     req.flush({});
//   });

//   it('should publish loading=false when request completes', () => {
//     httpClient.get('/api/test').subscribe();

//     const req = httpTesting.expectOne('/api/test');
//     req.flush({});

//     expect(pubsubSpy).toHaveBeenCalledWith('loading', false);
//   });

//   it('should publish loading=false when request errors', () => {
//     httpClient.get('/api/test').subscribe({
//       error: () => {
//         // expected error
//       },
//     });

//     const req = httpTesting.expectOne('/api/test');
//     req.error(new ProgressEvent('Network error'));

//     expect(pubsubSpy).toHaveBeenCalledWith('loading', false);
//   });
// });
