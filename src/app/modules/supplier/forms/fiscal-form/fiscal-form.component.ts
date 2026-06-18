import { Component, input, OnInit, effect } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import {
  COUNTRIES, PROVINCES, CITIES, ACTIVITY_TYPES, TAXPAYER_CATEGORIES,
  SERVICE_TYPES, GOOD_TYPES, YES_NO_OPTIONS, PHONE_TYPES,
  RESIDENT_PAYMENT_TYPES, FISCAL_REGIME_TYPES, RETENTION_CATALOG,
} from '../../constants/supplier-catalogs';
import { CatalogValueI } from '../../services/supplier.service';

@Component({
  selector: 'mf-finance-supplier-fiscal-form',
  standalone: false,
  templateUrl: './fiscal-form.component.html',
  styleUrls: ['./fiscal-form.component.scss'],
})
export class FiscalFormComponent implements OnInit {
  form = input.required<FormGroup>();
  isLegalEntity = input<boolean>(false);
  isForeignResidency = input<boolean>(false);

  constructor() {
    // React to isForeignResidency changes (signal input)
    effect(() => {
      const isForeign = this.isForeignResidency();
      this.updateForeignValidators(isForeign);
    });

    // React to isLegalEntity changes (signal input)
    effect(() => {
      const isLegal = this.isLegalEntity();
      const ctrl = this.form().get('accountingRequired');
      if (isLegal) {
        ctrl?.setValidators(Validators.required);
      } else {
        ctrl?.clearValidators();
        ctrl?.setValue(null);
      }
      ctrl?.updateValueAndValidity();
    });
  }

  readonly countries = COUNTRIES;
  readonly provinces = PROVINCES;
  readonly cities = CITIES;
  readonly activityTypes = ACTIVITY_TYPES;
  readonly taxpayerCategories = TAXPAYER_CATEGORIES;
  readonly yesNoOptions = YES_NO_OPTIONS;
  readonly phoneTypes = PHONE_TYPES;
  readonly residentPaymentTypes = RESIDENT_PAYMENT_TYPES;
  readonly fiscalRegimeTypes = FISCAL_REGIME_TYPES;

  /** Convert string[] to CatalogValueI[] for mf-core-shared-select */
  readonly serviceTypeOptions: CatalogValueI[] = SERVICE_TYPES.map((s, i) => ({ id: i + 1, name: s }));
  readonly goodTypeOptions: CatalogValueI[] = GOOD_TYPES.map((g, i) => ({ id: i + 1, name: g }));

  /** Pre-computed catalog IDs for bindValue="id" comparisons */
  private readonly goodId = ACTIVITY_TYPES.find(a => a.name === 'Bien')?.id;
  private readonly serviceId = ACTIVITY_TYPES.find(a => a.name === 'Servicio')?.id;
  private readonly goodAndServiceId = ACTIVITY_TYPES.find(a => a.name === 'Bien y Servicio')?.id;
  private readonly mobileId = PHONE_TYPES.find(p => p.name === 'Celular')?.id;
  private readonly landlineId = PHONE_TYPES.find(p => p.name === 'Convencional')?.id;

  /** Custom validator: requires array to have at least 1 element */
  private readonly arrayRequired = (control: { value: any }) =>
    Array.isArray(control.value) && control.value.length > 0 ? null : { required: true };

  phonePlaceholder = 'Select type';

  ngOnInit(): void {
    const f = this.form();

    f.get('phoneType')?.valueChanges.subscribe(val => {
      const phoneCtrl = f.get('phoneNumber');
      phoneCtrl?.clearValidators();

      if (val === this.mobileId) {
        phoneCtrl?.setValidators([
          Validators.required,
          Validators.pattern('^[0-9]+$'),
          Validators.minLength(10),
          Validators.maxLength(15)
        ]);
        this.phonePlaceholder = '10 a 15 dígitos';
      } else if (val === this.landlineId) {
        phoneCtrl?.setValidators([
          Validators.required,
          Validators.pattern('^[0-9]+$'),
          Validators.minLength(7),
          Validators.maxLength(12)
        ]);
        this.phonePlaceholder = '7 a 12 dígitos';
      } else {
        phoneCtrl?.setValue('');
        this.phonePlaceholder = 'Selecciona el tipo';
      }
      
      phoneCtrl?.updateValueAndValidity();
    });

    f.get('activityType')?.valueChanges.subscribe(val => {
      const sCtrl = f.get('serviceType');
      const gCtrl = f.get('goodType');
      sCtrl?.clearValidators();
      gCtrl?.clearValidators();
      sCtrl?.setValue([]);
      gCtrl?.setValue([]);
      if (val === this.serviceId || val === this.goodAndServiceId) {
        sCtrl?.setValidators(this.arrayRequired);
      }
      if (val === this.goodId || val === this.goodAndServiceId) {
        gCtrl?.setValidators(this.arrayRequired);
      }
      sCtrl?.updateValueAndValidity();
      gCtrl?.updateValueAndValidity();
    });
  }

