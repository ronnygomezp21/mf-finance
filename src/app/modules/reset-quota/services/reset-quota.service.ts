// [AI-GENERATED | skill: mf-feature-skill | spec: tasks/mf-finance/feat-011-mf-listado-proveedores-ocasionales-reinicio.md
//  | ticket: #011 | model: antigravity]

import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { PaginationResponseInterface } from 'src/app/shared/interfaces/response.interface';
import { environment } from 'src/environments/environment';
import { MsPrefixEnum } from 'src/app/shared/enum/ms-prefix.enum';
import { SupplierI } from '../../supplier/services/supplier.service';

export interface ResetQuotaResponseI {
  affected: number;
}

@Injectable({
  providedIn: 'root'
})
export class ResetQuotaService {
  private readonly http = inject(HttpClient);
  private readonly urlApi = environment.apiUrl;
  private readonly prefixApi = MsPrefixEnum.FINANCE;

  /**
   * Obtener proveedores Ocasionales.
   * El parámetro frequency=Ocasional se envía siempre por default.
   */
  getOccasionalSuppliers(
    page: number,
    limit: number,
    filters?: { search?: string }
  ): Observable<PaginationResponseInterface<SupplierI[]>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('frequency', 'Ocasional');

    if (filters?.search) {
      params = params.set('search', filters.search);
    }

    return this.http.get<any>(`${this.urlApi}/${this.prefixApi}/supplier`, { params }).pipe(
      map(res => res.data as PaginationResponseInterface<SupplierI[]>)
    );
  }

  /**
   * Ejecutar reinicio masivo de cupos para el año indicado.
   */
  resetQuota(year: number): Observable<ResetQuotaResponseI> {
    return this.http.post<any>(
      `${this.urlApi}/${this.prefixApi}/supplier/reset-quota`,
      { year }
    ).pipe(
      map(res => res.data as ResetQuotaResponseI)
    );
  }
}
