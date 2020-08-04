import { Component, OnInit, Directive, ViewChild, ElementRef, Inject, Renderer2, HostListener } from '@angular/core';
import { Subscription, ReplaySubject, Subject } from 'rxjs';
import { EmployeeService } from '../_services/employee.service';
import { MatTableDataSource, MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatRadioButton, MatRadioGroup } from '@angular/material';
import { AnnualLeavePaid } from '../_models/annualleavepaid';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import * as _moment from 'moment';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { saveAs } from 'file-saver';
import { HttpEventType } from '@angular/common/http';
import { takeUntil } from 'rxjs/operators';
import { DataSource } from '@angular/cdk/table';
import { yearRequiredValidator } from 'src/app/report/_validations/reportProject-validations';
import { Overlay } from '@angular/cdk/overlay';
const moment = _moment;


export const MONTH_ONLY_FORMATS = {
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
  selector: 'app-employee-annual-leave-paid',
  templateUrl: './employee-annual-leave-paid.component.html',
  styleUrls: ['./employee-annual-leave-paid.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },

    { provide: MAT_DATE_FORMATS, useValue: MONTH_ONLY_FORMATS },
  ],
})
export class EmployeeAnnualLeavePaidComponent implements OnInit {

  //#region Subscription
  AnnualLeavePaidSubcriptuon: Subscription;
  AllDayOffSubcriptuon: Subscription;
  annualLeavePaidDowloadFileSubcriptuon: Subscription;
  //#endregion

  //#region Cofig Mattable
  dataSource: MatTableDataSource<any>;
  displayedColumns = [
    'No', 'EmpName', 'DayRemainLastYear', 'DayCurrentYear', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'DaysOfLeft'
  ];
  currentYearHeader = moment().year();
  dataSourceChild: MatTableDataSource<any>;
  displayedColumnsForChildTable = ['ActionC', 'DayOffC', 'TimeOffC', 'ApprovedByC', 'ApprovedDateC', 'ReasonC']
  //#endregion

  constructor(
    private employeeService: EmployeeService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private renderer2 : Renderer2,
    private overlay: Overlay) { }
  allDayOffForEmpByYearMonth: any;
  employeeAnnualLeavePaidYear = new FormControl(moment().year(), {
    validators: [
      yearRequiredValidator(new FormControl('y')),
    ]
  });
  empSelected: any;
  allEmp = [];
  isUpdateDayOf = false;
  dayOffSelect: any;
  userLogin: any;
  isShowInputFilterEmpName: boolean = false;
  currentMonthDayOff: any;
  arr_member: any;
  listEmployeeManage = [];
  innerWidth;
  innerHeight;
  //#region Form 
  //Update Day Of Form
  parentDrawer = window.document.getElementById('parentEmpoyee');
  UpdateDayOfForm: FormGroup;
  empNameFilterCtrl = new FormControl('2');

  ngOnInit() {
    console.log(this.parentDrawer);
    
    this.userLogin = this.getUserLogin();
    this.innerWidth = window.innerWidth;
    this.innerHeight = window.innerHeight;
    console.log(this.innerHeight);
    
    this.UpdateDayOfForm = this.formBuilder.group({
      EmpId: new FormControl('', Validators.required),
      EmpName: new FormControl(),
      ApprovedDate: new FormControl(''),
      ApprovedBy: new FormControl(null),
      DayOff: new FormControl('', Validators.required),
      TimeOff: new FormControl('', Validators.required),
      Reason: new FormControl(),
    });
  }

  ngAfterViewInit() {
    this.loadAllAnnualLeavePaid(true);
    this.employeeService.getAllApproved().subscribe(data => {
      this.listEmployeeManage = data;
    });
    this.scrollToBottomParent();
  }

  ngOnDestroy() {
    this.unsubciption(this.AnnualLeavePaidSubcriptuon);
    this.unsubciption(this.AllDayOffSubcriptuon);
  }

  //#endregion

  //process function

