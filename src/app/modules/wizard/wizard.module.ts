import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WizardComponent } from './wizard.component';
import { WizardStepComponent } from './wizard-step/wizard-step/wizard-step.component';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    WizardComponent,
    WizardStepComponent
  ],
  declarations: [WizardComponent, WizardStepComponent]
})
export class WizardModule { }
