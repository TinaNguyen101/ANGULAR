import { Component, OnInit, ViewChild, AfterViewInit, Inject, ElementRef, Renderer2 } from '@angular/core';
import { ProjectService } from '../_services/projects.service';
import { Project } from '../_models/project';
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
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },

    { provide: MAT_DATE_FORMATS, useValue: FORMATS_DATE },
  ],

})
export class ProjectListComponent implements AfterViewInit, OnInit {

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild("parentTable", { static: true }) parentTable: ElementRef;
  @ViewChild('drawer', { static: true }) drawer: MatDrawer;

  dataSource: MatTableDataSource<Project>;
  about: string;
  direction: string;
  dtFormSearch: FormGroup;
  id: number;
  projects = new Project();
  lstStatus = [];
  searchedValue: any;
  // date = moment();
  startDate = moment(moment().year() + '-01-01');
  endDate = moment();
  // isSearch: boolean;
  displayedColumns = ['Action', 'ProjectName', 'CustName', 'StartDate',
    'EstimateCost', 'PaymentDate', 'ProjectStatusName'];
  matTableProjectsRequest: MatTableRequest;
  constructor(
    private projectService: ProjectService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    // private commons: Commons,
    // private renderer: Renderer2

  ) { }

  ngOnInit() {
    this.dtFormSearch = this.formBuilder.group({
      ProjectName: new FormControl(''),
      StartDate: new FormControl(this.startDate.clone(), {
        validators: [compareDateValidator('StartDate', 'StartDate')
        ]
      }),
      EndDate: new FormControl(this.endDate.clone(), {
        validators: [compareDateValidator('EndDate', 'EndDate')
        ]
      }),
      CustName: new FormControl(''),
      ProjectStatusName: new FormControl(''),
    });
    this.searchedValue = { ...this.dtFormSearch.value };

    this.projectService.getMstByName('MstProjectStatus').subscribe(data => {
      this.lstStatus = data.mst;
    });

    this.drawer.openedChange.subscribe((o: boolean) => {
      if (!o) {
        this.dtFormSearch.patchValue(this.searchedValue);
      }
    });

  }

  ngAfterViewInit(): void {
    this.dtFormSearch.patchValue(this.searchedValue);
    this.loadProject();
    // reset the paginator after sorting
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() =>
          this.loadProject()
        )
      )
      .subscribe();
  }

  goToTop() {
    this.parentTable.nativeElement.scrollTo(0, 0)
  }

  getIdProject(event) {
    this.id = event.id;
    this.projectService.getProjectInfo(this.id).subscribe(r => {
      this.projects = r;
    });
  }

  refersh() {
    this.dtFormSearch.patchValue(
      {
        ProjectName: '',
        StartDate: this.startDate.clone(),
        EndDate: this.endDate.clone(),
        CustName: '',
        ProjectStatusName: '',
      }
    );
  }
  onSubmitSearch() {
    // this.isSearch = true;
    this.paginator.pageIndex = 0;
    this.searchedValue = { ...this.dtFormSearch.value };
    this.loadProject();
    this.drawer.close()
  }

  loadProject() {

    this.matTableProjectsRequest = new MatTableRequest(this.sort.active,
      this.sort.direction.toString(),
      this.paginator.pageIndex,
      this.paginator.pageSize,
      {
        ...this.searchedValue,
        StartDate: this.searchedValue.StartDate ? this.searchedValue.StartDate.format('YYYY/MM/DD') : "",
        EndDate: this.searchedValue.EndDate ? this.searchedValue.EndDate.format('YYYY/MM/DD') : ""
      });
    this.projectService.getProjects(this.matTableProjectsRequest).subscribe(resp => {
      this.paginator.length = resp.itemscount;
      console.log(resp);
      this.dataSource = new MatTableDataSource(resp.items);
    });
  }
  convertStyleObject(style: string) {
    return JSON.parse(style);
  }
}

