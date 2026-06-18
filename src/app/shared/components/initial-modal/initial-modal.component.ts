import {
  Component,
  EventEmitter,
  inject,
  input,
  Output,
  output,
} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
// import { InitialModalService } from '../../services/inital-modal.service';

@Component({
  standalone: false,
  selector: 'mf-core-shared-initial-modal',
  templateUrl: './initial-modal.component.html',
  styleUrls: ['./initial-modal.component.scss'],
})
export class InitialModalComponent {
  close = output<void>();

  confirmButtonText = input<string>('');
  saveAction = output<number>();

  certificates = 0;
  dateRange = '';

  // [AI-GENERATED | skill: mf-refactor-skill | Patr?n 18 | model: gemini-2-5-pro]
  // private readonly initialModalService = inject(InitialModalService);
  readonly activeModal = inject(NgbActiveModal);

  constructor() { }

  ngOnInit(): void {
    this.loadPendingAuthorizations();
  }

  loadPendingAuthorizations(): void {
    // this.initialModalService.get().subscribe((data) => {
    //   this.certificates = data.certificatesToApprove;
    //   this.dateRange = this.buildDateRange(
    //     data.minCreatedAt,
    //     data.maxCreatedAt,
    //   );
    // });
  }

  buildDateRange(min: string, max: string): string {
    const start = new Date(min);
    const end = new Date(max);

    const sameMonth = start.getMonth() === end.getMonth();
    const sameYear = start.getFullYear() === end.getFullYear();

    const dayStart = start.getDate();
    const dayEnd = end.getDate();

    const month = start.toLocaleDateString('es-ES', { month: 'long' });
    const year = start.getFullYear();

    if (sameMonth && sameYear) {
      // Ej: del 20 al 25 de noviembre del 2025
      return `del ${dayStart} al ${dayEnd} de ${month} del ${year}`;
    }

    // Si son meses o años diferentes, usa formato completo en ambos
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    };

    return `del ${start.toLocaleDateString('es-ES', options)} al ${end.toLocaleDateString('es-ES', options)}`;
  }

  approve() {
    // this.initialModalService.authorizeCertificates().subscribe({
    //   next: (res) => {
    //     // console.log('Respuesta del backend:', res);
    //     const cantidad = this.certificates;

    //     this.saveAction.emit(cantidad);

    //     this.activeModal.close(true);
    //   },
    //   error: (err) => {
    //     console.error('Error al aprobar:', err);
    //   },
    // });
  }

  onClose(): void {
    this.activeModal.dismiss();
  }
}
