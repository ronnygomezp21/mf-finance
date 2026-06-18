import { Injectable, signal } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root' // Provide globally so it can be used across steps easily, though typically could be provided in component
})
export class SharedStepperService {
  // Signal to let the parent know if the current step form is valid
  public isCurrentStepValid = signal<boolean>(false);

  // Observable for parent to tell the current step to execute save/submit
  private requestSubmitSubject = new Subject<void>();
  public requestSubmit$ = this.requestSubmitSubject.asObservable();

  // Observable for child to tell the parent that save was successful and it can move to next step
  private stepCompletedSubject = new Subject<void>();
  public stepCompleted$ = this.stepCompletedSubject.asObservable();

  /**
   * Called by the child component whenever its form validity changes.
   */
  setValid(isValid: boolean) {
    this.isCurrentStepValid.set(isValid);
  }

  /**
   * Called by the parent component when the user clicks 'Continuar'.
   */
  triggerSubmit() {
    this.requestSubmitSubject.next();
  }

  /**
   * Called by the child component after successfully saving data.
   */
  nextStep() {
    this.stepCompletedSubject.next();
  }

  /**
   * Resets the validity state when moving to a new step.
   */
  resetState() {
    this.isCurrentStepValid.set(false);
  }
}
