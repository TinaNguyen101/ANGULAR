import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { EmployeeService } from '../../employee/_services/employee.service';
import { FormControl, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Commons } from 'src/app/_shared/common_function';
import * as _moment from 'moment';
const moment = _moment;

@Component({
  selector: 'app-employee-annual-rating-factor',
  templateUrl: './employee-annual-rating-factor.component.html',
  styleUrls: ['./employee-annual-rating-factor.component.scss']
})
export class EmployeeAnnualRatingFactorComponent implements OnInit {

  
  dataSource: MatTableDataSource<any>;
  dataSourceSecond = [];
  resultLastYear: any;
  isSearchted = false;
  lstYear: any;
  searchYear = new FormControl('', Validators.required);
  yearHeader : number;
  lstAnnualRatingFactor = [];
  RatingYearMember1;
  RatingYearLeader1;
  RatingYearMember2;
  RatingYearLeader2;
  displayedColumns = [
    'EmployeeName',
    'RatingYearMember1',
    'RatingYearLeader1',
    'RatingYearMember2',
    'RatingYearLeader2',
  ];

  constructor(private employeeService: EmployeeService, private route: Router, private commons: Commons,) { }

  ngOnInit() {
    this.employeeService.getAllYearAnnualRatingFactor().subscribe(resp => {
      this.lstYear = resp;
      this.yearHeader = parseInt(moment().year().toString());
    });  
  }
  selectClick = {
    id: -1,
    coll: -1
  };
  loadAnnualRatingFactor() {
    if(!this.searchYear.value){
      return;
    }
    this.isSearchted = true;  
    this.yearHeader = this.searchYear.value;
    this.RatingYearMember1 = "Rating Member "+(this.yearHeader-1);
    this.RatingYearLeader1 = "Rating Leader "+(this.yearHeader-1);
    this.RatingYearMember2 = "Rating Member "+(this.yearHeader);
    this.RatingYearLeader2 = "Rating Leader "+(this.yearHeader);
    this.employeeService.getAllAnnualRatingFactor(this.yearHeader).subscribe(resp => {
      this.dataSourceSecond = resp;
      console.log(resp);
      this.dataSource = new MatTableDataSource(this.dataSourceSecond);
    });

  }
  setSelectClick(EmpId, collum, year) {
    if (year < (new Date()).getFullYear()) {
     return false;
    }
    this.selectClick.id = EmpId;
    this.selectClick.coll = collum;
  }
  removeClick() {
    this.selectClick.id = -1;
    this.selectClick.coll = -1;
  }
  checkSelectClick(row, coll) {

    if (row) {
      if (this.selectClick.id == row.EmpId && this.selectClick.coll == coll) {
        return true;
      }

      return false;
    }
    return false;
  }

  setValueDataSource(event, EmpID, coll) {
    this.removeClick();
    let indexUpdate = this.dataSourceSecond.findIndex(item => {
      return item.EmpId == EmpID;
    });

    let rating = event.target.value / 100;
    switch (coll) {
      case 4: {
        this.dataSourceSecond[indexUpdate].RatingFactorMember = rating ;
        break;
      }
      case 5: {
        this.dataSourceSecond[indexUpdate].RatingFactorLeader = rating ;
        break;
      }
    }
   
    this.dataSource = new MatTableDataSource(this.dataSourceSecond);

  }
  submitData() {       
    this.employeeService.UpdateAnnualRatingFactor(this.dataSourceSecond).subscribe(rs => {
      alert("Update successful");
      this.route.navigate(['employee/AnnualRatingFactor'])
    });
  }

}
