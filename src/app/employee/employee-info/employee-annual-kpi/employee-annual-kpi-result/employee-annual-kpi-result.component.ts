import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { FormBuilder, FormControl, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Commons } from 'src/app/_shared/common_function';
import * as _moment from 'moment';
import { SharedService } from 'src/app/employee/_share/shared-service';
import { EmployeeService } from 'src/app/employee/_services/employee.service';
import { AnnualEvaluationKPIResult } from 'src/app/employee/_models/annualKPIResult';
import { moveItemInArray, CdkDragDrop } from '@angular/cdk/drag-drop';
import { stringToKeyValue } from '@angular/flex-layout/extended/typings/style/style-transforms';
const moment = _moment;
@Component({
  selector: 'app-employee-annual-kpi-result',
  templateUrl: './employee-annual-kpi-result.component.html',
  styleUrls: ['./employee-annual-kpi-result.component.scss']
})
export class EmployeeAnnualKPIResultComponent implements OnInit {
  dataSource: MatTableDataSource<any>;
  dataSourceSecond = [];
  KPIClassificationResultDto = [];
  lstAnnualKPIResult = [];
  KPIHeading;
  Score: number;
  EvaluationContent;
  Classification;
  idLogin: number;
  error: string;
  empIdManage;
  IdMatCell: number;
  isSearchted = false;
  empId;
  year;
  yearSearch = new FormControl(moment().year());
  KPIHeadingTotal = 0;
  KPIHeadingTotal2 = 0;
  KPIHeadingTotal3 = 0;
  yearNow = moment().year();
  displayedColumns = [
    'KPIHeading',
    'Score',
    'EvaluationContent',
  ];
  count1;
  count2;
  lstDTO;
  lengthData;
  constructor(private employeeService: EmployeeService,
    private route: Router, private commons: Commons,
    private formBuilder: FormBuilder,
    private _sharedService: SharedService, ) { }

  ngOnInit() {
    this.getUserFormLocalStorage();
    const userLogin = JSON.parse(localStorage.getItem("authUser"));
    this.idLogin = userLogin.EmpId;
    this._sharedService.changeYearEmitted.subscribe(data => {
      this.yearSearch = data;
      this.year = data;
      if (this.empIdManage) {
        this.getUserFormLocalStorage();
        this.loadListAnnualKPIResult(this.yearSearch, this.empIdManage, this.empId);
      }
    });

    this._sharedService.changeEmpIdEmitted.subscribe(data => {
      this.empIdManage = data;
      if (this.yearSearch && this.empIdManage) {

        this.getUserFormLocalStorage();
        this.loadListAnnualKPIResult(this.yearSearch, this.empIdManage, this.empId);
      }
    })
  }
  selectClick = {
    id: -1,
    col: -1,
    index: -1
  };
  loadListAnnualKPIResult(year, evaluatorId, EmpId) {
    this.isSearchted = true;
    this.employeeService.getAnnualKPIResult(year, evaluatorId, EmpId).subscribe(data => {
      this.dataSource = new MatTableDataSource(data.KPIResultDto);
      this.lengthData = data.KPIResultDto.length;
      this.dataSourceSecond = data.KPIResultDto;
      this.lstDTO = data.KPIResultDto;
      this.KPIClassificationResultDto = data.KPIClassificationResultDto;
      this.lstAnnualKPIResult = data.KPIResultDto;
      this.count1 = this.lstDTO.filter(x => x.Kpiid == 1).length - 1;
      this.count2 = this.lstDTO.filter(x => x.Kpiid == 2).length - 1;
      this.KPIHeadingTotal = data.KPIResultDto.find(x => x.KpidetailId == 0 && x.Kpiid == 1).Score;
      this.KPIHeadingTotal2 = data.KPIResultDto.find(x => x.KpidetailId == 0 && x.Kpiid == 2).Score;
      console.log(data);
    });
  }
  getUserFormLocalStorage = () => {
    this.empId = localStorage.getItem('emplpyeeId');
  }
  setSelectClick(index, row, col) {

    this.removeClick();
    this.selectClick.index = index;
    this.selectClick.col = col;
    setTimeout(() => {
      window.document.getElementById('input-' + index).focus();
    }, 10);

  }
  removeClick() {
    this.selectClick.index = -1;
    this.selectClick.col = -1;
  }
  checkSelectClick(row, index, col) {
    if (row) {
      if (this.selectClick.index == index && this.selectClick.col == col) {
        return true;
      }
      return false;
    }
    this.dataSource = new MatTableDataSource(this.dataSourceSecond);
    return false;
  }

