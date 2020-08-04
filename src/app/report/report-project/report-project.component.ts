import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MatDatepicker} from '@angular/material/datepicker';
import * as _moment from 'moment';

import { animate, state, style, transition, trigger } from '@angular/animations';

// tslint:disable-next-line:no-duplicate-imports
import {defaultFormat as _rollupMoment, Moment} from 'moment';
import { ProjectReport } from '../_models/project-report';
import { MatTableDataSource, MatPaginator, MatSort, MatTable } from '@angular/material';
import { ProjectReportService } from '../_services/projects-report.service';
import { CurrencyRateService } from 'src/app/_services/currency-rate.service';
import { DecimalPipe } from '@angular/common';
import { monthRequiredValidator, yearRequiredValidator, monthFormatValidator } from '../_validations/reportProject-validations';
import { customRequiredValidator } from 'src/app/_shared/common-validations';

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
  selector: 'app-report-project',
  templateUrl: './report-project.component.html',
  styleUrls: ['./report-project.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', display: 'none' })),
      state('expanded', style({ height: '*', display: 'flex' })),
    ]),
  ],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},

    {provide: MAT_DATE_FORMATS, useValue: MONTH_ONLY_FORMATS},
  ],
})
export class ReportProjectComponent implements OnInit, AfterViewInit {
  
  
  @ViewChild('scrollContent', { static: true }) private scrollContent: ElementRef;
  @ViewChild('divSearch', { static: true }) private divSearch: ElementRef;
  @ViewChild('reportMonthElement', { static: false }) private reportMonthElement: ElementRef;
  @ViewChild('rateUSDElement', { static: false }) private  rateUSDElement: ElementRef;
  @ViewChild('rateJPYElement', { static: false }) private  rateJPYElement: ElementRef;

  tableResultMaxHeight = "";

  projectStatus = [];
  reportStatusValue = '';

  reportByValue = 'm';
  reportByValues: any[] = [{ value: 'm', text: 'Month'}, { value: 'y', text: 'Year'}];
  reportBy = new FormControl('m');

  reportMonth = new FormControl(moment())
  rateUSD = new FormControl('')
  rateJPY = new FormControl('')
  public currencyPattern = {'0': { pattern: new RegExp('\[0-9]')}};
  
  ngAfterViewInit(): void {
    this.reportMonth.setValidators([
        monthRequiredValidator(this.reportBy, this.reportMonthElement),
        // monthFormatValidator(this.reportBy, this.reportMonthElement),
      ]);

    this.rateUSD.setValidators([
      customRequiredValidator(this.rateUSDElement),
    ]);
    this.rateJPY.setValidators([
      customRequiredValidator(this.rateJPYElement),
    ]);
  }
  
  reportYear = new FormControl(moment().year(),  {
    validators: [
      yearRequiredValidator(this.reportBy),
    ]
  });
  isReported = false;
  isSubmitted = false;
  
  

  selectedYear = 0;

  dataSource: MatTableDataSource<any>;
  displayedColumns = [
  'CustName',
  'ProjectName',
  'ProjectDate',
  'ProjectEstimateCost',
  'ProjectDeliveryDate',
  'ProjectPaymentDate',
  'ProjectStatus',
  'ProjectTotalEstimateCost'];
  expandedElement: any;
  isExpansionDetailRow = (i: number, row: any) => row.hasOwnProperty('detailRow');
  isLastRow = (data, index) => index === this.dataSource.data.length;

  constructor(
    private projectReportService: ProjectReportService,
    private decimalPipe: DecimalPipe, 
    private currencyRateService: CurrencyRateService,   
    ) { }

  ngOnInit() {
    this.projectReportService.getMstByName('MstProjectStatus').subscribe(resp => {
      this.projectStatus = resp.mst;
    });

    this.currencyRateService.getCurrency().subscribe(resp => {
      this.rateUSD.patchValue(this.decimalPipe.transform(resp.USD_VND, '1.0-0' ));
      this.rateJPY.patchValue(this.decimalPipe.transform(resp.JPY_VND, '1.0-0' ));
    });
  }

  
  chosenYearHandler(normalizedYear: Moment) {
    const ctrlValue = this.reportMonth.value;
    if(ctrlValue == null){
      this.selectedYear = normalizedYear.year()
    } else {
      ctrlValue.year(normalizedYear.year());
      this.reportMonth.setValue(ctrlValue);
    }
  }

  chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.reportMonth.value;
    if(ctrlValue == null) {
      normalizedMonth.year(this.selectedYear);
      this.reportMonth.setValue(normalizedMonth);
    } else {
      ctrlValue.month(normalizedMonth.month());
      this.reportMonth.setValue(ctrlValue);
    }
    datepicker.close();
  }

  loadProject() {
    this.isSubmitted = true;

    this.reportMonth.updateValueAndValidity();
    this.reportYear.updateValueAndValidity();
    this.rateUSD.updateValueAndValidity();
    this.rateJPY.updateValueAndValidity();

    if (
      !this.reportMonth.valid ||
      !this.reportYear.valid ||
      !this.rateUSD.valid ||
      !this.rateJPY.valid
      ){
      return;
    }

    this.dataSource = null;

    this.isReported = true;
    // tslint:disable-next-line:max-line-length
    this.projectReportService.getProjectReports(this.reportByValue, this.reportMonth.value, this.reportYear.value, this.reportStatusValue, this.rateJPY.value, this.rateUSD.value).subscribe(resp => {
      const rows = [];
      resp.forEach(element => rows.push(element, { detailRow: true, element }));
      this.dataSource = new MatTableDataSource(rows);
      setTimeout(() => {
        try {
            let contentHeight = this.scrollContent.nativeElement.clientHeight;
            let divSearchHeight = this.divSearch.nativeElement.clientHeight;
            if (contentHeight < 600 || (contentHeight / 2.5) < divSearchHeight)
            {
              this.tableResultMaxHeight = (contentHeight - 30).toString();
              setTimeout(() => {
                this.scrollContent.nativeElement.scrollTop = this.scrollContent.nativeElement.scrollHeight;
              }, 100);
            } else {
              this.tableResultMaxHeight = (contentHeight - divSearchHeight - 80).toString();
            }

        } catch(err) { }  
      }, 100);
    });
  }

  convertStyleObject(style: string) {
    return JSON.parse(style);
  }
}
