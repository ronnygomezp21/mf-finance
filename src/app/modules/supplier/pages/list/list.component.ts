import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SupplierService } from '../../services/supplier.service';
import { TableColumnDataI } from 'src/app/shared/interfaces/general.interface';

@Component({
  selector: 'mf-finance-list',
  standalone: false,
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent implements OnInit {
  public page = 1;
  public total = 0;
  public limit = 10;
  public status: boolean | null = true;
  public validAction: boolean = true;

  private readonly router = inject(Router);

  public tableColumns: TableColumnDataI[] = [
    { name: '#', dataKey: 'id', type: 'index' },
    { name: 'Id Interno', dataKey: 'internalId' },
    { name: 'Proveedor', dataKey: 'supplier' },
    { name: 'Tipo de identificación', dataKey: 'identificationType' },
    { name: 'Identificación', dataKey: 'identification' },
    { name: 'Contribuyente', dataKey: 'taxpayer' },
    { name: 'Clasificación', dataKey: 'classification' },
    { name: 'Residencia', dataKey: 'residence' },
    { name: 'Estado', dataKey: 'status', type: 'status' },
  ];

  public searchTerm: string = '';

  private readonly supplierService = inject(SupplierService);

  public suppliers: any[] = [];

  ngOnInit() {
    this.get(1);
  }

  onChangeStatus(event: any) {
    this.status = event;
    this.get(1);
  }

  openAddModalForm(event: any) {
    console.log('jdjdjd');
    this.router.navigateByUrl("/supplier/record");
  }

  iconAction(event: any) { }

  onLimitTermChange(limitValue: number) {
    this.limit = limitValue;
    this.get(1);
  }

  get(page?: number) {
    if (page) this.page = page;

    const filters: { search?: string; status?: string } = {};

    if (this.searchTerm) {
      filters.search = this.searchTerm;
    }
    if (this.status !== null) {
      filters.status = this.status ? 'ACTIVO' : 'INACTIVO';
    }

    this.supplierService.getSuppliers(this.page, this.limit, filters).subscribe({
      next: (res) => {
        this.total = res.total;
        this.suppliers = res.records.map((r) => ({
          id: r.id,
          internalId: r.supplierCode || 'N/A',
          supplier: r.name,
          identificationType: r.identificationType?.name || 'N/A',
          identification: r.identification,
          taxpayer: r.contributorType?.name || 'N/A',
          classification: r.classification?.name || 'N/A',
          residence: r.residency?.name || 'N/A',
          status: r.status === 'ACTIVO'
        }));
      },
      error: (err) => console.error('Error fetching suppliers', err)
    });
  }

  onSearchTermChange(event: any) {
    this.searchTerm = event;
    this.get(1);
  }

  openFilterModal(event: any) { }
}
