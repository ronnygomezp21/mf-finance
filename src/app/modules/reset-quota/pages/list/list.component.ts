// [AI-GENERATED | skill: mf-feature-skill | spec: tasks/mf-finance/feat-011-mf-listado-proveedores-ocasionales-reinicio.md
//  | ticket: #011 | model: antigravity]

import { Component, inject, OnInit } from '@angular/core';
import { ResetQuotaService } from '../../services/reset-quota.service';
import { TableColumnDataI } from 'src/app/shared/interfaces/general.interface';
import { SupplierI } from 'src/app/modules/supplier/services/supplier.service';

@Component({
  selector: 'mf-finance-reset-quota-list',
  standalone: false,
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent implements OnInit {
  public page = 1;
  public total = 0;
  public limit = 10;


  public tableColumns: TableColumnDataI[] = [
    { name: '#', dataKey: 'id', type: 'index' },
    { name: 'Proveedor', dataKey: 'commercialName' },
    { name: 'Cupo Asignado', dataKey: 'quotaAssigned' },
    { name: 'Total Facturado', dataKey: 'totalBilled' },
    { name: 'Saldo', dataKey: 'quotaBalance' },
  ];

  public searchTerm = '';
  public suppliers: SupplierI[] = [];

  // Estado del reinicio
  public showConfirmDialog = false;
  public showYearDialog = false;
  public resetYear = new Date().getFullYear() - 1;
  public isResetting = false;
  public resetMessage = '';
  public resetMessageType: 'success' | 'error' | '' = '';

  private readonly resetQuotaService = inject(ResetQuotaService);

  ngOnInit() {
    this.get(1);
  }

  get(page?: number) {
    if (page) this.page = page;

    const filters: { search?: string } = {};
    if (this.searchTerm) {
      filters.search = this.searchTerm;
    }

    this.resetQuotaService.getOccasionalSuppliers(this.page, this.limit, filters).subscribe({
      next: (res) => {
        this.total = res.total;
        this.page = res.page;
        this.suppliers = res.records;
      },
      error: (err) => console.error('Error fetching occasional suppliers', err)
    });
  }

  onSearchTermChange(event: any) {
    this.searchTerm = event;
    this.get(1);
  }

  onLimitTermChange(limitValue: number) {
    this.limit = limitValue;
    this.get(1);
  }

  // ── Flujo de reinicio de cupos ──

  openResetDialog() {
    this.resetMessage = '';
    this.resetMessageType = '';
    this.showConfirmDialog = true;
  }

  confirmReset() {
    this.showConfirmDialog = false;
    this.showYearDialog = true;
  }

  cancelReset() {
    this.showConfirmDialog = false;
    this.showYearDialog = false;
  }

  executeReset() {
    this.isResetting = true;
    this.showYearDialog = false;

    this.resetQuotaService.resetQuota(this.resetYear).subscribe({
      next: (res) => {
        this.isResetting = false;
        this.resetMessage = `Reinicio exitoso. ${res.affected} proveedores actualizados.`;
        this.resetMessageType = 'success';
        this.get(1); // Recargar tabla
      },
      error: (err) => {
        this.isResetting = false;
        if (err.status === 409) {
          this.resetMessage = `El reinicio de cupos ya fue ejecutado para el año ${this.resetYear}.`;
        } else {
          this.resetMessage = 'Error al ejecutar el reinicio de cupos.';
        }
        this.resetMessageType = 'error';
      }
    });
  }

  iconAction(_event: any) { }
  onChangeStatus(_event: any) { }
  openFilterModal(_event: any) { }
  openAddModalForm(_event: any) { }

  private formatCurrency(value: number): string {
    return `$${Number(value || 0).toLocaleString('es-EC', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
}
