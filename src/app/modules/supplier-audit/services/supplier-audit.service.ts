// [AI-GENERATED | skill: mf-feature-skill | spec: tasks/mf-finance/feat-007-mf-listado-auditoria-proveedor.md
//  | ticket: #007 | model: antigravity]

import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  PaginationResponseInterface,
  ServiceResponseInterface,
} from 'src/app/shared/interfaces/response.interface';
import { environment } from 'src/environments/environment';
import { MsPrefixEnum } from 'src/app/shared/enum/ms-prefix.enum';
import { SupplierAuditI } from '../interfaces/supplier-audit.interface';

@Injectable({
  providedIn: 'root'
})
export class SupplierAuditService {
  private readonly http = inject(HttpClient);
  private readonly urlApi = environment.apiUrl;
  private readonly prefixApi = MsPrefixEnum.FINANCE;

  getAuditRecords(
    page: number,
    limit: number,
    search?: string
  ): Observable<
    ServiceResponseInterface<PaginationResponseInterface<SupplierAuditI[]>>
  > {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (search) {
      params = params.set('search', search);
    }

    return this.http.get<
      ServiceResponseInterface<PaginationResponseInterface<SupplierAuditI[]>>
    >(`${this.urlApi}/${this.prefixApi}/supplier/audit`, { params });
  }
}
