import { Component, OnInit,ViewChild } from '@angular/core';
import { MasterService } from '../_services/master.service';
import { Holiday } from '../_models/Holiday';
import { FormGroup, FormBuilder, FormControl,Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator, MatSort, MatTableDataSource, MatDrawer } from '@angular/material';
import { merge } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MatTableRequest } from 'src/app/_models/MatTableRequest';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { Router } from '@angular/router';



import * as _moment from 'moment';
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
const moment = _moment;
@Component({
  selector: 'app-master-annual-holiday',
  templateUrl: './master-annual-holiday.component.html',
  styleUrls: ['./master-annual-holiday.component.scss'],
  providers:[
            { provide: MAT_DATE_FORMATS, useValue: FORMATS_DATE },
            { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
            ]
})

export class MasterAnnualHolidayComponent implements OnInit {
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  displayedColumns = ['Action', 'Holiday', 'Comment'];
  dataSource: MatTableDataSource<any>;
  dataSourceSecond = [];
  dtFormHoliday: FormGroup;
  isSearched = false;
  error: string;
  idHoliday : number;
  idLogin: number;
  searchYear = new FormControl('', Validators.required);
  year : number;
  listAnHoliday =[];
  result: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private masterService: MasterService,
    private route: Router,

  ) { }

  ngOnInit() {       
    const userLogin = JSON.parse(localStorage.getItem("authUser"));
    this.idLogin = userLogin.EmpId;
    this.searchYear.setValue(moment().year());
    //form insert holiday
    this.dtFormHoliday = this.formBuilder.group({
      HolidayDay: new FormControl(''),      
      Comment: new FormControl(''),     
    });
  }
  ngAfterViewInit(): void {
    this.loadAnnualHoliday();
  }

  //load all Annual Holiday
  loadAnnualHoliday()
  {
    if(!this.searchYear.value){
      return;
    }
    this.isSearched = true;
    this.year = this.searchYear.value;
    this.masterService.getAllAnnualHoliday(this.year).subscribe(res => {  
    this.dataSourceSecond = res;
    this.listAnHoliday = res;
    this.dataSource = new MatTableDataSource(this.dataSourceSecond);
    });
    this.refresh();
  }


  checkExistedHoliday(holiday:Holiday)
  {    
    this.result = true;
    //check annual holiday  existed
  this.listAnHoliday.forEach(element => {
  if(element.Id != holiday.Id && moment(element.Holiday1).format("YYYY/MM/DD") == moment(holiday.Holiday1).format("YYYY/MM/DD"))
    {      
      this.result = false; 
    }
  });
  return this.result;  
}

  //Form submited
  onSubmitData()
  {
    const formValue = this.dtFormHoliday.value;
    let newHoliday = new Holiday();
    newHoliday.Holiday1 = formValue.HolidayDay;
    newHoliday.Comment = formValue.Comment;
    if(this.idHoliday == 0)
    {
      if(this.dtFormHoliday.controls.HolidayDay.value == "")
      {
        this.dtFormHoliday.controls.HolidayDay.setValidators(Validators.required);
        this.dtFormHoliday.controls.HolidayDay.updateValueAndValidity();
        this.dtFormHoliday.controls.HolidayDay.markAllAsTouched()
      }
      if(this.dtFormHoliday.controls.Comment.value == "")
      {
        this.dtFormHoliday.controls.Comment.setValidators(Validators.required);
        this.dtFormHoliday.controls.Comment.updateValueAndValidity();
        this.dtFormHoliday.controls.Comment.markAllAsTouched()
      }
    }
    if(this.dtFormHoliday.invalid)
    {
      return;
    }


    //update holiday
    if(this.idHoliday)
    {      
      newHoliday.Id = this.idHoliday;  
      this.checkExistedHoliday(newHoliday);   
      if(this.result == false)
      {
        alert("Holiday already exists");
        return
      }
      
      newHoliday.UpdatedId = this.idLogin;
      newHoliday.UpdatedDate = new Date();      
      this.masterService.updateAnnualHoliday(newHoliday).subscribe(data => {
        alert("Update holiday successful");   
        this.route.navigate(['master/Holiday']);
        this.loadAnnualHoliday();
        this.refresh();
      }),
      error => {
        this.error = error;
        console.log(this.error);
      } 
      
    }
    //insert holiday
    else{
      this.checkExistedHoliday(newHoliday);   
      if(this.result == false)
      {
        alert("Holiday already exists");
        return
      }
      newHoliday.CreateDate = new Date();
      newHoliday.CreatedId = this.idLogin;      
      this.masterService.insertAnnualHoliday(newHoliday).subscribe(data => {
      this.route.navigate(['master/Holiday']);  
      this.loadAnnualHoliday();
      this.refresh();      
      }),
      error => {
        this.error = error;
        console.log(this.error);
      }
    }
  }

  
  //Edit Annual Holiday
  LoadEdit_AnnualHoliday(id){
  this.idHoliday = id;      
  this.masterService.getAnnualHolidayById(id).subscribe(data => {  
  this.dtFormHoliday.patchValue({
        HolidayDay: data.Holiday1,
        Comment: data.Comment,        
      });
    }),
    error => {
      this.error = error;
      console.log(this.error);
    } 
  }
  //Delete Annual Holiday
  DeleteAnnualHoliday(id){
    var isStateDel = confirm('Are you sure want to delete this holiday ?');
    if (!isStateDel) return;
    this.masterService.deleteAnnualHoliday(id).subscribe(data => {
      this.loadAnnualHoliday();
      this.route.navigate(['master/Holiday']);
    }),
      error => {
        this.error = error;
      }
  }
  
  //refresh holiday-form
  refresh() {
    this.idHoliday = 0;
    this.dtFormHoliday.patchValue(
      {
        HolidayDay: '',
        Comment: ''        
      }
    );
        this.dtFormHoliday.controls.HolidayDay.setValidators(null);
        this.dtFormHoliday.controls.HolidayDay.updateValueAndValidity();
        this.dtFormHoliday.controls.HolidayDay.markAllAsTouched()
        this.dtFormHoliday.controls.Comment.setValidators(null);
        this.dtFormHoliday.controls.Comment.updateValueAndValidity();
        this.dtFormHoliday.controls.Comment.markAllAsTouched()
  }
  //go to top 
  goToTop() {
    if (this.dtFormHoliday.invalid) {
      window.scrollTo(0, 0)
    }
  }
  
}
