// [AI-GENERATED | skill: mf-feature-skill | spec: tasks/mf-finance/feat-007-mf-listado-auditoria-proveedor.md
//  | ticket: #007 | model: antigravity]

import { SessionUserInterface } from "src/app/shared/interfaces/user-session.interfaces";

export interface SupplierAuditI {
  id: string;
  supplierId: string;
  supplierName: string;
  fieldChanged: string;
  previousValue: string | null;
  newValue: string | null;
  reason: string;
  modifiedBy: SessionUserInterface | string;
  modifiedAt: string;
}
