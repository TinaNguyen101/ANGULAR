import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { EmployeeService } from '../../_services/employee.service';
import { FormControl, FormBuilder, Validators, FormGroup, ValidatorFn, AbstractControl } from '@angular/forms';
import { Subscription, ReplaySubject, Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { MatTableDataSource, MatDrawer, DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material';
import { DecimalPipe } from '@angular/common';

import * as _moment from 'moment';
import { yearRequiredValidator } from 'src/app/report/_validations/reportProject-validations';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { takeUntil } from 'rxjs/operators';
import { customRequiredValidator } from 'src/app/_shared/common-validations';
import { CurrencyRateService } from 'src/app/_services/currency-rate.service';
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
  selector: 'app-employee-annual-bonus',
  templateUrl: './employee-annual-bonus.component.html',
  styleUrls: ['./employee-annual-bonus.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },

    { provide: MAT_DATE_FORMATS, useValue: MONTH_ONLY_FORMATS },
  ]
})
export class EmployeeAnnualBonusComponent implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
    private employeeService: EmployeeService,
    private route: ActivatedRoute,
    private currencyRateService: CurrencyRateService,
    private decimalPipe: DecimalPipe,

  ) { }
  @ViewChild('drawercreate', { static: false }) drawercreate: MatDrawer;
  @ViewChild('toggleBottonDrawer', { static: false }) toggleBottonDrawer: ElementRef;
  @ViewChild('rateUSDElement', { static: false }) private rateUSDElement: ElementRef;
  @ViewChild('rateJPYElement', { static: false }) private rateJPYElement: ElementRef;
  GetAllBonusForEmpByYearSubcription: Subscription;
  GetProjectFinishOfYearSubcription: Subscription;
  GetAnnualRatingFacorSubcription: Subscription;
  GetBonusSubcription: Subscription;
  DeleteBonusSubcription: Subscription;
  AnnualRatingFactor = {
    Id: 0,
    RatingFactorLeader: 0,
    RatingFactorMember: 0
  };
  dataSource: MatTableDataSource<any>;
  dataSourceForLeader: MatTableDataSource<any>;
  displayedColumns = ['ProName', 'Day', 'Bonus', 'Action'];
  displayedColumnsForLeader = ['ProNameLeader', 'BonusLeader', 'ActionLeader'];
  bonusYear = new FormControl(moment().year(), {
    validators: [
      yearRequiredValidator(new FormControl('y')),
    ]
  });
  totalMoney = 0;
  yearCurent = moment().year();
  empId;
  idEdit;
  flagEdit;
  proId;
  salaryId;
  FormEditBonus: FormGroup;
  projectFilterCtrl = new FormControl('');
  rateUSD = new FormControl('')
  rateJPY = new FormControl('')
  listProject = [];
  listProjectMaintenace = [];
  TypeProject = "0";
  listFillterProject = [];
  listFillterProjectMaintenace = [];
  isOpenTableMember = true;
  bonus = 0;
  Top1Salary;
  userLogin;
  isMobile;
  innerWidth;
  hasMember;
  hasLeader;
  isTableMember = true;
  doneSetValidatorsRateInput = true;
  public fillterProject: ReplaySubject<[]> = new ReplaySubject<[]>(1)
  public fillterProjectMaintenace: ReplaySubject<[]> = new ReplaySubject<[]>(1);
  public custFilterCtrlMaintenace: FormControl = new FormControl();

  protected _onDestroy = new Subject<void>();
  customRequired2Validator(
    input: ElementRef, isSet: boolean
  ): ValidatorFn {
    return (control: AbstractControl) => {
      return input.nativeElement.value != '' || isSet
        ? null
        : { customRequired2: true };
    }
  }

  ngOnInit() {
    this.innerHeight = window.innerHeight;
    this.innerWidth = window.innerWidth;
    if (this.innerWidth > 1200) {
      this.isMobile = false;
    }
    else {
      this.isMobile = true;
    }
    this.empId = this.getEmpIdFromLocalStorage();
    this.FormEditBonus = this.formBuilder.group({
      TypeMember: new FormControl('0', Validators.required),
      TypeProject: new FormControl('0', Validators.required),
      Day: new FormControl('', {
        validators: [Validators.pattern("^[0-9]+(.[0-9]{0,2})?$"), Validators.required]
      }),
      ProjectId: new FormControl(null, Validators.required),
      ProjectMaintenanceId: new FormControl(null, Validators.required)
    });
    this.projectFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filter();
      });
    this.custFilterCtrlMaintenace.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterMaintenace();
      });
    this.FormEditBonus.controls.TypeProject.valueChanges.subscribe(() => {
      this.FormEditBonus.patchValue({
        ProjectMaintenanceId: null,
        ProjectId: null
      })
    })
    this.getTop1Salary();
    this.getUserLogin();
  }
  ngAfterViewInit(): void {
    this.GetProjectFinishOfYear(this.yearCurent, "1");
    this.GetAllBonusForEmpByYear(this.yearCurent);
    this.GetProjectFinishOfYear(this.yearCurent, "0");
    this.rateUSD.setValidators([this.customRequired2Validator(this.rateUSDElement, this.doneSetValidatorsRateInput)]);
    this.rateJPY.setValidators([this.customRequired2Validator(this.rateJPYElement, this.doneSetValidatorsRateInput)]);
    this.getAnnualRatingFactor();
    this.currencyRateService.getCurrency().subscribe(resp => {
      this.rateUSD.patchValue(this.decimalPipe.transform(resp.USD_VND, '1.0-0'));
      this.rateJPY.patchValue(this.decimalPipe.transform(resp.JPY_VND, '1.0-0'));
    });
    // setTimeout(() => {
    //   (this.dataSource.data.length>0) && this.scrollParentTo();
    // }, 1000);
  }

  scrollParentTo = (position = 10e10) => {
    if (this.innerWidth < 500 || (this.innerHeight < 500)) {
      window.document.getElementById('parentEmpoyee').scrollTo(0, position);
    }
  }
  getTop1Salary = () => {
    this.employeeService.getTop1Salary(this.empId, this.bonusYear.value).subscribe(data => {
      console.log(data)
      this.Top1Salary = data;
    });
  }
  getAnnualRatingFactor = () => {
    this.GetAnnualRatingFacorSubcription = this.employeeService.getAnnualRatingFactor(this.yearCurent, this.empId).subscribe(data => {
      if (data) {
        this.AnnualRatingFactor = data;
      } else {
        this.AnnualRatingFactor.RatingFactorLeader = 0;
        this.AnnualRatingFactor.RatingFactorMember = 0;
      }
    })
  }
  onEdit(row, typeMember = '0') {
    this.flagEdit = true;
    this.proId = row.ProId;
    this.FormEditBonus.controls.TypeMember.setValue(typeMember);
    if (row.isPro == "1") {
      this.FormEditBonus.controls.TypeProject && this.FormEditBonus.controls.TypeProject.setValue('0');
      this.FormEditBonus.controls.ProjectId.setValue(this.proId);

    } else if (row.isPro == '0') {
      this.FormEditBonus.controls.TypeProject && this.FormEditBonus.controls.TypeProject.setValue('1');
      this.FormEditBonus.controls.ProjectMaintenanceId.setValue(this.proId);
    }
    this.FormEditBonus.controls.Day.setValue(row.Day);
    this.bonus = Math.round(row.Bonus);
    this.idEdit = row.Id;
    this.salaryId = row.SalaryId;
    this.drawercreate.open();
  }
  GetAllBonusForEmpByYear = (year) => {
    this.onResize(event);
    this.GetAllBonusForEmpByYearSubcription = this.employeeService.GetAllBonusForEmpByYear(year, this.empId).subscribe(data => {
      this.dataSource = new MatTableDataSource([]);
      this.dataSourceForLeader = new MatTableDataSource([]);
      this.drawercreate.close();
      setTimeout(() => {
        data.lstBonusListForMember.sort((pro1, pro2) => {
          let nameA = this.convertVNToEng(pro1.ProName);
          let nameB = this.convertVNToEng(pro2.ProName);
          if (nameA < nameB) { return -1; }
          if (nameA > nameB) { return 1; }
          return 0;
        });
        data.lstBonusListForLeader.sort((pro1, pro2) => {
          let nameA = this.convertVNToEng(pro1.ProName);
          let nameB = this.convertVNToEng(pro2.ProName);
          if (nameA < nameB) { return -1; }
          if (nameA > nameB) { return 1; }
          return 0;
        });
        this.dataSource = new MatTableDataSource(data.lstBonusListForMember);
        this.dataSourceForLeader = new MatTableDataSource(data.lstBonusListForLeader);
        
      }, 500);
      setTimeout(() => {
        window.document.getElementById('wrapTableMemberMobile')&&window.document.getElementById('wrapTableMemberMobile').scrollTo(0,0);
        window.document.getElementById('wrapTableLeaderMobile')&&window.document.getElementById('wrapTableLeaderMobile').scrollTo(0,0);
      }, 500);
      setTimeout(() => {
        ((this.isTableMember == true && this.dataSource.data.length > 0) || (this.isTableMember == false && this.dataSourceForLeader.data.length > 0) ) && this.scrollParentTo();
        
      }, 500);
      this.totalMoney = 0;
      for (const item of data.lstBonusListForMember) {
        this.totalMoney += item.Bonus
      }
      for (const item of data.lstBonusListForLeader) {
        this.totalMoney += item.Bonus
      }
    });
    this.getAnnualRatingFactor();
    this.getTop1Salary();
  }
  GetAllBonus = () => {
    if (this.bonusYear.invalid) {
      return;
    };
    this.yearCurent = this.bonusYear.value;
    this.GetAllBonusForEmpByYear(this.yearCurent);
    this.GetProjectFinishOfYear(this.yearCurent, "1");
    this.GetProjectFinishOfYear(this.yearCurent, "0");
  }
  resetForm = () => {
    this.FormEditBonus.controls['Day'].reset();
    this.FormEditBonus.controls.ProjectMaintenanceId.reset();
    this.FormEditBonus.controls.ProjectId.reset();
    // this.FormEditBonus.controls.TypeMember.reset();
    this.FormEditBonus.controls.TypeMember.setValue('0');
    this.TypeProject = "0";
    this.bonus = 0;
    this.flagEdit = false;

  }
  formSubmit = () => {
    let bonusCurrent = this.bonus;
    if (this.TypeProject == '0') {
      this.FormEditBonus.controls.ProjectMaintenanceId.setValue('-10');
    } else {
      this.FormEditBonus.controls.ProjectId.setValue('-10');
    }
    if (this.FormEditBonus.controls.TypeMember.value == '1') {
      this.FormEditBonus.controls.Day.setValue('0');
    }
    if (this.FormEditBonus.invalid) {
      this.FormEditBonus.markAllAsTouched();
      return;
    };
    let bonusItem = {
      Bonus: Number = undefined,
      ProjectId: Number = undefined,
      RatingFactorId: Number = undefined,
      ProjectMaintenanceId: Number = undefined,
      RatingFactor: Number = undefined,
      EmpId: Number = undefined,
      Year: Number = undefined,
      Day: Number = undefined,
      Id: Number = undefined,
      SalaryId: Number = null,
      CreatedId: Number = null,
      UpdatedId: Number = null
    };
    bonusItem.Bonus = bonusCurrent;
    if (this.FormEditBonus.controls.TypeProject.value == '1') {
      bonusItem.ProjectMaintenanceId = this.FormEditBonus.controls.ProjectMaintenanceId.value;
      bonusItem.ProjectId = null;
    } else {
      bonusItem.ProjectMaintenanceId = null;
      bonusItem.ProjectId = this.FormEditBonus.controls.ProjectId.value;
    }
    bonusItem.EmpId = this.empId;
    if (this.FormEditBonus.controls.TypeMember.value == '0') {
      bonusItem.Day = this.FormEditBonus.controls.Day.value;

    } else {
      bonusItem.Day = null;
      if (this.rateJPY.invalid || this.rateUSD.invalid) {
        return;
      }
    }

    bonusItem.Year = this.yearCurent;
    bonusItem.RatingFactorId = this.AnnualRatingFactor.Id;
    bonusItem.RatingFactor = this.AnnualRatingFactor.RatingFactorLeader;
    if (!this.flagEdit && this.FormEditBonus.controls.TypeMember.value == '0') {
      bonusItem.SalaryId = this.Top1Salary.Id;
    }
    if (this.flagEdit && this.FormEditBonus.controls.TypeMember.value == '0') {
      bonusItem.SalaryId = this.salaryId;
    }
    if (this.flagEdit) {
      bonusItem.Id = this.idEdit;
      bonusItem.UpdatedId = this.userLogin.EmpId;
      this.employeeService.updateBonus(bonusItem).subscribe(() => {
        this.GetAllBonusForEmpByYear(this.yearCurent);
        alert("Update bonus success!");
        this.drawercreate.close();
      })
    } else {
      bonusItem.CreatedId = this.userLogin.EmpId;
      this.employeeService.insertBonus(bonusItem).subscribe(data => {
        this.GetAllBonusForEmpByYear(this.yearCurent);
        alert("Insert bonus success!");
        this.drawercreate.close();
      })
    }

  }
  isSetValidatorRate = (isSet = true) => {
    if (isSet) {
      this.doneSetValidatorsRateInput = false;
      if (!(this.rateUSD.value && this.rateJPY.value)) {
        this.rateJPY.markAllAsTouched();
        this.rateUSD.markAllAsTouched();
        (!this.rateJPY.value) && this.rateJPY.setErrors({ 'customRequired2': true });
        (!this.rateUSD.value) && this.rateUSD.setErrors({ 'customRequired2': true });
      }

    } else {
      this.doneSetValidatorsRateInput = true;
      let oldUSD = this.rateUSD.value;
      let oldJPY = this.rateJPY.value
      this.rateJPY.setErrors({ 'customRequired2': false });
      this.rateUSD.setErrors({ 'customRequired2': false });
      this.rateUSD.reset();
      this.rateJPY.reset();
      this.rateJPY.setValue(oldJPY);
      this.rateUSD.setValue(oldUSD);
    }

  }
  autoCreate = () => {
    this.isSetValidatorRate();
    if (this.rateJPY.invalid || this.rateUSD.invalid) {
      return;
    }
    let r = confirm("Are you sure to include the bonus information?");
    let confirmResutlt = false;
    if (r == true) {
      confirmResutlt = true;
    };
    this.employeeService.autoCreateBonus(this.empId, this.yearCurent, confirmResutlt, this.userLogin.EmpId, this.rateJPY.value.replace(new RegExp(',', 'g'), ''), this.rateUSD.value.replace(new RegExp(',', 'g'), '')).subscribe(data => {
      this.GetAllBonusForEmpByYear(this.yearCurent);
    });
  }

  removeBonus = () => {
    let cf = confirm("Are you sure want to delete this bonus?");
    if (cf) {
      this.DeleteBonusSubcription = this.employeeService.deleteBonus(this.idEdit).subscribe(() => {
        this.GetAllBonusForEmpByYear(this.yearCurent);
        alert("Delete a bonus success!");
        this.drawercreate.close();
      })
    }
  }
  arr_project;
  arr_project_man;
  GetProjectFinishOfYear = (year, flagProject) => {
    this.fillterProject = new ReplaySubject<[]>(1);
    this.fillterProjectMaintenace = new ReplaySubject<[]>(1);
    this.GetProjectFinishOfYearSubcription = this.employeeService.getProjectFinish(year, flagProject).subscribe(data => {
      switch (flagProject) {
        case '0':
          this.listProject = data;
          this.arr_project = data;
          for (let index = 0; index <= this.arr_project.length - 1; index++) {
            for (let index1 = index + 1; index1 <= this.arr_project.length - 1; index1++) {
              if (this.arr_project[index1].Id == this.arr_project[index].Id) {
                this.arr_project.splice(index1, 1);
              }
            }
          }
          var t = this.arr_project;
          this.fillterProject.next(t);
          break;
        case '1':
          this.listProjectMaintenace = data;
          console.log(data);
          this.arr_project_man = data;
          for (let index = 0; index <= this.arr_project_man.length - 1; index++) {
            for (let index1 = index + 1; index1 <= this.arr_project_man.length - 1; index1++) {
              if (this.arr_project_man[index1].Id == this.arr_project_man[index].Id) {
                this.arr_project_man.splice(index1, 1);
              }
            }
          }
          var t = this.arr_project_man;
          this.fillterProjectMaintenace.next(t);
          break;
        default:
          break;
      }
    })
  }

  convertVNToEng(alias) {
    var str = alias || "";
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, " ");
    str = str.replace(/ + /g, " ");
    str = str.replace(/ /g, "");
    str = str.trim();
    return str;
  }

  filter() {
    // get the search keyword
    let search = this.projectFilterCtrl.value;
    if (!search) {
      this.fillterProject.next(this.arr_project.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the member
    this.fillterProject.next(
      this.arr_project.filter(data => data.ProjectName.toLowerCase().indexOf(search) > -1)
    );
  }

  filterMaintenace() {
    // get the search keyword
    let search = this.custFilterCtrlMaintenace.value;
    if (!search) {
      this.fillterProjectMaintenace.next(this.arr_project_man.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the member
    this.fillterProjectMaintenace.next(
      this.arr_project_man.filter(data => data.ProjectName.toLowerCase().indexOf(search) > -1)
    );
  }
  getDayAndBonusMember = (value) => {
    if (this.FormEditBonus.controls.TypeMember.value == '0') {
      let proId = value, url;
      if (this.FormEditBonus.controls.TypeProject.value == '0') {
        url = 'projectId'
      } else {
        url = 'projectMaintenanceId';
      }
      this.employeeService.getDayAndBonusMember(this.empId, this.yearCurent, url, proId).subscribe(data => {
        this.bonus = Math.round(data.bonus);
        this.FormEditBonus.controls.Day.setValue(data.day);
      })
    }
  }
  changeTypeMember = (value) => {
    if (value == '0') {
      this.isSetValidatorRate(false);
      if (this.FormEditBonus.controls.ProjectId.valid || this.FormEditBonus.controls.ProjectMaintenanceId.valid) {
        if (this.FormEditBonus.controls.ProjectId.valid) {
          this.getDayAndBonusMember(this.FormEditBonus.controls.ProjectId.value)
        };
        if (this.FormEditBonus.controls.ProjectMaintenanceId.valid) {
          this.getDayAndBonusMember(this.FormEditBonus.controls.ProjectMaintenanceId.value)
        };
      }
    } else {
      this.isSetValidatorRate();
      if (this.FormEditBonus.controls.ProjectId.valid || this.FormEditBonus.controls.ProjectMaintenanceId.valid) {
        if (this.FormEditBonus.controls.ProjectId.valid) {
          this.setBonusLeader(this.FormEditBonus.controls.ProjectId.value)
        };
        if (this.FormEditBonus.controls.ProjectMaintenanceId.valid) {
          this.setBonusLeader(this.FormEditBonus.controls.ProjectMaintenanceId.value)
        };
      }
    }
  }
  getBonus = (day, empId, year) => {
    if (!day && empId && year) {
      return;
    }
    this.GetBonusSubcription = this.employeeService.getBonus(day, empId, year).subscribe(data => {
      this.bonus = Math.round(data);
    }, () => {
      this.bonus = 0;
    })
  }
  setTimeOutForBonus;
  setBonus = () => {
    if (this.FormEditBonus.controls.Day.invalid) {
      return;
    };
    this.setTimeOutForBonus && clearTimeout(this.setTimeOutForBonus);
    this.setTimeOutForBonus = setTimeout(() => {
      this.getBonus(this.FormEditBonus.controls.Day.value, this.empId, this.yearCurent);
    }, 500)
  }

  getBonusLeader = (proId, isProject, rateYen, rateUSD, empId, year) => {
    this.isSetValidatorRate();
    if (this.rateUSD.invalid || this.rateJPY.invalid) {
      return;
    }
    this.employeeService.getBonusLeader(proId, isProject, rateYen, rateUSD, empId, year).subscribe(data => {
      this.bonus = Math.round(data);
    })
  }
  setBonusLeader = (value) => {
    if (this.FormEditBonus.controls.TypeMember.value == '1') {
      this.getBonusLeader(value, this.TypeProject == '0', this.rateJPY.value.replace(new RegExp(',', 'g'), ''), this.rateUSD.value.replace(new RegExp(',', 'g'), ''), this.empId, this.yearCurent);
    }
  }
  getEmpIdFromLocalStorage = () => {
    return localStorage.getItem('emplpyeeId');
  }
  resetValueSearch = () => {
    if (this.listFillterProject.length == 0) {
      this.FormEditBonus.controls.ProjectId.setValue(null);
    }
  }
  unsubciption = (subscribe: Subscription) => {
    subscribe && subscribe.unsubscribe()
  }
  getUserLogin = () => {
    this.userLogin = JSON.parse(localStorage.getItem('authUser'));
  }

  @HostListener('window:resize', ['$event'])
  innerHeight;
  onResize(event) {
    this.innerWidth = window.innerWidth;
    this.innerHeight = window.innerHeight;
    if (this.innerWidth > 1200) {
      this.isMobile = false;
    }
    else {
      this.isMobile = true;
    }
  }

  renderValueOr0 = (value, unit = 'đ') => {
    if (!value || value == '' || value == null) {
      return '0 đ';
    }

    let result = (value + "").replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
    if (unit == 'đ') {
      return result + ' ' + unit;
    } else return unit + ' ' + result;
  }


}
