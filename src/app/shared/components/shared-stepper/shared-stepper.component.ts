import { Component, Input, OnInit, OnDestroy, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { StepperStepConfig } from './shared-stepper.interface';
import { SharedStepperService } from './shared-stepper.service';

@Component({
  selector: 'mf-core-shared-stepper',
  templateUrl: './shared-stepper.component.html',
  styleUrls: ['./shared-stepper.component.scss'],
  standalone: false
})
export class SharedStepperComponent implements OnInit, OnDestroy {
  @Input() steps: StepperStepConfig[] = [];

  public currentStepIndex = 0;
  private subscriptions = new Subscription();

  public readonly stepperService = inject(SharedStepperService);

  get currentStep(): StepperStepConfig | undefined {
    return this.steps[this.currentStepIndex];
  }

  get isLastStep(): boolean {
    return this.currentStepIndex === this.steps.length - 1;
  }

  get nextStepLabel(): string {
    if (this.isLastStep) return 'Finalizar';
    const nextStep = this.steps[this.currentStepIndex + 1];
    return nextStep ? `Continuar ${nextStep.label}` : 'Continuar';
  }

  ngOnInit() {
    // Escuchar cuando el hijo termine de guardar y nos diga que avancemos
    this.subscriptions.add(
      this.stepperService.stepCompleted$.subscribe(() => {
        this.goToNextStep();
      })
    );
    this.stepperService.resetState();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  onContinue() {
    if (this.stepperService.isCurrentStepValid()) {
      // Disparar evento para que el hijo guarde
      this.stepperService.triggerSubmit();
    }
  }

  onBack() {
    if (this.currentStepIndex > 0) {
      this.currentStepIndex--;
      this.stepperService.resetState();
    }
  }

  private goToNextStep() {
    if (!this.isLastStep) {
      this.currentStepIndex++;
      this.stepperService.resetState();
    }
  }

  goToStep(index: number) {
    this.currentStepIndex = index;
    this.stepperService.resetState();
  }
}
