import { Component, OnInit, Renderer2, NgModule, ViewChild, ElementRef, ViewEncapsulation, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProjectService } from '../../_services/projects.service';
import { Project } from '../../_models/project';
import { Location } from '@angular/common';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { ReplaySubject, Subject } from 'rxjs';
import { Customer } from '../../_models/customer';
import { MatSelect, MatDialog } from '@angular/material';
import { takeUntil } from 'rxjs/operators';
import { Commons } from 'src/app/_shared/common_function';
import { costCurrencySymboyRequiredValidator, compareDateValidator } from 'src/app/_shared/common-validations';
import { MyAlertDialogComponent } from 'src/app/_shared/control/my-alert-dialog/my-alert-dialog.component';
import { SharedService } from '../../_share/shared-service';
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
  selector: 'app-project-info-basic',
  templateUrl: './project-info-basic.component.html',
  styleUrls: ['./project-info-basic.component.scss'],
  //encapsulation: ViewEncapsulation.None,
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },

    { provide: MAT_DATE_FORMATS, useValue: MONTH_ONLY_FORMATS },
  ],
})
export class ProjectInfoBasicComponent implements OnInit {
  // @Input() projects: Project;
  // @Output() onNameSelected = new EventEmitter();
  dtForm: FormGroup;
  submitted: boolean;
  error: string;
  lstCurrentSymboy: any;
  lstCustomer: any;
  lstStatus: any;
  projectId: number;
  idLogin: number;
  currentCheckedValue = null;
  radioSelected: string;
  messageErr: string;
  project = new Project();
  arrCus: Customer[];
  defaultCheck: number;
  cost: string;
  public custFilterCtrl: FormControl = new FormControl();

