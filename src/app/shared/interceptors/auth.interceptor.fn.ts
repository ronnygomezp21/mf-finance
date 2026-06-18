// // [AI-GENERATED | skill: manual-migration | ticket: BUG-MF-SEC-INTERCEPTORS | model: claude-sonnet-4-6]
// import { HttpInterceptorFn } from '@angular/common/http';
// import { inject } from '@angular/core';
// import { DeviceDetectorService } from 'ngx-device-detector';
// import { StorageEnum } from '../enum/storage.enum';
// import { StorageService } from '../services/storage.service';

// export const authInterceptor: HttpInterceptorFn = (req, next) => {
//   const storageService = inject(StorageService);
//   const deviceService = inject(DeviceDetectorService);

//   const deviceInfo = Object.entries(deviceService.getDeviceInfo())
//     .map(([key, value]) => `${key}: ${value}`)
//     .join(', ');

//   let modifiedReq = req.clone({
//     setHeaders: { 'x-device-info': deviceInfo },
//   });

//   const token = storageService.getLocalStorage(StorageEnum.ACCESS_TOKEN);
//   if (token && !req.headers.has('Authorization')) {
//     modifiedReq = modifiedReq.clone({
//       setHeaders: { Authorization: `Bearer ${token}` },
//     });
//   }

//   return next(modifiedReq);
// };
