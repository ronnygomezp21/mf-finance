// [AI-GENERATED | skill: mf-feature-skill | spec: tasks/mf-finance/feat-2-modal-exito-proveedor.md
//  | ticket: #— | model: claude-sonnet-4-6]

import { Component, inject } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {
  SupplierSuccessMode,
  SupplierSuccessSummaryI,
} from '../../interfaces/supplier-success-summary.interface';

@Component({
  selector: 'mf-finance-supplier-success-modal',
  standalone: false,
  templateUrl: './success-modal.component.html',
})
export class SupplierSuccessModalComponent {
  /** Asignados vía NgbModal.componentInstance al abrir el modal */
  title = '';
  subtitle = '';
  mode: SupplierSuccessMode = 'create';
  summary: SupplierSuccessSummaryI = {
    businessName: '—',
    contributorType: '—',
    residency: '—',
    identification: '—',
    classification: '—',
    paymentMethod: '—',
    mainContact: '—',
    mainEmail: '—',
    retentionsCount: 0,
  };

  private readonly activeModal = inject(NgbActiveModal);

  goToList(): void {
    this.activeModal.close('list');
  }

  registerAnother(): void {
    this.activeModal.close('create-another');
  }
}
