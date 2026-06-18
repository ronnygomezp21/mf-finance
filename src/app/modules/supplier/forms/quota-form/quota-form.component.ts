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


  get quotaAssignedValue(): number {
    return this.form().get('quotaAssigned')?.value || 0;
  }
}