  submitData() {
    for (let index = 0; index < this.dataSourceSecond.length; index++) {
      this.dataSourceSecond[index].UpdatedId = this.idLogin;
      this.dataSourceSecond[index].CreatedId = this.idLogin;
      if (this.dataSourceSecond[index].Kpiid == 1 && this.dataSourceSecond[index].KpidetailId == 0) {
        this.dataSourceSecond[index].Score = this.KPIHeadingTotal;
      }
      if (this.dataSourceSecond[index].Kpiid == 2 && this.dataSourceSecond[index].KpidetailId == 0) {
        this.dataSourceSecond[index].Score = this.KPIHeadingTotal2;
      }
    }
    this.employeeService.updateAnnualKPIResult(this.dataSourceSecond).subscribe(rs => {
      alert("Update Annual KPI Result successful");
      this.loadListAnnualKPIResult(this.yearSearch, this.empIdManage, this.empId);
    });
  }
  getValueInput(row, Score, index) {
    if (parseInt(Score.value) > 100) {
      Score.value = "";
      return;
    }
    this.KPIHeadingTotal = 0;
    this.KPIHeadingTotal2 = 0;
    this.KPIHeadingTotal3 = 0;
    this.dataSourceSecond[index].Score = parseInt(Score.value);
    this.lstDTO = this.dataSourceSecond;
    this.count1 = this.lstDTO.filter(x => x.Kpiid == 1).length - 1;
    this.count2 = this.lstDTO.filter(x => x.Kpiid == 2).length - 1;
    for (let i = 0; i < this.lstDTO.length; i++) {
      if (this.lstDTO[i].Kpiid == 1) {
        if(!this.lstDTO[i].Score)
        {
          this.lstDTO[i].Score = null;
        }
        if (this.lstDTO[i].Score != null) {

          this.KPIHeadingTotal += (parseInt(this.lstDTO[i].Score) * parseInt(this.lstDTO[i].Kpirate));
          
        }
      }
      if (this.lstDTO[i].Kpiid == 2) {
        if (this.lstDTO[i].KpidetailId != 0) {
          if(!this.lstDTO[i].Score)
          {
            this.lstDTO[i].Score = null;
          }
          if (this.lstDTO[i].Score != null) {
            this.KPIHeadingTotal2 += (parseInt(this.lstDTO[i].Score) * parseInt(this.lstDTO[i].Kpirate));
          }
        }
      }
      if (this.lstDTO[i].Kpiid == 3) {
        if (Score.value != "" && Score.value != null
          && this.lstDTO[i].KpidetailId == 0 && row.Kpiid == 3) {
          this.lstDTO[i].Score = Score.value;
        }
      }
    }
    if (this.count1 == 0) {
      this.count1 = 1;
    }
    if (this.count2 == 0) {
      this.count2 = 1;
    }
    this.KPIHeadingTotal2 = Number((this.KPIHeadingTotal2 / this.count2).toPrecision(3));
    this.KPIHeadingTotal = Number((this.KPIHeadingTotal / this.count1).toPrecision(3));
    this.dataSourceSecond = this.lstDTO;
    this.dataSource = new MatTableDataSource(this.dataSourceSecond);
  }
  getValueContentInput(row, Content, index) {
    this.dataSourceSecond[index].EvaluationContent = Content.value;
    this.dataSource = new MatTableDataSource(this.dataSourceSecond);
  }
  //Drag and Drop Mobile
  dropMB(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.lstAnnualKPIResult, event.previousIndex, event.currentIndex);
  }

}
