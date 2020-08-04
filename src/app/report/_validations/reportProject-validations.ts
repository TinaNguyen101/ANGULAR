import { AbstractControl, ValidatorFn, FormControl } from '@angular/forms';
import { MatDatepicker, MatDatepickerInput } from '@angular/material';
import { ElementRef } from '@angular/core';

export function monthRequiredValidator(
    reportBy: AbstractControl, dateInput: ElementRef
  ): ValidatorFn {
      return (control: FormControl): {[key: string]: any} | null =>
        {
            if(reportBy.value != 'm'){
                return null;
            }

            return dateInput.nativeElement.value != ''
            ? null
            : { monthRequired: true };
        }
    }

    export function monthFormatValidator(
        reportBy: AbstractControl, dateInput: ElementRef
      ): ValidatorFn {
          return (control: FormControl): {[key: string]: any} | null =>
            {
                if(reportBy.value != 'm'){
                    return null;
                }
    
                if  (dateInput.nativeElement.value == ''){
                    return null;
                }
    
                return control.value != null
                ? null
                : { monthFormat: true };
            }
        }

    export function yearRequiredValidator(
        reportBy: AbstractControl
      ): ValidatorFn {
          return (control: FormControl): {[key: string]: any} | null =>
            {
                if(reportBy.value != 'y'){
                    return null;
                }
                return control.value != '' 
                ? null
                : { yearRequired: true };
            }
        }