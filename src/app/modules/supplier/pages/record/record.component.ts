// [AI-GENERATED | skill: mf-feature-skill | spec: tasks/mf-finance/feat-001-mf-alta-proveedor.md
//  | ticket: #001 | model: claude-sonnet-4-6]

import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

/** PubSub viene como singleton compartido vía Module Federation desde el shell */
declare const PubSub: { publish(channel: string, data?: any): boolean };

import { SupplierService } from '../../services/supplier.service';
import { CreateSupplierPayloadI } from '../../interfaces/create-supplier.interface';
import { AddedRetentionI, RetentionsFormComponent } from '../../forms/retentions-form/retentions-form.component';
import { SupplierSuccessModalComponent } from '../../components/success-modal/success-modal.component';
import { buildSupplierSuccessSummary } from '../../helpers/supplier-success-summary.helper';
import {
  CONTRIBUTOR_TYPES, FREQUENCIES, CONTACT_TYPES, RESIDENCIES,
  IDENTIFICATION_TYPES, COUNTRIES, PROVINCES, CITIES, ACTIVITY_TYPES,
  TAXPAYER_CATEGORIES, PHONE_TYPES, CLASSIFICATIONS,
  RESIDENT_PAYMENT_TYPES, FISCAL_REGIME_TYPES, PAYMENT_METHODS,
  BANK_NAMES, ACCOUNT_TYPES, CURRENCIES,
  YES_NO, PAYMENT_ID_TYPES,
  SHIPPING_COSTS, RELATIONSHIP_TYPES,
} from '../../constants/supplier-catalogs';
import { CatalogValueI } from '../../services/supplier.service';
import { resolveCatalog, catalogToBool } from '../../../../shared/helpers/catalog.helper';
import { StorageService } from 'src/app/shared/services/storage.service';
import { StorageEnum } from 'src/app/shared/enum/storage.enum';
import { SessionUserInterface } from 'src/app/shared/interfaces/user-session.interfaces';

