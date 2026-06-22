// [AI-GENERATED | skill: mf-feature-skill | spec: tasks/mf-finance/feat-012-mf-edicion-proveedor.md
//  | ticket: #012 | model: claude-opus-4-6]

import { CatalogValueI } from '../services/supplier.service';

/**
 * ViewModel retornado por GET /ms-finance/supplier/:id
 * Confirmar campos exactos contra el SupplierDetailVm del backend
 */
export interface SupplierDetailI {
  id: string;
  supplierCode: string;
  status: string;
  name: string;
  commercialName?: string;
  contributorType: CatalogValueI;
  identificationType: CatalogValueI;
  identification: string;
  // [FEAT #023] — Identificación secundaria (opcional)
  secondaryIdentificationType?: CatalogValueI | null;
  secondaryIdentification?: string | null;
  frequency: CatalogValueI;
  residency: CatalogValueI;
  classification: CatalogValueI;

  // Datos Fiscales
  country: CatalogValueI;
  province?: CatalogValueI;
  city: string;
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
  residentPaymentType?: string;
  fiscalRegimeType?: string;
  applyDoubleTaxation?: boolean;
  applyLegalRegulations?: boolean;

  // Datos Bancarios
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
  thirdPartyPayment: boolean;
  externalPayment: boolean;
  paymentEmail1: string;
  paymentEmail2?: string;

  // Cupo
  quotaAssigned?: number;
  totalBilled?: number;
  quotaBalance?: number;

  // Relaciones
  contacts: SupplierDetailContactI[];
  thirdPartyAccount?: SupplierDetailThirdPartyI;
  externalPaymentData?: SupplierDetailExternalPaymentI;
  retentions?: SupplierDetailRetentionI[];
}

export interface SupplierDetailContactI {
  contactType: string;
  name?: string;
  position?: string;
  phoneType?: string;
  phoneNumber?: string;
  email1: string;
  email2?: string;
}

export interface SupplierDetailThirdPartyI {
  beneficiary: string;
  identificationType: string;
  paymentId: string;
  bankName: string;
  accountType: string;
  accountNumber: string;
}

export interface SupplierDetailExternalPaymentI {
  swiftCode: string;
  shippingCosts: string;
  reference: string;
  relationship: string;
  hasIntermediaryBank: boolean;
  intermediarySwiftCode?: string;
}

export interface SupplierDetailRetentionI {
  retentionType: string;
  regulatoryEntity: string;
  retentionCode: string;
  description?: string;
  percentage?: number;
  status: string;
  effectiveDate: string;
}
