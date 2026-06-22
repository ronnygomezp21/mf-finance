// [AI-GENERATED | skill: mf-feature-skill | spec: tasks/mf-finance/feat-007-mf-listado-auditoria-proveedor.md
//  | ticket: #007 | model: antigravity]

import { Component, inject, OnInit } from '@angular/core';
import { SupplierAuditService } from '../../services/supplier-audit.service';
import { TableColumnDataI } from 'src/app/shared/interfaces/general.interface';
import { SupplierAuditI } from '../../interfaces/supplier-audit.interface';

@Component({
  selector: 'mf-finance-audit-list',
  standalone: false,
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent implements OnInit {
  public page = 1;
  public total = 0;
  public limit = 10;
  public searchTerm = '';

  private readonly auditService = inject(SupplierAuditService);

  public tableColumns: TableColumnDataI[] = [
    { name: '#', dataKey: 'id', type: 'index' },
    { name: 'Razón Social', dataKey: 'supplierName', type: 'string' },
    { name: 'Campo Modificado', dataKey: 'fieldChanged', type: 'string' },
    { name: 'Valor Anterior', dataKey: 'previousValue' },
    { name: 'Valor Nuevo', dataKey: 'newValue' },
    { name: 'Motivo', dataKey: 'reason', type: 'string' },
    { name: 'Modificado Por', dataKey: 'modifiedBy', type: 'string' },
    {
      name: 'Fecha',
      dataKey: 'modifiedAt',
      type: 'tooltip',
      config: {
        tooltip: {
          placement: 'top',
        },
      },
    },
  ];

  public auditRecords: SupplierAuditI[] = [];

  ngOnInit() {
    this.get(1);
  }

  get(page?: number) {
    if (page) this.page = page;

    const search = this.searchTerm || undefined;

    this.auditService.getAuditRecords(this.page, this.limit, search).subscribe({
      next: (res) => {
        this.total = res.data.total;
        this.page = res.data.page;
        this.auditRecords = res.data.records.map((r) => ({
          ...r,
          modifiedBy: typeof r.modifiedBy === 'object' ? r.modifiedBy.email : r.modifiedBy,
          modifiedAt: new Date(r.modifiedAt).toLocaleString('es-EC', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            second: '2-digit',
            timeZone: 'America/Guayaquil',
          }),
        }));
      },
      error: (err) => console.error('Error fetching audit records', err)
    });
  }

  onLimitTermChange(limitValue: number) {
    this.limit = limitValue;
    this.get(1);
  }

  onSearchTermChange(event: string) {
    this.searchTerm = event;
    this.get(1);
  }
}
