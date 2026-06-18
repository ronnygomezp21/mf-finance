// import { HttpHeaders } from '@angular/common/http';
// import { Injectable, inject } from '@angular/core';
// import { StorageEnum } from '@neocore/lib-components';
// import { UserPermissionI } from '../interfaces/general.interface';
// import { StorageService } from './storage.service';

// @Injectable({
//   providedIn: 'root',
// })
// export class PermissionService {
//   // [AI-GENERATED | skill: mf-refactor-skill | Patr?n 18 | model: gemini-2-5-pro]
//   private readonly storageService = inject(StorageService);

//   constructor() {}

//   validPermissionResourceAction(resource: string, action: string): boolean {
//     let result: boolean = false;
//     const permission = this.storageService.getLocalStorage(
//       StorageEnum.PERMISSION,
//     );
//     if (permission === undefined) return result;
//     const userPermission = JSON.parse(
//       JSON.stringify(permission),
//     ) as UserPermissionI;

//     const findResource = userPermission.resource.find((f) => f === resource);
//     const findResourceActionAllow = userPermission.allow.action.find(
//       (f) => f === `${resource}:${action}` || f === `${resource}:*`,
//     );
//     const findResourceActionDenny = userPermission.denny.action.find(
//       (f) => f === `${resource}:${action}` || f === `${resource}:*`,
//     );

//     if (findResource === undefined || findResourceActionDenny !== undefined)
//       result = false;
//     if (
//       findResourceActionAllow !== undefined &&
//       findResourceActionDenny === undefined
//     )
//       result = true;
//     return result;
//   }

//   setHeaders(apiKey: string) {
//     const headers = new HttpHeaders({
//       'Content-Type': 'application/json',
//       'x-api-key': apiKey,
//     });
//     return headers;
//   }
// }
