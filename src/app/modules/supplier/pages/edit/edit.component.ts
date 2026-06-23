// [AI-GENERATED | skill: mf-feature-skill | spec: tasks/mf-finance/feat-012-mf-edicion-proveedor.md
//  | ticket: #012 | model: claude-opus-4-6]

import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

/** PubSub viene como singleton compartido vía Module Federation desde el shell */
declare const PubSub: { publish(channel: string, data?: any): boolean };

import { SupplierService } from '../../services/supplier.service';
import { CatalogValueI } from '../../services/supplier.service';
import { SupplierDetailI } from '../../interfaces/supplier-detail.interface';
import { UpdateSupplierPayloadI } from '../../interfaces/update-supplier.interface';
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
  RETENTION_CATALOG,
} from '../../constants/supplier-catalogs';
import { resolveCatalog, catalogToBool } from '../../../../shared/helpers/catalog.helper';
import { StorageService } from 'src/app/shared/services/storage.service';
import { StorageEnum } from 'src/app/shared/enum/storage.enum';
import { SessionUserInterface } from 'src/app/shared/interfaces/user-session.interfaces';

@Component({
  selector: 'mf-finance-supplier-edit',
  standalone: false,
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class EditComponent implements OnInit {
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
  isLoading = true;
  showReasonModal = false;
  supplierCode = '';
  supplierId = '';

  private syncingQuota = false;

  /** [BUG-016 FIX] Datos de solo lectura del cupo (edición) */
  preloadedTotalBilled = 0;
  preloadedQuotaBalance = 0;
  private supplier!: SupplierDetailI;

  ngOnInit(): void {
    this.supplierId = history.state?.supplierId || '';

    if (!this.supplierId) {
      PubSub.publish('error', 'No se recibió el ID del proveedor.');
      this.router.navigateByUrl('/supplier/list');
      return;
    }

    this.initGeneralForm();
    this.initFiscalForm();
    this.initBankingForm();
    this.initContactsForm();
    this.initQuotaForm();
    this.syncQuotaFields();

    this.loadSupplier();
  }

  // ═══════════════════════════════════════════════════
  // DATA LOADING
  // ═══════════════════════════════════════════════════

  private loadSupplier(): void {
    this.supplierService.getSupplierById(this.supplierId).subscribe({
      next: (supplier) => {
        this.supplier = supplier;
        this.supplierCode = supplier.supplierCode;
        this.patchForms(supplier);
        this.isLoading = false;
      },
      error: () => {
        PubSub.publish('error', 'El proveedor no fue encontrado.');
        this.router.navigateByUrl('/supplier/list');
      },
    });
  }

  private patchForms(s: SupplierDetailI): void {
    // ── Tab 1 — Datos Generales ──
    this.generalForm.patchValue({
      name: s.name,
      commercialName: s.commercialName || '',
      contributorType: s.contributorType?.id,
      residency: s.residency?.id,
      identificationType: s.identificationType?.id,
      identification: s.identification,
      frequency: s.frequency?.id,
      classification: s.classification?.id,
      status: { id: s.status === 'ACTIVO' ? 1 : 2, name: s.status === 'ACTIVO' ? 'Activo' : 'Inactivo' },
      quotaAssigned: s.quotaAssigned ?? 3000,
      // [FEAT #023] — Identificación secundaria
      secondaryIdentificationType: s.secondaryIdentificationType?.id || null,
      secondaryIdentification: s.secondaryIdentification || '',
    });

    // ── Tab 2 — Datos Fiscales ──
    this.fiscalForm.patchValue({
      country: s.country?.id,
      province: s.province?.id,
      city: s.city || '',
      fiscalAddress: s.fiscalAddress || '',
      email: s.email || '',
      phoneType: this.findCatalogIdByName(PHONE_TYPES, s.phoneType),
      phoneNumber: s.phoneNumber || '',
      taxpayerCategory: this.findCatalogIdByName(TAXPAYER_CATEGORIES, s.taxpayerCategory),
      largeTaxpayer: this.boolToYesNo(s.largeTaxpayer),
      nonProfit: this.boolToYesNo(s.nonProfit),
      qualifiedArtisan: this.boolToYesNo(s.qualifiedArtisan),
      accountingRequired: this.boolToYesNo(s.accountingRequired),
      activityType: s.activityType?.id,
      serviceType: s.serviceType || [],
      goodType: s.goodType || [],
      residentPaymentType: this.findCatalogIdByName(RESIDENT_PAYMENT_TYPES, s.residentPaymentType),
      fiscalRegimeType: this.findCatalogIdByName(FISCAL_REGIME_TYPES, s.fiscalRegimeType),
      applyDoubleTaxation: this.boolToYesNo(s.applyDoubleTaxation),
      applyLegalRegulations: this.boolToYesNo(s.applyLegalRegulations),
    });

    // ── Tab 3 — Datos Bancarios ──
    this.bankingForm.patchValue({
      paymentMethod: s.paymentMethod?.id,
      paymentDays: s.paymentDays || 0,
      bankCountry: s.bankCountry?.id || 1,
      currency: this.findCatalogIdByName(CURRENCIES, s.currency) || 1,
      bankIdClassifier: s.bankIdClassifier || '022',
      bankName: this.findCatalogIdByName(BANK_NAMES, s.bankName),
      accountType: this.findCatalogIdByName(ACCOUNT_TYPES, s.accountType),
      accountNumber: s.accountNumber || '',
      accountHolder: s.accountHolder || '',
      paymentId: s.paymentId || '',
      paymentIdType: this.findCatalogIdByName(PAYMENT_ID_TYPES, s.paymentIdType),
      thirdPartyPayment: s.thirdPartyPayment ? 1 : 2,
      externalPayment: s.externalPayment ? 1 : 2,
      paymentEmail1: s.paymentEmail1 || '',
      paymentEmail2: s.paymentEmail2 || '',
    });

    // Pre-llenar pago a tercero si existe
    if (s.thirdPartyAccount) {
      this.bankingForm.patchValue({
        tpBeneficiary: s.thirdPartyAccount.beneficiary || '',
        tpIdentificationType: this.findCatalogIdByName(PAYMENT_ID_TYPES, s.thirdPartyAccount.identificationType),
        tpPaymentId: s.thirdPartyAccount.paymentId || '',
        tpBankName: this.findCatalogIdByName(BANK_NAMES, s.thirdPartyAccount.bankName),
        tpAccountType: this.findCatalogIdByName(ACCOUNT_TYPES, s.thirdPartyAccount.accountType),
        tpAccountNumber: s.thirdPartyAccount.accountNumber || '',
      });
    }

    // Pre-llenar pago al exterior si existe
    if (s.externalPaymentData) {
      this.bankingForm.patchValue({
        epSwiftCode: s.externalPaymentData.swiftCode || '',
        epShippingCosts: this.findCatalogIdByName(SHIPPING_COSTS, s.externalPaymentData.shippingCosts),
        epReference: s.externalPaymentData.reference || '',
        epRelationship: this.findCatalogIdByName(RELATIONSHIP_TYPES, s.externalPaymentData.relationship),
        epHasIntermediaryBank: s.externalPaymentData.hasIntermediaryBank ? 1 : 2,
        epIntermediarySwiftCode: s.externalPaymentData.intermediarySwiftCode || '',
      });
    }

    // ── Tab 4 — Contactos ──
    const contactsArray = this.contactsForm.get('contacts') as FormArray;
    contactsArray.clear();
    if (s.contacts && s.contacts.length > 0) {
      s.contacts.forEach(c => {
        contactsArray.push(this.fb.group({
          contactType: [this.findCatalogIdByName(CONTACT_TYPES, c.contactType) || 1, Validators.required],
          name: [c.name || '', Validators.required],
          position: [c.position || ''],
          phoneType: [this.findCatalogIdByName(PHONE_TYPES, c.phoneType)],
          phoneNumber: [c.phoneNumber || ''],
          email1: [c.email1 || '', [Validators.required, Validators.email]],
          email2: [c.email2 || ''],
        }));
      });
    } else {
      // Agregar al menos un contacto vacío
      contactsArray.push(this.fb.group({
        contactType: [1, Validators.required],
        name: ['', Validators.required],
        position: [''],
        phoneType: [null],
        phoneNumber: [''],
        email1: ['', [Validators.required, Validators.email]],
        email2: [''],
      }));
    }

    // ── Tab 5 — Cupo ──
    this.quotaForm.patchValue({
      quotaAssigned: s.quotaAssigned ?? 3000,
    });

    // [BUG-016 FIX] Mapear campos de solo lectura (el API los retorna como strings)
    this.preloadedTotalBilled = parseFloat(s.totalBilled as any) || 0;
    this.preloadedQuotaBalance = parseFloat(s.quotaBalance as any) || 0;

    // ── Tab 6 — Retenciones — [BUG-015 FIX] mapeo vía propiedad en lugar de @ViewChild ──
    if (s.retentions && s.retentions.length > 0) {
      this.preloadedRetentions = s.retentions.map(r => {
        // Enriquecer description y percentage desde el catálogo local (el API no los retorna)
        const catalogEntry = RETENTION_CATALOG
          .flatMap(t => t.codes)
          .find(c => c.code === r.retentionCode);
        return {
          entity: r.regulatoryEntity,
          type: r.retentionType,
          code: r.retentionCode,
          description: catalogEntry?.description || r.retentionCode,
          percentage: catalogEntry?.percentage || 0,
          effectiveDate: r.effectiveDate,
          status: r.status,
        };
      });
    }
  }

  // ─── Helpers de mapeo inverso ──────────────────────

  /** Busca el ID numérico de un catálogo dado su name string */
  private findCatalogIdByName(catalog: CatalogValueI[], name?: string): number | null {
    if (!name) return null;
    return catalog.find(c => c.name === name)?.id ?? null;
  }

  /** Convierte boolean a YES_NO catalog id (true → 1 SI, false → 2 NO) */
  private boolToYesNo(value?: boolean): number | null {
    if (value === undefined || value === null) return null;
    return value ? 1 : 2;
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
  // FORM INITIALIZATION (idéntico al RecordComponent)
  // ═══════════════════════════════════════════════════

  private initGeneralForm(): void {
    this.generalForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(300), Validators.pattern(/^[A-ZÁÉÍÓÚÑÜ0-9 ]+$/)]],
      commercialName: ['', [Validators.maxLength(200)]],
      contributorType: [null, Validators.required],
      residency: [null, Validators.required],
      identificationType: [null, Validators.required], // ahora editable
      identification: [{ value: '', disabled: true }, Validators.required], // se habilita al seleccionar tipo
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
      thirdPartyPayment: [2],
      externalPayment: [2],
      paymentEmail1: ['', [Validators.required, Validators.email]],
      paymentEmail2: [''],
      // Pago a tercero
      tpBeneficiary: [''],
      tpIdentificationType: [null],
      tpPaymentId: [''],
      tpBankName: [null],
      tpAccountType: [null],
      tpAccountNumber: [''],
      // Pago al exterior
      epSwiftCode: [''],
      epShippingCosts: [null],
      epReference: [''],
      epRelationship: [null],
      epHasIntermediaryBank: [2],
      epIntermediarySwiftCode: [''],
    });
  }

  private initContactsForm(): void {
    this.contactsForm = this.fb.group({
      contacts: this.fb.array([
        this.fb.group({
          contactType: [1, Validators.required],
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
  // SUBMIT FLOW — modal de motivo obligatorio
  // ═══════════════════════════════════════════════════

  @ViewChild(RetentionsFormComponent) retentionsForm?: RetentionsFormComponent;

  /** [BUG-015 FIX] Retenciones pre-cargadas desde el GET — se pasan como @Input al hijo */
  preloadedRetentions: AddedRetentionI[] = [];

  /** Step 1: El botón "Guardar cambios" abre el flujo de submit */
  onSubmitFromButton(): void {
    // Recoger retenciones del form hijo
    if (this.retentionsForm) {
      this.retentionsForm.onSubmit();
    }
  }

  /** Step 2: Recibe retenciones y valida todos los formularios antes de abrir el modal */
  onSubmit(retentions: AddedRetentionI[]): void {
    // Cache retentions for use after modal confirm
    this.pendingRetentions = retentions;

    [this.generalForm, this.fiscalForm, this.bankingForm, this.contactsForm, this.quotaForm]
      .forEach(f => f.markAllAsTouched());

    // Validar contacto con email (RN-05)
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

    if (this.generalForm.invalid || this.fiscalForm.invalid ||
      this.bankingForm.invalid || this.contactsForm.invalid) {
      PubSub.publish('error', 'Por favor complete todos los campos obligatorios.');
      return;
    }

    // ─── ABRIR MODAL ───
    this.showReasonModal = true;
  }

  private pendingRetentions: AddedRetentionI[] = [];

  /** Step 3: El usuario confirma el motivo en el modal → ejecutar PUT */
  onReasonConfirmed(reason: string): void {
    this.showReasonModal = false;
    this.isSubmitting = true;

    // [FEAT #018] Leer sesión del usuario logueado
    const sessionRaw = this.storageService.getLocalStorage(StorageEnum.USER_SESSION);
    if (!sessionRaw) {
      this.isSubmitting = false;
      PubSub.publish('error', 'No se encontró la sesión del usuario. Inicie sesión nuevamente.');
      return;
    }
    const sessionUser = JSON.parse(JSON.stringify(sessionRaw)) as SessionUserInterface;

    const payload = this.buildPayload(this.pendingRetentions, reason, sessionUser);

    this.supplierService.updateSupplier(this.supplierId, payload).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        const data = res?.data;
        const g = this.generalForm.getRawValue();
        const f = this.fiscalForm.getRawValue();
        const b = this.bankingForm.getRawValue();
        const contacts = (this.contactsForm.get('contacts') as FormArray).value;
        const mainContact = contacts.find((c: { name?: string }) => c.name?.trim());

        this.openSuccessModal(
          'Proveedor actualizado',
          'Los cambios del proveedor se guardaron correctamente y quedan disponibles para los demás módulos.',
          'edit',
          buildSupplierSuccessSummary({
            supplierCode: data?.supplierCode ?? this.supplierCode,
            name: data?.name ?? g.name ?? this.supplier?.name,
            contributorTypeId: g.contributorType,
            residencyId: g.residency,
            identificationTypeId: g.identificationType,
            identification: g.identification,
            classificationId: g.classification,
            paymentMethodId: b.paymentMethod,
            mainContact: mainContact?.name,
            mainEmail: f.email,
            quotaAssigned: this.isFrequencyOccasional ? Number(g.quotaAssigned) : undefined,
            retentionsCount: this.pendingRetentions.length,
          }),
        );
      },
      error: () => {
        this.isSubmitting = false;
      },
    });
  }

  /** El usuario cancela el modal → volver al formulario sin perder datos */
  onReasonCancelled(): void {
    this.showReasonModal = false;
  }

  // ═══════════════════════════════════════════════════
  // PAYLOAD BUILDER (misma lógica que RecordComponent + reason)
  // ═══════════════════════════════════════════════════

  private buildPayload(retentions: AddedRetentionI[], reason: string, sessionUser: SessionUserInterface): UpdateSupplierPayloadI {
    const g = this.generalForm.getRawValue();
    const f = this.fiscalForm.getRawValue();
    const b = this.bankingForm.getRawValue();
    const contacts = (this.contactsForm.get('contacts') as FormArray).value;

    return {
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
        phoneNumber: c.phoneNumber ? String(c.phoneNumber) : undefined,
        email1: c.email1,
        email2: c.email2 || undefined,
      })),
      thirdPartyAccount: resolveCatalog(YES_NO, b.thirdPartyPayment)?.name === 'SI' ? {
        beneficiary: b.tpBeneficiary || '',
        identificationType: resolveCatalog(PAYMENT_ID_TYPES, b.tpIdentificationType)?.name || '',
        paymentId: b.tpPaymentId || '',
        bankName: resolveCatalog(BANK_NAMES, b.tpBankName)?.name || '',
        accountType: resolveCatalog(ACCOUNT_TYPES, b.tpAccountType)?.name || '',
        accountNumber: b.tpAccountNumber ? String(b.tpAccountNumber) : '',
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
        effectiveDate: r.effectiveDate || new Date().toISOString().split('T')[0],
      })) : undefined,
      reason,

      // [FEAT #018] Sesión del usuario logueado
      sessionUser: {
        id: sessionUser.id,
        firstname: sessionUser.firstname,
        lastname: sessionUser.lastname,
        email: sessionUser.email
      },
    };
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
      modalDialogClass: 'modal-sm-v6',
    });
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.subtitle = subtitle;
    modalRef.componentInstance.mode = mode;
    modalRef.componentInstance.summary = summary;
    modalRef.closed.subscribe(() => {
      this.router.navigateByUrl('/supplier/list');
    });
  }
}
