import { Component, EventEmitter, Input, OnInit, Output, forwardRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'angular2-number-picker',
  template: `
    <div class="ngxNumberPicker-container input-group">  
      <div class="input-group-btn">
        <button type="button" class="btn btn-default" (click)="decreaseValue()" [disabled]="isControlDisabled">
          <span class="glyphicon glyphicon-menu-down"></span>
        </button>
      </div>
      
      <input [value]="innerValue" class="form-control text-center" 
      [disabled]="isControlDisabled" 
      (change)="onInputChange($event)" 
      type="number" 
      min="{{min}}" 
      max="{{max}}" 
      pattern="{{pattern}}"/>
      <span *ngIf="addon" class="input-group-addon">{{ addon }}</span>
      <div class="input-group-btn">
        <button type="button" class="btn btn-default" (click)="increaseValue()" [disabled]="isControlDisabled">
          <span class="glyphicon glyphicon-menu-up"></span>
        </button>
      </div>
    </div>
  `,
  styles: [`
    /* Remove native spinner for chrome */
      input[type=number]::-webkit-inner-spin-button, input[type=number]::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }
    
      /* Remove native spinner for mozilla */  
      input[type=number] {
        -moz-appearance: textfield;
      }
      
      span.input-group-addon {
          padding: 6px 12px;
          border-left-width: 0px;
      }
  `],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    // tslint:disable-next-line
    useExisting: forwardRef(() => NumberPickerComponent),
    multi: true
  }]

})
export class NumberPickerComponent implements OnInit {
	@Input() min: number;
	@Input() max: number;
	@Input() step: number;
	@Input() precision: number;
  @Input() addon: string;

  isControlDisabled: boolean;

  _onTouched = () => {};
  _onPropagateChange = (_: any) => {};


  @Output() onChange: EventEmitter<number> = new EventEmitter();

  private numberPicker: FormControl;

	constructor() {}

	ngOnInit() {
    if(this.min == null) {
      this.min = 0;
    }
    if(this.max == null) {
      this.max = Number.MAX_VALUE;
    }
    if(this.precision == null) {
      this.precision = 1;
    }
    if(this.step == null) {
      this.step = 1;
    }

		this.numberPicker = new FormControl({value: this.min });
		this.numberPicker.registerOnChange(() => {
			this.onChange.emit(this.numberPicker.value);
		});
  }

  /* ControlValue Interface Fn */
  writeValue( value : any ) : void {
    if(this.numberPicker.value !== value ){
      this.numberPicker.setValue(value)
    }
  }

  registerOnChange(fn: (_: any) => {}): void {
    this._onPropagateChange = fn;
  }

  registerOnTouched(fn: () => {}): void {
    this._onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isControlDisabled = isDisabled;
  }

  increaseValue(): void {
  		let currentValue = this.numberPicker.value;
  		if(currentValue < this.max) {
  			currentValue = currentValue+this.step;
  			if(this.precision != null) {
  				currentValue = this.round(currentValue, this.precision);
  			}
  			this.numberPicker.setValue(currentValue);
        this._onPropagateChange(currentValue);
  		}
  	}

    decreaseValue(): void {
  		let currentValue = this.numberPicker.value;
  		if(currentValue > this.min) {
  			currentValue = currentValue-this.step;
  			if(this.precision != null) {
  				currentValue = this.round(currentValue, this.precision);
  			}
  			this.numberPicker.setValue(currentValue);
        this._onPropagateChange(currentValue);
  		}
  	}

    round(value:number, precision:number): number {
  		let multiplier : number = Math.pow(10, precision || 0);
    	return Math.round(value * multiplier) / multiplier;
  	}
}