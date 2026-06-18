// import { HttpClient } from '@angular/common/http';
// import { Injectable, inject } from '@angular/core';
// import { Observable } from 'rxjs';
// import { environment } from 'src/environments/environment';
// import { ActionsLoginType, ActionsResource } from '../enum/general.enum';
// import { MsPrefixEnum } from '../enum/ms-prefix.enum';
// import { LoginTypeI, LoginTypeParamsI } from '../interfaces/general.interface';
// import {
//   ResourceInterface,
//   ResourceParamsInterface,
// } from '../interfaces/resource.interface';
// import {
//   PaginationResponseInterface,
//   ServiceResponseInterface,
// } from '../interfaces/response.interface';
// import { PermissionService } from './permission.service';

// @Injectable({
//   providedIn: 'root',
// })
// export class GeneralService {
//   // [AI-GENERATED | skill: mf-refactor-skill | Patrón 18 | model: gemini-2-5-pro]
//   private readonly http = inject(HttpClient);
//   private readonly permissionService = inject(PermissionService);
//   private readonly urlApi = environment.apiUrl!;
//   private readonly prefixApi = MsPrefixEnum.CORE;

//   getLoginType(
//     params: LoginTypeParamsI,
//   ): Observable<
//     ServiceResponseInterface<PaginationResponseInterface<LoginTypeI[]>>
//   > {
//     const headers = this.permissionService.setHeaders(
//       `${ActionsLoginType.resource}:${ActionsLoginType.listar}`,
//     );
//     let query: string = `limit=${params.limit}&page=${params.page}&`;
//     if (params.search !== null) query += `search=${params.search}&`;
//     if (params.status !== null) query += `status=${params.status}`;

//     return this.http.get<
//       ServiceResponseInterface<PaginationResponseInterface<LoginTypeI[]>>
//     >(`${this.urlApi}/${this.prefixApi}/user-type-login?${query}`, { headers });
//   }

//   getResources(
//     params: ResourceParamsInterface,
//   ): Observable<
//     ServiceResponseInterface<PaginationResponseInterface<ResourceInterface[]>>
//   > {
//     const headers = this.permissionService.setHeaders(
//       `${ActionsResource.resource}:${ActionsResource.listar}`,
//     );
//     let query: string = `limit=${params.limit}&page=${params.page}&`;
//     if (params.search !== null) query += `search=${params.search}&`;
//     if (params.status !== null) query += `status=${params.status}`;

//     return this.http.get<
//       ServiceResponseInterface<PaginationResponseInterface<ResourceInterface[]>>
//     >(`${this.urlApi}/${this.prefixApi}/resource?${query}`, { headers });
//   }
// }
