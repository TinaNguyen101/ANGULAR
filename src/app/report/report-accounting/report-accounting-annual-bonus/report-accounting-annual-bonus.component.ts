import { Component, OnInit, ViewChild, AfterViewInit, Inject, ElementRef, Renderer2 } from '@angular/core';
import { ReportAccountingService } from '../../_services/report-accounting.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { JsonpInterceptor, HttpEventType } from '@angular/common/http';
import { Commons } from 'src/app/_shared/common_function';
import { compareDateValidator } from 'src/app/_shared/common-validations';
import { ActivatedRoute } from '@angular/router';
import { MatTableDataSource, MatDatepicker } from '@angular/material';
import { monthRequiredValidator, yearRequiredValidator } from '../../_validations/reportProject-validations';
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
  selector: 'app-report-accounting-annual-bonus',
  templateUrl: './report-accounting-annual-bonus.component.html',
  styleUrls: ['./report-accounting-annual-bonus.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },

    { provide: MAT_DATE_FORMATS, useValue: MONTH_ONLY_FORMATS },
  ],
})
export class ReportAccountingAnnualBonusComponent implements OnInit {

  flagHidden;
  dataSource: MatTableDataSource<any>;
  displayedColumns = ['No', 'EmpName', 'RatingFactorMember', 'TotalProjectMember', 'TotalDayMember', 'BonusMember'
    , 'RatingFactorLeader', 'TotalProjectLeader', 'TotalEstimateCostVNDLeader', 'BonusLeader', 'TotalBonus'];
  displayedColumns1 = ['No1', 'EmpName1', 'RatingFactorMember1', 'TotalProjectMember1', 'TotalDayMember1', 'BonusMember1'
  , 'RatingFactorLeader1', 'TotalProjectLeader1', 'TotalEstimateCostVNDLeader1', 'BonusLeader1', 'TotalBonus1'];
  selectedYear = 0;
  downloadFile: Subscription;
  monthly = 0;
  reportMonthAnnual = new FormControl(moment());

  @ViewChild('reportMonthElement', { static: false }) private reportMonthElement: ElementRef;
  reportMonth = new FormControl();

  reportByAnnual = new FormControl('y');
  reportYearAnnual = new FormControl('', {
    validators: [
      yearRequiredValidator(this.reportByAnnual),
    ]
  });
  
  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private reportAccountingService: ReportAccountingService) { }

  ngOnInit() {
    this.flagHidden = false;
    //this.loadAnnualBonus();
  }

  ngAfterViewInit(): void {

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

  loadAnnualBonus() {
    if (!this.reportYearAnnual.value || parseInt(this.reportYearAnnual.value)<1000) {
      this.reportYearAnnual.updateValueAndValidity();
      return;
    }
    this.reportAccountingService.getReportAnnualBonus(this.reportYearAnnual.value, 0, 0).subscribe(res => {
      this.monthly = res[0].WorkDayMonth;
      this.dataSource = new MatTableDataSource(res);
      console.log(res);
    });
    this.flagHidden = true;
  }
  onDownLoadFile(){
    if (!this.reportYearAnnual.value || parseInt(this.reportYearAnnual.value)<1000) {
      this.reportYearAnnual.updateValueAndValidity();
      return;
    }
    this.downloadFile = this.reportAccountingService.downloadFileYearAnnualBonus(this.reportYearAnnual.value,255,23000).subscribe(data => {
      switch (data.type) {
        case HttpEventType.Response:
          const downloadedFile = new Blob([data.body], { type: data.body.type });
          saveAs(downloadedFile, "AnnualBonus_" + this.reportYearAnnual.value);
          break;
      }
    })
  }
}
