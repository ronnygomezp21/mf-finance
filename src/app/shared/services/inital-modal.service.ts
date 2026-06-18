// import { HttpClient } from '@angular/common/http';
// import { Injectable, inject } from '@angular/core';
// import { catchError, map, Observable, throwError } from 'rxjs';
// import { environment } from 'src/environments/environment';
// import { MsPrefixEnum } from '../enum/ms-prefix.enum';
// import {
//   CheckPendingAuthorizationsData,
//   CheckPendingAuthorizationsResponse,
// } from '../interfaces/initial-modal.interface';
// import { ServiceResponseInterface } from '../interfaces/response.interface';

// @Injectable({
//   providedIn: 'root',
// })
// export class InitialModalService {
//   // [AI-GENERATED | skill: mf-refactor-skill | Patrón 18 | model: gemini-2-5-pro]
//   private readonly http = inject(HttpClient);
//   private readonly urlApi = environment.apiUrl;
//   // private readonly urlApi = 'http://localhost:3000';
//   private readonly prefixApi =
//     `${MsPrefixEnum.VIRTUAL_OFFICE}/certificate-emission`;

//   get(): Observable<CheckPendingAuthorizationsData> {
//     return this.http
//       .get<CheckPendingAuthorizationsResponse>(
//         `${this.urlApi}/${this.prefixApi}/check-pending-authorizations`,
//         { headers: { 'x-info-user': '1' } },
//       )
//       .pipe(
//         map((response) => response.data),
//         catchError((err) =>
//           throwError(
//             () =>
//               new Error(
//                 err?.error?.message ?? 'Error loading pending authorizations',
//               ),
//           ),
//         ),
//       );
//   }

//   authorizeCertificates(): Observable<ServiceResponseInterface<any>> {
//     return this.http.patch<ServiceResponseInterface<any>>(
//       `${this.urlApi}/${this.prefixApi}/authorize`,
//       {},
//       { headers: { 'x-info-user': '1' } },
//     );
//   }
// }
