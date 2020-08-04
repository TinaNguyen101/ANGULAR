import { Component, OnInit, ElementRef, ViewChild, Inject, HostListener } from '@angular/core';
import { SalaryService } from '../_services/salary.service';
import { MatTableDataSource, MatDatepicker, MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as _moment from 'moment';
import { monthRequiredValidator } from 'src/app/report/_validations/reportProject-validations';
import { defaultFormat as _rollupMoment, Moment } from 'moment';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { HttpEventType } from '@angular/common/http';
import { saveAs } from 'file-saver';


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
  selector: 'app-accounting-monthly-salary',
  templateUrl: './accounting-monthly-salary.component.html',
  styleUrls: ['./accounting-monthly-salary.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },

    { provide: MAT_DATE_FORMATS, useValue: MONTH_ONLY_FORMATS },
  ],
})
export class AccountingMonthlySalaryComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private salaryService: SalaryService, public dialog: MatDialog) { }

  ngOnInit() {
    this.userLogin = JSON.parse(localStorage.getItem('authUser'));
    this.innerWidth = window.innerWidth;
    this.getAllMonthlySalary(true);
    this.formSearch = this.formBuilder.group({
      EmpName: new FormControl(''),
      CustContactName: new FormControl(null),
      SalaryFrom: new FormControl(null),
      SalaryTo: new FormControl(null)
    });
  }

  ngAfterViewInit(): void {
    this.salaryYearMonth.setValidators([
      monthRequiredValidator(this.reportBy, this.salaryYearMonthElement),
    ]);

  }
  serchValueForm = {
    EmpName: '',
    SalaryFrom: null,
    SalaryTo: null
  }
  RequestMonthSalary = {
    pageNumber: 0,
    pageSize: 10e5,
    filters: {
      yearMonth: null,
      EmpName: null,
      SalaryFrom: null,
      SalaryTo: null
    }
  }
  selectYearMonth;
  dataSource: MatTableDataSource<any>;
  displayedColumns = ['Action', 'EmpName', 'Salary', 'BonusOt', 'Allowance', 'Deduction', 'Actual'];
  @ViewChild("parentTable", { static: true }) parentTable: ElementRef;
  @ViewChild('salaryYearMonthElement', { static: true }) private salaryYearMonthElement: ElementRef;
  salaryYearMonth = new FormControl(moment());
  selectedYear = 0;
  reportBy = new FormControl('m');
  listMonthName = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  formSearch: FormGroup;
  innerWidth;
  employeeSelected;
  listAllSalary = [];
  listAllSalaryUpdate = [];
  userLogin;
  isLoadingData = false;
  selectClick = {
    id: -1,
    coll: -1
  }
  updateSalary = () => {
    let year = this.selectYearMonth.slice(0, 4);
    let month = this.selectYearMonth.replace(year, '');
    if (year < moment().year()) {
      return false;
    };
    if (month - 1 < moment().months()) {
      return false;
    }
    for (const item of this.listAllSalaryUpdate) {
      item.UpdatedId = this.userLogin.EmpId;
      item.UpdatedDate = moment().format('YYYY-MM-DD');
    }
    this.salaryService.updateMonthlySalary(this.listAllSalaryUpdate).subscribe(() => {
      this.getAllMonthlySalary();
      alert(`Updated payroll in ${this.listMonthName[month - 1]} successfully!`);
    })
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

  setSelectClick(row, coll) {
    let year = this.selectYearMonth.slice(0, 4);
    let month = this.selectYearMonth.replace(year, '');
    if (year < moment().year()) {
      return false;
    };
    if (month - 1 < moment().months()) {
      return false;
    }
    this.selectClick.id = row.EmpId;
    this.selectClick.coll = coll;
    setTimeout(() => {
      window.document.getElementById('input-' + row.EmpId + coll).focus();
    }, 10);
  }
  setValueDataSource(event, EmpID, coll) {
    this.removeClick();
    let indexUpdate = this.listAllSalaryUpdate.findIndex(item => {
      return item.EmpId == EmpID;
    });
    let indexShow = this.listAllSalary.findIndex(item => {
      return item.EmpId == EmpID;
    });
    let value = event.target.value.replace(/,/g, '');
    switch (coll) {
      case 4: {
        this.listAllSalaryUpdate[indexUpdate].Allowance = value;
        this.listAllSalary[indexShow].Allowance = value;
        break;
      }
      case 5: {
        this.listAllSalaryUpdate[indexUpdate].Deduction = value;
        this.listAllSalary[indexShow].Deduction = value;
        break;
      }
    }

    this.dataSource = new MatTableDataSource(this.listAllSalary);

  }
  removeClick() {
    this.selectClick.id = -1;
    this.selectClick.coll = -1;
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAccountingMonthSalary, {
      panelClass: 'wrapdialog',
      maxWidth: '92vw',
      data: {
        selectedYear: this.selectYearMonth,
        employeeSelected: this.employeeSelected,
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      this.goToTop();
      this.getAllMonthlySalary();
    });
  }
  onSubmitformSearch = () => {
    this.RequestMonthSalary.filters.EmpName = this.formSearch.controls.EmpName.value;
    this.RequestMonthSalary.filters.SalaryFrom = parseInt(this.formSearch.controls.SalaryFrom.value);
    this.RequestMonthSalary.filters.SalaryTo = parseInt(this.formSearch.controls.SalaryTo.value);
    this.RequestMonthSalary.filters.yearMonth = this.selectYearMonth;
    this.salaryService.getAllMonthlySalary(this.RequestMonthSalary).subscribe(data => {
      this.goToTop();
      this.dataSource = new MatTableDataSource(data.items);
      this.listAllSalary = data.items;
      this.serchValueForm.EmpName = this.formSearch.controls.EmpName.value;
      this.serchValueForm.SalaryFrom = parseInt(this.formSearch.controls.SalaryFrom.value);
      this.serchValueForm.SalaryTo = parseInt(this.formSearch.controls.SalaryTo.value);
      this.resetFromSearch();
    });
  }
  setValueFormSearch = () => {
    this.formSearch.patchValue({
      EmpName: this.serchValueForm.EmpName,
      SalaryFrom: this.serchValueForm.SalaryFrom,
      SalaryTo: this.serchValueForm.SalaryTo
    })
  }
  getAllMonthlySalary = (firstLoad = false) => {
    this.salaryYearMonth.markAsTouched();
    if (!this.salaryYearMonth.value) {
      this.salaryYearMonth.setErrors({
        monthRequired: true
      })
    }
    if (this.salaryYearMonth.valid) {
      this.isLoadingData = true;
      this.selectYearMonth = this.convertToYearMonthString();
      this.RequestMonthSalary.filters.EmpName = null;
      this.RequestMonthSalary.filters.SalaryFrom = null;
      this.RequestMonthSalary.filters.SalaryTo = null;
      this.RequestMonthSalary.filters.yearMonth = this.selectYearMonth;
      this.salaryService.getAllMonthlySalary(this.RequestMonthSalary).subscribe(data => {
        if (firstLoad) {
          this.dataSource = new MatTableDataSource(data.items);
          this.listAllSalaryUpdate = data.items;
          this.listAllSalary = data.items;
          this.isLoadingData = false;
          return;
        }
        if (data.itemscount == 0) {
          this.checkExistsMonthlySalary((data2) => {
            if (data2 == -1) {
              alert("There are no employees in " + this.listMonthName[this.salaryYearMonth.value.month()] + " " + this.salaryYearMonth.value.year());
              this.dataSource = new MatTableDataSource([]);
              this.serchValueForm = {
                EmpName: '',
                SalaryFrom: null,
                SalaryTo: null
              }
              this.listAllSalary = [];
              this.listAllSalaryUpdate = [];
              this.isLoadingData = false;
              return;
            }
            setTimeout(() => {
              let cf = confirm("Data for this month does not exist. Do you want to create data?");
              if (cf == true) {
                this.salaryService.generateMonthlySalary(this.selectYearMonth, this.userLogin.EmpId).subscribe(result => {
                  this.salaryService.getAllMonthlySalary(this.RequestMonthSalary).subscribe(data3 => {
                    this.goToTop();
                    this.dataSource = new MatTableDataSource(data3.items);
                    this.serchValueForm = {
                      EmpName: '',
                      SalaryFrom: null,
                      SalaryTo: null
                    }
                    this.listAllSalary = data3.items;
                    this.listAllSalaryUpdate = data2.items;
                    this.isLoadingData = false;
                  })
                })
              } else {
                this.dataSource = new MatTableDataSource([]);
                this.serchValueForm = {
                  EmpName: '',
                  SalaryFrom: null,
                  SalaryTo: null
                }
                this.listAllSalary = [];
              }
            }, 200);
          })
        } else {
          this.goToTop();
          this.dataSource = new MatTableDataSource(data.items);
          this.serchValueForm = {
            EmpName: '',
            SalaryFrom: null,
            SalaryTo: null
          }
          this.listAllSalary = data.items;
          this.listAllSalaryUpdate = data.items;
          this.isLoadingData = false;
        }

      })
    }

  }
  checkDisableTimeButton = () => {
    if (this.listAllSalary.length == 0) {
      return true;
    }
    let year = this.selectYearMonth.slice(0, 4);
    let month = this.selectYearMonth.replace(year, '');
    if (year < moment().year()) {
      return true;
    };
    if (month - 1 < moment().months()) {
      return true;
    }
    return false;
  }

  generateMonthlySalary = () => {
    if (this.salaryYearMonth.invalid) {
      return;
    }
    let ym = this.convertToYearMonthString();
    this.checkExistsMonthlySalary(data => {
      if (data == -1) {
        alert("There are no employees in " + this.listMonthName[this.salaryYearMonth.value.month()] + " " + this.salaryYearMonth.value.year());
        return;
      }
      if (!data) {
        this.salaryService.generateMonthlySalary(ym, this.userLogin.EmpId).subscribe(data => {

          this.getAllMonthlySalary();
        })
      } else {
        alert(this.listMonthName[this.salaryYearMonth.value.month()] + " " + this.salaryYearMonth.value.year() + " payroll already exists.")
      }
    })
  }

  deleteMonthlySalary = () => {
    this.salaryService.checkExistsMonthlySalary(this.selectYearMonth).subscribe(data => {
      let y = (this.selectYearMonth + "").slice(0, 4);
      let m = (this.selectYearMonth + "").replace(y, '');
      if (data > 0) {
        let cf = confirm(`Do you want to delete the payroll in ${this.listMonthName[parseInt(m) - 1]} ${y}?`);
        if (cf == true) {
          this.salaryService.deleteMonthlySalary(this.selectYearMonth).subscribe(() => {
            this.dataSource = new MatTableDataSource([]);

            setTimeout(() => { alert("Delete success!"); this.listAllSalary = []; this.listAllSalaryUpdate = [] }, 0)
          })
        } else {
          return;
        }
      } else {
        alert(this.listMonthName[parseInt(m) - 1] + ' ' + y + ' payroll does not exist.')
      }
    })
  }

  downloadFileAnnuaListForYear = () => {
    this.salaryService.checkExistsMonthlySalary(this.selectYearMonth).subscribe(data => {
      let y = (this.selectYearMonth + "").slice(0, 4);
      let m = (this.selectYearMonth + "").replace(y, '');
      if (data > 0) {
        this.salaryService.downloadReportMonthlySalary(this.selectYearMonth).subscribe(data => {
          switch (data.type) {
            case HttpEventType.Response:
              const downloadedFile = new Blob([data.body], { type: data.body.type });
              saveAs(downloadedFile, "Report_Monthly_Salary_For_" + this.selectYearMonth);
              break;
          }
        })
      } else {
        alert(this.listMonthName[parseInt(m) - 1] + ' ' + y + ' payroll does not exist.');
      }
    })

  }

  checkExistsMonthlySalary = (callback) => {
    let ym = this.convertToYearMonthString()
    this.salaryService.checkExistsMonthlySalary(ym).subscribe(data => {
      callback(data);
    })
  }

  chosenYearHandler(normalizedYear: Moment) {
    const ctrlValue = this.salaryYearMonth.value;
    if (ctrlValue == null) {
      this.selectedYear = normalizedYear.year()
    } else {
      ctrlValue.year(normalizedYear.year());
      this.salaryYearMonth.setValue(ctrlValue);
    }
  }

  chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.salaryYearMonth.value;
    if (ctrlValue == null) {
      normalizedMonth.year(this.selectedYear);
      this.salaryYearMonth.setValue(normalizedMonth);
    } else {
      ctrlValue.month(normalizedMonth.month());
      this.salaryYearMonth.setValue(ctrlValue);
    }
    datepicker.close();
  }

  onEditBonusEmployee = (emp) => {
    console.log(emp)
    this.employeeSelected = emp;
    this.openDialog();
  }

  convertToYearMonthString = () => {
    let year;
    let month;
    year = this.salaryYearMonth.value.year();
    if (this.salaryYearMonth.value.month() + 1 < 10) {
      let current = this.salaryYearMonth.value.month() + 1;
      month = "0" + current;
    } else {
      month = this.salaryYearMonth.value.month() + 1;
    }
    return year + "" + month;
  }

  goToTop = () => {
    this.parentTable.nativeElement.scrollTo(0, 0)
  }

  resetFromSearch = () => {
    this.formSearch.reset();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
  }

}


