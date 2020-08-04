import { Component, OnInit, ViewChild, AfterViewInit, Inject, ElementRef, Renderer2, HostListener } from '@angular/core';
import { SalaryService } from '../_services/salary.service';
import { Salary } from '../_models/salary';
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
import { compareDateValidator, compareDateInDBValidator } from 'src/app/_shared/common-validations';
import * as _moment from 'moment';
import { DataSource } from '@angular/cdk/table';
import { ActivatedRoute } from '@angular/router';
import { ConvertActionBindingResult } from '@angular/compiler/src/compiler_util/expression_converter';
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

@Component({
  selector: 'app-accounting-salary',
  templateUrl: './accounting-salary.component.html',
  styleUrls: ['./accounting-salary.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },

    { provide: MAT_DATE_FORMATS, useValue: FORMATS_DATE },
  ],
})
export class AccountingSalaryComponent implements OnInit {

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild("parentTable", { static: true }) parentTable: ElementRef;
  @ViewChild('drawer', { static: true }) drawer: MatDrawer;
  @ViewChild('drawercreate', { static: true }) drawercreate: MatDrawer;

  public filterMember: ReplaySubject<Salary[]> = new ReplaySubject<Salary[]>(1)
  public custFilterCtrl: FormControl = new FormControl();
  protected _onDestroy = new Subject<void>();

  flagEdit = true;
  about: string;
  direction: string;
  idEdit: number;
  idLogin: number;

  sar: Salary;
  dtFormSearch: FormGroup;
  searchedValue: any;
  dtFormCreate: FormGroup;
  createValue: any;
  lstSalary: any;

  date = moment();
  startDate = moment('');
  endDate = moment('');
  isSearch: boolean;
  msgErr: string = "";

