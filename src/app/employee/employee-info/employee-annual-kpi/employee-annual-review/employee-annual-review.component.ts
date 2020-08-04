import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormsModule, NgForm } from '@angular/forms';
import { Router,ActivatedRoute } from '@angular/router';
import { Commons } from 'src/app/_shared/common_function';
import * as _moment from 'moment';
import { EmployeeService } from 'src/app/employee/_services/employee.service';
import { Employee } from 'src/app/project/_models/employee';
import { SharedService } from 'src/app/employee/_share/shared-service';
import { AnnualReview } from 'src/app/employee/_models/annualReview';
const moment = _moment;
@Component({
  selector: 'app-employee-annual-review',
  templateUrl: './employee-annual-review.component.html',
  styleUrls: ['./employee-annual-review.component.scss']
})
export class EmployeeAnnualReviewComponent implements OnInit {
  AnnualReviewForm: FormGroup;
  listAnnualReview: any;
  ReviewContent: any;
  ReviewId: any;
  idLogin: number;
  error: string;
  empIdManage;
  idEvaluator: number;
  empId;
  key: any;
  boolean :any = "true";
  array_AnnualReview = new Array<AnnualReview>();
  yearSearch = new FormControl(moment().year());
  yearNow = moment().year();
  year;
  constructor(private employeeService: EmployeeService,
    private formBuilder: FormBuilder,
    private _sharedService: SharedService,
    private router: Router,
    private route: ActivatedRoute 
    ) {
  }
 

  ngOnInit() {    

    this.key = this.route.snapshot.routeConfig.path;
    localStorage.setItem("keyShowEvaluator", this.key);

    this.array_AnnualReview = new Array<AnnualReview>();
    this.getUserFormLocalStorage();
    const userLogin = JSON.parse(localStorage.getItem("authUser"));
    this.idLogin = userLogin.EmpId;

    this.AnnualReviewForm = this.formBuilder.group({
      "1": new FormControl(''),
      "2": new FormControl(''),
      "3": new FormControl(''),
      "4": new FormControl(''),
      "5": new FormControl(''),
    });
    this._sharedService.changeYearEmitted.subscribe(data => {
      this.yearSearch = data;
      this.year = data;
      if (this.empIdManage) {
        
        this.getUserFormLocalStorage();
        this.loadListAnnualReview(this.yearSearch, this.empId);
      }
    });

    this._sharedService.changeEmpIdEmitted.subscribe(data => {
      this.empIdManage = data;
      if (this.yearSearch ) {
        
        this.getUserFormLocalStorage();
        this.loadListAnnualReview(this.yearSearch, this.empId);
      }
    })
    this._sharedService.emitContentChangeOnLoad.subscribe(data => {
      if(data){
        this.listAnnualReview = data;
      }
    })
    
  }
  loadListAnnualReview(year, EmpId) {
    this.employeeService.getAnnualReview(year, EmpId).subscribe(data => {
      this.listAnnualReview = data;
      this._sharedService.emitContentChange(data);
    });

  }
  onSubmitAnnualReview() {
    if (this.AnnualReviewForm.invalid) {
      return;
    }
    this.array_AnnualReview = new Array<AnnualReview>();
    const fv = this.AnnualReviewForm.value;
    this.listAnnualReview.forEach(ele => {    
      let annualReview = new AnnualReview();
      annualReview.EmpId = this.empId;
      annualReview.Year = this.year;
      annualReview.ReviewId = ele.ReviewId;
      annualReview.UpdatedId = this.idLogin;
      annualReview.CreatedId = this.idLogin;
      for (const key in fv) {
        if (fv.hasOwnProperty(key) && key.toString() == (ele.ReviewId).toString()) {
          const element = fv[key];
          annualReview.ReviewContent = element ;
        }
      }
      this.array_AnnualReview.push(annualReview);
      this.ReviewId = ele.ReviewId;

    });
    console.log(this.array_AnnualReview);

    if (this.ReviewId != null) {
      this.employeeService.updateAnnualReview(this.array_AnnualReview).subscribe(
        data => {
          alert('Update annual review result successfull');
          this._sharedService.emitChange(this.ReviewId);
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
    if (this.AnnualReviewForm.invalid) {
      window.scrollTo(0, 0)
    }
  };
  getUserFormLocalStorage = () => {
    this.empId = localStorage.getItem('emplpyeeId');
  }
  getValueInput(ReviewContent)
  {
    if (parseInt(ReviewContent.value) > 100) {
      ReviewContent.value = "";
      return;
    }
   
  }
  
}
