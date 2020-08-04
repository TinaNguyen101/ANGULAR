import { Component, OnInit, OnDestroy, ViewChild, TemplateRef, ElementRef, Renderer2 } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { EmployeeVehicle } from '../_models/EmployeeVehicle';
import { EmployeeReportService } from '../_services/employee-report.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDatepicker } from '@angular/material/datepicker';
import { monthRequiredValidator, yearRequiredValidator, monthFormatValidator } from '../_validations/reportProject-validations';

import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { defaultFormat as _rollupMoment, Moment } from 'moment';

import * as _moment from 'moment';
import { UploadDownloadService } from '../_services/upload-dowload.service';
import { HttpEventType } from '@angular/common/http';

import { saveAs } from 'file-saver';
import { state } from '@angular/animations';
import { Subscription } from 'rxjs';

const moment = _moment;

export const MONTH_ONLY_FORMATS = {
  parse: {
    dateInput: 'YYYY/MM',
  },
  display: {
    dateInput: 'YYYY/MM',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};


@Component({
  selector: 'app-report-employee',
  templateUrl: './report-employee.component.html',
  styleUrls: ['./report-employee.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },

    { provide: MAT_DATE_FORMATS, useValue: MONTH_ONLY_FORMATS },
  ],
})
export class ReportEmployeeComponent implements OnInit {

  //#region Cofig Mattable
  dataSource: MatTableDataSource<EmployeeVehicle>;
  displayedColumns = ['Action', 'No', 'EmpName', 'LicensePlate',
    'VehicleType1', 'VehicleType2', 'VehicleComment'];
  dtFormSearch: FormGroup;
  selection = new SelectionModel<EmployeeVehicle>(true, []);
  VehicleTotal = null;
  //#endregion

  //#region Coffig form input month
  reportMonth = new FormControl(moment());
  reportMonthValue;
  reportMonthAnnual = new FormControl(moment());
  reportAnnualByValue = "m";
  selectedYear = 0;
  tableResultMaxHeight = "";
  reportBy = new FormControl('m');
  reportByAnnual = new FormControl('m');
  reportYearAnnual = new FormControl(moment().year(), {
    validators: [
      yearRequiredValidator(this.reportByAnnual),
    ]
  });
  
  
  //#endregion


  //#region Subscription
  downloadFileEmployeeVehicleSubcriptuon: Subscription;
  downloadFileEmployeeListSubcriptuon: Subscription;
  downloadFileAnnuaListForMonthSubcriptuon: Subscription;
  downloadFileAnnuaListForYearSubcriptuon: Subscription;
  downloadFileAnnuaKPISubcriptuon: Subscription;
  //#endregion

  //#region Element ref
  @ViewChild("btndownloadFileAnnual", { static: false }) btndownloadFileAnnual: ElementRef;
  @ViewChild('scrollContent', { static: true }) private scrollContent: ElementRef;
  @ViewChild('divSearch', { static: true }) private divSearch: ElementRef;
  @ViewChild('reportMonthElement', { static: false }) private reportMonthElement: ElementRef;
  @ViewChild('reportMonthElementAnnual', { static: false }) private reportMonthElementAnnual: ElementRef;



  //#endregion


  constructor(private employeeService: EmployeeReportService, private downloadFileService: UploadDownloadService, private renderer2: Renderer2, ) {

  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.reportMonth.setValidators([
      monthRequiredValidator(this.reportBy, this.reportMonthElement),
    ]);
    this.reportMonthAnnual.setValidators([
      monthRequiredValidator(this.reportByAnnual, this.reportMonthElementAnnual),
    ]);
    this.loadProject();
    //this.dowloadFileEmployeeVehicle("201910",[1,2])

  }


  //#region Load data table

  loadProject() {
    if (!this.reportMonth.value) {
      this.reportMonth.updateValueAndValidity();
      return;
    }
    this.dataSource = new MatTableDataSource([]);;
    this.reportMonthValue = this.convertToYearMonthString();
    this.employeeService.getAllEmployeeVehicles(this.reportMonthValue).subscribe(data => {
      console.log(data);
      this.dataSource = new MatTableDataSource(data.VehicleDetail);
      this.VehicleTotal = data.VehicleTotal;
      this.selection.clear();
      this.dataSource.data.forEach(row => this.selection.select(row));
      if (data.VehicleDetail.length > 0) {
        setTimeout(() => {
          try {
            let contentHeight = this.scrollContent.nativeElement.clientHeight;
            let divSearchHeight = this.divSearch.nativeElement.clientHeight;
            if (contentHeight < 600 || (contentHeight / 4) < divSearchHeight) {
              this.tableResultMaxHeight = (contentHeight - 50).toString();
              setTimeout(() => {
                this.tableResultMaxHeight = 'calc(100vh - 200px) !important';                
                this.scrollContent.nativeElement.scrollTop = this.scrollContent.nativeElement.scrollHeight + divSearchHeight + 150;
              }, 100);
            } else {
              this.tableResultMaxHeight = 'calc(100vh - '+(divSearchHeight + 120).toString() + 'px) !important';
            }

          } catch (err) { }
        }, 100);
      }

    });
  }

  //#endregion


  //#region  Coffig table function
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  isHasSelecter() {
    return this.selection.selected.length > 0
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    console.log(this.selection.selected)
    this.isHasSelecter() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }
  //#endregion

  chosenYearHandler(normalizedYear: Moment) {
    const ctrlValue = this.reportMonth.value;
    if (ctrlValue == null) {
      this.selectedYear = normalizedYear.year()
    } else {
      ctrlValue.year(normalizedYear.year());
      this.reportMonth.setValue(ctrlValue);
    }
  }
  chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.reportMonth.value;
    if (ctrlValue == null) {
      normalizedMonth.year(this.selectedYear);
      this.reportMonth.setValue(normalizedMonth);
    } else {
      ctrlValue.month(normalizedMonth.month());
      this.reportMonth.setValue(ctrlValue);
    }
    datepicker.close();
  }

  chosenYearAnnualHandler(normalizedYear: Moment) {
    const ctrlValue = this.reportMonth.value;
    if (ctrlValue == null) {
      this.selectedYear = normalizedYear.year()
    } else {
      ctrlValue.year(normalizedYear.year());
      this.reportMonthAnnual.setValue(ctrlValue);
    }
  }


  chosenMonthAnnualHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.reportMonth.value;
    if (ctrlValue == null) {
      normalizedMonth.year(this.selectedYear);
      this.reportMonthAnnual.setValue(normalizedMonth);
    } else {
      ctrlValue.month(normalizedMonth.month());
      this.reportMonthAnnual.setValue(ctrlValue);
    }
    datepicker.close();
  }
  //#endregion


  //#region Dowload File
  //Vehicle list
  downloadFileEmployeeVehicle = () => {
    if (!this.reportMonth.value) {
      return;
    }
    let lstEmpId = [];
    for (const item of this.selection.selected) {
      lstEmpId.push(item.Id)
    }
    if(lstEmpId.length==0){
      alert('Please Choose Vehicle');
      return;
    }
    this.downloadFileEmployeeVehicleSubcriptuon = this.downloadFileService.downloadFileEmployeeVehicle(this.reportMonthValue, lstEmpId).subscribe(data => {
      console.log(data)
      switch (data.type) {
        case HttpEventType.Response:
          const downloadedFile = new Blob([data.body], { type: data.body.type });
          saveAs(downloadedFile, "EmployeeVehicleReport_" + this.reportMonthValue)
          break;
      }
    })
  }

  //Employee list
  downloadFileEmployeeList = () => {
    if (!this.reportMonth.value) {
      this.reportMonth.updateValueAndValidity();
      return;
    }
    this.downloadFileEmployeeListSubcriptuon = this.downloadFileService.downloadFileEmployeeList(this.convertToYearMonthString()).subscribe(data => {
      switch (data.type) {
        case HttpEventType.Response:
          const downloadedFile = new Blob([data.body], { type: data.body.type });
          saveAs(downloadedFile, "EmployeeListReport_" + this.convertToYearMonthString())
          break;
      }
    })
  }

  downloadFileAnnuaListForMonth = () => {
    
    let stringYearMonth = this.convertToYearMonthString('reportMonthAnnual');
    this.downloadFileAnnuaListForMonthSubcriptuon = this.downloadFileService.downloadFileAnnuaListForMonth(stringYearMonth).subscribe(data => {
      switch (data.type) {
        case HttpEventType.Response:
          const downloadedFile = new Blob([data.body], { type: data.body.type });
          saveAs(downloadedFile, "AnnuaList_For_" + stringYearMonth);
          break;
      }
    })
  }

  downloadFileAnnuaListForYear = () => {
    console.log(this.reportYearAnnual)
    this.downloadFileAnnuaListForYearSubcriptuon = this.downloadFileService.downloadFileAnnualListForYear(this.reportYearAnnual.value).subscribe(data => {
      switch (data.type) {
        case HttpEventType.Response:
          const downloadedFile = new Blob([data.body], { type: data.body.type });
          saveAs(downloadedFile, "AnnuaList_For_" + this.reportYearAnnual.value);
          break;
      }
    })
  }
  downloadFileKPI = () => {
    if(this.reportYearAnnual.invalid){
      return;
    }
    let year = this.reportYearAnnual.value;
    this.downloadFileAnnuaKPISubcriptuon = this.downloadFileService.downloadFileKPIForYear(year).subscribe(data => {
      switch (data.type) {
        case HttpEventType.Response:
          const downloadedFile = new Blob([data.body], { type: data.body.type });
          saveAs(downloadedFile, "File_KPI_" + year);
          break;
      }
    }, err => {
      alert('No corresponding data');
    })
  }
  downloadFileAnnual = () => {
    switch (this.reportAnnualByValue) {
      case 'm':
        if (this.reportMonthAnnual.invalid) {
          this.reportMonthAnnual.updateValueAndValidity();
          return;
        } else {
          this.downloadFileAnnuaListForMonth();
        }
        break;
      case 'y':
        if (this.reportYearAnnual.invalid) {
          return;
        } else {
          this.downloadFileAnnuaListForYear()
        }
        break;
      default:
        break;
    }
  }
  //#endregion

  //#region commone function:
  //convert date time to yearMonth requests
  convertToYearMonthString = (typeInputControl = 'reportMonth') => {
    let year;
    let month;
    if (typeInputControl == 'reportMonth') {
      year = this.reportMonth.value.year();
      if (this.reportMonth.value.month() + 1 < 10) {
        let current = this.reportMonth.value.month() + 1;
        month = "0" + current;
      } else {
        month = this.reportMonth.value.month() + 1;
      }
      return year + "" + month;
    } else if (typeInputControl == 'reportMonthAnnual') {
      year = this.reportMonthAnnual.value.year();
      if (this.reportMonthAnnual.value.month() + 1 < 10) {
        let current = this.reportMonthAnnual.value.month() + 1;
        month = "0" + current;
      } else {
        month = this.reportMonthAnnual.value.month() + 1;
      }
      return year + "" + month;
    }


  }
  //set attr disable
  setAttributeDisabledElement = (el: ElementRef, value: boolean = true) => {
    if (value) {
      this.renderer2.setAttribute(el.nativeElement, "disabled", "true");
    } else {
      this.renderer2.removeAttribute(el.nativeElement, "disabled");
    }
  }
  //unsubcription
  unsubciption = (subscribe: Subscription) => {
    subscribe && subscribe.unsubscribe()
  }
  //#endregion

  ngOnDestroy() {

    this.unsubciption(this.downloadFileEmployeeVehicleSubcriptuon);
    this.unsubciption(this.downloadFileEmployeeListSubcriptuon);
    this.unsubciption(this.downloadFileAnnuaListForMonthSubcriptuon);
    this.unsubciption(this.downloadFileAnnuaListForYearSubcriptuon);
  }

}
