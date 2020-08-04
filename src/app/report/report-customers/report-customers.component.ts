import { Component, OnInit, HostListener, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MatDatepicker} from '@angular/material/datepicker';
import * as _moment from 'moment';
import {defaultFormat as _rollupMoment, Moment} from 'moment';
import { ProjectReportService } from '../_services/projects-report.service';
import { CurrencyRateService } from 'src/app/_services/currency-rate.service';
import { DecimalPipe } from '@angular/common';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
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
  selector: 'app-report-customers',
  templateUrl: './report-customers.component.html',
  styleUrls: ['./report-customers.component.scss'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},

    {provide: MAT_DATE_FORMATS, useValue: MONTH_ONLY_FORMATS},
  ],
})
export class ReportCustomersComponent implements OnInit, AfterViewInit {
  
  @ViewChild('reportMonthFromElement', { static: false }) private reportMonthFromElement: ElementRef;
  @ViewChild('reportMonthToElement', { static: false }) private reportMonthToElement: ElementRef;
  @ViewChild('rateUSDElement', { static: false }) private  rateUSDElement: ElementRef;
  @ViewChild('rateJPYElement', { static: false }) private  rateJPYElement: ElementRef;

  constructor(
    private projectReportService: ProjectReportService, 
    private decimalPipe: DecimalPipe, 
    private currencyRateService: CurrencyRateService,
    private breakpointObserver: BreakpointObserver
    ) { }

    reportByValue = 'm';
    reportByValues: any[] = [{ value: 'm', text: 'Month'}, { value: 'y', text: 'Year'}];
    reportBy = new FormControl('m');

  reportMonthFrom = new FormControl(moment(moment().year() + '-01-01'));
  reportMonthTo = new FormControl(moment());

  reportYear = new FormControl(moment().year(), {
    validators: [
      yearRequiredValidator(this.reportBy),
    ]
  });

  rateUSD = new FormControl('')
  rateJPY = new FormControl('')

  ngAfterViewInit(): void {
    this.reportMonthFrom.setValidators([
      monthRequiredValidator(this.reportBy, this.reportMonthFromElement),
      // monthFormatValidator(this.reportBy, this.reportMonthFromElement),
    ]);

    this.reportMonthTo.setValidators([
      monthRequiredValidator(this.reportBy, this.reportMonthToElement),
      // monthFormatValidator(this.reportBy, this.reportMonthToElement),
    ]);
    
    this.rateUSD.setValidators([
      customRequiredValidator(this.rateUSDElement),
    ]);

    this.rateJPY.setValidators([
      customRequiredValidator(this.rateJPYElement),
    ]);
  }

  isReported = false;
  isSubmitted = false;

  selectedYear = 0;
  
