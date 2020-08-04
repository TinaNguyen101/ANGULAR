import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Commons } from 'src/app/_shared/common_function';
import * as _moment from 'moment';
import { EmployeeService } from 'src/app/employee/_services/employee.service';
import { Employee } from 'src/app/project/_models/employee';
import { SharedService } from 'src/app/employee/_share/shared-service';
import { AnnualEvaluationResult } from 'src/app/employee/_models/annualEvaluationResult';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ConvertActionBindingResult } from '@angular/compiler/src/compiler_util/expression_converter';
const moment = _moment;


@Component({
  selector: 'app-employee-annual-evaluation',
  templateUrl: './employee-annual-evaluation.component.html',
  styleUrls: ['./employee-annual-evaluation.component.scss']
})
export class EmployeeAnnualEvaluationComponent implements OnInit {
  EvaluationForm: FormGroup;
  listAnnualEvaluation: any;
  EvaluationContent: any;
  Evaluationid: any;
  idLogin: number;
  error: string;
  empIdManage;
  idEvaluator: number;
  empId;
  boolean :any = "true";
  array_EvaluationResult = new Array<AnnualEvaluationResult>();
  yearSearch = new FormControl(moment().year());
  yearNow = moment().year();
  year;
  constructor(private employeeService: EmployeeService,
    private formBuilder: FormBuilder,
    private _sharedService: SharedService,
    private router: Router) {
  }
 
  ngOnInit() {    
    this.array_EvaluationResult = new Array<AnnualEvaluationResult>();
    this.getUserFormLocalStorage();
    const userLogin = JSON.parse(localStorage.getItem("authUser"));
    this.idLogin = userLogin.EmpId;

    this.EvaluationForm = this.formBuilder.group({
      "1": new FormControl(''),
      "2": new FormControl(''),
      "3": new FormControl(''),
      "4": new FormControl(''),
    });
    this._sharedService.changeYearEmitted.subscribe(data => {
      this.yearSearch = data;
      this.year = data;
      if (this.empIdManage) {
        
        this.getUserFormLocalStorage();
        this.loadListEvaluationResult(this.yearSearch, this.empIdManage, this.empId);
      }
    });

    this._sharedService.changeEmpIdEmitted.subscribe(data => {
      this.empIdManage = data;
      if (this.yearSearch &&  this.empIdManage) {
        
        this.getUserFormLocalStorage();
        this.loadListEvaluationResult(this.yearSearch, this.empIdManage, this.empId);
      }
    })
    this._sharedService.emitContentChangeOnLoad.subscribe(data => {
      if(data){
        this.listAnnualEvaluation = data;
      }
    })
    
  }
  loadListEvaluationResult(year, evaluatorId, EmpId) {
    
    this.employeeService.GetListEvaluationResult(year, evaluatorId, EmpId).subscribe(data => {
      this.listAnnualEvaluation = data;
      this._sharedService.emitContentChange(data);
    });

  }
  onSubmitAnnualEvaluationResult() {
    //check form invalid
    if (this.EvaluationForm.invalid) {
      return;
    }
    this.array_EvaluationResult = new Array<AnnualEvaluationResult>();
    const fv = this.EvaluationForm.value;
    this.listAnnualEvaluation.forEach(ele => {
      let evaluationResult = new AnnualEvaluationResult();
      evaluationResult.EmpId = this.empId;
      evaluationResult.Year = this.year;
      evaluationResult.EvaluatorId = this.empIdManage;
      evaluationResult.EvaluationId = ele.EvaluationId;
      evaluationResult.UpdatedId = this.idLogin;
      evaluationResult.CreatedId = this.idLogin;
      for (const key in fv) {
        if (fv.hasOwnProperty(key) && key.toString() == (ele.EvaluationId).toString()) {
          const element = fv[key];
          evaluationResult.EvaluationContent = element;
        }
      }
      this.array_EvaluationResult.push(evaluationResult);
      this.Evaluationid = ele.EvaluationId;

    });
    console.log(this.array_EvaluationResult);

    if (this.Evaluationid != null) {
      this.employeeService.updateEvaluationResult(this.array_EvaluationResult).subscribe(
        data => {
          alert('Update annual evaluation result successfull');
          this._sharedService.emitChange(this.Evaluationid);
        },
        error => {
          this.error = error;
        });
    }
  }
  convertStyleObject(style: string) {
    return JSON.parse(style);
  }
  submitData() {
    if (this.EvaluationForm.invalid) {
      window.scrollTo(0, 0)
    }
  };
  getUserFormLocalStorage = () => {
    
    this.empId = localStorage.getItem('emplpyeeId');

  }

}
