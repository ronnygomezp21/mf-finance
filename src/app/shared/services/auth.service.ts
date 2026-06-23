// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Injectable, inject } from '@angular/core';
// import { Observable } from 'rxjs';
// import { ActionsUser } from 'src/app/modules/user/enums/action.enum';
// import { environment } from 'src/environments/environment';
// import { MsPrefixEnum } from '../enum/ms-prefix.enum';
// import { ServiceResponseInterface } from '../interfaces/response.interface';
// import { PermissionService } from './permission.service';
// import { StorageService } from './storage.service';

// @Injectable({
//     providedIn: 'root',
// })
// export class AuthService {
//     private urlApi: string = environment.apiUrl!;

//     // [AI-GENERATED | skill: mf-refactor-skill | Patr?n 18 | model: gemini-2-5-pro]
//     private readonly http = inject(HttpClient);
//     private readonly storageService = inject(StorageService);
//     private readonly permissionService = inject(PermissionService);

//     constructor() { }

//     refreshToken(
//         sessionId: number,
//     ): Observable<ServiceResponseInterface<string>> {
//         const headers = new HttpHeaders().set(
//             'x-refresh-token',
//             `${this.storageService.getLocalStorage('REFRESH_TOKEN')}`,
//         );
//         return this.http.post<ServiceResponseInterface<string>>(
//             `${this.urlApi}/${MsPrefixEnum.CORE}/authentication/refresh-token/${sessionId}`,
//             {},
//             { headers },
//         );
//     }

//     resetPassword(
//         password: string,
//         userId: number,
//         currentPassword?: string,
//     ): Observable<ServiceResponseInterface<string>> {
//         const headers = this.permissionService.setHeaders(
//             `${ActionsUser.resource}:${ActionsUser.crear}`,
//         );
//         return this.http.put<ServiceResponseInterface<string>>(
//             `${this.urlApi}/${MsPrefixEnum.CORE}/user/pwd/${userId}`,
//             {
//                 password,
//                 currentPassword,
//             },
//             { headers },
//         );
//     }
// }
