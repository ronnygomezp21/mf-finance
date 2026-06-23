// [AI-GENERATED | skill: mf-feature-skill | spec: tasks/mf-finance/feat-2-modal-exito-proveedor.md
//  | ticket: #— | model: claude-sonnet-4-6]

import {
  CLASSIFICATIONS,
  CONTRIBUTOR_TYPES,
  IDENTIFICATION_TYPES,
  PAYMENT_METHODS,
  RESIDENCIES,
} from '../constants/supplier-catalogs';
import { SupplierSuccessSummaryI } from '../interfaces/supplier-success-summary.interface';
import { resolveCatalog } from '../../../shared/helpers/catalog.helper';

export interface BuildSupplierSuccessSummaryParams {
  supplierCode?: string;
  name: string;
  contributorTypeId?: number | null;
  residencyId?: number | null;
  identificationTypeId?: number | null;
  identification?: string | null;
  classificationId?: number | null;
  paymentMethodId?: number | null;
  mainContact?: string | null;
  mainEmail?: string | null;
  quotaAssigned?: number | null;
  retentionsCount: number;
}

const dash = (value?: string | null): string => value?.trim() || '—';

export const buildSupplierSuccessSummary = (
  params: BuildSupplierSuccessSummaryParams,
): SupplierSuccessSummaryI => {
  const identificationType = resolveCatalog(IDENTIFICATION_TYPES, params.identificationTypeId)?.name;
  const identificationValue = params.identification?.trim();
  const identification = identificationType && identificationValue
    ? `${identificationType} — ${identificationValue}`
    : dash(identificationValue ?? identificationType);

  const quotaAssigned = params.quotaAssigned != null && params.quotaAssigned > 0
    ? new Intl.NumberFormat('es-EC', { style: 'currency', currency: 'USD' }).format(params.quotaAssigned)
    : undefined;

  return {
    supplierCode: params.supplierCode,
    businessName: dash(params.name),
    contributorType: dash(resolveCatalog(CONTRIBUTOR_TYPES, params.contributorTypeId)?.name),
    residency: dash(resolveCatalog(RESIDENCIES, params.residencyId)?.name),
    identification,
    classification: dash(resolveCatalog(CLASSIFICATIONS, params.classificationId)?.name),
    paymentMethod: dash(resolveCatalog(PAYMENT_METHODS, params.paymentMethodId)?.name),
    mainContact: dash(params.mainContact),
    mainEmail: dash(params.mainEmail),
    quotaAssigned,
    retentionsCount: params.retentionsCount,
  };
};
