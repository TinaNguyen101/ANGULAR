import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MasterRoutingModule } from './master-routing.module';
import { MasterComponent } from './../master/master.component';

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
  MatBadgeModule,
  MatTreeModule,
  MatDividerModule
  } from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxMaskModule } from 'ngx-mask';
import { ShareDirectiveModule } from '../_shared/Directive/share-directive.module';
import { MasterCustomerListComponent } from './master-customer-list/master-customer-list.component';
import { MasterInfoComponent } from './master-info/master-info.component';
import { MasterCustomerBasicInfoComponent } from './master-info/master-customer-basic-info/master-customer-basic-info.component';
import { MasterAnnualHolidayComponent } from './master-annual-holiday/master-annual-holiday.component';
import { MasterAnnualEvaluatorsComponent } from './master-annual-evaluators/master-annual-evaluators.component';
@NgModule({
  declarations: [MasterCustomerListComponent,MasterComponent, MasterAnnualHolidayComponent, MasterInfoComponent, MasterCustomerBasicInfoComponent, MasterAnnualEvaluatorsComponent],
  imports: [
    MatExpansionModule,
    DragDropModule,
    MatDividerModule,
    MatTreeModule,
    MatTooltipModule,
    MatToolbarModule,
    MatBadgeModule,
    CommonModule,
    MasterRoutingModule,
    ReactiveFormsModule,
    BsDatepickerModule.forRoot(),
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
    FlexLayoutModule,
    NgxMaskModule.forRoot(),
    ShareDirectiveModule
  ]
})
export class MasterModule { }
