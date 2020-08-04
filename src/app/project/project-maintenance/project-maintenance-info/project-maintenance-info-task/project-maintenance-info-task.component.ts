import { Component, OnInit, ViewChild, AfterViewInit, Inject, ElementRef, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator, MatSort, MatTableDataSource, MatDrawer, MatInput } from '@angular/material';
import { ReplaySubject, Subject,merge } from 'rxjs';
import { tap ,takeUntil} from 'rxjs/operators';
import { MatTableRequest } from 'src/app/_models/MatTableRequest';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { Commons } from 'src/app/_shared/common_function';
import { compareDateValidator } from 'src/app/_shared/common-validations';
import * as _moment from 'moment';
import { TaskProject } from '../../../_models/task';
import { TaskProjectService } from '../../../_services/projects-task.service';
import { ProjectMaintenanceMemberService } from '../../../_services/project-maintenance-member.service';
import { SharedService } from '../../../_share/shared-service';
import { MatSelect } from '@angular/material';
import { ProjectMaintenanceMember } from '../../../_models/project-maintenance-member';
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
  selector: 'app-project-maintenance-info-task',
  templateUrl: './project-maintenance-info-task.component.html',
  styleUrls: ['./project-maintenance-info-task.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },

    { provide: MAT_DATE_FORMATS, useValue: FORMATS_DATE },
  ]
})
export class ProjectMaintenanceInfoTaskComponent implements OnInit {
  public filterMember: ReplaySubject<ProjectMaintenanceMember[]> = new ReplaySubject<ProjectMaintenanceMember[]>(1)
  public custFilterCtrl: FormControl = new FormControl();
  protected _onDestroy = new Subject<void>();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild("parentTable", { static: true }) parentTable: ElementRef;
  @ViewChild('drawer', { static: true }) drawer: MatDrawer;
  @ViewChild('drawercreate', { static: true }) drawercreate: MatDrawer;
  @ViewChild('singleSelect', { static: false }) singleSelect: MatSelect;
  @ViewChild('endDate', { static: false }) EndDate:ElementRef;
  @ViewChild('duration', { static: false }) Duration:ElementRef;
  dataSource: MatTableDataSource<TaskProject>;about: string;
  direction: string;
  startString: string;
  dtFormSearch: FormGroup;
  dtFormCreate:FormGroup;  
  projectId: number;
  projectMaintenanceId :number;
  taskId :number;
  idLogin: number;
  error:string;
  submitted:boolean;
  task = new TaskProject();
  lstEmp : any;
  endValue:string;
  arrMember : ProjectMaintenanceMember[];
  searchedValue: any;
  createValue:any; 
  displayedColumns = ['Action', 'EmpName', 'TaskName', 'StartDate','EndDate', 'Duration'];
  matTableTasksRequest: MatTableRequest;
  constructor(
    private taskService: TaskProjectService,
    private projecMaintenanceMemberService :ProjectMaintenanceMemberService,
    private formBuilder: FormBuilder,
    private route :Router,

    public dialog: MatDialog,
    private commons: Commons,
    private _sharedService: SharedService
  ) {}

  ngOnInit() {
    this.projectId = parseInt(localStorage.getItem("projectId"));
    const userLogin = JSON.parse(localStorage.getItem("authUser"));
    this.projectMaintenanceId = parseInt(localStorage.getItem("projectMaintenanceId"));
    this.idLogin = userLogin.EmpId;
    this.projecMaintenanceMemberService.getAllMaintenanceMember(this.projectMaintenanceId).subscribe(data => {
      this.arrMember = data;
      for (let index = 0; index <= this.arrMember.length - 1 ; index++) {
        for (let index1 = index + 1; index1 <= this.arrMember.length - 1; index1++) {
          if(this.arrMember[index1].EmpId == this.arrMember[index].EmpId)
          {
            this.arrMember.splice(index1,1);
          }          
        }        
      }
      var t = this.arrMember;
      this.filterMember.next(t);
    });
    this.custFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filter();
      });
    //create
    this.dtFormCreate = this.formBuilder.group({
     EmpName : new FormControl(''),
      TaskName :new FormControl('',{
        validators: [Validators.required],updateOn:'blur'
      }),
      StartDate: new FormControl('', {
        validators: [compareDateValidator('StartDate', 'EndDate')
        ]
      }),
      EndDate: new FormControl('',  {
        validators: [compareDateValidator('StartDate', 'EndDate')
        ]
      }),
     Duration : new FormControl('',{
      validators :[Validators.pattern("^[0-9]+(.[0-9]{0,2})?$")]
     })

    })
    
   
    //search
    this.dtFormSearch = this.formBuilder.group({
      TaskName  : new FormControl(''),
      StartDate: new FormControl('', {
        validators: [compareDateValidator('StartDate', 'StartDate')
        ]
      }),
      EndDate: new FormControl('', {
        validators: [compareDateValidator('EndDate', 'EndDate')]
      })
     
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
        this.loadTask();
      }
    });
  }

  onblur(){
    this.dtFormCreate.controls.TaskName.setValidators(Validators.required);
    this.dtFormCreate.controls.TaskName.updateValueAndValidity();
  }
  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

