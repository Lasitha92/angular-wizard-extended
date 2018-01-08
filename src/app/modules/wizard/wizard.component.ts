import {
  AfterContentInit, Component, ContentChildren, EventEmitter, Input, OnInit, Output,
  QueryList
} from '@angular/core';
import {WizardStepComponent} from './wizard-step/wizard-step/wizard-step.component';

@Component({
  selector: 'app-wizard',
  templateUrl: './wizard.component.html',
  styleUrls: ['./wizard.component.css']
})
export class WizardComponent implements OnInit, AfterContentInit {
  validationMessage: string = '';
  @ContentChildren(WizardStepComponent)
  wizardSteps: QueryList<WizardStepComponent>;

  @Input()
  holdOnStepChange = false;
  @Output()
  onStepChanged: EventEmitter<WizardStepComponent> = new EventEmitter<WizardStepComponent>();
  @Output()
  onNextStepPaused: EventEmitter<number> = new EventEmitter<number>();
  @Output()
  onPrevStepPaused: EventEmitter<number> = new EventEmitter<number>();

  private _steps: Array<WizardStepComponent> = [];
  private _isCompleted: boolean;
  private isPrevPaused = false;
  private isNextPaused = false;
  private disableMessage = '';

  constructor() {
    this._isCompleted = false;
  }

  ngOnInit() {
  }

  ngAfterContentInit() {
    this.wizardSteps.forEach(step => this._steps.push(step));
    this.steps[0].isActive = true;
  }

  public setCompleted(completed: boolean): void {
    this._isCompleted = completed;
  }

  get steps(): Array<WizardStepComponent> {
    return this._steps.filter(step => !step.hidden);
  }

  get isCompleted(): boolean {
    return this._isCompleted;
  }

  private get activeStep(): WizardStepComponent {
    return this.steps.find(step => step.isActive);
  }

  private set activeStep(step: WizardStepComponent) {
    if (step !== this.activeStep && !step.isDisabled) {
      this.activeStep.isActive = false;
      step.isActive = true;
      this.onStepChanged.emit(step);
    }
  }

  private get activeStepIndex(): number {
    return this.steps.indexOf(this.activeStep);
  }

  get hasNextStep(): boolean {
    return this.activeStepIndex < this.steps.length - 1;
  }

  private get hasPrevStep(): boolean {
    return this.activeStepIndex > 0;
  }

  goToStep(step: WizardStepComponent) {
    if (!this.isCompleted) {
      this.activeStep = step;
    }
  }

  goToStepByIndex(step: number) {
    if (!this.isCompleted) {
      const nextStep: WizardStepComponent = this.steps[step];
      if (step - 1 === this.activeStepIndex) {
        this.activeStep.onNext.emit();
      }
      if (step + 1 === this.activeStepIndex) {
        this.activeStep.onPrev.emit();
      }
      nextStep.isDisabled = false;
      this.activeStep = nextStep;
    }
  }

  next() {
    if (this.hasNextStep) {
      if (this.holdOnStepChange) {
        this.isPrevPaused = false;
        this.isNextPaused = true;
        this.onNextStepPaused.emit(this.activeStepIndex);
      } else {
        const nextStep: WizardStepComponent = this.steps[this.activeStepIndex + 1];
        this.activeStep.onNext.emit();
        nextStep.isDisabled = false;
        this.activeStep = nextStep;
      }
    }
  }

  previous() {
    if (this.hasPrevStep) {
      if (this.holdOnStepChange) {
        this.isNextPaused = false;
        this.isPrevPaused = true;
        this.onPrevStepPaused.emit(this.activeStepIndex);
      } else {
        const prevStep: WizardStepComponent = this.steps[this.activeStepIndex - 1];
        this.activeStep.onPrev.emit();
        prevStep.isDisabled = false;
        this.activeStep = prevStep;
      }
    }
  }

  complete() {
    if (this.holdOnStepChange) {
      this.isNextPaused = true;
      this.isPrevPaused = false;
      this.onNextStepPaused.emit(this.activeStepIndex);
    } else {
      this.activeStep.onComplete.emit();
      this._isCompleted = true;
    }
  }

  continuePaused() {
    if (this.isNextPaused) {
      if (this.hasNextStep) {
        const nextStep: WizardStepComponent = this.steps[this.activeStepIndex + 1];
        this.activeStep.onNext.emit();
        nextStep.isDisabled = false;
        this.activeStep = nextStep;
        this.isNextPaused = false;
      } else {
        this.activeStep.onComplete.emit();
        this._isCompleted = true;
      }
    } else if (this.isPrevPaused) {
      const prevStep: WizardStepComponent = this.steps[this.activeStepIndex - 1];
      this.activeStep.onPrev.emit();
      prevStep.isDisabled = false;
      this.activeStep = prevStep;
      this.isPrevPaused = false;
    }
  }

  onMouseOver() {
    if (!this.activeStep.isValid) {
      this.disableMessage = this.validationMessage;
    }
  }

  onMouseLeave() {
    this.disableMessage = '';
  }
}
