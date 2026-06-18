import { Component, input, output } from '@angular/core';
import { RETENTION_CATALOG, RetentionCodeI } from '../../constants/supplier-catalogs';

/** Retención ya agregada a la tabla */
export interface AddedRetentionI {
  entity: string;
  type: string;
  code: string;
  description: string;
  percentage: number;
  effectiveDate: string;
  status: string;
}

@Component({
  selector: 'mf-finance-supplier-retentions-form',
  standalone: false,
  templateUrl: './retentions-form.component.html',
  styleUrls: ['./retentions-form.component.scss'],
})
export class RetentionsFormComponent {
  isSubmitting = input<boolean>(false);

  submit = output<AddedRetentionI[]>();

  readonly retentionCatalog = RETENTION_CATALOG;

  selectedRetentionType: string | null = null;
  selectedRetentionEntity = '';
  availableCodes: RetentionCodeI[] = [];
  selectedRetentionCode: string | null = null;
  addedRetentions: AddedRetentionI[] = [];

  onRetentionTypeChange(): void {
    const found = this.retentionCatalog.find(r => r.type === this.selectedRetentionType);
    this.selectedRetentionEntity = found?.entity || '—';
    this.availableCodes = found?.codes || [];
    this.selectedRetentionCode = null;
  }

  addRetention(): void {
    if (!this.selectedRetentionType || !this.selectedRetentionCode) return;

    const type = this.retentionCatalog.find(r => r.type === this.selectedRetentionType);
    const code = type?.codes.find(c => c.code === this.selectedRetentionCode);
    if (!type || !code) return;

    if (this.addedRetentions.some(r => r.code === code.code)) return;

    this.addedRetentions.push({
      entity: type.entity,
      type: type.type,
      code: code.code,
      description: code.description,
      percentage: code.percentage,
      effectiveDate: new Date().toLocaleDateString('es-EC'),
      status: 'Activo',
    });

    this.selectedRetentionType = null;
    this.selectedRetentionEntity = '—';
    this.availableCodes = [];
    this.selectedRetentionCode = null;
  }

  removeRetention(index: number): void {
    this.addedRetentions.splice(index, 1);
  }

  onSubmit(): void {
    this.submit.emit(this.addedRetentions);
  }
}
