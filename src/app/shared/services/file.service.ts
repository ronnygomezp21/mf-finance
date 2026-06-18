// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Injectable, inject } from '@angular/core';
// import { Observable } from 'rxjs';
// import { environment } from 'src/environments/environment';
// import { MsPrefixEnum } from '../enum/ms-prefix.enum';
// import { ServiceResponseInterface } from '../interfaces/response.interface';

// @Injectable({
//   providedIn: 'root',
// })
// export class FileService {
//   // [AI-GENERATED | skill: mf-refactor-skill | Patrón 18 | model: gemini-2-5-pro]
//   private readonly http = inject(HttpClient);
//   private readonly urlApi = environment.apiUrl!;
//   private readonly prefixApi = MsPrefixEnum.FILE;

//   uploadFileBase64(file: File): Observable<string> {
//     return new Observable<string>((observer) => {
//       const reader = new FileReader();
//       reader.readAsDataURL(file);
//       reader.onload = () => {
//         observer.next(reader.result!.toString());
//         observer.complete();
//       };
//       reader.onerror = (error) => {
//         observer.error(error);
//       };
//     });
//   }

//   uploadFile(base64File: string): Observable<ServiceResponseInterface<string>> {
//     const credentials = btoa(
//       `${environment.fileUser}:${environment.filePassword}`,
//     );

//     const headers = new HttpHeaders({
//       'Content-Type': 'application/json',
//       Authorization: `Basic ${credentials}`,
//     });

//     return this.http.post<ServiceResponseInterface<string>>(
//       `${this.urlApi}/${this.prefixApi}/upload`,
//       { base64File },
//       { headers },
//     );
//   }

//   validateImageFile(file: File): boolean {
//     const allowedMimeTypes = ['image/png', 'image/jpeg'];
//     const allowedExtensions = ['png', 'jpg', 'jpeg'];

//     if (!allowedMimeTypes.includes(file.type)) {
//       return false;
//     }

//     const extension = file.name.split('.').pop();

//     if (!extension) {
//       return false;
//     }
//     if (!allowedExtensions.includes(extension)) {
//       return false;
//     }

//     return true;
//   }

//   validateFilePdf(file: File): boolean {
//     const allowedMimeType = 'application/pdf';
//     const allowedExtension = 'pdf';

//     if (file.type !== allowedMimeType) {
//       return false;
//     }

//     const extension = file.name.split('.').pop();

//     if (!extension) {
//       return false;
//     }

//     if (extension.toLowerCase() !== allowedExtension) {
//       return false;
//     }

//     return true;
//   }
// }