@Component({
  selector: 'mf-finance-supplier-record',
  standalone: false,
  templateUrl: './record.component.html',
  styleUrls: ['./record.component.scss'],
})
export class RecordComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly supplierService = inject(SupplierService);
  private readonly modalService = inject(NgbModal);
  /** [FEAT #018] Lectura de sesión del usuario logueado */
  private readonly storageService = inject(StorageService);

  // ─── Tabs ────────────────────────────────────────
  readonly tabLabels = [
    'Datos Generales', 'Datos Fiscales', 'Datos Bancarios',
    'Datos de Contacto', 'Cupo asignado', 'Retenciones',
  ];
  activeTab = 0;

  // ─── Forms ───────────────────────────────────────
  generalForm!: FormGroup;
  fiscalForm!: FormGroup;
  bankingForm!: FormGroup;
  contactsForm!: FormGroup;
  quotaForm!: FormGroup;


  // ─── Estado ──────────────────────────────────────
  isSubmitting = false;

  private syncingQuota = false;

  ngOnInit(): void {
    this.initGeneralForm();
    this.initFiscalForm();
    this.initBankingForm();
    this.initContactsForm();
    this.initQuotaForm();
    this.syncQuotaFields();
  }

  /** Sincronización bidireccional entre generalForm.quotaAssigned y quotaForm.quotaAssigned */
  private syncQuotaFields(): void {
    this.generalForm.get('quotaAssigned')?.valueChanges.subscribe((val: number) => {
      if (this.syncingQuota) return;
      this.syncingQuota = true;
      this.quotaForm.get('quotaAssigned')?.setValue(val, { emitEvent: false });
      this.syncingQuota = false;
    });

    this.quotaForm.get('quotaAssigned')?.valueChanges.subscribe((val: number) => {
      if (this.syncingQuota) return;
      this.syncingQuota = true;
      this.generalForm.get('quotaAssigned')?.setValue(val, { emitEvent: false });
      this.syncingQuota = false;
    });
  }

  // ═══════════════════════════════════════════════════
  // FORM INITIALIZATION
  // ═══════════════════════════════════════════════════

  private initGeneralForm(): void {
    this.generalForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(300), Validators.pattern(/^[A-ZÁÉÍÓÚÑÜ0-9 ]+$/)]],
      commercialName: ['', [Validators.maxLength(200)]],
      contributorType: [null, Validators.required],
      residency: [null, Validators.required],
      identificationType: [null, Validators.required],
      identification: [{ value: '', disabled: true }, Validators.required],
      frequency: [null, Validators.required],
      classification: [null, Validators.required],
      status: [{ id: 1, name: 'Activo' }],
      quotaAssigned: [3000, [Validators.min(0)]],
      // [FEAT #023] — Identificación secundaria (opcional)
      secondaryIdentificationType: [null],
      secondaryIdentification: [{ value: '', disabled: true }],
    });
  }

  private initFiscalForm(): void {
    this.fiscalForm = this.fb.group({
      country: [null, Validators.required],
      province: [null, Validators.required],
      city: ['', Validators.required],
      fiscalAddress: ['', [Validators.required, Validators.maxLength(500)]],
      email: ['', [Validators.required, Validators.email]],
      phoneType: [null],
      phoneNumber: [''],
      taxpayerCategory: [null, Validators.required],
      largeTaxpayer: [null, Validators.required],
      nonProfit: [null],
      qualifiedArtisan: [null],
      accountingRequired: [null],
      activityType: [null, Validators.required],
      serviceType: [[]],
      goodType: [[]],
      // Proveedor del exterior (condicional)
      residentPaymentType: [null],
      fiscalRegimeType: [null],
      applyDoubleTaxation: [null],
      applyLegalRegulations: [null],
    });
  }

  private initBankingForm(): void {
    this.bankingForm = this.fb.group({
      paymentMethod: [null, Validators.required],
      paymentDays: [0],
      bankCountry: [null],
      currency: [null],
      bankIdClassifier: [''],
      bankName: [null],
      bankNameForeign: [''],
      accountType: [null],
      accountNumber: [''],
      accountHolder: [''],
      paymentId: ['', Validators.required],
      paymentIdType: [null, Validators.required],
      thirdPartyPayment: [2],  // NO by default (id: 2)
      externalPayment: [2],    // NO by default (id: 2)
      paymentEmail1: ['', [Validators.required, Validators.email]],
      paymentEmail2: [''],
      // Pago a tercero (registro único)
      tpBeneficiary: [''],
      tpIdentificationType: [null],
      tpPaymentId: [''],
      tpBankName: [null],
      tpAccountType: [null],
      tpAccountNumber: [''],
      // Pago al exterior (registro único)
      epSwiftCode: [''],
      epShippingCosts: [null],
      epReference: [''],
      epRelationship: [null],
      epHasIntermediaryBank: [2],  // NO by default
      epIntermediarySwiftCode: [''],
    });
  }

  private initContactsForm(): void {
    this.contactsForm = this.fb.group({
      contacts: this.fb.array([
        this.fb.group({
          contactType: [2, Validators.required], // Default: Retención
          name: ['', Validators.required],
          position: [''],
          phoneType: [null],
          phoneNumber: [''],
          email1: ['', [Validators.required, Validators.email]],
          email2: [''],
        }),
      ]),
    });
  }

  private initQuotaForm(): void {
    this.quotaForm = this.fb.group({
      quotaAssigned: [3000, [Validators.required, Validators.min(0)]],
    });
  }

  // ═══════════════════════════════════════════════════
  // TAB NAVIGATION
  // ═══════════════════════════════════════════════════

  private getFormForTab(index: number): FormGroup | null {
    switch (index) {
      case 0: return this.generalForm;
      case 1: return this.fiscalForm;
      case 2: return this.bankingForm;
      case 3: return this.contactsForm;
      case 4: return this.quotaForm;
      default: return null;
    }
  }

  get tabDisabled(): boolean[] {
    return this.tabLabels.map((_, i) => {
      if (i === 0) return false;
      for (let j = 0; j < i; j++) {
        const form = this.getFormForTab(j);
        if (form && form.invalid) return true;
      }
      return false;
    });
  }

  onTabChange(index: number): void {
    const currentForm = this.getFormForTab(this.activeTab);
    currentForm?.markAllAsTouched();
    this.activeTab = index;
  }

  nextTab(): void {
    const currentForm = this.getFormForTab(this.activeTab);

    if (currentForm) {
      currentForm.markAllAsTouched();
      if (currentForm.invalid) {
        PubSub.publish('error', 'Por favor, complete correctamente todos los campos obligatorios antes de continuar.');
        return;
      }
    }

    // DEBUG: print current tab form data
    const tabName = this.tabLabels[this.activeTab];
    const formData = currentForm?.getRawValue();
    console.log(`[DEBUG] Tab "${tabName}" — form data:`, formData);

    if (this.activeTab < this.tabLabels.length - 1) {
      this.activeTab++;
    }
  }

  prevTab(): void {
    if (this.activeTab > 0) {
      this.activeTab--;
    }
  }

  cancel(): void {
    this.router.navigateByUrl('/supplier/list');
  }

  @ViewChild(RetentionsFormComponent) retentionsForm?: RetentionsFormComponent;

  onSubmitFromButton(): void {
    if (this.retentionsForm) {
      this.retentionsForm.onSubmit();
    }
  }

  // ═══════════════════════════════════════════════════
  // COMPUTED — cross-form dependencies
  // ═══════════════════════════════════════════════════

  private readonly legalEntityId = CONTRIBUTOR_TYPES.find(c => c.name === 'Persona Jurídica')?.id;
  private readonly occasionalId = FREQUENCIES.find(f => f.name === 'Ocasional')?.id;
  private readonly permanentId = FREQUENCIES.find(f => f.name === 'Permanente')?.id;
  private readonly foreignId = RESIDENCIES.find(r => r.name === 'Extranjero')?.id;

  get isLegalEntity(): boolean {
    return this.generalForm.get('contributorType')?.value === this.legalEntityId;
  }

  get isFrequencyOccasional(): boolean {
    return this.generalForm.get('frequency')?.value === this.occasionalId;
  }

  get isFrequencyPermanent(): boolean {
    return this.generalForm.get('frequency')?.value === this.permanentId;
  }

  get isForeignResidency(): boolean {
    return this.generalForm.get('residency')?.value === this.foreignId;
  }
  // ═══════════════════════════════════════════════════
  // SUBMIT
  // ═══════════════════════════════════════════════════

  onSubmit(retentions: AddedRetentionI[]): void {

    console.log('[SUBMIT] Iniciando proceso de guardado...');

    [this.generalForm, this.fiscalForm, this.bankingForm, this.contactsForm, this.quotaForm]
      .forEach(f => f.markAllAsTouched());

    // [BUGFIX #003] Validar que al menos un contacto tenga email (RN-05) — BLOQUEANTE
    const contacts = (this.contactsForm.get('contacts') as FormArray).value;
    const hasContactWithEmail = contacts.some((c: any) => c.email1);
    if (!hasContactWithEmail) {
      PubSub.publish('error', 'Debe registrar al menos un contacto con correo electrónico (RN-05).');
      return;
    }

    // [BUGFIX #014-A] Validar que exista al menos una retención — BLOQUEANTE
    if (!retentions || retentions.length === 0) {
      PubSub.publish('error', 'Debe agregar al menos una retención antes de guardar.');
      return;
    }

    // Debug: mostrar qué formularios son inválidos
    const formStatus = {
      general: this.generalForm.valid,
      fiscal: this.fiscalForm.valid,
      banking: this.bankingForm.valid,
      contacts: this.contactsForm.valid,
      quota: this.quotaForm.valid,
    };
    console.log('[SUBMIT] Estado de formularios:', formStatus);

    if (this.generalForm.invalid || this.fiscalForm.invalid ||
      this.bankingForm.invalid || this.contactsForm.invalid) {
      // Debug: mostrar campos inválidos
      [
        { name: 'General', form: this.generalForm },
        { name: 'Fiscal', form: this.fiscalForm },
        { name: 'Banking', form: this.bankingForm },
        { name: 'Contacts', form: this.contactsForm },
      ].forEach(({ name, form }) => {
        if (form.invalid) {
          const invalidFields = Object.keys(form.controls).filter(k => form.get(k)?.invalid);
          console.error(`[SUBMIT] ${name} inválido — campos:`, invalidFields);
        }
      });
      PubSub.publish('error', 'Por favor complete todos los campos obligatorios.');
      return;
    }

    this.isSubmitting = true;

    // [FEAT #018] Leer sesión del usuario logueado
    const sessionRaw = this.storageService.getLocalStorage(StorageEnum.USER_SESSION);
    if (!sessionRaw) {
      this.isSubmitting = false;
      PubSub.publish('error', 'No se encontró la sesión del usuario. Inicie sesión nuevamente.');
      return;
    }
    const sessionUser = JSON.parse(JSON.stringify(sessionRaw)) as SessionUserInterface;

    const g = this.generalForm.getRawValue();
    const f = this.fiscalForm.getRawValue();
    const b = this.bankingForm.getRawValue();


    const payload: CreateSupplierPayloadI = {
      name: g.name,
      commercialName: g.commercialName || undefined,
      contributorType: resolveCatalog(CONTRIBUTOR_TYPES, g.contributorType)!,
      identificationType: resolveCatalog(IDENTIFICATION_TYPES, g.identificationType)!,
      identification: g.identification,
      // [FEAT #023] — Identificación secundaria (opcional)
      secondaryIdentificationType: g.secondaryIdentificationType
        ? resolveCatalog(IDENTIFICATION_TYPES, g.secondaryIdentificationType) || null
        : null,
      secondaryIdentification: g.secondaryIdentification || null,
      frequency: resolveCatalog(FREQUENCIES, g.frequency)!,
      residency: resolveCatalog(RESIDENCIES, g.residency)!,
      classification: resolveCatalog(CLASSIFICATIONS, g.classification)!,
      residentPaymentType: resolveCatalog(RESIDENT_PAYMENT_TYPES, f.residentPaymentType)?.name || undefined,
      fiscalRegimeType: resolveCatalog(FISCAL_REGIME_TYPES, f.fiscalRegimeType)?.name || undefined,
      applyDoubleTaxation: catalogToBool(f.applyDoubleTaxation),
      applyLegalRegulations: catalogToBool(f.applyLegalRegulations),
      country: resolveCatalog(COUNTRIES, f.country)!,
      province: resolveCatalog(PROVINCES, f.province) || undefined,
      city: f.city as any,
      fiscalAddress: f.fiscalAddress,
      email: f.email,
      phoneType: resolveCatalog(PHONE_TYPES, f.phoneType)?.name || undefined,
      phoneNumber: f.phoneNumber || undefined,
      activityType: resolveCatalog(ACTIVITY_TYPES, f.activityType)!,
      serviceType: f.serviceType?.length ? f.serviceType : undefined,
      goodType: f.goodType?.length ? f.goodType : undefined,
      taxpayerCategory: resolveCatalog(TAXPAYER_CATEGORIES, f.taxpayerCategory)?.name || undefined,
      largeTaxpayer: catalogToBool(f.largeTaxpayer),
      nonProfit: catalogToBool(f.nonProfit),
      qualifiedArtisan: catalogToBool(f.qualifiedArtisan),
      accountingRequired: catalogToBool(f.accountingRequired),
      paymentMethod: resolveCatalog(PAYMENT_METHODS, b.paymentMethod)!,
      paymentDays: b.paymentDays || 0,
      bankCountry: this.isForeignResidency ? undefined : (resolveCatalog(COUNTRIES, b.bankCountry) || undefined), // [BUGFIX #019]
      currency: this.isForeignResidency ? undefined : (resolveCatalog(CURRENCIES, b.currency)?.name || 'USD'),
      bankIdClassifier: this.isForeignResidency ? undefined : (b.bankIdClassifier || '022'),
      bankName: this.isForeignResidency ? undefined : (b.bankNameForeign || resolveCatalog(BANK_NAMES, b.bankName)?.name || undefined),
      accountType: this.isForeignResidency ? undefined : (resolveCatalog(ACCOUNT_TYPES, b.accountType)?.name || undefined),
      accountNumber: b.accountNumber ? String(b.accountNumber) : undefined, // requerido en Transferencia (nacional y extranjero)
      accountHolder: this.isForeignResidency ? undefined : (b.accountHolder || undefined),
      paymentId: this.isForeignResidency ? undefined : (b.paymentId || undefined),
      paymentIdType: this.isForeignResidency ? undefined : (resolveCatalog(PAYMENT_ID_TYPES, b.paymentIdType)?.name || undefined),
      thirdPartyPayment: resolveCatalog(YES_NO, b.thirdPartyPayment)?.name === 'SI',

      paymentEmail1: b.paymentEmail1,
      paymentEmail2: b.paymentEmail2 || undefined,
      quotaAssigned: this.isFrequencyOccasional ? Number(g.quotaAssigned) : undefined,
      contacts: contacts.map((c: any) => ({
        contactType: resolveCatalog(CONTACT_TYPES, c.contactType)?.name || c.contactType,
        name: c.name || undefined,
        position: c.position || undefined,
        phoneType: resolveCatalog(PHONE_TYPES, c.phoneType)?.name || undefined,
        phoneNumber: c.phoneNumber ? String(c.phoneNumber) : undefined, // [BUGFIX #002]
        email1: c.email1,
        email2: c.email2 || undefined,
      })),
      thirdPartyAccount: resolveCatalog(YES_NO, b.thirdPartyPayment)?.name === 'SI' ? {
        beneficiary: b.tpBeneficiary || '',
        identificationType: resolveCatalog(PAYMENT_ID_TYPES, b.tpIdentificationType)?.name || '',
        paymentId: b.tpPaymentId || '',
        bankName: resolveCatalog(BANK_NAMES, b.tpBankName)?.name || '',
        accountType: resolveCatalog(ACCOUNT_TYPES, b.tpAccountType)?.name || '',
        accountNumber: b.tpAccountNumber ? String(b.tpAccountNumber) : '', // [BUGFIX #001]
      } : undefined,
      externalPayment: resolveCatalog(YES_NO, b.externalPayment)?.name === 'SI' ? {
        swiftCode: b.epSwiftCode || '',
        shippingCosts: resolveCatalog(SHIPPING_COSTS, b.epShippingCosts)?.name || '',
        reference: b.epReference || '',
        relationship: resolveCatalog(RELATIONSHIP_TYPES, b.epRelationship)?.name || '',
        hasIntermediaryBank: resolveCatalog(YES_NO, b.epHasIntermediaryBank)?.name === 'SI',
        intermediarySwiftCode: resolveCatalog(YES_NO, b.epHasIntermediaryBank)?.name === 'SI' ? b.epIntermediarySwiftCode || '' : undefined,
      } : undefined,
      retentions: retentions.length ? retentions.map(r => ({
        retentionType: r.type,
        regulatoryEntity: r.entity,
        retentionCode: r.code,
        status: r.status,
        effectiveDate: new Date().toISOString().split('T')[0],
      })) : undefined,

      // [FEAT #018] Sesión del usuario logueado
      sessionUser: {
        id: sessionUser.id,
        firstname: sessionUser.firstname,
        lastname: sessionUser.lastname,
        email: sessionUser.email
      },
    };

    this.supplierService.createSupplier(payload).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        const data = res?.data;
        const g = this.generalForm.getRawValue();
        const f = this.fiscalForm.getRawValue();
        const b = this.bankingForm.getRawValue();
        const mainContact = contacts.find((c: { name?: string }) => c.name?.trim());

        this.openSuccessModal(
          'Proveedor registrado',
          'El proveedor se creó correctamente y queda disponible para los demás módulos.',
          'create',
          buildSupplierSuccessSummary({
            supplierCode: data?.supplierCode,
            name: data?.name ?? g.name,
            contributorTypeId: g.contributorType,
            residencyId: g.residency,
            identificationTypeId: g.identificationType,
            identification: g.identification,
            classificationId: g.classification,
            paymentMethodId: b.paymentMethod,
            mainContact: mainContact?.name,
            mainEmail: f.email,
            quotaAssigned: this.isFrequencyOccasional ? Number(g.quotaAssigned) : undefined,
            retentionsCount: retentions.length,
          }),
        );
      },
      error: (err) => {
        this.isSubmitting = false;
        const message = err?.error?.message || 'Error al crear el proveedor';
        console.error('[Supplier Record] Error:', message);
      },
    });
  }

  private openSuccessModal(
    title: string,
    subtitle: string,
    mode: 'create' | 'edit',
    summary: ReturnType<typeof buildSupplierSuccessSummary>,
  ): void {
    const modalRef = this.modalService.open(SupplierSuccessModalComponent, {
      centered: true,
      backdrop: 'static',
      modalDialogClass: 'modal-window-modal-supplier-success',
    });
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.subtitle = subtitle;
    modalRef.componentInstance.mode = mode;
    modalRef.componentInstance.summary = summary;
    modalRef.closed.subscribe((action: 'list' | 'create-another') => {
      if (action === 'create-another') {
        this.router.navigateByUrl('/supplier/record');
        return;
      }
      this.router.navigateByUrl('/supplier/list');
    });
  }
}
