import { Component, input, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import {
  CONTRIBUTOR_TYPES, IDENTIFICATION_TYPES, FREQUENCIES, RESIDENCIES,
  CLASSIFICATIONS, YES_NO_OPTIONS, SUPPLIER_STATUS,
} from '../../constants/supplier-catalogs';
import { cedulaEcuatorianaValidator } from '../../../../shared/helpers/cedula-ecuatoriana.validator';

@Component({
  selector: 'mf-finance-supplier-general-form',
  standalone: false,
  templateUrl: './general-form.component.html',
  styleUrls: ['./general-form.component.scss'],
})
export class GeneralFormComponent implements OnInit {
  form = input.required<FormGroup>();

  readonly contributorTypes = CONTRIBUTOR_TYPES;
  readonly allIdentificationTypes = IDENTIFICATION_TYPES;
  filteredIdentificationTypes = [...IDENTIFICATION_TYPES];
  readonly frequencies = FREQUENCIES;
  readonly residencies = RESIDENCIES;
  readonly classifications = CLASSIFICATIONS;
  readonly yesNoOptions = YES_NO_OPTIONS;
  readonly supplierStatus = SUPPLIER_STATUS;

  identificationDisabled = true;
  identificationPlaceholder = 'Selecciona el tipo primero';
  identificationMaxLength = 20;

  /** Pre-computed catalog IDs for bindValue="id" comparisons */
  private readonly foreignId = RESIDENCIES.find(r => r.name === 'Extranjero')?.id;
  private readonly passportId = IDENTIFICATION_TYPES.find(t => t.name === 'Pasaporte')?.id;
  private readonly rucId = IDENTIFICATION_TYPES.find(t => t.name === 'RUC')?.id;
  private readonly idCardId = IDENTIFICATION_TYPES.find(t => t.name === 'Cédula')?.id;
  private readonly occasionalId = FREQUENCIES.find(f => f.name === 'Ocasional')?.id;
  private readonly permanentId = FREQUENCIES.find(f => f.name === 'Permanente')?.id;

  get isFrequencyOccasional(): boolean {
    return this.form().get('frequency')?.value === this.occasionalId;
  }

  get isFrequencyPermanent(): boolean {
    return this.form().get('frequency')?.value === this.permanentId;
  }

  ngOnInit(): void {
    const f = this.form();

    // Habilitar identificación y configurar placeholder/maxlength según tipo
    f.get('identificationType')?.valueChanges.subscribe(val => {
      const identCtrl = f.get('identification');
      if (val) {
        identCtrl?.enable();
        identCtrl?.setValue('');
        this.identificationDisabled = false;

        if (val === this.rucId) {
          this.identificationPlaceholder = '13 dígitos numéricos';
          this.identificationMaxLength = 13;
          identCtrl?.setValidators([Validators.required, Validators.minLength(13), Validators.maxLength(13)]);
        } else if (val === this.idCardId) {
          this.identificationPlaceholder = '10 dígitos numéricos';
          this.identificationMaxLength = 10;
          identCtrl?.setValidators([Validators.required, cedulaEcuatorianaValidator]);
        } else if (val === this.passportId) {
          this.identificationPlaceholder = 'Alfanumérico (letras y números)';
          this.identificationMaxLength = 20;
          identCtrl?.setValidators([Validators.required]);
        }
        identCtrl?.updateValueAndValidity();
      } else {
        identCtrl?.disable();
        identCtrl?.setValue('');
        identCtrl?.setValidators([Validators.required]);
        identCtrl?.updateValueAndValidity();
        this.identificationDisabled = true;
        this.identificationPlaceholder = 'Selecciona el tipo primero';
        this.identificationMaxLength = 20;
      }
    });

    // Filtro de tipo identificación por residencia
    f.get('residency')?.valueChanges.subscribe(val => {
      if (val === this.foreignId) {
        // Only Passport for foreign
        this.filteredIdentificationTypes = this.allIdentificationTypes.filter(t => t.name === 'Pasaporte');
        f.get('identificationType')?.setValue(this.passportId);
      } else {
        // All types for nationals
        this.filteredIdentificationTypes = [...this.allIdentificationTypes];
        f.get('identificationType')?.setValue(null);
      }
    });
  }

  get isForeignResidency(): boolean {
    return this.form().get('residency')?.value === this.foreignId;
  }

  onNameInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.toUpperCase();
    this.form().get('name')?.setValue(input.value, { emitEvent: false });
  }

  /** Filtra caracteres según tipo de identificación seleccionado */
  onIdentificationInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const idType = this.form().get('identificationType')?.value;
    let filtered: string;

    if (idType === this.rucId || idType === this.idCardId) {
      // Solo números
      filtered = input.value.replace(/[^0-9]/g, '');
    } else {
      // Pasaporte: alfanumérico en mayúsculas
      filtered = input.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    }

    input.value = filtered;
    this.form().get('identification')?.setValue(filtered, { emitEvent: false });
  }
}
