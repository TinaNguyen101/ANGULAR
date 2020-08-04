import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectMaintenance } from '../../../_models/project-maintenance';
import { FormControl, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ProjectMaintenanceService } from '../../../_services/projects-maintenance.service';
import { Location } from '@angular/common';
import { ProjectService } from '../../../_services/projects.service';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

import { Commons } from '../../../../_shared/common_function';

import { from } from 'rxjs';
import { costCurrencySymboyRequiredValidator, compareDateValidator } from 'src/app/_shared/common-validations';
import { ProjectMaintenanceInfoComponent } from 'src/app/project/project-maintenance/project-maintenance-info/project-maintenance-info.component';
import { MyAlertDialogComponent } from 'src/app/_shared/control/my-alert-dialog/my-alert-dialog.component';
import { MatDialog } from '@angular/material';
import { SharedService } from 'src/app/project/_share/shared-service';

export const MONTH_ONLY_FORMATS = {
  parse: {
    dateInput: 'YYYY/MM/DD',
  },
  display: {
    dateInput: 'YYYY/MM/DD',
    monthYearLabel: 'YYYY MMM DD',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY MMM DDD',
  },
};
@Component({
  selector: 'app-project-maintenance-info-basic',
  templateUrl: './project-maintenance-info-basic.component.html',
  styleUrls: ['./project-maintenance-info-basic.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },

    { provide: MAT_DATE_FORMATS, useValue: MONTH_ONLY_FORMATS },
    ProjectMaintenanceInfoComponent
  ],
})
export class ProjectMaintenanceInfoBasicComponent implements OnInit {
  @ViewChild('CostCurrency', { read: ElementRef, static: false }) CostCurrency: ElementRef;
  @ViewChild('estimateCost', { read: ElementRef, static: false }) estimateCost: ElementRef;
  defaultCheck: number;
  form: FormGroup;
  submitted: boolean;
  error: string;
  date: Date;
  projectMaintenanceId: number;
  projectId : number;
  MstCostCurrency: any;
  MstProjectStatus: any;
  projectMaintenance = new ProjectMaintenance();
  //comp:ProjectInfoMaintenanceComponent;


  constructor(private service: ProjectMaintenanceService,
    private formBuilder: FormBuilder,
    private projectService: ProjectService,
    private route: Router,
    private location: Location,
    private commons: Commons,
    private comp: ProjectMaintenanceInfoComponent,
    private dialog: MatDialog,
    private _sharedService: SharedService) {

  }

