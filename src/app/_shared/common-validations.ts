import { AbstractControl, ValidatorFn, FormGroup, FormControl } from '@angular/forms';
import * as moment from 'moment'
import { ElementRef } from '@angular/core';

export function phoneNumberValidator(
  control: AbstractControl
): { [key: string]: any } | null {
  const valid = /^\d+$/.test(control.value);
  return valid
    ? null
    : { phoneNumber: { valid: false, value: control.value } };
}


export function costCurrencySymboyRequiredValidator(costControlName: string, currencySymbolControlName: string): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    if (!control.parent) {
      return null;
    }
    let costEl = control.parent.get(costControlName);
    if (!costEl) {
      return null;
    }
    let currencyEl = control.parent.get(currencySymbolControlName);
    if (!currencyEl) {
      return null;
    }
    if (costEl.value && !currencyEl.value) {
      return { symboyRequired: true };
    }
    /*else
    {
      return { symboyRequired: false };
    }*/
    return null;
  }
}


export function compareDateValidator(startDateControlName: string, endDateControlName: string): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    if (!control.parent) {
      return null;
    }
    let startDate = control.parent.get(startDateControlName);
    let endDate = control.parent.get(endDateControlName);
    // debugger;
    // console.log(startDate.value);
    // console.log(endDate.value);
    if (!endDate.value) {
      return null;
    }
    if (!startDate.value) {
      return null;
    }
    let _Sdate = moment(startDate.value).format("YYYY/MM/DD");
    let _Edate = moment(endDate.value).format("YYYY/MM/DD");
    if (_Edate < _Sdate) {
      return { compareDate: true };
    }
    return null;
  };
}

export function customRequiredValidator(
  input: ElementRef
): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    return input.nativeElement.value != ''
      ? null
      : { customRequired: true };
  }
}
export function compareDateInDBValidator(check:boolean): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    debugger
    if (!check) {
      return { compareDateInDB: true };
    }
    return null;
  };
}

export function compareTimeValidator(startDateControlName: string, endDateControlName: string): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    if (!control.parent) {
      return null;
    }
    debugger;
    let startDate = control.parent.get(startDateControlName);
    let endDate = control.parent.get(endDateControlName);
    if (!endDate.value) {
      return null;
    }
    if (!startDate.value) {
      return null;
    }
    let _Sdate = moment(startDate.value).format("YYYY/MM/DD");
    let _Edate = moment(endDate.value).format("YYYY/MM/DD");
    if (_Edate < _Sdate) {
      return { compareDate: true };
    }
    return null;
  };
}
