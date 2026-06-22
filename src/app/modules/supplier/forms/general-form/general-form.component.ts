import { Component, input, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import {
  CONTRIBUTOR_TYPES, IDENTIFICATION_TYPES, FREQUENCIES, RESIDENCIES,
  CLASSIFICATIONS, YES_NO_OPTIONS, SUPPLIER_STATUS,
} from '../../constants/supplier-catalogs';
import { cedulaEcuatorianaValidator, rucEcuatorianoValidator } from '../../../../shared/helpers/cedula-ecuatoriana.validator';

@Component({
  selector: 'mf-finance-supplier-general-form',
  standalone: false,
  templateUrl: './general-form.component.html',
  styleUrls: ['./general-form.component.scss'],
})
export class GeneralFormComponent implements OnInit {
  form = input.required<FormGroup>();
  /** Modo edición: muestra campo Estado */
  isEditMode = input<boolean>(false);

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

  // [FEAT #023] — Identificación secundaria
  readonly allSecondaryIdentificationTypes = IDENTIFICATION_TYPES;
  secondaryIdentificationDisabled = true;
  secondaryIdentificationPlaceholder = 'Selecciona el tipo primero';
  secondaryIdentificationMaxLength = 20;

  /** Pre-computed catalog IDs for bindValue="id" comparisons */
  private readonly foreignId = RESIDENCIES.find(r => r.name === 'Extranjero')?.id;
  private readonly passportId = IDENTIFICATION_TYPES.find(t => t.name === 'Pasaporte')?.id;
  private readonly rucId = IDENTIFICATION_TYPES.find(t => t.name === 'RUC')?.id;
  private readonly idCardId = IDENTIFICATION_TYPES.find(t => t.name === 'Cédula')?.id;
  private readonly occasionalId = FREQUENCIES.find(f => f.name === 'Ocasional')?.id;
  private readonly permanentId = FREQUENCIES.find(f => f.name === 'Permanente')?.id;

  private readonly legalEntityId = CONTRIBUTOR_TYPES.find(c => c.name === 'Persona Jurídica')?.id;

  get isFrequencyOccasional(): boolean {
    return this.form().get('frequency')?.value === this.occasionalId;
  }

  get isFrequencyPermanent(): boolean {
    return this.form().get('frequency')?.value === this.permanentId;
  }

  ngOnInit(): void {
    const f = this.form();

    f.get('identificationType')?.disable({ emitEvent: false });

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
          identCtrl?.setValidators([Validators.required, Validators.minLength(13), Validators.maxLength(13), rucEcuatorianoValidator]);
          // identCtrl?.setValidators([Validators.required, Validators.minLength(13), Validators.maxLength(13)]);
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

    // [FEAT #023] Habilitar identificación secundaria según tipo seleccionado
    f.get('secondaryIdentificationType')?.valueChanges.subscribe(val => {
      const secCtrl = f.get('secondaryIdentification');
      if (val) {
        secCtrl?.enable();
        secCtrl?.setValue('');
        this.secondaryIdentificationDisabled = false;
        if (val === this.rucId) {
          this.secondaryIdentificationPlaceholder = '13 dígitos numéricos';
          this.secondaryIdentificationMaxLength = 13;
          secCtrl?.setValidators([Validators.required, Validators.minLength(13), Validators.maxLength(13), rucEcuatorianoValidator]);
        } else if (val === this.idCardId) {
          this.secondaryIdentificationPlaceholder = '10 dígitos numéricos';
          this.secondaryIdentificationMaxLength = 10;
          secCtrl?.setValidators([Validators.required, cedulaEcuatorianaValidator]);
        } else if (val === this.passportId) {
          this.secondaryIdentificationPlaceholder = 'Alfanumérico (letras y números)';
          this.secondaryIdentificationMaxLength = 20;
          secCtrl?.setValidators([Validators.required]);
        }
        secCtrl?.updateValueAndValidity();
      } else {
        secCtrl?.disable();
        secCtrl?.setValue('');
        secCtrl?.clearValidators();
        secCtrl?.updateValueAndValidity();
        this.secondaryIdentificationDisabled = true;
        this.secondaryIdentificationPlaceholder = 'Selecciona el tipo primero';
        this.secondaryIdentificationMaxLength = 20;
      }
    });

    // Filtro de tipo identificación por residencia
    // f.get('residency')?.valueChanges.subscribe(val => {
    //   if (val === this.foreignId) {
    //     // Only Passport for foreign
    //     this.filteredIdentificationTypes = this.allIdentificationTypes.filter(t => t.name === 'Pasaporte');
    //     f.get('identificationType')?.setValue(this.passportId);
    //   } else {
    //     // All types for nationals
    //     this.filteredIdentificationTypes = [...this.allIdentificationTypes];
    //     f.get('identificationType')?.setValue(null);
    //   }
    // });

    f.get('residency')?.valueChanges.subscribe(() => {
      this.updateIdentificationTypeFilter();
    });

    f.get('contributorType')?.valueChanges.subscribe(() => {
      this.updateIdentificationTypeFilter();
    });
  }

  get isForeignResidency(): boolean {
    return this.form().get('residency')?.value === this.foreignId;
  }

  /** [BUG-017 FIX] Filtra caracteres especiales y convierte a mayúsculas */
  onNameInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    // Permitir SOLO: letras (incl. Ñ, tildes), números y espacios
    const filtered = input.value.toUpperCase().replace(/[^A-ZÁÉÍÓÚÑÜ0-9 ]/g, '');
    input.value = filtered;
    this.form().get('name')?.setValue(filtered, { emitEvent: false });
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

  private updateIdentificationTypeFilter(): void {
    const f = this.form();
    const residency = f.get('residency')?.value;
    const contributorType = f.get('contributorType')?.value;
    const identCtrl = f.get('identificationType');

    if (!residency || !contributorType) {
      identCtrl?.setValue(null);
      identCtrl?.disable({ emitEvent: false });
      this.filteredIdentificationTypes = [];
      // También limpiar y deshabilitar el campo de identificación
      const identInputCtrl = f.get('identification');
      identInputCtrl?.setValue('');
      identInputCtrl?.disable({ emitEvent: false });
      this.identificationDisabled = true;
      this.identificationPlaceholder = 'Selecciona contribuyente y residencia primero';
      return;
    }

    identCtrl?.enable({ emitEvent: false });

    const currentIdType = identCtrl?.value;

    if (residency === this.foreignId) {
      // Extranjero → Solo Pasaporte
      this.filteredIdentificationTypes = this.allIdentificationTypes.filter(t => t.name === 'Pasaporte');
    } else if (contributorType === this.legalEntityId) {
      // Persona Jurídica Nacional → Solo RUC
      this.filteredIdentificationTypes = this.allIdentificationTypes.filter(t => t.name === 'RUC');
    } else {
      // Persona Natural Nacional → RUC y Cédula (NO Pasaporte)
      this.filteredIdentificationTypes = this.allIdentificationTypes.filter(t => t.name !== 'Pasaporte');
    }
    // Si el tipo actual ya no está en la lista filtrada → resetear
    const isCurrentValid = this.filteredIdentificationTypes.some(t => t.id === currentIdType);
    if (!isCurrentValid) {
      // Auto-seleccionar si solo hay una opción, sino limpiar
      if (this.filteredIdentificationTypes.length === 1) {
        identCtrl?.setValue(this.filteredIdentificationTypes[0].id);
      } else {
        identCtrl?.setValue(null);
      }
    }
  }

  /** [FEAT #023] Filtra caracteres según tipo de identificación secundaria seleccionado */
  onSecondaryIdentificationInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const idType = this.form().get('secondaryIdentificationType')?.value;
    let filtered: string;

    if (idType === this.rucId || idType === this.idCardId) {
      // Solo números
      filtered = input.value.replace(/[^0-9]/g, '');
    } else {
      // Pasaporte: alfanumérico en mayúsculas
      filtered = input.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    }

    input.value = filtered;
    this.form().get('secondaryIdentification')?.setValue(filtered, { emitEvent: false });
  }
}
