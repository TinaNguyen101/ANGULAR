import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import {ReactiveFormsModule, FormsModule} from '@angular/forms';
import { EmployeeComponent } from './employee.component';
import { EmployeeRoutingModule } from './employee-routing.module';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { EmployeeInfoComponent } from './employee-info/employee-info.component';
import { EmployeeInfoBasicComponent } from './employee-info/employee-info-basic/employee-info-basic.component';
import { EmployeeInfoAttachfileComponent } from './employee-info/employee-info-attachfile/employee-info-attachfile.component';
import { EmployeeAnnualLeavePaidComponent, DialogFormDayOff } from './employee-annual-leave-paid/employee-annual-leave-paid.component';
import { EmployeeAnnualRatingFactorComponent } from './employee-annual-rating-factor/employee-annual-rating-factor.component';
import { EmployeeAnnualBonusComponent } from './employee-info/employee-annual-bonus/employee-annual-bonus.component';
import { EmployeeAnnualKPIComponent } from './employee-info/employee-annual-kpi/employee-annual-kpi.component';
import { EmployeeAnnualEvaluationComponent } from './employee-info/employee-annual-kpi/employee-annual-evaluation/employee-annual-evaluation.component';
import { EmployeeAnnualReviewComponent } from './employee-info/employee-annual-kpi/employee-annual-review/employee-annual-review.component';
import { EmployeeAnnualKPIResultComponent } from './employee-info/employee-annual-kpi/employee-annual-kpi-result/employee-annual-kpi-result.component';
import { MatAutocompleteModule, MatButtonModule, MatButtonToggleModule, MatCardModule, MatCheckboxModule, MatChipsModule, MatStepperModule, MatDatepickerModule, MatDialogModule, MatExpansionModule, MatGridListModule, MatIconModule, MatInputModule, MatListModule, MatMenuModule, MatNativeDateModule, MatPaginatorModule, MatProgressBarModule, MatProgressSpinnerModule, MatRadioModule, MatRippleModule, MatSelectModule, MatSidenavModule, MatSliderModule, MatSlideToggleModule, MatSnackBarModule, MatSortModule, MatTableModule, MatTabsModule } from '@angular/material';
import { ShareDirectiveModule } from '../_shared/Directive/share-directive.module';
import { FlexLayoutModule } from '@angular/flex-layout';


import { UploadDownloadService } from './_services/upload-download.service';
import { DownloadComponent } from './_share/download/download.component';
import { SharedService } from './_share/shared-service';
import { MyAlertDialogComponent } from '../_shared/control/my-alert-dialog/my-alert-dialog.component';

// import { numberDirective } from '../_shared/Directive/mask.numbernocomma.directive';




@NgModule({
  declarations: [EmployeeComponent, 
    EmployeeListComponent, 
    EmployeeInfoComponent, 
    EmployeeInfoBasicComponent, 
    EmployeeInfoAttachfileComponent, 
    EmployeeAnnualLeavePaidComponent, 
    EmployeeAnnualRatingFactorComponent, 
    EmployeeAnnualBonusComponent, 
    EmployeeAnnualKPIComponent, 
    EmployeeAnnualEvaluationComponent, 
    EmployeeAnnualReviewComponent, 
    EmployeeAnnualKPIResultComponent, 
    DialogFormDayOff,
    DownloadComponent
    // numberDirective
  ],
  imports: [
    FlexLayoutModule,
    ReactiveFormsModule,
    CommonModule,
    EmployeeRoutingModule,
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
    ShareDirectiveModule,
    MatTabsModule
  ],
  providers: [
    SharedService,
    UploadDownloadService,
    DecimalPipe
  ]
  ,entryComponents: [ DialogFormDayOff]
})
export class EmployeeModule { }