//Dialog-------------------------
export const Y_M_D_FORMATS = {
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

@Component({
  selector: 'dialog-accouting-salary',
  templateUrl: 'dialog-accouting-salary.html',
  styleUrls: ['./dialog.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },

    { provide: MAT_DATE_FORMATS, useValue: Y_M_D_FORMATS },
  ]
})

export class DialogAccountingMonthSalary {
  constructor(
    private formBuilder: FormBuilder,
    private salaryService: SalaryService,
    public dialogRef: MatDialogRef<DialogAccountingMonthSalary>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  //#region variable
  innerWidth;
  @ViewChild('wrapMonthlyOvertime', { static: false }) wrapMonthlyOvertime: ElementRef;
  formImageBonus: FormGroup;
  formMonthlyOvertime: FormGroup;
  lstMstImageUnitPrice;
  dataSourceImageBonus: MatTableDataSource<any>;
  displayedColumnsImageBonus = ['ImageType', 'TotalImageBonus', 'Wage', 'Comment', 'Action'];
  selectedYear;
  MonthlyBonus;
  isEdit = false;
  unitPrice;
  TotalImageBonus;
  TotalImageBasic;
  wage;
  userLogin;
  userSelected;
  rowSelected;
  yearMonthFomat;
  filterCustomer = [];
  custFilterCtrl: FormControl = new FormControl(null);
  listProjectFilter = [];
  listMainProject = [];
  listMainProjectMaintanain = [];
  dataSourceMonthlyOvertime: MatTableDataSource<any> = new MatTableDataSource([]);
  displayedColumnsMonthlyOvertime = ['ProjectName', 'Otdate', 'PaymentDate', 'Time', 'Wage', 'Action'];
  allMonthlyOT;
  wageIT;
  isEditIT = false;
  rowITSelected;
  totalMonthlyIT = 0;
  SatAndSunBonus = 0;
  MonToFriBonus = 0;
  idMonthlyBonus = 0;
  isDisable = false;
  //#endregion

  ngAfterViewInit() {
    setTimeout(() => {
      if (this.dataSourceMonthlyOvertime.data.length > 0) {
        this.scrollToTop();
      }
    }, 500)
  }
  ngOnInit() {
    console.log(this.userSelected)
    this.innerWidth = window.innerWidth;
    this.salaryService.getTotalImageBasicMonth().subscribe(data => {
      this.TotalImageBasic = data;
    });
    this.getUserLoginFromLocal();
    this.selectedYear = this.data.selectedYear;
    this.userSelected = this.data.employeeSelected;
    this.setDisable();
    if(this.isDisable){
      this.formImageBonus = this.formBuilder.group({
        TotalImageInMonth: new FormControl(''),
        ImageLastWeek: new FormControl(''),
        ImageFirstWeek: new FormControl(''),
        Comment: new FormControl('')
      });
      this.formMonthlyOvertime = this.formBuilder.group({
        TypeProject: new FormControl('0'),
        ProjectId: new FormControl(''),
        PaymentDate: new FormControl(''),
        OvertimeDate: new FormControl(''),
        TimeFrom: new FormControl(''),
        To: new FormControl('')
      });
    } else {
      this.formImageBonus = this.formBuilder.group({
        TotalImageInMonth: new FormControl('', Validators.required),
        ImageLastWeek: new FormControl('', Validators.required),
        ImageFirstWeek: new FormControl('', Validators.required),
        Comment: new FormControl('')
      });
      this.formMonthlyOvertime = this.formBuilder.group({
        TypeProject: new FormControl('0', Validators.required),
        ProjectId: new FormControl('', Validators.required),
        PaymentDate: new FormControl('', Validators.required),
        OvertimeDate: new FormControl('', Validators.required),
        TimeFrom: new FormControl('', Validators.required),
        To: new FormControl('', Validators.required)
      });
    }

    this.getProjectFinish();

    this.yearMonthFomat = (this.selectedYear + "").slice(0, 4) + "/" + (this.selectedYear + "").slice(4);
    this.getMstByName('MstImageUnitPrice');
    this.getAllMonthlyBonus(this.selectedYear);
    this.getallMonthlyOT();
  }
  setDisable = () => {
    if(+(this.selectedYear + "").slice(0, 4) > moment().years()) return;
    if(+(this.selectedYear + "").slice(0,4) < moment().years()){
      this.isDisable = true;
      return;
    }
    if(+(this.selectedYear + "").slice(4) -1 < moment().months()){
      this.isDisable = true;
      return;
    }
  }
  onSubmitForm = (isEdit = false) => {
    this.formImageBonus.markAllAsTouched();
    if (this.formImageBonus.invalid) {
      return;
    }
    let dataBasic = {
      EmpId: this.userSelected.EmpId,
      Comment: this.formImageBonus.controls.Comment.value,
      YearMonth: this.selectedYear,
      SatAndSunImage: (this.formImageBonus.controls.ImageLastWeek.value + "").replace(/,/g, ""),
      MonToFriImage: (this.formImageBonus.controls.ImageFirstWeek.value + "").replace(/,/g, ""),
      SatAndSunBonus: this.SatAndSunBonus,
      MonToFriBonus: this.MonToFriBonus,
      TotalImage: (this.formImageBonus.controls.TotalImageInMonth.value + "").replace(/,/g, ""),
      TotalBonus: this.SatAndSunBonus + this.MonToFriBonus,
    }
    let callback = () => {
      setTimeout(() => {
        if (isEdit) {
          alert('Update Monthly Image bonus success!');
        } else {
          alert('Insert Monthly Image bonus success!');
        }
        this.dialogRef.close();
        // this.getAllMonthlyBonus(this.selectedYear);
      }, 0);
    }
    if (isEdit) {
      dataBasic = Object.assign({ UpdatedId: this.userLogin.EmpId, Id: this.idMonthlyBonus }, dataBasic);
      this.salaryService.updateMonthlyBonus(dataBasic).subscribe(() => {
        callback();
      });
    } else {
      dataBasic = Object.assign({ CreatedId: this.userLogin.EmpId }, dataBasic);
      this.salaryService.insertMonthlyBonus(dataBasic).subscribe(() => {
        callback();
        // this.isEdit = true;
      });
    }
  }
  onDeleteImageBonus = () => {
    this.windowConfirm('Are you sure want to delete this image bonus?', () => {
      this.salaryService.deleteMonthlyBonus(this.MonthlyBonus.Id).subscribe(() => {
        // this.getAllMonthlyBonus(this.selectedYear);
        // this.onResetFormImageBonus();
        // this.MonToFriBonus = 0;
        // this.SatAndSunBonus = 0;
        // this.isEdit = false;
        setTimeout(() => {
          // alert('Delete success!');
          this.dialogRef.close();
        }, 0);
      })
    })
  }
  getMstByName = (mstName) => {
    this.salaryService.getMstByName(mstName).subscribe(data => {
      this.lstMstImageUnitPrice = data.mst;
    })
  };
  getAllMonthlyBonus = (yearMonth) => {
    this.salaryService.getAllMonthlyBonus(yearMonth, this.userSelected.EmpId).subscribe(data => {
      console.log(data)
      this.MonthlyBonus = data || null;
      if (data) {
        this.idMonthlyBonus = data.Id;
        this.isEdit = true;
        this.SatAndSunBonus = data.SatAndSunBonus;
        this.MonToFriBonus = data.MonToFriBonus;
        this.TotalImageBonus = data.SatAndSunImage + data.MonToFriImage;
        this.formImageBonus.patchValue({
          TotalImageInMonth: data.TotalImage,
          ImageLastWeek: data.SatAndSunImage,
          ImageFirstWeek: data.MonToFriImage,
          Comment: data.Comment
        })
      }
    })
  }
  getWageBonusImageOfPhotoshop = () => {

  }
  getTotalImageBonus = () => {
    if (this.formImageBonus.controls.TotalImageInMonth.invalid) {
      return;
    }
    this.salaryService.getTotalImageBonus(this.formImageBonus.controls.TotalImageInMonth.value).subscribe(data => {
      this.TotalImageBonus = data;
    })
  }
  reloadImageFirstweed = (event) => {
    if (!this.formImageBonus.controls.TotalImageInMonth.value) {
      this.formImageBonus.controls.TotalImageInMonth.setErrors({
        required: true,
      })
      this.formImageBonus.controls.TotalImageInMonth.markAsTouched();
      return;
    }
    let value = this.TotalImageBonus - (+event.target.value.replace(/,/g, ""));;
    if (value < 0) {
      this.formImageBonus.controls.ImageLastWeek.setErrors({
        valueNotValid: true,
      });
      this.formImageBonus.controls.ImageFirstWeek.setValue(null);
      return;
    }
    this.formImageBonus.controls.ImageFirstWeek.setValue(value);
    this.SatAndSunBonus = (+event.target.value.replace(/,/g, "")) * this.lstMstImageUnitPrice[0].UnitPrice;
    this.MonToFriBonus = value * this.lstMstImageUnitPrice[1].UnitPrice;
  }
  reloadImageLastweed = (event) => {
    if (!this.formImageBonus.controls.TotalImageInMonth.value) {
      this.formImageBonus.controls.TotalImageInMonth.setErrors({
        required: true,
      })
      this.formImageBonus.controls.TotalImageInMonth.markAsTouched();
      return;
    }
    let value = this.TotalImageBonus - (+event.target.value.replace(/,/g, ""));;
    if (value < 0) {
      this.formImageBonus.controls.ImageFirstWeek.setErrors({
        valueNotValid: true,
      });
      this.formImageBonus.controls.ImageLastWeek.setValue(null);
      return;
    }
    this.formImageBonus.controls.ImageLastWeek.setValue(value);
    this.MonToFriBonus = (+event.target.value.replace(/,/g, "")) * this.lstMstImageUnitPrice[1].UnitPrice;
    this.SatAndSunBonus = value * this.lstMstImageUnitPrice[0].UnitPrice;
  }
  onEditBonus = (item) => {
    clearTimeout(this.timeOutGetWageBonusImageOfPhotoshop);
    this.scrollToTop(0);
    this.rowSelected = item;
    this.isEdit = true;
    this.formImageBonus.patchValue({
      ImageType: item.ImageUnitPriceId,
      TotalImage: item.TotalImageBonus,
      Comment: item.Comment
    });
    this.unitPrice = item.UnitPrice;
    this.wage = item.Wage;
    this.TotalImageBonus = item.TotalImageBonus
  };
  onResetFormImageBonus = () => {
    this.formImageBonus.reset();
    this.isEdit = false;
    this.unitPrice = null;
    this.wage = null;
    this.TotalImageBonus = null;

  }

  timeOutGetWageBonusImageOfPhotoshop;
  onChangeImageType = (value) => {
    this.timeOutGetWageBonusImageOfPhotoshop && clearTimeout(this.timeOutGetWageBonusImageOfPhotoshop);
    this.timeOutGetWageBonusImageOfPhotoshop = setTimeout(() => {
      this.getWageBonusImageOfPhotoshop();
    }, 500);
    let itemMst = this.lstMstImageUnitPrice.find(x => x.Id == value);
    this.unitPrice = itemMst.UnitPrice;
  }
  onChangeTotalImage = (event) => {
    this.timeOutGetWageBonusImageOfPhotoshop && clearTimeout(this.timeOutGetWageBonusImageOfPhotoshop);
    this.timeOutGetWageBonusImageOfPhotoshop = setTimeout(() => {
      this.getWageBonusImageOfPhotoshop();
      if (this.formImageBonus.controls.ImageLastWeek.value) {
        let inputValue = (event && event.value) || this.formImageBonus.controls.TotalImageInMonth.value || "";
        let value = (+(inputValue + '').replace(/,/g, "")) - this.TotalImageBasic - (+(this.formImageBonus.controls.ImageLastWeek.value + "").replace(/,/g, ""));
        if (value >= 0) {
          this.formImageBonus.controls.ImageFirstWeek.setValue(value);
        } else {
          this.formImageBonus.controls.ImageFirstWeek.setValue(null);
          this.formImageBonus.controls.ImageLastWeek.setValue(null);
        }
      }

    }, 500);
  }

  clearInput() {
    if (this.filterCustomer.length == 0) {
      this.formMonthlyOvertime.controls.CustName.setValue(null);
      this.filterCustomer = [];
    }
  }

  filterProject() {
    let list = this.formMonthlyOvertime.controls.TypeProject.value == '0' ? this.listMainProject : this.listMainProjectMaintanain;
    if (this.custFilterCtrl.value) {
      this.listProjectFilter = list.filter(x => {
        return x.ProjectName.toLowerCase().includes(this.custFilterCtrl.value.toLowerCase())
      })
    } else this.listProjectFilter = list;
  }

  changeListProject = (event) => {
    this.listProjectFilter = event.value == '0' ? this.listMainProject : this.listMainProjectMaintanain;
  }

  getProjectFinish = () => {
    let year = this.selectedYear.slice(0, 4);
    this.salaryService.getProjectFinish(year, 0).subscribe(data => {
      this.listMainProject = data;
      this.listProjectFilter = data;
    });
    this.salaryService.getProjectFinish(year, 1).subscribe(data => {
      this.listMainProjectMaintanain = data;
    })
  }
  scrollToTop = (sr = 10e10) => {
    if (this.innerWidth < 1200) {
      this.wrapMonthlyOvertime.nativeElement.scrollTo(0, sr);
    }
  }
  setTimeOutGetWageOvertime;
  getWageOvertime = (timeOut = 500, callback = null) => {
    if (this.formMonthlyOvertime.controls.OvertimeDate.invalid ||
      this.formMonthlyOvertime.controls.TimeFrom.invalid ||
      this.formMonthlyOvertime.controls.To.invalid) {
      return;
    };
    clearTimeout(this.setTimeOutGetWageOvertime);
    let from, to;
    debugger;
    from = (+this.formMonthlyOvertime.controls.TimeFrom.value.split(':')[0]) + (+this.formMonthlyOvertime.controls.TimeFrom.value.split(':')[1] / 60);
    if (!from) {
      let vl = this.formMonthlyOvertime.controls.TimeFrom.value+'';
      let num;
      if(vl.length==2||vl.length==1){
        num = (+(vl+'0'+'0'));
      } else if(vl.length==3){
        num = vl.slice(0,2) + '0' + vl.slice(2);
      }
      else {
        num = (+vl);
      }    
      let intPart = parseInt( num/100 + '');
      let decPart = (num -intPart*100)/60
      from = intPart + decPart;
    }
    to = (+this.formMonthlyOvertime.controls.To.value.split(':')[0]) + (+this.formMonthlyOvertime.controls.To.value.split(':')[1] / 60);
    if (!to) {
      let vl = this.formMonthlyOvertime.controls.To.value + '';
      let num;
      if(vl.length==2||vl.length==1){
        num = (+(vl+'0'+'0'));
      } else if(vl.length==3){
        num = vl.slice(0,2) + '0' + vl.slice(2);
      }
      else {
        num = (+vl);
      }    
      let intPart = parseInt( num/100 + '');
      let decPart = (num -intPart*100)/60
      to = intPart + decPart;
    }
    let timeOt = to - from;
    let dateConvert = moment(this.formMonthlyOvertime.controls.OvertimeDate.value).format('YYYY-MM-DD');
    this.setTimeOutGetWageOvertime = setTimeout(() => {
      this.salaryService.getWageOvertime(this.userSelected.EmpId, timeOt, dateConvert).subscribe(data => {
        this.wageIT = Math.round(data);
        if (typeof callback == "function") {
          callback(data);
        }
      })
    }, timeOut);
  }
  onResetFormOvertime = () => {
    this.formMonthlyOvertime.reset();
    this.formMonthlyOvertime.patchValue({
      TypeProject: '0'
    })
    this.wageIT = null;
    this.isEditIT = false;
    this.filterProject();
  }

  onSubmitFormOvertime = (isEditIT = false) => {
    this.formMonthlyOvertime.markAllAsTouched();
    if (this.formMonthlyOvertime.invalid) {
      return;
    }
    this.getWageOvertime(0);
    let fromValue = this.formMonthlyOvertime.controls.TimeFrom.value.replace(/:/g, "");
    let toValue = this.formMonthlyOvertime.controls.To.value.replace(/:/g, "");
    let baseData = {
      Otdate: moment(this.formMonthlyOvertime.controls.OvertimeDate.value).format('YYYY-MM-DD'),
      StartTime: fromValue.slice(0, 2) + ':' + (fromValue.slice(2, 4) ? fromValue.slice(2, 4) : '00'),
      EndTime: toValue.slice(0, 2) + ':' + (toValue.slice(2, 4) ? toValue.slice(2, 4) : '00'),
      EmpId: this.userSelected.EmpId,
      UpdatedId: this.userLogin.EmpId,
      CreatedId: this.userLogin.EmpId,
      ProjectId: null,
      ProjectMaintenanceId: null,
      Wage: this.wageIT,
      PaymentDate: moment(this.formMonthlyOvertime.controls.PaymentDate.value).format('YYYY-MM-DD'),
    }
    if (this.formMonthlyOvertime.controls.TypeProject.value == '0') {
      baseData.ProjectId = this.formMonthlyOvertime.controls.ProjectId.value;
    } else {
      baseData.ProjectMaintenanceId = this.formMonthlyOvertime.controls.ProjectId.value;
    }
    let callbackSuccess = () => {
      this.onResetFormOvertime();
      clearTimeout(this.setTimeOutGetWageOvertime);
      this.getallMonthlyOT();
      setTimeout(() => {
        if (isEditIT) {
          alert('Edit success!');
        } else {
          alert('Insert success!');
        }
      }, 0)
    }
    this.getWageOvertime(0, (data) => {
      if (isEditIT) {
        baseData.CreatedId = null;
        baseData.Wage = data;
        this.salaryService.getWageOvertime;
        this.salaryService.updateMonthlyOT(Object.assign({ Id: this.rowITSelected.Id }, baseData)).subscribe(() => {
          callbackSuccess();
        })
      } else {
        baseData.Wage = data;
        this.salaryService.InsertMonthlyOT(baseData).subscribe(() => {
          callbackSuccess();
        });
      }
    })
  }
  onDeleteMonthlyOvertime = () => {
    this.windowConfirm('Are you sure want to delete this overtime?', () => {
      this.salaryService.deleteMonthlyOT(this.rowITSelected.Id).subscribe(() => {
        this.onResetFormOvertime();
        this.getallMonthlyOT();
      })
    })
  }
  windowConfirm = (mes, callbackSuccess, callbackCancer = null) => {
    let cf = confirm(mes);
    if (cf == true) {
      callbackSuccess();
    } else {
      if (typeof callbackCancer == 'function') {
        callbackCancer();
      }
    }
  }
  onEditRowIT = (item) => {
    if(this.isDisable) return;
    this.scrollToTop(0)
    this.rowITSelected = item;
    this.isEditIT = true;
    if (item.isPro == '0') {
      this.listProjectFilter = this.listMainProjectMaintanain
    } else {
      this.listProjectFilter = this.listMainProject
    }
    this.formMonthlyOvertime.patchValue({
      TypeProject: item.isPro == '0' ? '1' : '0',
      ProjectId: item.ProID,
      OvertimeDate: item.Otdate,
      TimeFrom: item.StartTime.slice(0, 5),
      To: item.EndTime.slice(0, 5),
      PaymentDate: item.PaymentDate
    });
    this.wageIT = item.Wage

  }

  getallMonthlyOT = () => {
    this.salaryService.getAllMonthlyOT(this.selectedYear, this.userSelected.EmpId).subscribe(data => {
      this.totalMonthlyIT = 0;
      for (const item of data) {
        this.totalMonthlyIT += item.Wage
      }
      let dataOfEmp = data.filter(x => x.EmpId == this.userSelected.EmpId);
      this.dataSourceMonthlyOvertime = new MatTableDataSource(dataOfEmp);
    })
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
  }
  getUserLoginFromLocal = () => {
    this.userLogin = JSON.parse(localStorage.getItem('authUser'));
  }
  checkValueTime = (event, type) => {
    debugger
    if (type == 0) {
      if (this.formMonthlyOvertime.controls.To.value) {
        let valueInput = (event + "").replace(/:/g, '');
        if(valueInput.length==2){
          valueInput = valueInput + '00';
        }else if(valueInput.length==3){
          valueInput = valueInput.slice(0,2) + '0' + valueInput.slice(2);
        }
        let valueNext = this.formMonthlyOvertime.controls.To.value.replace(/:/g, '');
        if(valueNext.length==2){
          valueNext = valueNext + '00'
        } else if(valueNext.length==3){
          valueNext = valueNext.slice(0,2) + '0' + valueNext.slice(2);
        }
        if ((+valueInput) > (+valueNext)) {
          this.formMonthlyOvertime.controls.TimeFrom.setErrors({
            valueNotValid: true
          });
          if(this.formMonthlyOvertime.controls.To.value){
            this.formMonthlyOvertime.controls.To.setErrors(null)
          }
        }
      }
    }

    if (type == 1) {
      if (this.formMonthlyOvertime.controls.TimeFrom.value) {
        let valueInput = (event + "").replace(/:/g, '');
        if(valueInput.length==2){
          valueInput = valueInput + '00'
        }else if(valueInput.length==3){
          valueInput = valueInput.slice(0,2) + '0' + valueInput.slice(2);
        }
        let valuePrev = this.formMonthlyOvertime.controls.TimeFrom.value.replace(/:/g, '');
        if(valuePrev.length==2){
          valuePrev = valuePrev + '00'
        }else if(valuePrev.length==3){
          valuePrev = valuePrev.slice(0,2) + '0' + valuePrev.slice(2);
        }
        if ((+valueInput) < (+valuePrev)) {
          this.formMonthlyOvertime.controls.To.setErrors({
            valueNotValid: true
          });
          this.formMonthlyOvertime.controls.TimeFrom.setErrors(null);
          if (this.formMonthlyOvertime.controls.TimeFrom.value) {
            this.formMonthlyOvertime.controls.TimeFrom.setErrors(null);
          }
        }
      }
    }

  }
}