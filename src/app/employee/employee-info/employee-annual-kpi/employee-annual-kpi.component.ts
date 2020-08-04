
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, NgForm, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Commons } from 'src/app/_shared/common_function';
import * as _moment from 'moment';
import { EmployeeService } from '../../_services/employee.service';
import { yearRequiredValidator } from 'src/app/report/_validations/reportProject-validations';
import { SharedService } from '../../_share/shared-service';
const moment = _moment;

import { Employee } from '../../_models/employee';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-employee-annual-kpi',
  templateUrl: './employee-annual-kpi.component.html',
  styleUrls: ['./employee-annual-kpi.component.scss']
})
export class EmployeeAnnualKPIComponent implements OnInit {
  resultLastYear: any;
  isSearchted = false;
  lstYear: any;
  AnnualForm: FormGroup;
  selected:number;
  panelOpenState = false;
  keyChange :any;
  urlEl : string;
  searchYear  = new FormControl(moment().year(), {
    validators: [
      yearRequiredValidator(new FormControl('y')),
    ]
  });

  EmpManageId = new FormControl('1', Validators.required);
  idEvaluation = new FormControl('1', Validators.required);
  displayedColumns = [
    'EmployeeName',
  ];
  departmentList;
  constructor(private employeeService: EmployeeService,
    private formBuilder: FormBuilder,
    private _sharedService: SharedService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }
 

  ngOnInit() {
    this.keyChange = localStorage.getItem("keyShowEvaluator");
  }
  ngAfterViewInit(): void {
    this._sharedService.emitYearChange(this.searchYear.value);
    this._sharedService.emitEmpIdChange(this.EmpManageId.value);
    this.loadAnnualYear();
  }
  getListEvaluator(year) {
    this.employeeService.GetListEvaluator(year).subscribe(data => {
      this.departmentList = data;
      if (this.searchYear != null ) {
        this.selected = data[0].Id;
        console.log(this.selected);
      }
    });
  }
  loadAnnualYear() {
    this._sharedService.emitYearChange(this.searchYear.value);
    this.getListEvaluator(this.searchYear.value);
  }

  changeEmpIdManage = () => {
    this._sharedService.emitEmpIdChange(this.EmpManageId.value);
  }

  ngOnDestroy(): void {
    this._sharedService.emitContentChange(null);
  }
  ChangeEvaluator()
  {
     this.urlEl = this.router.url.toString();
    if(this.urlEl.includes(this.keyChange) ){
      return false;
    }
    else 
    {return true;
    }
  }
}
