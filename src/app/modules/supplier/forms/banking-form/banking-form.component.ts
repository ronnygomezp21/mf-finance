import { Component, effect, inject, input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  PAYMENT_METHODS, ACCOUNT_TYPES, BANK_NAMES, CURRENCIES, COUNTRIES,
  YES_NO, PAYMENT_ID_TYPES, SHIPPING_COSTS, RELATIONSHIP_TYPES,
} from '../../constants/supplier-catalogs';

@Component({
  selector: 'mf-finance-supplier-banking-form',
  standalone: false,
  templateUrl: './banking-form.component.html',
  styleUrls: ['./banking-form.component.scss'],
})
export class BankingFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);

  form = input.required<FormGroup>();
  /** Razón social del proveedor (viene del generalForm) */
  supplierName = input<string>('');
  /** Tipo de residencia extranjero */
  isForeignResidency = input<boolean>(false);
  /** Identificación del proveedor (default para paymentId) */
  supplierIdentification = input<string>('');
  /** Tipo de identificación del proveedor (default para paymentIdType) */
  supplierIdentificationType = input<number | null>(null);

  // [BUGFIX #019 | skill: ms-bugfix-skill] — Reaccionar a cambios de residencia
  constructor() {
    effect(() => {
      const isForeign = this.isForeignResidency();
      const paymentVal = this.form().get('paymentMethod')?.value;
      this.updateBankValidators(paymentVal === this.transferenciaId);
    });
  }

  get holderMismatch(): boolean {
    const holder = (this.form().get('accountHolder')?.value || '').trim().toLowerCase();
    const name = (this.supplierName() || '').trim().toLowerCase();
    return holder.length > 0 && name.length > 0 && holder !== name;
  }

  /** SI = id 1 in YES_NO catalog */
  private readonly yesId = YES_NO.find(o => o.name === 'SI')?.id ?? 1;

  get isThirdPartyPayment(): boolean {
    return this.form().get('thirdPartyPayment')?.value === this.yesId;
  }

  get isExternalPayment(): boolean {
    return this.form().get('externalPayment')?.value === this.yesId;
  }

  readonly paymentMethods = PAYMENT_METHODS;
  readonly accountTypes = ACCOUNT_TYPES;
  readonly bankNames = BANK_NAMES;
  readonly currencies = CURRENCIES;
  readonly countries = COUNTRIES;
  readonly yesNoOptions = YES_NO;
  readonly paymentIdTypes = PAYMENT_ID_TYPES;
  readonly shippingCosts = SHIPPING_COSTS;
  readonly relationshipTypes = RELATIONSHIP_TYPES;

  /** Default values for selects */
  readonly defaultCountryId = COUNTRIES.find(c => c.name === 'Ecuador')?.id ?? 1;
  readonly defaultCurrencyId = CURRENCIES.find(c => c.name === 'USD')?.id ?? 1;
  readonly defaultNoId = YES_NO.find(o => o.name === 'NO')?.id ?? 2;

  /** ID of 'Transferencia' in the PAYMENT_METHODS catalog */
  private readonly transferenciaId = PAYMENT_METHODS.find(p => p.name === 'Transferencia')?.id;

  private defaultsApplied = false;

  ngOnInit(): void {
    const f = this.form();

    // Set defaults from general form data
    this.applyDefaults(f);

    f.get('paymentMethod')?.valueChanges.subscribe((val: number | null) => {
      this.updateBankValidators(val === this.transferenciaId);
    });

    // Dynamic validators for third party fields
    f.get('thirdPartyPayment')?.valueChanges.subscribe((val: number | null) => {
      this.updateThirdPartyValidators(val === this.yesId);
    });

    // Dynamic validators for external payment fields
    f.get('externalPayment')?.valueChanges.subscribe((val: number | null) => {
      this.updateExternalPaymentValidators(val === this.yesId);
    });

    // Dynamic validator for intermediary bank SWIFT
    f.get('epHasIntermediaryBank')?.valueChanges.subscribe((val: number | null) => {
      this.updateIntermediaryValidator(val === this.yesId);
    });
  }

  /** Aplica valores por defecto de identificación del proveedor */
  private applyDefaults(f: FormGroup): void {
    if (this.defaultsApplied) return;
    this.defaultsApplied = true;

    // paymentId = identification del proveedor (si no tiene valor aún)
    const currentPaymentId = f.get('paymentId')?.value;
    if (!currentPaymentId && this.supplierIdentification()) {
      f.get('paymentId')?.setValue(this.supplierIdentification());
    }

    // paymentIdType = tipo de identificación del proveedor
    const currentIdType = f.get('paymentIdType')?.value;
    if (!currentIdType && this.supplierIdentificationType()) {
      f.get('paymentIdType')?.setValue(this.supplierIdentificationType());
    }
  }

  /** Actualiza validadores de campos bancarios según método de pago y residencia */
  // [BUGFIX #019 | skill: ms-bugfix-skill] — Ocultar campos bancarios para extranjeros
  private updateBankValidators(isTransfer: boolean): void {
    const f = this.form();
    const isForeign = this.isForeignResidency();

    // Campos que SOLO aplican a proveedores nacionales con Transferencia
    const nationalBankFields = [
      'bankCountry', 'currency', 'bankIdClassifier',
      'bankName', 'bankNameForeign',
      'accountType', 'accountHolder',
      'paymentIdType', 'paymentId',
    ];

    if (isForeign) {
      // Extranjero: limpiar validadores y valores de campos nacionales
      nationalBankFields.forEach(field => {
        f.get(field)?.clearValidators();
        f.get(field)?.setValue(null, { emitEvent: false });
        f.get(field)?.updateValueAndValidity();
      });
    } else {
      // Nacional: activar/desactivar según Transferencia
      const transferFields = ['bankCountry', 'currency', 'bankIdClassifier',
        'accountType', 'accountHolder'];

      if (isTransfer) {
        transferFields.forEach(field => f.get(field)?.setValidators(Validators.required));
        f.get('bankName')?.setValidators(Validators.required);
        f.get('bankNameForeign')?.clearValidators();

        // Asignar defaults si están vacíos: Ecuador, USD, 022
        if (!f.get('bankCountry')?.value) {
          f.get('bankCountry')?.setValue(this.defaultCountryId, { emitEvent: false });
        }
        if (!f.get('currency')?.value) {
          f.get('currency')?.setValue(this.defaultCurrencyId, { emitEvent: false });
        }
        if (!f.get('bankIdClassifier')?.value) {
          f.get('bankIdClassifier')?.setValue('022', { emitEvent: false });
        }
      } else {
        [...transferFields, 'bankName', 'bankNameForeign'].forEach(field =>
          f.get(field)?.clearValidators()
        );
      }

      [...transferFields, 'bankName', 'bankNameForeign'].forEach(field =>
        f.get(field)?.updateValueAndValidity()
      );
    }

    // accountNumber — requerido en Transferencia sin importar residencia
    if (isTransfer) {
      f.get('accountNumber')?.setValidators(Validators.required);
    } else {
      f.get('accountNumber')?.clearValidators();
    }
    f.get('accountNumber')?.updateValueAndValidity();
  }

  /** Actualiza validadores de pago a tercero */
  private updateThirdPartyValidators(isActive: boolean): void {
    const f = this.form();
    const tpFields = ['tpBeneficiary', 'tpPaymentId', 'tpBankName', 'tpAccountType', 'tpAccountNumber'];

    if (isActive) {
      tpFields.forEach(field => f.get(field)?.setValidators(Validators.required));
    } else {
      tpFields.forEach(field => f.get(field)?.clearValidators());
    }
    tpFields.forEach(field => f.get(field)?.updateValueAndValidity());
  }

  /** Actualiza validadores de pago al exterior */
  private updateExternalPaymentValidators(isActive: boolean): void {
    const f = this.form();
    const epFields = ['epSwiftCode', 'epShippingCosts', 'epReference', 'epRelationship'];

    if (isActive) {
      epFields.forEach(field => f.get(field)?.setValidators(Validators.required));
    } else {
      epFields.forEach(field => f.get(field)?.clearValidators());
      // Also clear intermediary validator
      f.get('epIntermediarySwiftCode')?.clearValidators();
      f.get('epIntermediarySwiftCode')?.updateValueAndValidity();
    }
    epFields.forEach(field => f.get(field)?.updateValueAndValidity());
  }

  /** Actualiza validador de SWIFT intermediario */
  private updateIntermediaryValidator(isActive: boolean): void {
    const f = this.form();
    if (isActive) {
      f.get('epIntermediarySwiftCode')?.setValidators(Validators.required);
    } else {
      f.get('epIntermediarySwiftCode')?.clearValidators();
    }
    f.get('epIntermediarySwiftCode')?.updateValueAndValidity();
  }

  get isTransferencia(): boolean {
    return this.form().get('paymentMethod')?.value === this.transferenciaId;
  }

  get isIntermediaryBank(): boolean {
    return this.form().get('epHasIntermediaryBank')?.value === this.yesId;
  }
}
