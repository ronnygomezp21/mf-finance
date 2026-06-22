import { Component, input, OnInit, output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { RETENTION_CATALOG, RetentionCodeI } from '../../constants/supplier-catalogs';

/** PubSub viene como singleton compartido vía Module Federation desde el shell */
declare const PubSub: { publish(channel: string, data?: any): boolean };

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
export class RetentionsFormComponent implements OnInit {
  isSubmitting = input<boolean>(false);
  /** [BUG-015 FIX] Retenciones pre-cargadas desde el padre (edición) */
  initialRetentions = input<AddedRetentionI[]>([]);

  submit = output<AddedRetentionI[]>();

  readonly retentionCatalog = RETENTION_CATALOG;

  selectedRetentionType: string | null = null;
  selectedRetentionEntity = '';
  availableCodes: RetentionCodeI[] = [];
  selectedRetentionCode: string | null = null;
  addedRetentions: AddedRetentionI[] = [];

  /** FormControls locales para vincular con mf-core-shared-select */
  readonly retentionTypeControl = new FormControl<string | null>(null);
  readonly retentionCodeControl = new FormControl<string | null>({ value: null, disabled: true });

  /** [BUG-015 FIX] Carga retenciones iniciales pasadas por el padre (edición) */
  ngOnInit(): void {
    const initial = this.initialRetentions();
    if (initial.length > 0) {
      this.addedRetentions = [...initial];
    }
  }

  onRetentionTypeSelected(value: any): void {
    this.selectedRetentionType = value;
    this.onRetentionTypeChange();
  }

  onRetentionTypeChange(): void {
    const found = this.retentionCatalog.find(r => r.type === this.selectedRetentionType);
    this.selectedRetentionEntity = found?.entity || '—';
    this.availableCodes = found?.codes || [];
    this.selectedRetentionCode = null;
    this.retentionCodeControl.setValue(null);

    if (this.selectedRetentionType) {
      this.retentionCodeControl.enable();
    } else {
      this.retentionCodeControl.disable();
    }
  }

  onRetentionCodeSelected(value: any): void {
    this.selectedRetentionCode = value;
  }

  addRetention(): void {
    if (!this.selectedRetentionType || !this.selectedRetentionCode) return;

    const type = this.retentionCatalog.find(r => r.type === this.selectedRetentionType);
    const code = type?.codes.find(c => c.code === this.selectedRetentionCode);
    if (!type || !code) return;

    if (this.addedRetentions.some(r => r.code === code.code)) {
      PubSub.publish('error', 'Esa retención ya está asignada.');
      return;
    }

    this.addedRetentions.push({
      entity: type.entity,
      type: type.type,
      code: code.code,
      description: code.description,
      percentage: code.percentage,
      effectiveDate: new Date().toISOString().split('T')[0], // YYYY-MM-DD para PostgreSQL
      status: 'Activo',
    });

    this.selectedRetentionType = null;
    this.selectedRetentionEntity = '—';
    this.availableCodes = [];
    this.selectedRetentionCode = null;
    this.retentionTypeControl.setValue(null);
    this.retentionCodeControl.setValue(null);
    this.retentionCodeControl.disable();
  }

  removeRetention(index: number): void {
    this.addedRetentions.splice(index, 1);
  }

  onSubmit(): void {
    this.submit.emit(this.addedRetentions);
  }
}
