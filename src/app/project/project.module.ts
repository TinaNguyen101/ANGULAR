import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap';

import { ProjectRoutingModule } from './project-routing.module';
import { ProjectListComponent } from './project-list/project-list.component';
import { ProjectComponent } from './project.component';
import { ProjectInfoComponent } from './project-info/project-info.component';
import { ProjectInfoBasicComponent } from './project-info/project-info-basic/project-info-basic.component';
import { ProjectInfoAttachfileComponent } from './project-info/project-info-attachfile/project-info-attachfile.component';
import { ProjectInfoMemberComponent } from './project-info/project-info-member/project-info-member.component';
import { ProjectInfoMaintenanceComponent } from './project-maintenance/project-info-maintenance.component';
// tslint:disable-next-line:max-line-length
import { ProjectMaintenanceListComponent } from './project-maintenance/project-maintenance-list/project-maintenance-list.component';
import { ProjectMaintenanceInfoComponent } from './project-maintenance/project-maintenance-info/project-maintenance-info.component';
// tslint:disable-next-line:max-line-length
import { ProjectMaintenanceInfoBasicComponent } from './project-maintenance/project-maintenance-info/project-maintenance-info-basic/project-maintenance-info-basic.component';
// tslint:disable-next-line:max-line-length
import { ProjectMaintenanceInfoMemberComponent } from './project-maintenance/project-maintenance-info/project-maintenance-info-member/project-maintenance-info-member.component';
// tslint:disable-next-line:max-line-length
import { ProjectMaintenanceInfoAttachfileComponent } from './project-maintenance/project-maintenance-info/project-maintenance-info-attachfile/project-maintenance-info-attachfile.component';

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
  ShowOnDirtyErrorStateMatcher
  } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import {NgxMaskModule} from 'ngx-mask';
import { MyTelInput } from './_share/date-picker/date-picker.component';
import { MyAlertDialogComponent } from '../_shared/control/my-alert-dialog/my-alert-dialog.component';
import { SharedService } from './_share/shared-service';
import { DownloadComponent } from './_share/download/download.component';
import { UploadDownloadService } from './_services/upload-download.service';
import { ProjectInfoTaskComponent } from './project-info/project-info-task/project-info-task.component';
import { ProjectMaintenanceInfoTaskComponent } from './project-maintenance/project-maintenance-info/project-maintenance-info-task/project-maintenance-info-task.component';
import { ShareDirectiveModule } from '../_shared/Directive/share-directive.module';
@NgModule({
  declarations: [ProjectListComponent,
    ProjectComponent,
    ProjectInfoComponent,
    ProjectInfoBasicComponent,
    ProjectInfoAttachfileComponent,
    ProjectInfoMemberComponent,
    ProjectInfoMaintenanceComponent,
    ProjectMaintenanceListComponent,
    ProjectMaintenanceInfoComponent,
    ProjectMaintenanceListComponent,
    ProjectMaintenanceInfoBasicComponent,
    ProjectMaintenanceInfoMemberComponent,
    ProjectMaintenanceInfoAttachfileComponent,
    MyTelInput,
    MyAlertDialogComponent,
    DownloadComponent,
    ProjectInfoTaskComponent,
    ProjectMaintenanceInfoTaskComponent
  ],
  imports: [
    CommonModule,
    ProjectRoutingModule,
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
  ],
  providers: [
    SharedService,
    UploadDownloadService
  ],entryComponents: [  MyAlertDialogComponent]
})
export class ProjectModule { }
