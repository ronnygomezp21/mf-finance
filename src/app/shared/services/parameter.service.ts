// import { HttpClient } from '@angular/common/http';
// import { Injectable, inject } from '@angular/core';
// import { Observable } from 'rxjs';
// import { environment } from 'src/environments/environment';
// import { MsPrefixEnum } from '../enum/ms-prefix.enum';
// import { ServiceResponseInterface } from '../interfaces/response.interface';

// @Injectable({
//   providedIn: 'root',
// })
// export class ParameterService {
//   // [AI-GENERATED | skill: mf-refactor-skill | Patrón 18 | model: gemini-2-5-pro]
//   private readonly http = inject(HttpClient);
//   private readonly urlApi = environment.apiUrl!;

//   getParameterEnv(): Observable<ServiceResponseInterface<any>> {
//     return this.http.get<ServiceResponseInterface<any>>(
//       `${this.urlApi}/${MsPrefixEnum.CORE}/parameter/env`,
//     );
//   }
// }
