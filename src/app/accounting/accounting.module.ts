import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountingComponent } from './accounting.component';
import {ReactiveFormsModule, FormsModule} from '@angular/forms';
import { AccountingSalaryComponent } from './accounting-salary/accounting-salary.component';
import { AccountingMonthlySalaryComponent, DialogAccountingMonthSalary } from './accounting-monthly-salary/accounting-monthly-salary.component';
import { AccountingRoutingModule } from './accounting-routing.module';

import { MatAutocompleteModule, MatButtonModule, MatButtonToggleModule, MatCardModule, MatCheckboxModule, MatChipsModule, MatStepperModule, MatDatepickerModule, MatDialogModule, MatExpansionModule, MatGridListModule, MatIconModule, MatInputModule, MatListModule, MatMenuModule, MatNativeDateModule, MatPaginatorModule, MatProgressBarModule, MatProgressSpinnerModule, MatRadioModule, MatRippleModule, MatSelectModule, MatSidenavModule, MatSliderModule, MatSlideToggleModule, MatSnackBarModule, MatSortModule, MatTableModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import {NgxMaskModule} from 'ngx-mask';
import { ShareDirectiveModule } from '../_shared/Directive/share-directive.module';


@NgModule({
  declarations: [AccountingComponent, 
    AccountingSalaryComponent, 
    DialogAccountingMonthSalary,
    AccountingMonthlySalaryComponent],
  imports: [
    CommonModule,
    AccountingRoutingModule,

    ReactiveFormsModule,

    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatStepperModule,
    MatDatepickerModule,
    MatDialogModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    FormsModule,
    FlexLayoutModule,
    NgxMaskModule.forRoot(),
    ShareDirectiveModule


  ]
  ,entryComponents: [ DialogAccountingMonthSalary]
})
export class AccountingModule { }
