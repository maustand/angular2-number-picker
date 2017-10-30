
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NumberPickerComponent } from './number-picker.component';

@NgModule({
  imports: [CommonModule],
  declarations: [NumberPickerComponent],
  exports: [NumberPickerComponent]
})
export class NumberPickerModule {
}