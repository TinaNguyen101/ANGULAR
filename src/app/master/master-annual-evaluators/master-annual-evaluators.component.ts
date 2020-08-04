import { Component, OnInit, ViewChild, AfterViewInit, Inject, ElementRef, Renderer2, HostListener } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator, MatSort, MatTableDataSource, MatDrawer } from '@angular/material';
import { merge, ReplaySubject, Subject } from 'rxjs';
import { tap, takeUntil } from 'rxjs/operators';
import { MatTableRequest } from 'src/app/_models/MatTableRequest';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { JsonPipe } from '@angular/common';
import { JsonpInterceptor } from '@angular/common/http';
import { Commons } from 'src/app/_shared/common_function';
import { compareDateValidator } from 'src/app/_shared/common-validations';
import * as _moment from 'moment';
import { MasterService } from '../_services/master.service';
const moment = _moment;

export const FORMATS_DATE = {
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
export class Evaluator {
    EmpId: number;
    Year: number;
    CreatedId: number;
}
@Component({
  selector: 'app-master-annual-evaluators',
  templateUrl: './master-annual-evaluators.component.html',
  styleUrls: ['./master-annual-evaluators.component.scss']
})
export class MasterAnnualEvaluatorsComponent implements OnInit {

  @ViewChild("parentTable", { static: true }) parentTable: ElementRef;

  //dataSource: MatTableDataSource<any> ;
  dataSource = new MatTableDataSource<any>();
  searchYear = new FormControl('', Validators.required);
  yearHeader = 0;
  yearNow;
  lstEvaluator = [];
  displayedColumns = [
    'Evaluator',
    'BeforeYearSearch',
    'YearSearch',
  ];

  constructor(
    private formBuilder: FormBuilder,
    private masterService: MasterService,
  ) { }

  ngOnInit() {
    this.LoadListEvaluators();
    this.yearNow = parseInt(moment().year().toString());
  }

  LoadListEvaluators() {
    if (this.searchYear.value) {
      this.yearHeader = this.searchYear.value;
      this.masterService.getListEvaluator(this.searchYear.value).subscribe(res => {
        this.dataSource = new MatTableDataSource(res);
        setTimeout(()=>{
          this.goToTop();
        },500)
        this.lstEvaluator= [];
        for (const item of res) {
          if (item.Year == 1) {
            let empInfo = {
              EmpId : item.EmpId,
              Year : parseInt(this.yearHeader+""),
              CreatedId: JSON.parse(localStorage.getItem("authUser")).EmpId
            }
            this.lstEvaluator.push(empInfo);
          }
        }
      });
    }
  }
  onChangeChecked(event,row,currentYear){
    if(currentYear){ //flag to know year     
      if (event.checked) {
        this.lstEvaluator.push({
          EmpId : row.EmpId,
          Year : parseInt(this.yearHeader + ""),
          CreatedId: JSON.parse(localStorage.getItem("authUser")).EmpId
        })
      } else {
        let empIndex = this.lstEvaluator.findIndex( x=>x.EmpId==row.EmpId && x.Year == this.yearHeader );
        this.lstEvaluator.splice(empIndex,1);
      }
    }
  }
  onSave(){
    console.log(JSON.stringify(this.lstEvaluator) )
    if (this.lstEvaluator.length <= 0) {
      alert("At least one evaluator must be chosen !");
      this.LoadListEvaluators();
      return;
    }
    this.masterService.insertUpdateDetele_ListEvaluator(this.lstEvaluator).subscribe(res => {
      alert("Save Success!")
      this.LoadListEvaluators();
    });
  }
  // Click paging Scroll to Top
  goToTop() {
    window.document.getElementById('parent').scrollTo(0, 10e5);
  }
}
