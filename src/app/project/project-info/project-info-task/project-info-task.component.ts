import { Component, OnInit, ViewChild, AfterViewInit, Inject, ElementRef, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatSort, MatTableDataSource, MatDrawer, MatInput } from '@angular/material';
import { ReplaySubject, Subject, merge } from 'rxjs';
import { tap, takeUntil } from 'rxjs/operators';
import { MatTableRequest } from 'src/app/_models/MatTableRequest';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { compareDateValidator } from 'src/app/_shared/common-validations';
import * as _moment from 'moment';
import { TaskProject } from '../../_models/task';
import { TaskProjectService } from '../../_services/projects-task.service';
import { ProjectMemberService } from '../../_services/projects-member.service';
import { MatSelect } from '@angular/material';
import { ProjectMember } from '../../_models/project-member';
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
  selector: 'app-project-info-task',
  templateUrl: './project-info-task.component.html',
  styleUrls: ['./project-info-task.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },

    { provide: MAT_DATE_FORMATS, useValue: FORMATS_DATE },
  ],
})

export class ProjectInfoTaskComponent implements OnInit {
  public filterMember: ReplaySubject<ProjectMember[]> = new ReplaySubject<ProjectMember[]>(1)
  public custFilterCtrl: FormControl = new FormControl();
  protected _onDestroy = new Subject<void>();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild("parentTable", { static: true }) parentTable: ElementRef;
  @ViewChild('drawer', { static: true }) drawer: MatDrawer;
  @ViewChild('drawercreate', { static: true }) drawercreate: MatDrawer;
  @ViewChild('singleSelect', { static: false }) singleSelect: MatSelect;
  @ViewChild('endDate', { static: false }) EndDate: ElementRef;
  @ViewChild('duration', { static: false }) Duration: ElementRef;
  dataSource: MatTableDataSource<TaskProject>; about: string;
  direction: string;
  startString: string;
  dtFormSearch: FormGroup;
  dtFormCreate: FormGroup;
  projectId: number;
  taskId: number;
  idLogin: number;
  error: string;
  submitted: boolean;
  task = new TaskProject();
  lstEmp: any;
  endValue: string;
  arrMember: ProjectMember[];
  arrMemberNew: ProjectMember[];
  searchedValue: any;
  createValue: any;
  displayedColumns = ['Action', 'EmpName', 'TaskName', 'StartDate', 'EndDate', 'Duration'];
  matTableTasksRequest: MatTableRequest;
  constructor(
    private taskService: TaskProjectService,
    private projectMemberService: ProjectMemberService,
    private formBuilder: FormBuilder,
    private route: Router,
    public dialog: MatDialog,
  ) { }
  ngOnInit() {
    this.projectId = parseInt(localStorage.getItem("projectId"));
    const userLogin = JSON.parse(localStorage.getItem("authUser"));
    this.idLogin = userLogin.EmpId;
    this.projectMemberService.getAllMember(this.projectId).subscribe(data => {
      this.arrMember = data;
      for (let index = 0; index <= this.arrMember.length - 1; index++) {
        for (let index1 = index + 1; index1 <= this.arrMember.length - 1; index1++) {
          if (this.arrMember[index1].EmpId == this.arrMember[index].EmpId) {
            this.arrMember.splice(index1, 1);
          }
        }
      }
      var t = this.arrMember;
      this.filterMember.next(t);
    });

    this.custFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterMemberList();
      });
    //create
    this.dtFormCreate = this.formBuilder.group({
      EmpName: new FormControl(''),
      TaskName: new FormControl(''
        , {
          validators: [Validators.required], updateOn: 'blur'
        }
      ),
      StartDate: new FormControl('', {
        validators: [compareDateValidator('StartDate', 'EndDate')
        ]
      }),
      EndDate: new FormControl('', {
        validators: [compareDateValidator('StartDate', 'EndDate')
        ]
      }),
      Duration: new FormControl('', {
        validators: [Validators.pattern("^[0-9]+(.[0-9]{0,1})?$"),],
      })
    })
    //this.dtFormCreate.get('EndDate').disable();

    //search
    this.dtFormSearch = this.formBuilder.group({
      TaskName: new FormControl(''),
      StartDate: new FormControl(''),
      EndDate: new FormControl('')
    });
    this.searchedValue = { ...this.dtFormSearch.value };
    this.createValue = { ...this.dtFormCreate.value };
    this.drawer.openedChange.subscribe((o: boolean) => {
      if (!o) {
        this.dtFormSearch.patchValue(this.searchedValue);
      }
    });
    this.drawercreate.openedChange.subscribe((o: boolean) => {
      if (!o) {
        this.dtFormCreate.patchValue(this.createValue);
        this.dtFormCreate.controls.TaskName.setValidators(null);
        this.dtFormCreate.controls.TaskName.updateValueAndValidity();
        this.resetFormCreateEdit();
        this.taskId = null;
      }


    });
  }
  ngAfterViewInit(): void {
    this.dtFormSearch.patchValue(this.searchedValue);

    this.loadTaskList();
    // reset the paginator after sorting
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() =>
          this.loadTaskList()
        )
      )
      .subscribe();

  }
  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }
  goToTop() {
    // this.renderer.setStyle(this.parentTable.nativeElement, 'scrollTop', 0);
    this.parentTable.nativeElement.scrollTo(0, 0)
  }
  validDecimal(event, duration) {
    return (/^[0-9]*\.?[0-9]*$/).test(duration.value+event.key);
  }
  convertStyleObject(style: string) {
    return JSON.parse(style);

  }
  checkValidDate(flag: number) {
    if (flag == 0) {
      if (this.dtFormCreate.controls.StartDate.errors) {
        if (this.dtFormCreate.controls.StartDate.errors.compareDate) {
          this.dtFormCreate.controls['StartDate'].setErrors(null);
        }
      }
    }
    if (flag == 1) {
      if (this.dtFormCreate.controls.EndDate.errors) {
        if (this.dtFormCreate.controls.EndDate.errors.compareDate) {
          this.dtFormCreate.controls['EndDate'].setErrors(null);
        }
      }
    }
  }
  loadTaskList() {
    this.projectId = parseInt(localStorage.getItem("projectId"));
    this.matTableTasksRequest = new MatTableRequest(this.sort.active,
      this.sort.direction.toString(),
      this.paginator.pageIndex,
      this.paginator.pageSize,
      {
        ...this.searchedValue,
        TaskName: this.searchedValue.TaskName,
        StartDate: this.searchedValue.StartDate ? this.searchedValue.StartDate.format('YYYY/MM/DD') : "",
        EndDate: this.searchedValue.EndDate ? this.searchedValue.EndDate.format('YYYY/MM/DD') : "",
        ProjectId: this.projectId
      });
    this.taskService.getTaskProject(this.matTableTasksRequest).subscribe(resp => {
      this.paginator.length = resp.itemscount;
      this.dataSource = new MatTableDataSource(resp.items);
    });
  }
  //Search  START ----------------------------------------------------
  onSubmitSearch() {
    // this.isSearch = true;
    this.paginator.pageIndex = 0;
    this.searchedValue = { ...this.dtFormSearch.value };
    this.loadTaskList();
    this.drawer.close()
  }
  refershSearchForm() {
    this.dtFormSearch.patchValue(
      {
        TaskName: '',
        StartDate: '',
        EndDate: '',
        Duration: ''
      }
    );
  }
  //Search  END -------------------------------------------------------

  //create-edit  START ----------------------------------------------------
  onblur() {
    this.dtFormCreate.controls.TaskName.setValidators(Validators.required);
    this.dtFormCreate.controls.TaskName.updateValueAndValidity();
  }
  filterMemberList() {
    // get the search keyword
    let search = this.custFilterCtrl.value;
    if (!search) {
      this.filterMember.next(this.arrMember.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the member
    this.filterMember.next(
      this.arrMember.filter(data => data.EmpName.toLowerCase().indexOf(search) > -1)
    );
  }
  LoadEditTask(id) {
    this.taskId = id;
    this.drawercreate.toggle();
    this.taskService.getTaskById(id).subscribe(data => {
      this.dtFormCreate.patchValue({
        Id: data.Id,
        EmpName: data.EmpId,
        TaskName: data.TaskName,
        StartDate: data.StartDate,
        EndDate: data.EndDate,
        Duration: data.Duration,

      });
    })
  }
  loadDataEndDate() {
    var start = this.dtFormCreate.controls.StartDate.value;
    var duration = this.dtFormCreate.controls.Duration.value;
    var id = this.dtFormCreate.controls.EmpName.value;
    if (start != "" && duration != null) {
      if (this.dtFormCreate.controls.Duration.invalid) {
        this.dtFormCreate.controls.EndDate.reset();
        return;
      }
      if (moment.isMoment(start)) {
        start = this.dtFormCreate.controls.StartDate.value.format("YYYY-MM-DD");
      }
      if (id != "") {
        this.taskService.getEndDateById(start, duration, id).subscribe(data => {
          var t = data;
          this.dtFormCreate.controls.EndDate.setValue(t);
          if (this.dtFormCreate.controls.StartDate.errors.compareDate) {
            this.dtFormCreate.controls['StartDate'].setErrors(null);
          }
        });
      }
      else {
        this.taskService.getEndDate(start, duration).subscribe(data => {
          var t = data;
          this.dtFormCreate.controls.EndDate.setValue(t);
          if (this.dtFormCreate.controls.StartDate.errors.compareDate) {
            this.dtFormCreate.controls['StartDate'].setErrors(null);
          }
        });
      }
    }
    else {
      this.dtFormCreate.controls.EndDate.setValue("");
    }
  }
  deleteTask() {
    if (this.taskId != null) {
      var del = confirm('Are you sure want to delete this task ?');
      if (!del) return;
      this.taskService.deleteTask(this.taskId).subscribe(data => {
        this.loadTaskList()
      }),
        error => {
          this.error = error;
        }
      this.drawercreate.close();
    }
  }
  resetFormCreateEdit() {
    // this.dtFormCreate.controls.TaskName.clearValidators(); 
    this.route.navigate(['project/info/' + this.projectId + '/task']);
    this.dtFormCreate.patchValue(
      {
        StartDate: '',
        EndDate: '',
        Duration: ''
      }
    );
  }
  OnSubmitData() {
    this.dtFormCreate.controls.TaskName.setValidators(Validators.required);
    this.dtFormCreate.controls.TaskName.updateValueAndValidity();

    this.projectId = parseInt(localStorage.getItem("projectId"));
    this.submitted = true;
    if (this.dtFormCreate.invalid) {
      return;
    }
    const formValue = this.dtFormCreate.value;
    let task = new TaskProject();
    task.TaskName = formValue.TaskName;
    task.EmpId = formValue.EmpName;
    task.StartDate = formValue.StartDate;
    task.Duration = formValue.Duration;
    task.EndDate = this.dtFormCreate.controls.EndDate.value;
    task.ProjectId = this.projectId;
    if (this.taskId != null) {
      task.Id = this.taskId;
      task.UpdatedId = this.idLogin;
      task.UpdatedDate = new Date();
      this.taskService.updateTask(task).subscribe(data => {
        alert("Update project successful");
        this.route.navigate(['project/info/' + this.projectId + '/task']);
        this.loadTaskList();
      }),
        error => {
          this.error = error;
          console.log(this.error);
        }
    }
    else {
      task.CreatedDate = new Date();
      task.CreatedId = this.idLogin;
      this.taskService.createTask(task).subscribe(
        data => {
          this.route.navigate(['project/info/' + this.projectId + '/task']);
        },
        error => {
          this.error = error;
          console.log(this.error);
        });
    }
    this.loadTaskList();
    this.drawercreate.close();
  }
  //create-edit  END -------------------------------------------------------

}
