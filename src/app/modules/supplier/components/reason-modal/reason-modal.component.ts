// [AI-GENERATED | skill: mf-feature-skill | spec: tasks/mf-finance/feat-012-mf-edicion-proveedor.md
//  | ticket: #012 | model: claude-opus-4-6]

import { Component, input, output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'mf-finance-supplier-reason-modal',
  standalone: false,
  templateUrl: './reason-modal.component.html',
  styleUrls: ['./reason-modal.component.scss'],
})
export class ReasonModalComponent {
  /** Controla la visibilidad del modal */
  isOpen = input<boolean>(false);

  /** Emite el texto del motivo cuando el usuario confirma */
  confirmed = output<string>();

  /** Emite void cuando el usuario cancela */
  cancelled = output<void>();

  /** FormControl interno del textarea de motivo */
  readonly reasonControl = new FormControl('', [
    Validators.required,
    Validators.maxLength(500),
  ]);

  /** Retorna la longitud actual del texto */
  get charCount(): number {
    return this.reasonControl.value?.length || 0;
  }

  /** Confirma el motivo y emite al padre */
  onConfirm(): void {
    this.reasonControl.markAsTouched();
    if (this.reasonControl.invalid) return;

    this.confirmed.emit(this.reasonControl.value!);
    this.reasonControl.reset('');
  }

  /** Cancela y cierra el modal sin guardar */
  onCancel(): void {
    this.reasonControl.reset('');
    this.cancelled.emit();
  }
}