  ngOnInit() {
    this.projectMaintenanceId = parseInt(localStorage.getItem("projectMaintenanceId"));
    this.projectId = parseInt(localStorage.getItem("projectMaintenanceId"));
    this.form = this.formBuilder.group({
      Id: new FormControl(""),
      MaintenanceName: new FormControl("", {
        validators: [Validators.required
        ]
      }),
      projectId: new FormControl("", {
        validators: [
        ]
      }),
      startDate: new FormControl("", {
        validators: [Validators.required, compareDateValidator('startDate', 'endDate')
        ]
      }),
      endDate: new FormControl('', {
        validators: [Validators.required, compareDateValidator('startDate', 'endDate')
        ]
      }),
      paymentDate: new FormControl('', {
        validators: [
        ]
      }),
      maintenanceContent: new FormControl('', {
        validators: [Validators.required
        ]
      }),
      estimateCost: new FormControl('', {
        validators: [
          costCurrencySymboyRequiredValidator('estimateCost', 'CostCurrency')
        ]
      }),
      estimateCostCurrencyId: new FormControl('', {
        validators: [
        ]
      }),
      ProjectStatusName: new FormControl('', {
        validators: [
        ]
      }),
      CostCurrency: new FormControl('', {
        validators: [costCurrencySymboyRequiredValidator('estimateCost', 'CostCurrency')
        ]
      }), CostCurrencySymboy: new FormControl('', {
        validators: [
        ]
      }), EstimateManDay: new FormControl('', {
        validators: [
        ]
      }), DeliveryDate: new FormControl('', {
        validators: [
        ]
      }), MaintenanceStatusId: new FormControl('', {
        validators: [
        ]
      })
    });
    this.projectService.getMasterData("MstCostCurrency").subscribe(r => {
      this.MstCostCurrency = r.mst;
      if(!this.projectMaintenanceId){
        this.defaultCheck = r.mst[0].Id;
      }
    });
    this.projectService.getMasterData("MstProjectStatus").subscribe(r => this.MstProjectStatus = r.mst);
    if (this.projectMaintenanceId) {//edit
      console.log("di qua toi")
      this.service.getProjectMaintenancesInfo(this.projectMaintenanceId).subscribe(r => {
        this.projectMaintenance = r,
          this.form.patchValue({
            MaintenanceName: r.MaintenanceName,
            Id: r.Id,
            startDate: r.StartDate,
            endDate: r.EndDate,
            paymentDate: r.PaymentDate,
            maintenanceContent: r.MaintenanceContent,
            estimateCost: r.EstimateCost,
            CostCurrency: r.EstimateCostCurrencyId,
            EstimateManDay: r.EstimateManDay,
            DeliveryDate: r.DeliveryDate,
            MaintenanceStatusId: r.MaintenanceStatusId,
            ProjectStatusName: r.ProjectStatusName
          });
      });
    } else {//create
      this.form.reset();
    }

  }

  get f() { return this.form.controls; }

  detectmob() {
    if (navigator.userAgent.match(/Android/i)
      || navigator.userAgent.match(/webOS/i)
      || navigator.userAgent.match(/iPhone/i)
      || navigator.userAgent.match(/iPad/i)
      || navigator.userAgent.match(/iPod/i)
      || navigator.userAgent.match(/BlackBerry/i)
      || navigator.userAgent.match(/Windows Phone/i)
    ) {

      if (!navigator.hardwareConcurrency) {
        return true;
      }
      return false;
    }
    else {
      return false;
    }
  }
  convertStyleObject(style: string) {
    return JSON.parse(style);
  }
  checkShowHideValid(event: any) {
    if (this.form.controls.estimateCost.errors) {
      if (this.form.controls.estimateCost.errors.symboyRequired) {
        this.form.controls['CostCurrency'].setErrors({ 'symboyRequired': true });
        this.CostCurrency.nativeElement.focus();
        this.CostCurrency.nativeElement.blur();
      }
    }
    if (!this.form.controls.estimateCost.errors) {
      this.form.controls['CostCurrency'].setErrors(null);
      this.CostCurrency.nativeElement.focus();
      this.CostCurrency.nativeElement.blur();
    }
  }



  checkValidEstimateCost() {
    if (this.form.controls.estimateCost.errors) {
      if (this.form.controls.estimateCost.errors.symboyRequired && !this.form.controls.CostCurrency.errors) {
        this.form.controls['estimateCost'].setErrors(null);
      }
    }
    if (this.form.controls.CostCurrency.errors) {
      if (this.form.controls.CostCurrency.errors.symboyRequired) {
        this.form.controls['estimateCost'].setErrors({ 'symboyRequired': true });
        this.estimateCost.nativeElement.focus();
        this.estimateCost.nativeElement.blur();
      }
    }
  }

