import { Type } from '@angular/core';

export interface StepperStepConfig {
  id: string;
  label: string;
  description?: string;
  component: Type<any>;
}