// search start region



//search end region



  filter() {
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
  ngAfterViewInit(): void {
    this.dtFormSearch.patchValue(this.searchedValue);

    this.loadTask();

    // reset the paginator after sorting
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() =>
          this.loadTask()
        )
      )
      .subscribe();

  }
  loadTask() {
    const userLogin = JSON.parse(localStorage.getItem("authUser"));
    this.projectId = parseInt(localStorage.getItem("projectId"));
    this.projectMaintenanceId = parseInt(localStorage.getItem("projectMaintenanceId"));
    this.matTableTasksRequest = new MatTableRequest(this.sort.active,
      this.sort.direction.toString(),
      this.paginator.pageIndex,
      this.paginator.pageSize,
      {
        ...this.searchedValue, 
        TaskName : this.searchedValue.TaskName,               
        StartDate: this.searchedValue.StartDate ? this.searchedValue.StartDate.format('YYYY/MM/DD') : "",
        EndDate: this.searchedValue.EndDate ? this.searchedValue.EndDate.format('YYYY/MM/DD') : "",       
        ProjectMaintenanceId : this.projectMaintenanceId       
      });
      this.taskService.getTaskMaintenance(this.matTableTasksRequest).subscribe(resp => {
      this.paginator.length = resp.itemscount;
      this.dataSource = new MatTableDataSource(resp.items);
    });
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
  CreateTask(id)
  {
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
  loadDataEndDate()
  {
    var start = this.dtFormCreate.controls.StartDate.value;      
    var duration =this.dtFormCreate.controls.Duration.value;
    var id = this.dtFormCreate.controls.EmpName.value;
    if(start != "" && duration != null)
    {     
      if(moment.isMoment(start))
      {
        start = this.dtFormCreate.controls.StartDate.value.format("YYYY-MM-DD");
      }
      if(id != "")
      {
        this.taskService.getEndDateById(start,duration,id).subscribe(data=>{
          var t = data;             
          this.dtFormCreate.controls.EndDate.setValue(t);    
          if (this.dtFormCreate.controls.StartDate.errors.compareDate) {
            this.dtFormCreate.controls['StartDate'].setErrors(null);
          }  
          });  
      }
      else{
        this.taskService.getEndDate(start,duration).subscribe(data=>{
          var t = data;             
          this.dtFormCreate.controls.EndDate.setValue(t);    
          if (this.dtFormCreate.controls.StartDate.errors.compareDate) {
            this.dtFormCreate.controls['StartDate'].setErrors(null);
          }  
          });
      }
            
    } 
    else{
      this.dtFormCreate.controls.EndDate.setValue("");
    }    
  }
  OnSubmitData()
  {    
    this.projectId = parseInt(localStorage.getItem("projectId"));  
    this.projectMaintenanceId = parseInt(localStorage.getItem("projectMaintenanceId"));    
    this.submitted = true;
    if(this.dtFormCreate.invalid)
    {
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
     task.ProjectMaintenanceId = this.projectMaintenanceId;
     if(this.taskId != null)
      {                
        task.Id = this.taskId;
        task.UpdatedId = this.idLogin;
        task.UpdatedDate = new Date();
        this.taskService.updateTaskMaintenance(task).subscribe(data => {
          alert("Update project successful");     
          this.loadTask();    
           }),
          error => {
            this.error = error;
            console.log(this.error);
          }
      }
      else {
        task.CreatedDate = new Date();
        task.CreatedId = this.idLogin;
        this.taskService.createTaskMaintenance(task).subscribe(
          data => {             
            this.route.navigate(['project/info/' + this.projectId + '/maintenance/info/' +this.projectMaintenanceId+'/task']);            
          },
          error => {
            this.error = error;
            console.log(this.error);
           });          
          }
          this.loadTask();
          this.drawercreate.close();
  }
  //search
  onSubmitSearch() {   
    this.checkValidDate
    this.paginator.pageIndex = 0;
    this.searchedValue = { ...this.dtFormSearch.value };
    this.loadTask();
    this.drawer.close()
  }
  refersh() {
    this.dtFormSearch.patchValue(
      {
        TaskName: '',
        StartDate: '',
        EndDate: ''       
      }
    );
  }
  resetFormCreateEdit()
  {
    this.dtFormCreate.controls.TaskName.clearValidators();
    this.dtFormCreate.patchValue(
      {
        TaskName: '',
        StartDate: '',
        EndDate: '',
        Duration:''      
      }
    );
  }
  goToTop() {
    // this.renderer.setStyle(this.parentTable.nativeElement, 'scrollTop', 0);
    this.parentTable.nativeElement.scrollTo(0, 0)
  }
  //delete
  deleteTask()
  {
    var del = confirm('Are you sure want to delete this Task Maintenance ?');
    if (!del) return;
    this.taskService.deleteTask(this.taskId).subscribe(data => {
      this.loadTask();
    }),
      error => {
        this.error = error;
      }
      this.drawercreate.close();
  }
 
}