  checkValidDate(flag: number) {
    if (flag == 0) {
      if (this.form.controls.startDate.errors) {
        if (this.form.controls.startDate.errors.compareDate) {
          this.form.controls['startDate'].setErrors(null);
        }
      }
    }
    if (flag == 1) {
      if (this.form.controls.endDate.errors) {
        if (this.form.controls.endDate.errors.compareDate) {
          this.form.controls['endDate'].setErrors(null);
        }
      }
    }
  }
  // showMessage(data:any) {
  //   let dialogRef = this.dialog.open(MyAlertDialogComponent,
  //    {width:"300px",
  //       data: { 
  //       dialogTitle:"Info",
  //       dialogText:"Update successful",
  //       cancelShow:false
  //     }});
  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result == 'OK') {
  //       this._sharedService.emitChange(name);
  //     }
  //   })
  // }
  onSubmitData() {
    if (this.form.invalid) {
      return;
    }
    let object = JSON.parse(localStorage.getItem('authUser'));
    const fv = this.form.value;

    // Set object
    let projectMaintenance = new ProjectMaintenance();

    projectMaintenance.MaintenanceContent = fv.maintenanceContent;
    projectMaintenance.ProjectId = parseInt(localStorage.getItem("projectId"));
    projectMaintenance.StartDate = fv.startDate;//? moment(fv.startDate.value).format("YYYY/MM/DD"):fv.startDate;
    projectMaintenance.EndDate = fv.endDate;//?fv.endDate.format('YYYY/MM/DD'):fv.endDate;
    projectMaintenance.MaintenanceName = fv.MaintenanceName;
    projectMaintenance.EstimateCost = fv.estimateCost;
    projectMaintenance.EstimateManDay = fv.EstimateManDay;
    projectMaintenance.DeliveryDate = fv.DeliveryDate;//? fv.DeliveryDate.format('YYYY/MM/DD') : "" ;
    projectMaintenance.PaymentDate = fv.paymentDate;//? fv.DeliveryDate.format('YYYY/MM/DD') : "";
    let costCurrency = this.MstCostCurrency.find(r => r.Id === fv.CostCurrency);

    if (costCurrency) {
      projectMaintenance.EstimateCostCurrencyId = costCurrency.Id;
      projectMaintenance.CostCurrency = costCurrency.CostCurrency;
      projectMaintenance.CostCurrencySymboy = costCurrency.CostCurrencySymboy;
    }
    if (!this.projectMaintenanceId) {
      if (!fv.MaintenanceStatusId)
        fv.MaintenanceStatusId = 1;
    }
    let maintenanceStatus = this.MstProjectStatus.find(status => status.Id === fv.MaintenanceStatusId);
    if (maintenanceStatus) {
      projectMaintenance.MaintenanceStatusId = maintenanceStatus.Id;
      projectMaintenance.ProjectStatusName = maintenanceStatus.ProjectStatusName;
      projectMaintenance.StyleCss = maintenanceStatus.StyleCss;
    }
    if (this.projectMaintenanceId) {
      projectMaintenance.UpdatedId = object.EmpId;
      projectMaintenance.Id = fv.Id;
      this.service.editProjectMaintenances(projectMaintenance).subscribe(
        data => {
          alert("Update project Maintenance successful");
          this._sharedService.emitChange(projectMaintenance.MaintenanceName);
          //this.showMessage(this.projectMaintenanceId) ;
        },
        error => {
          this.error = error;
          console.log(error)
        });
    } else {
      projectMaintenance.CreatedId = object.EmpId;
      this.service.createProjectMaintenances(projectMaintenance).subscribe(
        data => {
          this.route.navigate(
            ['project/info/' + localStorage.getItem("projectId") + '/maintenance/info/' + data + '/basic']);
        },
        error => {
          this.error = error;
          console.log(error)
        });
    }
  }

  public deleteProjectMaintenance() {
    var del = confirm('Are you sure want to delete this project maintenance');
    if (!del) return;
    this.service.deleteProjectMaintenances(this.projectMaintenanceId).subscribe(
      data => {
        this.route.navigate(
          ['project/info/' + localStorage.getItem("projectId") + '/maintenance']);
      },
      error => {
        this.error = error;
        console.log(error)
      });

  }

  public Back() {
    this.route.navigate(
      ['project/info/' + localStorage.getItem("projectId") + '/maintenance']);
  }
  goToTop() {
    if (this.form.invalid) {
      window.scrollTo(0, 0)
    }
  }
}