  /** list of banks filtered by search keyword */
  public filteredCust: ReplaySubject<Customer[]> = new ReplaySubject<Customer[]>(1)
  @ViewChild('currentSymboy', { read: ElementRef, static: false }) currentSymboy: ElementRef;
  @ViewChild('estimateCost', { read: ElementRef, static: false }) estimateCost: ElementRef;
  @ViewChild('singleSelect', { static: false }) singleSelect: MatSelect;
  /** Subject that emits when the component has been destroyed. */
  protected _onDestroy = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder,
    private route: Router,
    private projectService: ProjectService,
    private commons: Commons,
    private dialog: MatDialog, private _sharedService: SharedService

  ) {
  }

  ngOnInit() {
    this.projectId = parseInt(localStorage.getItem("projectId"));
    const userLogin = JSON.parse(localStorage.getItem("authUser"));
    this.idLogin = userLogin.EmpId;
    this.projectService.getMstByName("MstCostCurrency").subscribe(data => this.lstCurrentSymboy = data.mst);
    this.projectService.getCustomerName().subscribe(data => {
      this.arrCus = data;
      this.filteredCust.next(this.arrCus);
    });
    this.custFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filter();
      });
    this.projectService.getMstByName("MstProjectStatus").subscribe(data => {
      this.lstStatus = data.mst;
      if (!this.projectId) {
        this.defaultCheck = data.mst[0].Id;
      }
    });

    this.dtForm = this.formBuilder.group({
      id: new FormControl(''),
      projectName: new FormControl('', {
        validators: [
          Validators.required,
        ]
      }),
      custName: new FormControl('', {

      }),
      startDate: new FormControl('', {
        validators: [compareDateValidator('startDate', 'endDate')
        ]
      }),
      endDate: new FormControl('', {
        validators: [compareDateValidator('startDate', 'endDate')
        ]
      }),
      estimateCost: new FormControl('', {
        validators: [
          costCurrencySymboyRequiredValidator('estimateCost', 'currentSymboy')
        ]
      }),
      currentSymboy: new FormControl('', {
        validators: [
          costCurrencySymboyRequiredValidator('estimateCost', 'currentSymboy')
        ]
      }),
      estimateManday: new FormControl('', {

      }),
      paymentDate: new FormControl('', {

      }),
      deliveryDate: new FormControl('', {

      }),
      projectDecription: new FormControl('', {

      }),
      projectStatus: new FormControl('', {

      }),
    });
    if (this.projectId) {
      this.projectService.getProjectInfo(this.projectId).subscribe(data => {
        this.project = data;
        this.dtForm.patchValue({
          id: data.Id,
          projectName: data.ProjectName,
          custName: data.CustId,
          startDate: data.StartDate,
          endDate: data.EndDate,
          estimateCost: data.EstimateCost,
          currentSymboy: data.EstimateCostCurrencyId,
          estimateManday: data.EstimateManDay,
          paymentDate: data.PaymentDate,
          deliveryDate: data.DeliveryDate,
          projectStatus: data.ProjectStatusId,
          projectDecription: data.ProjectDecription
        });
      })
    }
  }
  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  filter() {
    // get the search keyword
    let search = this.custFilterCtrl.value;
    if (!search) {
      this.filteredCust.next(this.arrCus.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the customer
    this.filteredCust.next(
      this.arrCus.filter(data => data.CustName.toLowerCase().indexOf(search) > -1)
    );
  }
  checkShowHideValid(event: any) {
    if (this.dtForm.controls.estimateCost.errors) {
      if (this.dtForm.controls.estimateCost.errors.symboyRequired) {
        this.dtForm.controls['currentSymboy'].setErrors({ 'symboyRequired': true });
        this.currentSymboy.nativeElement.focus();
        this.currentSymboy.nativeElement.blur();
      }
    }
    if (!this.dtForm.controls.estimateCost.errors) {
      this.dtForm.controls['currentSymboy'].setErrors(null);
      this.currentSymboy.nativeElement.focus();
      this.currentSymboy.nativeElement.blur();
    }
  }
  checkValidEstimateCost() {
    if (this.dtForm.controls.estimateCost.errors) {
      if (this.dtForm.controls.estimateCost.errors.symboyRequired && !this.dtForm.controls.currentSymboy.errors) {
        this.dtForm.controls['estimateCost'].setErrors(null);
      }
    }
    if (this.dtForm.controls.currentSymboy.errors) {
      if (this.dtForm.controls.currentSymboy.errors.symboyRequired) {
        this.dtForm.controls['estimateCost'].setErrors({ 'symboyRequired': true });
        this.estimateCost.nativeElement.focus();
        this.estimateCost.nativeElement.blur();
      }
    }
  }

  checkValidDate(flag: number) {
    if (flag == 0) {
      if (this.dtForm.controls.startDate.errors) {
        if (this.dtForm.controls.startDate.errors.compareDate) {
          this.dtForm.controls['startDate'].setErrors(null);
        }
      }
    }
    if (flag == 1) {
      if (this.dtForm.controls.endDate.errors) {
        if (this.dtForm.controls.endDate.errors.compareDate) {
          this.dtForm.controls['endDate'].setErrors(null);
        }
      }
    }
  }
  goToTop() {
    if (this.dtForm.invalid) {
      window.scrollTo(0, 0)
    }
  }
  showMessage(data: any) {
    let dialogRef = this.dialog.open(MyAlertDialogComponent,
      {
        width: "300px",
        data: {
          dialogTitle: "Info",
          dialogText: "Update successful",
          cancelShow: false
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'OK') {
        this._sharedService.emitChange(data);
      }
    })
  }
  onSubmitData() {
    this.checkValidDate
    this.submitted = true;

    //check productStatus  == finish
    if(this.dtForm.controls.projectStatus.value == '5')
    {
      this.dtForm.controls.deliveryDate.setValidators(Validators.required);
      this.dtForm.controls.deliveryDate.markAllAsTouched();
      this.dtForm.controls.deliveryDate.updateValueAndValidity();
    }


    // stop here if form is invalid
    if (this.dtForm.invalid) {
      return;
    }

    const fv = this.dtForm.value;
    if (fv.projectStatus == 5) {
      if (fv.deliveryDate == null || fv.deliveryDate == "") {
        alert("Delivery Date is required!");
        return;
      }
    }
    let project = new Project();

    project.ProjectName = fv.projectName;
    project.CustId = fv.custName;
    project.StartDate = fv.startDate;
    project.EndDate = fv.endDate;
    project.EstimateCost = fv.estimateCost;
    project.EstimateCostCurrencyId = fv.currentSymboy;
    project.EstimateManDay = fv.estimateManday;
    project.PaymentDate = fv.paymentDate;
    project.DeliveryDate = fv.deliveryDate;
    project.ProjectStatusId = fv.projectStatus;
    project.ProjectDecription = fv.projectDecription;
    console.log(project);
    if (this.projectId) {
      project.Id = fv.id;
      project.UpdatedId = this.idLogin;
      project.UpdatedDate = new Date();
      this.projectService.updateProject(project).subscribe(data => {
        alert("Update project successful");
        this._sharedService.emitChange(this.projectId);
        // this.showMessage(this.projectId) ;

      }),
        error => {
          this.error = error;
          console.log(this.error);
        }
    } else {

      project.CreatedDate = new Date();
      project.CreatedId = this.idLogin;
      this.projectService.createProject(project).subscribe(
        data => {

          this.route.navigate(['project/info/' + data + '/basic'])
        },
        error => {
          this.error = error;
          console.log(this.error);
        });
    }

  }


  //btn back
  goBack() {
    this.route.navigate(['project']);
  }

  deleteProject() {
    var del = confirm('Are you sure want to delete this project');
    if (!del) return;
    this.projectService.deleteProject(this.projectId).subscribe(data => {
      this.route.navigate(['project']);
    }),
      error => {
        this.error = error;
      }
  }
  convertStyleObject(style: string) {
    return JSON.parse(style);
  }

}