  openDialog(emp, month, _formType = 'update'): void {
    if (_formType == 'update') {
      if (this.allowPopupMatCell(month, emp.EmpStartDate, emp.EmpEndDate, emp.year) != 'modal') {
        return;
      }
    }
    const scrollStrategy = this.overlay.scrollStrategies.reposition();
    const dialogRef = this.dialog.open(DialogFormDayOff, {
      panelClass: 'dialogWrap',
      width: _formType == 'update' ? '90vw' : '90vw',
      maxWidth: _formType == 'update' ? '1200px' : '900px',
      scrollStrategy,
      autoFocus: true,
      data: {
        allEmp: this.allEmp,
        empSelected: emp,
        formType: _formType,
        monthSelected: month,
        yearSelected: this.employeeAnnualLeavePaidYear.value
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed' + result);
      this.loadAllAnnualLeavePaid();
    });
  }

  addAnnualLeavePaid = () => {
    this.employeeService.CheckYearAnnualLeavePaid(this.employeeAnnualLeavePaidYear.value).subscribe(result => {
      debugger
      if (result > 0) {
        alert(`Data already exists!`)
      } else if(result == -1){
        alert(`Do not exist employee!`);
        this.allEmp = [];
        this.dataSource = new MatTableDataSource([]);
        return;
      };
      this.employeeService.addAnnualLeavePaid(this.employeeAnnualLeavePaidYear.value, this.userLogin.EmpId).subscribe(data => {
        this.loadAllAnnualLeavePaid();
      }, (err) => {
        alert(err);
      });
    })


  }

  editDayOf = (row) => {
    console.log(row);
    this.UpdateDayOfForm.patchValue({
      TimeOff: row.TimeOff,
      DayOff: row.DayOff1,
      Reason: row.Reason,
      ApprovedDate: row.ApprovedDate,
      ApprovedBy: row.ApprovedBy
    });
    this.dayOffSelect = row;
    this.isUpdateDayOf = true;
  }
  closeModal = () => {
    this.UpdateDayOfForm.reset();
    this.isUpdateDayOf = false;

  }


  scrollToBottomParent = (timeout = 0) => {
    setTimeout(() => {
      if(this.allEmp.length>0 && this.innerHeight< 500){
        this.parentDrawer.scrollTo(0,10e5);
      }      
    }, timeout);
  }
  loadAllAnnualLeavePaid = (isFirstLoad = false) => {
    this.employeeService.CheckYearAnnualLeavePaid(this.employeeAnnualLeavePaidYear.value).subscribe(result => {
      if (result > 0) {
        this.employeeService.getAllAnnualLeavePaid(this.employeeAnnualLeavePaidYear.value).subscribe(data => {
          this.allEmp = []
          this.allEmp = data.sort((item1, item2) => item1.No - item2.No);
          this.setCurrentYearHeader();
          
          this.dataSource = new MatTableDataSource([]);
          setTimeout(() => {
            this.dataSource = new MatTableDataSource(this.allEmp);
            this.scrollToBottomParent();
          });
        });
      } else if (!isFirstLoad) {
        let conf = confirm(`Data for this year does not exist. Do you want to create data?`);
        if (conf == true) {
          this.addAnnualLeavePaid();
        } else {
          this.allEmp = []
          this.dataSource = new MatTableDataSource([]);
        }
      } else {
        this.allEmp = []
        this.dataSource = new MatTableDataSource([]);
      }
    })
  }
  getAllDayOff = (year, month, empId) => {
    this.currentMonthDayOff = month;
    this.allDayOffForEmpByYearMonth = [];//reset
    this.AllDayOffSubcriptuon = this.employeeService.getAllDayOff(year + month).subscribe(data => {
      this.empSelected = this.allEmp.find(x => x.EmpId == empId);
      this.allDayOffForEmpByYearMonth = data.filter(x => x.EmpId == empId);
      this.dataSourceChild = new MatTableDataSource(this.allDayOffForEmpByYearMonth);
      console.log(this.empSelected);
      console.log(this.allDayOffForEmpByYearMonth);
    })
  }
  annualLeavePaidDowloadFile = () => {
    this.annualLeavePaidDowloadFileSubcriptuon = this.employeeService.downloadFileAnnualLeavePaid(this.employeeAnnualLeavePaidYear.value).subscribe(data => {
      switch (data.type) {
        case HttpEventType.Response:
          const downloadedFile = new Blob([data.body], { type: data.body.type });
          saveAs(downloadedFile, "AnnualLeavePaid_" + this.employeeAnnualLeavePaidYear.value)
          break;
      }
    })
  }
  //#endregion

  //#region Common functuon
  //unsubcription
  unsubciption = (subscribe: Subscription) => {
    subscribe && subscribe.unsubscribe()
  }

  //Set year current for table header
  setCurrentYearHeader = () => {
    parseInt(this.employeeAnnualLeavePaidYear.value) && (this.currentYearHeader = this.employeeAnnualLeavePaidYear.value)
  }
  //render class mat cell
  renderClassMatCell = (month, startDate, endDate, year) => {
    let convertDateStart = new Date(startDate);
    let convertDateEnd = new Date(endDate);
    let convertDateColl = new Date(year, month - 1, 1);
    let yearCurrent = moment().year();
    // not join
    if (!startDate) {
      return "emp_status-out";
    }
    // joined
    if (convertDateColl > convertDateStart) {
      //doing
      if (!endDate) {
        //doing 
        if (year < yearCurrent) {
          return "emp_status-in"
        } else {
          return "emp_status-in curentYear"
        }

      }
      //leave
      else {
        // leave
        if (convertDateColl < convertDateEnd) {
          // in month

          if(year<convertDateEnd.getFullYear()){
            return "emp_status-in"
          }

          if (month - 1 < convertDateEnd.getMonth()) {
            if (year <= yearCurrent) {
              return "emp_status-in"
            } else {
              return "emp_status-in curentYear"
            }
          } else {
            if (year < yearCurrent) {
              return "emp_status-out_InMonth"
            } else {
              return "emp_status-out_InMonth curentYear"
            }
          }

        }
        //true leave 
        else {
          return "emp_status-out";
        }
      }
    } else {
      if (year < convertDateStart.getFullYear()) {
        return "emp_status-out"
      }
      if (month - 1 < convertDateStart.getMonth()) {
        return "emp_status-out"
      } else {
        if (year < yearCurrent) {
          return "emp_status-out_InMonth"
        } else {
          return "emp_status-out_InMonth curentYear"
        }
      }
    }
  }
  //Allow popup mat cell
  allowPopupMatCell = (month, startDate, endDate, year) => {
    let classRender = this.renderClassMatCell(month, startDate, endDate, year);
    if (classRender == "emp_status-out") {
      return null
    } else {
      if (year < moment().year()) {
        return null
      }
      return "modal"
    }
  }

  //get user loging from local storage
  getUserLogin = () => {
    return JSON.parse(localStorage.getItem('authUser'));
  }
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
    this.innerHeight = window.innerHeight;
  }

