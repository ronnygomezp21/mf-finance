import { Component, input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'mf-finance-supplier-quota-form',
  standalone: false,
  templateUrl: './quota-form.component.html',
  styleUrls: ['./quota-form.component.scss'],
})
export class QuotaFormComponent {
  form = input.required<FormGroup>();
  isFrequencyOccasional = input<boolean>(false);
  isFrequencyPermanent = input<boolean>(false);

  /** [BUG-016 FIX] Datos de solo lectura desde el API (edición) */
  totalBilled  = input<number>(0);
  quotaBalance = input<number>(0);

  get quotaAssignedValue(): number {
    return this.form().get('quotaAssigned')?.value || 0;
  }

  /** Porcentaje del cupo usado — para la barra de progreso */
  get usedPercentage(): number {
    const assigned = this.quotaAssignedValue;
    if (assigned <= 0) return 0;
    return Math.min(100, (this.totalBilled() / assigned) * 100);
  }
}