  dataSource: MatTableDataSource<Salary>;
  matTableSalaryRequest = new MatTableRequest("EmpName", "asc", 0, 10, {});
  matTableEmployeeRequest = new MatTableRequest("EmpName", "asc", 0, 1000000, {});
  displayedColumns = ['Action', 'EmpName', 'Salary', 'ApprovalDate'];
  arr_member: any;
  EmpID;

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private salaryService: SalaryService,
  ) { }

  ngOnInit() {

    const userLogin = JSON.parse(localStorage.getItem("authUser"));
    this.idLogin = userLogin.EmpId;

    this.salaryService.getAllEmployee(this.matTableEmployeeRequest).subscribe(res => {
      this.arr_member = res.items;
      for (let index = 0; index <= this.arr_member.length - 1; index++) {
        if (this.arr_member[index].EmpStatusId == 4) {
          this.arr_member.splice(index, 1);
        }
        for (let index1 = index + 1; index1 <= this.arr_member.length - 1; index1++) {
          if (this.arr_member[index1].Id == this.arr_member[index].Id) {
            this.arr_member.splice(index1, 1);
          }
        }
      }
      var t = this.arr_member;
      this.filterMember.next(t);
    });
    this.custFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filter();
      });
    this.dtFormCreate = this.formBuilder.group({
      EmpName: new FormControl('', Validators.required),
      EmpSalary: new FormControl('', Validators.required),
      ApprovalDate: new FormControl('', Validators.required),
    })

    this.dtFormSearch = this.formBuilder.group({

      ApprovalDateStart: new FormControl(''),
      ApprovalDateEnd: new FormControl(''),
      EmpName: new FormControl(''),
      SalaryFrom: new FormControl(''),
      SalaryTo: new FormControl(''),

    });
    this.searchedValue = { ...this.dtFormSearch.value };

    this.drawer.openedChange.subscribe((o: boolean) => {
      if (!o) {
        this.dtFormSearch.patchValue(this.searchedValue);
      }
    });
    this.drawercreate.openedChange.subscribe((o: boolean) => {
      if (!o) {
        //this.dtFormCreate.patchValue(this.createValue);
        this.resetFormCreate();
      }
    });
  }
  ngAfterViewInit(): void {

    this.dtFormSearch.patchValue(this.searchedValue);
    this.loadSalary();
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() =>
          this.loadSalary()
        )
      )
      .subscribe();
  }

  filter() {
    // get the search keyword
    let search = this.custFilterCtrl.value;
    if (!search) {
      this.filterMember.next(this.arr_member.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the member
    this.filterMember.next(
      this.arr_member.filter(data => data.EmpName.toLowerCase().indexOf(search) > -1)
    );
  }

  // Load lst Salary
  loadSalary() {

    this.matTableSalaryRequest = new MatTableRequest(this.sort.active,
      this.sort.direction.toString(),
      this.paginator.pageIndex,
      this.paginator.pageSize,
      {
        ...this.searchedValue,
        StartDate: this.searchedValue.StartDate ? this.searchedValue.StartDate.format('YYYY/MM/DD') : "",
        EndDate: this.searchedValue.EndDate ? this.searchedValue.EndDate.format('YYYY/MM/DD') : ""
      });

    this.salaryService.getAllSalary(this.matTableSalaryRequest).subscribe(res => {
      this.paginator.length = res.itemscount;
      this.dataSource = new MatTableDataSource(res.items);
      this.lstSalary = res.items;
    })

  }

  // Click paging Scroll to Top
  goToTop() {
    this.parentTable.nativeElement.scrollTo(0, 0)
  }

  convertStyleObject(style: string) {
    return JSON.parse(style);
  }

  //Refresh form search
  refersh() {
    this.dtFormSearch.patchValue(
      {
        StartDate: this.startDate.clone(),
        EndDate: this.endDate.clone(),
        EmpName: '',
        SalaryFrom: '',
        SalaryTo: '',
        ApprovalDateStart: '',
        ApprovalDateEnd: '',
      }
    );
  }
  // Reset FormCreate
  resetFormCreate() {
    this.dtFormCreate.reset();
  }
  // Submit Search
  onSubmitSearch() {

    if (this.dtFormSearch.invalid) {
      this.dtFormSearch.markAsDirty();
      return;
    }
    this.paginator.pageIndex = 0;

    this.searchedValue = { ...this.dtFormSearch.value };

    this.loadSalary();

    this.drawer.close()
  }
  //
  openDrawerCreate() {
    if (!this.flagEdit) {
      this.flagEdit = true;
    }
    this.resetFormCreate();
    if (this.drawercreate.open()) {
      this.drawercreate.close()
    } else {
      this.drawercreate.open()
    }
  }
  //Submit data Create
  OnSubmitData() {

    if (this.dtFormCreate.invalid) {
      this.flagEdit = true;
      this.dtFormCreate.markAllAsTouched();
      return;
    }
    let pSalary = new Salary();
    this.EmpID = this.dtFormCreate.controls.EmpName.value;
    pSalary.Salary = this.dtFormCreate.controls.EmpSalary.value;
    pSalary.EmpId = this.dtFormCreate.controls.EmpName.value;
    pSalary.ApprovalDate = this.dtFormCreate.controls.ApprovalDate.value.format('YYYY-MM-DD');

    this.salaryService.checkApprovalDate(pSalary.ApprovalDate, pSalary.EmpId).subscribe(res => {
      if (!res) {
        alert("Approval Date is less than choosen date !");
        return;
      }
      else {
        if (this.flagEdit == false) {
          pSalary.Id = this.idEdit;
          pSalary.UpdatedId = this.idLogin;
          pSalary.CreatedId = this.idLogin;
          //console.log(JSON.stringify(pSalary));
          this.salaryService.updateSalary(pSalary).subscribe(res => {
            console.log("update success!");
            this.loadSalary();
          });
        } else {
            pSalary.CreatedId = this.idLogin;
            this.salaryService.insertSalary(pSalary).subscribe(res => {
              console.log(" insert success!");
              this.loadSalary();
            });
        }
        this.resetFormCreate();
        this.drawercreate.close();
        this.flagEdit = true;
      }
    });
  }

  //Edit Salary
  onEdit(row) {
    this.flagEdit = false;
    this.dtFormCreate.patchValue(
      {
        EmpName: row.EmpId,
        EmpSalary: row.Salary,
        ApprovalDate: moment(row.ApprovalDate),
      }
    );
    this.idEdit = row.Id;
    this.drawercreate.open();
  }

  onClickAdd() {
    this.flagEdit = true;
    this.drawercreate.open()
    this.resetFormCreate();
  }

  //Delete Salary
  DeleteSalary() {
    this.salaryService.deleteSalary(this.idEdit).subscribe(res => {
      console.log("delete success!");
      this.loadSalary();
    });
    this.drawercreate.close();
  }

}
