// [AI-GENERATED | skill: mf-feature-skill | spec: tasks/mf-finance/feat-2-modal-exito-proveedor.md
//  | ticket: #— | model: claude-sonnet-4-6]

export interface SupplierSuccessSummaryI {
  supplierCode?: string;
  businessName: string;
  contributorType: string;
  residency: string;
  identification: string;
  classification: string;
  paymentMethod: string;
  mainContact: string;
  mainEmail: string;
  quotaAssigned?: string;
  retentionsCount: number;
}

export type SupplierSuccessMode = 'create' | 'edit';