  private updateForeignValidators(isForeign: boolean): void {
    const f = this.form();
    const foreignFields = ['residentPaymentType', 'fiscalRegimeType', 'applyDoubleTaxation', 'applyLegalRegulations'];
    const nationalOnlyRequired = [f.get('taxpayerCategory'), f.get('largeTaxpayer')];
    const nationalOnlyOptional = [f.get('nonProfit'), f.get('qualifiedArtisan')];

    if (isForeign) {
      foreignFields.forEach(field => f.get(field)?.setValidators(Validators.required));
      // Hide national-only fields
      [...nationalOnlyRequired, ...nationalOnlyOptional].forEach(ctrl => {
        ctrl?.clearValidators();
        ctrl?.setValue(null);
        ctrl?.updateValueAndValidity();
      });
    } else {
      foreignFields.forEach(field => {
        f.get(field)?.clearValidators();
        f.get(field)?.setValue(null);
      });
      // Required for nationals
      nationalOnlyRequired.forEach(ctrl => {
        ctrl?.setValidators(Validators.required);
        ctrl?.updateValueAndValidity();
      });
      // Optional — just update validity
      nationalOnlyOptional.forEach(ctrl => ctrl?.updateValueAndValidity());
    }
    foreignFields.forEach(field => f.get(field)?.updateValueAndValidity());
  }

  get showServiceType(): boolean {
    const val = this.form().get('activityType')?.value;
    return val === this.serviceId || val === this.goodAndServiceId;
  }

  get showGoodType(): boolean {
    const val = this.form().get('activityType')?.value;
    return val === this.goodId || val === this.goodAndServiceId;
  }

  // ── Checkbox toggle methods for service/good types ──

  isServiceChecked(name: string): boolean {
    const current: string[] = this.form().get('serviceType')?.value || [];
    return current.includes(name);
  }

  toggleServiceType(name: string, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    const ctrl = this.form().get('serviceType');
    const current: string[] = ctrl?.value || [];
    ctrl?.setValue(checked ? [...current, name] : current.filter(v => v !== name));
    ctrl?.markAsTouched();
  }

  isGoodChecked(name: string): boolean {
    const current: string[] = this.form().get('goodType')?.value || [];
    return current.includes(name);
  }

  toggleGoodType(name: string, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    const ctrl = this.form().get('goodType');
    const current: string[] = ctrl?.value || [];
    ctrl?.setValue(checked ? [...current, name] : current.filter(v => v !== name));
    ctrl?.markAsTouched();
  }

  // ── Suggested retentions based on activity type ──

  get suggestedRetentions(): { code: string; type: string; label: string; percentage: number }[] {
    const activityVal = this.form().get('activityType')?.value;
    const suggestions: { code: string; type: string; label: string; percentage: number }[] = [];

    if (activityVal === this.serviceId || activityVal === this.goodAndServiceId) {
      const rfType = RETENTION_CATALOG.find(r => r.type === 'Ret. Fuente');
      const rf2 = rfType?.codes.find(c => c.code === 'RF2');
      if (rf2) suggestions.push({ code: rf2.code, type: 'Ret. Fuente', label: 'servicios', percentage: rf2.percentage });

      const ivaType = RETENTION_CATALOG.find(r => r.type === 'Ret. IVA');
      const iva70 = ivaType?.codes.find(c => c.code === 'IVA70');
      if (iva70) suggestions.push({ code: iva70.code, type: 'Ret. IVA', label: 'servicios', percentage: iva70.percentage });
    }
    if (activityVal === this.goodId || activityVal === this.goodAndServiceId) {
      const ivaType = RETENTION_CATALOG.find(r => r.type === 'Ret. IVA');
      const iva30 = ivaType?.codes.find(c => c.code === 'IVA30');
      if (iva30) suggestions.push({ code: iva30.code, type: 'Ret. IVA', label: 'bienes', percentage: iva30.percentage });
    }

    return suggestions;
  }
}
