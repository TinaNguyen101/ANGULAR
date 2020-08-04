import { NgModule } from '@angular/core';
import { numberDirective } from './mask.numbernocomma.directive';
import { dateFormatDirective } from './mask.date.directive';
import { numberCommaSeparatorDirective } from './mask.number.directive';
import { yearmonthFormatDirective } from './mask.yearmonth.directive';
import { SpecialCharacterDirective } from './mask.directive';
import { HourMinDirective } from './hour-min.directive';



@NgModule({
  declarations: [
    numberDirective,
    dateFormatDirective,
    numberCommaSeparatorDirective,
    yearmonthFormatDirective,
    SpecialCharacterDirective,
    HourMinDirective,
    HourMinDirective
  ],
  exports: [
    numberDirective,
    dateFormatDirective,
    numberCommaSeparatorDirective,
    yearmonthFormatDirective,
    SpecialCharacterDirective,
    HourMinDirective
  ]
})
export class ShareDirectiveModule { }
