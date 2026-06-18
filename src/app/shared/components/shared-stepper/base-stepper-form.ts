import { Directive, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SharedStepperService } from './shared-stepper.service';

/**
 * Base class for stepper forms. 
 * Automatically handles the subscription to requestSubmit$ and validation status.
 */
@Directive()
export class BaseStepperForm implements OnInit, OnDestroy {
  private baseSub = new Subscription();
  
  constructor(protected stepperService: SharedStepperService) { }
  
  ngOnInit() {
    // 1. Mark form as valid by default (you should override this logic or call it when the form changes)
    this.stepperService.setValid(true);
    
    // 2. Listen for the "Continuar" button click
    this.baseSub.add(
      this.stepperService.requestSubmit$.subscribe(() => {
        this.submitForm();
      })
    );
  }
  
  /**
   * Override this method in the child component to implement real save logic.
   * Make sure to call this.stepperService.nextStep() when the save is successful.
   */
  submitForm() {
    // Simulate a successful save
    this.stepperService.nextStep();
  }
  
  ngOnDestroy() {
    this.baseSub.unsubscribe();
  }
}
