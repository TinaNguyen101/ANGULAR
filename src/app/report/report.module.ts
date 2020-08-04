import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import {ReactiveFormsModule, FormsModule} from '@angular/forms';
import { ChartsModule } from 'ng2-charts';

import { ReportRoutingModule } from './report-routing.module';
import { ReportProjectComponent } from './report-project/report-project.component';
import { ReportComponent } from './report.component';

import {
  MatAutocompleteModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
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
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatStepperModule,
  ErrorStateMatcher,
  ShowOnDirtyErrorStateMatcher,
  } from '@angular/material';

import { ReportCustomersComponent } from './report-customers/report-customers.component';
import { NgxMaskModule } from 'ngx-mask';
import { ReportEmployeeComponent } from './report-employee/report-employee.component';
import { ReportAccountingComponent } from './report-accounting/report-accounting.component';
import { ShareDirectiveModule } from '../_shared/Directive/share-directive.module';
import { ReportAccountingMonthlySalaryComponent } from './report-accounting/report-accounting-monthly-salary/report-accounting-monthly-salary.component';
import { ReportAccountingAnnualBonusComponent } from './report-accounting/report-accounting-annual-bonus/report-accounting-annual-bonus.component';

@NgModule({
  declarations: [
    ReportComponent,
    ReportProjectComponent,
    ReportCustomersComponent,
    ReportEmployeeComponent,
    ReportAccountingComponent,
    ReportAccountingMonthlySalaryComponent,
    ReportAccountingAnnualBonusComponent
  ],
  imports: [
    CommonModule,
    ReportRoutingModule,
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
    ReactiveFormsModule,
    FormsModule,
    ChartsModule,
    ShareDirectiveModule,
    NgxMaskModule.forRoot()
  ],
  providers: [DecimalPipe]
})
export class ReportModule { }