  public barChartOptions: ChartOptions = {
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      yAxes: [{
        id: 'TotalCost',
        position: 'left',
        ticks: {
          beginAtZero: true,
          callback: label => `${this.decimalPipe.transform(label).replace(/(,000)$/, 'k')}`
        }
      },
      {
        id: 'TotalProject',
        position: 'right',
        ticks: {
          beginAtZero: true,
          callback: label => `${this.decimalPipe.transform(label).replace(/(,000)$/, 'k')}`
        }
      }]
    },
    tooltips: {
      callbacks: {
        label: (tooltipItem, data) => {
          var strVal = `${this.decimalPipe.transform(data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index])}`;
          return strVal.replace(/(,000)$/, 'k')
        }
      }
    }
  };


  public barChartLabels: Label[] = [];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];

  public seriesCost = { data: [], label: 'Total Cost', yAxisID: 'TotalCost' };
  public seriesProject = { data: [], label: 'Total Project', yAxisID: 'TotalProject' };
  public barChartData: ChartDataSets[] = [
    this.seriesCost,
    this.seriesProject
  ];

  public pieChartOptions: ChartOptions = {
    maintainAspectRatio: false,
    responsive: true,
    legend: {
      display: true,
      labels: {
        fontSize: 11
      }
    },
    legendCallback: legend => 'x',
    tooltips: {
      callbacks: {
        label: (tooltipItem, data) => {
          var strVal = `${this.decimalPipe.transform(data.datasets[0].data[tooltipItem.index])}`;
          return strVal.replace(/(,000)$/, 'k')
        }
      }
    }
  };

  public pie2ChartOptions: ChartOptions = {
    ...this.pieChartOptions,
    legendCallback: legend => '',
    tooltips: {
      callbacks: {
        label: (tooltipItem, data) => {
          var strVal = `${this.decimalPipe.transform(data.datasets[0].data[tooltipItem.index])}`;
          return strVal.replace(/(,000)$/, 'k')
        }
      }
    }
  };
  public pieChartLabels: Label[] = [];
  public pieChartType: ChartType = 'pie';
  public pie1Series = [];
  public pie2Series = [];

  public pieChartColors = [
    {
      // tslint:disable-next-line:max-line-length
      backgroundColor: [],
    },
  ];
  public pieChartGroupHeight = '';

  ngOnInit() {
    this.breakpointObserver.observe([
      '(max-width: 1200px)'
        ]).subscribe(result => {
            this.pieChartOptions.legend.position = result.matches ? 'top' : 'left';
            this.pieChartGroupHeight = result.matches ? '1000' : 'auto';
        })
    this.currencyRateService.getCurrency().subscribe(resp => {
      this.rateUSD.patchValue(this.decimalPipe.transform(resp.USD_VND, '1.0-0' ));
      this.rateJPY.patchValue(this.decimalPipe.transform(resp.JPY_VND, '1.0-0' ));
    });
  }


  loadDataFromService() {
    this.isSubmitted = true;

    this.reportMonthFrom.updateValueAndValidity();
    this.reportMonthTo.updateValueAndValidity();
    this.reportYear.updateValueAndValidity();
    this.rateUSD.updateValueAndValidity();
    this.rateJPY.updateValueAndValidity();

    if (
      !this.reportMonthFrom.valid ||
      !this.reportMonthTo.valid ||
      !this.reportYear.valid ||
      !this.rateUSD.valid ||
      !this.rateJPY.valid
      ){
      return;
    }

    this.barChartLabels = [];
    this.seriesCost.data = [];
    this.seriesProject.data = [];

    this.pieChartLabels = [];
    this.pieChartColors[0].backgroundColor = [];
    this.pie1Series = [];
    this.pie2Series = [];

    this.isReported = true;
    // tslint:disable-next-line:max-line-length
    this.projectReportService.getReportStatistics(this.reportByValue, this.reportMonthFrom.value, this.reportMonthTo.value, this.reportYear.value, this.rateJPY.value, this.rateUSD.value).subscribe(resp => {
      resp.forEach(value => {
        this.barChartLabels.push(value.CustName);
        this.seriesCost.data.push(value.TotalCost);
        this.seriesProject.data.push(value.TotalProject);

        this.pieChartLabels.push(value.CustName);
        this.pieChartColors[0].backgroundColor.push(value.CustStyleCss);
        this.pie1Series.push(value.TotalCost);
        this.pie2Series.push(value.TotalProject);
      });
    });
  }

  chosenYearHandler(normalizedYear: Moment, inputDate: any) {
    const ctrlValue = inputDate.value;
    if(ctrlValue == null){
      this.selectedYear = normalizedYear.year()
    } else {
      ctrlValue.year(normalizedYear.year());
      inputDate.setValue(ctrlValue);
    }
  }

  chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>, inputDate: any) {
    const ctrlValue = inputDate.value;
    if(ctrlValue == null) {
      normalizedMonth.year(this.selectedYear);
      inputDate.setValue(normalizedMonth);
    } else {
      ctrlValue.month(normalizedMonth.month());
      inputDate.setValue(ctrlValue);
    }
    datepicker.close();
  }

}
