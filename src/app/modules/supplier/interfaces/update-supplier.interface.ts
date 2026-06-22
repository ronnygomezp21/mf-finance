// [AI-GENERATED | skill: mf-feature-skill | spec: tasks/mf-finance/feat-012-mf-edicion-proveedor.md
//  | ticket: #012 | model: claude-opus-4-6]

import { CreateSupplierPayloadI } from './create-supplier.interface';

/** DTO que se envía al backend para actualizar un proveedor (PUT /ms-finance/supplier/:id) */
export interface UpdateSupplierPayloadI extends CreateSupplierPayloadI {
  /** Motivo del cambio — obligatorio, capturado desde el modal, max 500 chars */
  reason: string;
}
