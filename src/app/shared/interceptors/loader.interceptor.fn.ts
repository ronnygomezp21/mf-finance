// // [AI-GENERATED | skill: manual-migration | ticket: BUG-MF-SEC-INTERCEPTORS | model: claude-sonnet-4-6]
// import { HttpInterceptorFn } from '@angular/common/http';
// import Pubsub from 'pubsub-js';
// import { finalize } from 'rxjs';

// let countRequest = 0;

// export const loaderInterceptor: HttpInterceptorFn = (req, next) => {
//   if (!countRequest) {
//     Pubsub.publish('loading', true);
//   }
//   countRequest++;

//   return next(req).pipe(
//     finalize(() => {
//       countRequest--;
//       if (!countRequest) {
//         Pubsub.publish('loading', false);
//       }
//     }),
//   );
// };