  //#endregion


}


//Dialog-------------------------

@Component({
  selector: 'dialog-form-day-off',
  templateUrl: 'dialog-form-day-off.html',
  styleUrls: ['./employee-annual-leave-paid.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },

    { provide: MAT_DATE_FORMATS, useValue: MONTH_ONLY_FORMATS },
  ],
})
export class DialogFormDayOff {

  constructor(
    private employeeService: EmployeeService,
    public dialogRef: MatDialogRef<DialogFormDayOff>,
    private formBuilder: FormBuilder,
    private renderer2: Renderer2,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
  selectDayForTextDate = new Date(this.data.yearSelected, this.data.monthSelected - 1, 1);
  empManFilterCtrl = new FormControl();
  empFilterCtrl = new FormControl();
  DayOfForm: FormGroup;
  allEmp: any;
  allEmpFilter: any;
  listEmployeeManage: any;
  listEmployeeManageFilter: any;
  empSelected: any;
  dayOffSelect: any;
  userLogin: any;
  formType: any;
  isUpdateForm = false;
  allDayOffForEmpByYearMonth: any;
  dataSourceChild: MatTableDataSource<any>;
  innerWidth;
  displayedColumnsForChildTable = ['ActionC', 'DayOffC', 'TimeOffC', 'ApprovedByC', 'ApprovedDateC', 'ReasonC'];
  @ViewChild('wrapDiaglog', { static: false }) wrapDiaglog: ElementRef;
  ngOnInit() {
    this.allEmp = this.data.allEmp;
    this.innerWidth = window.innerWidth;
    this.allEmpFilter = this.addFirstRowEmptyInListFillter(this.allEmp);
    this.empSelected = this.data.empSelected;
    this.formType = this.data.formType;
    this.userLogin = this.getUserLogin();
    this.DayOfForm = this.formBuilder.group({
      EmpId: new FormControl('', Validators.required),
      EmpName: new FormControl(),
      ApprovedDate: new FormControl(''),
      ApprovedBy: new FormControl(null),
      DayOff: new FormControl('', Validators.required),
      TimeOff: new FormControl(4, Validators.required),
      Reason: new FormControl(),
    });

  }
  ngAfterViewInit() {

    console.log(this.allEmpFilter)
    this.employeeService.getAllApproved().subscribe(data => {
      console.log(data)
      let dataSort = this.sortByEmpName(data);
      this.listEmployeeManage = dataSort;
      this.listEmployeeManageFilter = this.addFirstRowEmptyInListFillter(dataSort);
    });
    if (this.formType == 'update') {
      this.getAllDayOff(this.data.yearSelected, this.data.monthSelected, this.empSelected);

    }
  }

  sortByEmpName = (data) => {
    console.log("start sort");

    console.log(data)
    data.sort((emp1, emp2) => {
      let nameA = this.convertVNToEng(emp1.EmpName);
      let nameB = this.convertVNToEng(emp2.EmpName);
      if (nameA < nameB) { return -1; }
      if (nameA > nameB) { return 1; }
      return 0;
    });
    console.log(data);
    return data;
  }

  filterEmp(type) {
    switch (type) {
      case 'man': {
        if (this.empManFilterCtrl.value) {
          this.listEmployeeManageFilter = this.listEmployeeManage.filter(x => {
            return x.EmpName.toLowerCase().includes(this.empManFilterCtrl.value.toLowerCase())
          })
        } else {
          this.listEmployeeManageFilter = this.addFirstRowEmptyInListFillter(this.listEmployeeManage);
        }
      }
      case 'emp': {
        if (this.empFilterCtrl.value) {
          this.allEmpFilter = this.allEmp.filter(x => {
            return x.EmpName.toLowerCase().includes(this.empFilterCtrl.value.toLowerCase())
          })
        } else {
          this.allEmpFilter = this.addFirstRowEmptyInListFillter(this.allEmp)
        }
      }
    }

  }

  clearInput = (type) => {

    switch (type) {
      case 'man': {
        if (this.listEmployeeManageFilter.length == 0) {
          this.DayOfForm.controls.ApprovedBy.setValue(null);
          this.listEmployeeManageFilter = this.addFirstRowEmptyInListFillter([]);
        }
      }
      case 'emp': {
        if (this.allEmpFilter.length == 0) {
          this.DayOfForm.controls.EmpId.setValue(null);
          this.allEmpFilter = this.addFirstRowEmptyInListFillter([]);
        }
      }
    }


  }
  addFirstRowEmptyInListFillter = (arraySource) => {
    return [{ CustName: null }].concat(arraySource)
  }
  getAllDayOff = (year, month, emp) => {
    this.allDayOffForEmpByYearMonth = [];//reset
    this.employeeService.getAllDayOff(this.convertYearMonthForRequest(year, month)).subscribe(data => {
      this.allDayOffForEmpByYearMonth = data.filter(x => x.EmpId == emp.EmpId);
      this.dataSourceChild = new MatTableDataSource(this.allDayOffForEmpByYearMonth);
      console.log(data);
    })
  }


  submitFormUpdate = (type, form = 'updateForm') => {
    // debugger;
    this.DayOfForm.markAllAsTouched()
    this.DayOfForm.controls['EmpId'].markAsDirty();
    if (form == "updateForm") {
      this.DayOfForm.controls['EmpId'].patchValue({
        EmpId: this.DayOfForm.controls.EmpId.value
      })
    }
    if (this.DayOfForm.invalid) {
      return;
    }
    let dayOfSendBase = {

      UpdatedId: this.userLogin.EmpId,
      ApprovedBy: this.DayOfForm.controls.ApprovedBy.value,
      UpdatedDate: moment(Date.now()).format('YYYY-MM-DD'),
      DayOff1: moment(this.DayOfForm.controls.DayOff.value).format('YYYY-MM-DD'),
      Reason: this.DayOfForm.controls.Reason.value,
      TimeOff: this.DayOfForm.controls.TimeOff.value,
      ApprovedDate: this.DayOfForm.controls.ApprovedDate.value ? moment(this.DayOfForm.controls.ApprovedDate.value).format('YYYY-MM-DD') : null,
      EmpId: this.empSelected ? this.empSelected.EmpId : null,
      CreatedId: null,
    }
    if (form == 'add') {
      dayOfSendBase.CreatedId = this.userLogin.EmpId,
        dayOfSendBase.EmpId = this.DayOfForm.controls.EmpId.value;
    }
    switch (type) {
      case 'create': {
        dayOfSendBase.CreatedId = this.userLogin.EmpId;
        this.employeeService.checkExistDayOff(dayOfSendBase.DayOff1, dayOfSendBase.TimeOff, dayOfSendBase.EmpId, '').subscribe(data => {
          // debugger;
          if (data) {
            this.createDayOf(dayOfSendBase);
          } else {
            alert("Day off is exist!")
          }
        })
        break;
      }
      case 'update': {
        if (moment(this.dayOffSelect.DayOff1).format('YYYY-MM-DD') != dayOfSendBase.DayOff1 || this.dayOffSelect.TimeOff != dayOfSendBase.TimeOff) {
          this.employeeService.checkExistDayOff(dayOfSendBase.DayOff1, dayOfSendBase.TimeOff, dayOfSendBase.EmpId, this.dayOffSelect.Id).subscribe(data => {
            // debugger;

            if (data) {
              this.updateDayOf(Object.assign({ Id: this.dayOffSelect.Id }, dayOfSendBase));
            } else {
              alert("Day off is exist!")
            }
          })
        } else {
          this.updateDayOf(Object.assign({ Id: this.dayOffSelect.Id }, dayOfSendBase));
        }


        break;
      }
    }
  }
  updateDayOf = (dayOff) => {
    console.log(JSON.stringify(dayOff))
    this.employeeService.updateDayOf(dayOff).subscribe(data => {
      // this.DayOfForm.markAsTouched();
      this.resetForm();
      this.getAllDayOff(this.data.yearSelected, this.data.monthSelected, this.empSelected);
      alert("Update day off Success");
    })

  }
  createDayOf = (dayOff) => {
    // debugger;
    console.log(JSON.stringify(dayOff));
    this.employeeService.addDayOf(dayOff).subscribe(data => {
      this.resetForm();
      this.getAllDayOff(this.data.yearSelected, this.data.monthSelected, this.empSelected);
      alert("Add day off Success");
    })
  }
  resetForm = () => {
    this.DayOfForm.controls['EmpId'].reset()
    this.DayOfForm.controls['EmpName'].reset()
    this.DayOfForm.controls['ApprovedDate'].reset()
    this.DayOfForm.controls['ApprovedBy'].reset()
    this.DayOfForm.controls['DayOff'].reset()
    this.DayOfForm.controls['Reason'].reset()
    this.DayOfForm.patchValue({
      TimeOff: "4"
    })

    this.isUpdateForm = false;

  }
  editDayOf = (row) => {
    console.log(row);
    this.wrapDiaglog.nativeElement.scrollTo(0, 0)
    this.isUpdateForm = true;
    // debugger;
    this.dayOffSelect = row;
    // this.selectDayForTextDate = moment(row.ApprovedDate);
    this.DayOfForm.patchValue({
      DayOff: row.DayOff1,
      Reason: row.Reason,
      ApprovedDate: row.ApprovedDate,
      ApprovedBy: row.ApprovedBy,
      EmpId: row.EmpId,
      TimeOff: row.TimeOff + "",
    });
  }


  deleteDayOff = () => {

    let conf = confirm(`Are you sure want to delete this day off?`);
    if (conf == true) {
      this.employeeService.deleteDayOf(this.dayOffSelect.Id).subscribe(data => {
        alert("Delete success!");
        this.getAllDayOff(this.data.yearSelected, this.data.monthSelected, this.empSelected);
        this.resetForm();
      })
    }

  }
  getUserLogin = () => {
    return JSON.parse(localStorage.getItem('authUser'));
  }
  convertYearMonthForRequest = (year, month) => {
    let _month = month < 10 ? "0" + month : month;
    console.log(year + "" + _month)
    return year + "" + _month;
  }

  convertVNToEng(alias) {
    var str = alias;
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
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
  }
}