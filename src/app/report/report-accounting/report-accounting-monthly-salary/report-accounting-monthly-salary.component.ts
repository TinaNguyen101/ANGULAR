import { Component, OnInit, ViewChild, AfterViewInit, Inject, ElementRef, Renderer2 } from '@angular/core';
import { ReportAccountingService } from '../../_services/report-accounting.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { JsonpInterceptor, HttpEventType } from '@angular/common/http';
import { Commons } from 'src/app/_shared/common_function';
import { compareDateValidator } from 'src/app/_shared/common-validations';
import { ActivatedRoute } from '@angular/router';
import { MatTableDataSource, MatDatepicker } from '@angular/material';
import { monthRequiredValidator } from '../../_validations/reportProject-validations';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
const moment = _moment;
import { defaultFormat as _rollupMoment, Moment } from 'moment';
import * as _moment from 'moment';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { Subscription } from 'rxjs';
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
  selector: 'app-report-accounting-monthly-salary',
  templateUrl: './report-accounting-monthly-salary.component.html',
  styleUrls: ['./report-accounting-monthly-salary.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },

    { provide: MAT_DATE_FORMATS, useValue: MONTH_ONLY_FORMATS },
  ],
})
export class ReportAccountingMonthlySalaryComponent implements OnInit {

  flagHidden;
  lst: any;
  dataSource: MatTableDataSource<any>;
  displayedColumns = ['No', 'TotalDayOff', 'EmpName', 'PositionName', 'Salary', 'BonusOT', 'Allowance', 'Deduction', 'ActualSalary', 'Comment'];
  selectedYear = 0;

  downloadFile: Subscription;
  
  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private reportAccountingService: ReportAccountingService
  ) { }

  @ViewChild('reportMonthElement', { static: false }) private reportMonthElement: ElementRef;
  reportMonth = new FormControl();
  reportBy = new FormControl('m');

  ngOnInit() {
    this.flagHidden = false;
  }

  ngAfterViewInit(): void {
    this.reportMonth.setValidators([
      monthRequiredValidator(this.reportBy, this.reportMonthElement),
    ]);
  }

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
    }
  }
  loadMonthlySalary() {
    if (!this.reportMonth.value) {
      this.reportMonth.updateValueAndValidity();
      return;
    }
    let yearMonthly = this.convertToYearMonthString();
    
    this.reportAccountingService.getReportMonthlySalary(yearMonthly).subscribe(res => {
      this.lst = res.detail;
      this.dataSource = new MatTableDataSource(this.lst);
    })
    this.flagHidden = true;
  }

  onDownLoadFile = () => {
    let stringYearMonth = this.convertToYearMonthString();
    this.downloadFile = this.reportAccountingService.downloadFileYearMonth(stringYearMonth).subscribe(data => {
      switch (data.type) {
        case HttpEventType.Response:
          const downloadedFile = new Blob([data.body], { type: data.body.type });
          saveAs(downloadedFile, "MonthlySalary_For_" + stringYearMonth);
          break;
      }
    })
  }
}
