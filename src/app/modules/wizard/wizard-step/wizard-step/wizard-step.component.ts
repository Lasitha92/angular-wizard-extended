import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-wizard-step',
  templateUrl: './wizard-step.component.html',
  styleUrls: ['./wizard-step.component.css']
})
export class WizardStepComponent implements OnInit {
  @Input() title: string;
  @Input() hidden: boolean = false;
  @Input() isValid: boolean = true;
  @Input() showNext: boolean = true;
  @Input() showPrev: boolean = true;

  @Output() onNext: EventEmitter<any> = new EventEmitter<any>();
  @Output() onPrev: EventEmitter<any> = new EventEmitter<any>();
  @Output() onComplete: EventEmitter<any> = new EventEmitter<any>();

  @Input('isActive') set isActive(isActive: boolean) {
    this._isActive = isActive;
    this.isDisabled = false;
  }

  private _isActive: boolean = false;
  isDisabled: boolean = true;

  constructor() {
  }

  ngOnInit() {
  }

  get isActive(): boolean {
    return this._isActive;
  }

}
