// [AI-GENERATED | skill: mf-feature-skill | spec: tasks/mf-finance/feat-001-mf-alta-proveedor.md
//  | ticket: #001 | model: claude-sonnet-4-6]

import { CatalogValueI } from '../services/supplier.service';

/** DTO que se envía al backend para crear un proveedor */
export interface CreateSupplierPayloadI {
  // Tab 1 — Datos Generales
  name: string;
  commercialName?: string;
  contributorType: CatalogValueI;
  identificationType: CatalogValueI;
  identification: string;
  frequency: CatalogValueI;
  residency: CatalogValueI;
  classification: CatalogValueI;

  // Tab 1 — Condicionales por residencia extranjera
  residentPaymentType?: string;
  fiscalRegimeType?: string;
  applyDoubleTaxation?: boolean;
  applyLegalRegulations?: boolean;

  // Tab 2 — Datos Fiscales
  country: CatalogValueI;
  province?: CatalogValueI;
  city: CatalogValueI;
  fiscalAddress: string;
  email: string;
  phoneType?: string;
  phoneNumber?: string;
  activityType: CatalogValueI;
  serviceType?: string[];
  goodType?: string[];
  taxpayerCategory?: string;
  largeTaxpayer?: boolean;
  nonProfit?: boolean;
  qualifiedArtisan?: boolean;
  accountingRequired?: boolean;

  // Tab 3 — Datos Bancarios
  paymentMethod: CatalogValueI;
  paymentDays?: number;
  bankCountry?: CatalogValueI;
  currency?: string;
  bankIdClassifier?: string;
  bankName?: string;
  accountType?: string;
  accountNumber?: string;
  accountHolder?: string;
  paymentId?: string;
  paymentIdType?: string;
  thirdPartyPayment?: boolean;

  paymentEmail1: string;
  paymentEmail2?: string;

  // Tab 5 — Cupo asignado
  quotaAssigned?: number;

  // Relaciones
  contacts: CreateContactI[];
  thirdPartyAccount?: CreateThirdPartyI;
  externalPayment?: CreateExternalPaymentI;
  retentions?: CreateRetentionI[];
}

export interface CreateContactI {
  contactType: string;
  name?: string;
  position?: string;
  phoneType?: string;
  phoneNumber?: string;
  email1: string;
  email2?: string;
}

export interface CreateThirdPartyI {
  beneficiary: string;
  identificationType: string;
  paymentId: string;
  bankName: string;
  accountType: string;
  accountNumber: string;
}

export interface CreateExternalPaymentI {
  swiftCode: string;
  shippingCosts: string;
  reference: string;
  relationship: string;
  hasIntermediaryBank: boolean;
  intermediarySwiftCode?: string;
}

export interface CreateRetentionI {
  retentionType: string;
  regulatoryEntity: string;
  retentionCode: string;
  status: string;
  effectiveDate: string;
}
