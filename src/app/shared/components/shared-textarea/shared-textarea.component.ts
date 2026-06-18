import {
  Component,
  ElementRef,
  HostListener,
  input,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';

interface ResizeState {
  isResizing: boolean;
  startX: number;
  startY: number;
  startWidth: number;
  startHeight: number;
}

@Component({
  standalone: false,
  selector: 'mf-core-shared-textarea',
  templateUrl: './shared-textarea.component.html',
  styleUrl: './shared-textarea.component.scss',
})
export class SharedTextareaComponent {
  @ViewChild('textareaContainer')
  textareaContainer!: ElementRef<HTMLTextAreaElement>;
  control = input<FormControl>();
  rows = input<number | string>(2);
  value = input<string>();
  label = input<string>('Completa el texto');
  maxLength = input<number | null>(null);
  resize = input<'none' | 'both' | 'horizontal' | 'vertical'>('both');
  disabled = input<boolean>(false);

  private resizeState: ResizeState = {
    isResizing: false,
    startX: 0,
    startY: 0,
    startWidth: 0,
    startHeight: 0,
  };

  // Iniciar resize
  onResizeStart(event: MouseEvent | TouchEvent): void {
    event.preventDefault();

    const textAreaContainer = this.textareaContainer.nativeElement;
    const textAreaContainerComputedStyle = getComputedStyle(textAreaContainer);

    this.resizeState = {
      isResizing: true,
      startX: this.getClientX(event),
      startY: this.getClientY(event),
      startWidth: parseInt(textAreaContainerComputedStyle.width, 10),
      startHeight: parseInt(textAreaContainerComputedStyle.height, 10),
    };

    this.toggleUserSelect(false);
  }

  // Manejar movimiento
  @HostListener('document:mousemove', ['$event'])
  @HostListener('document:touchmove', ['$event'])
  onResizeMove(event: MouseEvent | TouchEvent): void {
    if (!this.resizeState.isResizing) return;
    if (this.disabled()) return;
    if (this.resize() === 'both') {
      this.onResizeX(event);
      this.onResizeY(event);
    }

    if (this.resize() === 'horizontal') {
      this.onResizeX(event);
    }
    if (this.resize() === 'vertical') {
      this.onResizeY(event);
    }
  }

  private onResizeX(event: MouseEvent | TouchEvent) {
    const dx = this.getClientX(event) - this.resizeState.startX;
    const newWidth = Math.max(this.resizeState.startWidth + dx, 0);
    this.textareaContainer.nativeElement.style.width = `${newWidth}px`;
  }

  private onResizeY(event: MouseEvent | TouchEvent) {
    const dy = this.getClientY(event) - this.resizeState.startY;
    const newHeight = Math.max(this.resizeState.startHeight + dy, 0);
    this.textareaContainer.nativeElement.style.height = `${newHeight}px`;
  }

  // Finalizar resize
  @HostListener('document:mouseup')
  @HostListener('document:touchend')
  onResizeEnd(): void {
    this.resizeState.isResizing = false;
    this.toggleUserSelect(true);
  }

  // Helpers para eventos táctiles
  private getClientX(event: MouseEvent | TouchEvent): number {
    return event instanceof TouchEvent
      ? event.touches[0].clientX
      : event.clientX;
  }

  private getClientY(event: MouseEvent | TouchEvent): number {
    return event instanceof TouchEvent
      ? event.touches[0].clientY
      : event.clientY;
  }

  // Mejor UX: deshabilitar selección durante resize
  private toggleUserSelect(enable: boolean): void {
    document.body.style.userSelect = enable ? '' : 'none';
  }
}
