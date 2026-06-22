// [AI-GENERATED | skill: mf-feature-skill | spec: tasks/mf-finance/feat-001-mf-alta-proveedor.md
//  | ticket: #001 | model: claude-sonnet-4-6]
// [AI-UPDATED | skill: mf-feature-skill | spec: tasks/mf-finance/feat-012-mf-edicion-proveedor.md
//  | ticket: #012 | model: claude-opus-4-6]

import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { PaginationResponseInterface } from 'src/app/shared/interfaces/response.interface';
import { environment } from 'src/environments/environment';
import { MsPrefixEnum } from 'src/app/shared/enum/ms-prefix.enum';
import { CreateSupplierPayloadI } from '../interfaces/create-supplier.interface';
import { UpdateSupplierPayloadI } from '../interfaces/update-supplier.interface';
import { SupplierDetailI } from '../interfaces/supplier-detail.interface';

/** Catálogo genérico (jsonb del backend) */
export interface CatalogValueI {
  id: number;
  name: string;
}

/** Proveedor mapeado desde SupplierListVm del backend */
export interface SupplierI {
  id: string;
  supplierCode: string;
  name: string;
  commercialName: string | null;
  identification: string;
  identificationType: CatalogValueI;
  contributorType: CatalogValueI;
  frequency: CatalogValueI;
  status: string;
  residency: CatalogValueI;
  classification: CatalogValueI;
  createdAt: string;
  createdBy: string;
  quotaAssigned: number;   // [FEAT #010]
  totalBilled: number;     // [FEAT #010]
  quotaBalance: number;    // [FEAT #010]
}

@Injectable({
  providedIn: 'root'
})
export class SupplierService {
  private readonly http = inject(HttpClient);
  private readonly urlApi = environment.apiUrl;
  private readonly prefixApi = MsPrefixEnum.FINANCE;

  getSuppliers(
    page: number,
    limit: number,
    filters?: { search?: string; status?: string }
  ): Observable<PaginationResponseInterface<SupplierI[]>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (filters) {
      if (filters.search) params = params.set('search', filters.search);
      if (filters.status) params = params.set('status', filters.status);
    }

    return this.http.get<any>(`${this.urlApi}/${this.prefixApi}/supplier`, { params }).pipe(
      map(res => res.data as PaginationResponseInterface<SupplierI[]>)
    );
  }

  createSupplier(payload: CreateSupplierPayloadI): Observable<any> {
    return this.http.post<any>(
      `${this.urlApi}/${this.prefixApi}/supplier`,
      payload
    );
  }

  /** [FEAT #012] Retorna la ficha completa del proveedor para pre-llenar el formulario de edición */
  getSupplierById(id: string): Observable<SupplierDetailI> {
    return this.http.get<any>(`${this.urlApi}/${this.prefixApi}/supplier/${id}`).pipe(
      map(res => res.data as SupplierDetailI)
    );
  }

  /** [FEAT #012] Actualiza la ficha completa del proveedor */
  updateSupplier(id: string, payload: UpdateSupplierPayloadI): Observable<any> {
    return this.http.put<any>(
      `${this.urlApi}/${this.prefixApi}/supplier/${id}`,
      payload
    );
  }
}
