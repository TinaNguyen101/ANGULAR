import { Component, OnInit, ViewChild, AfterViewInit, Inject, ElementRef, Renderer2 } from '@angular/core';
import { EmployeeService } from '../_services/employee.service';
import { Employee } from '../_models/employee';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator, MatSort, MatTableDataSource, MatDrawer } from '@angular/material';
import { merge } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MatTableRequest } from 'src/app/_models/MatTableRequest';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { JsonPipe } from '@angular/common';
import { JsonpInterceptor } from '@angular/common/http';
import { Commons } from 'src/app/_shared/common_function';
import { compareDateValidator } from 'src/app/_shared/common-validations';
import * as _moment from 'moment';
import { DataSource } from '@angular/cdk/table';
const moment = _moment;
import { ActivatedRoute } from "@angular/router";

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
export class Gender {
  Id: number;
  GenderName: string;
}
@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },

    { provide: MAT_DATE_FORMATS, useValue: FORMATS_DATE },
  ],
})

export class EmployeeListComponent implements OnInit {

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild("parentTable", { static: true }) parentTable: ElementRef;
  @ViewChild('drawer', { static: true }) drawer: MatDrawer;

  about: string;
  direction: string;
  dtFormSearch: FormGroup;
  id: number;
  searchedValue: any;
  date = moment();
  startDate = moment(null);
  endDate = moment(null);
  isSearch: boolean;
  lstEmplomentStatus: [];
  lstDepartment: [];
  lstGender = [];
  matTableProjectsRequest = new MatTableRequest("PositionName", "asc", 1, 10, {});
  dataSource: MatTableDataSource<Employee>;
  displayedColumns = ['Action', 'EmpName', 'EmpGender', 'EmpAddress', 'EmpStatusId', 'DeptId', 'EmpStartDate'];

  constructor(
    private formBuilder: FormBuilder,
    private employService: EmployeeService
  ) { }

  ngOnInit() {

    // create Form Search
    this.dtFormSearch = this.formBuilder.group({

      EmpStartDate: new FormControl('', {
        validators: [compareDateValidator('EmpStartDate', 'EmpEndDate')
        ]
      }),
      EmpEndDate: new FormControl('', {
        validators: [compareDateValidator('EmpEndDate', 'EmpEndDate')
        ]
      }),
      EmpName: new FormControl(''),
      EmpGender: new FormControl(''),
      EmpAddress: new FormControl(''),
      EmpStatusId: new FormControl(''),
      DeptId: new FormControl(''),
    });

    //Create data Gender
    this.Create_data_Gender();

    this.searchedValue = { ...this.dtFormSearch.value };

    // Get data MstEmplomentStatus DropdownList
    this.employService.getMstByName('MstEmplomentStatus').subscribe(data => {
      this.lstEmplomentStatus = data.mst;
    });
    // Get data MstEmplomentStatus DropdownList
    this.employService.getMstByName('MstDepartment').subscribe(data => {
      this.lstDepartment = data.mst;
    });

    this.drawer.openedChange.subscribe((o: boolean) => {
      if (!o) {
        this.dtFormSearch.patchValue(this.searchedValue);
      }
    });
  }

  ngAfterViewInit(): void {

    this.dtFormSearch.patchValue(this.searchedValue);
    this.loadEmployee();
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() =>
          this.loadEmployee()
        )
      )
      .subscribe();
  }

  // Load lst Employee
  loadEmployee() {
  
    this.matTableProjectsRequest = new MatTableRequest(this.sort.active,
      this.sort.direction.toString(),
      this.paginator.pageIndex,
      this.paginator.pageSize,
      {
        ...this.searchedValue,    
        
        EmpStartDate: this.searchedValue.EmpStartDate ? this.searchedValue.EmpStartDate.format('YYYY/MM/DD') : "",
        EmpEndDate: this.searchedValue.EmpEndDate ? this.searchedValue.EmpEndDate.format('YYYY/MM/DD') : ""  
      });
      console.log(this.matTableProjectsRequest);

    this.employService.getAllEmployee(this.matTableProjectsRequest).subscribe(res => {
      this.paginator.length = res.itemscount;
      this.dataSource = new MatTableDataSource(res.items);
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
        EmpEndDate: '',
        EmpStartDate: '',
        EmpName: '',
        EmpGender: '',
        EmpAddress: '',
        EmpStatusId: '',
        DeptId: '',
      }
    );
  }

  // Submit Search
  onSubmitSearch() {

    this.paginator.pageIndex = 0;

    this.searchedValue = { ...this.dtFormSearch.value };

    this.loadEmployee();

    this.drawer.close()
  }

  //Create_data_Gender
  Create_data_Gender() {
    for (let index = 0; index < 2; index++) {
      let gen = new Gender();
      gen.Id = index;
      if (index<1) {
        gen.GenderName = "Male";
      }
      else{
        gen.GenderName = "Female";
      }
      this.lstGender.push(gen);
    }
  }
}
