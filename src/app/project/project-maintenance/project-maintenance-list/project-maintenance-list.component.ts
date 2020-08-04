import { Component, OnInit, ViewChild, ElementRef, QueryList, ViewChildren, AfterViewInit } from '@angular/core';
import { ProjectMaintenanceService } from '../../_services/projects-maintenance.service';
import { ProjectMaintenance } from '../../_models/project-maintenance';
import { FormControl,FormBuilder, FormGroup } from '@angular/forms';
import { ProjectService } from '../../_services/projects.service';
import {MatTableRequest} from '../../../_models/MatTableRequest';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { Commons } from 'src/app/_shared/common_function';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDrawer, MatDrawerContent, MatDrawerContainer } from '@angular/material';
import { ToolbarAnimator } from '../../_share/ToolbarAnimator';
import { trigger, state, transition, animate, style } from '@angular/animations';
import * as _moment from 'moment';
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


export const _animate ='.5s';

@Component({
  selector: 'app-project-maintenance-list',
  templateUrl: './project-maintenance-list.component.html',
  styleUrls: ['./project-maintenance-list.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },

    { provide: MAT_DATE_FORMATS, useValue: MONTH_ONLY_FORMATS },
  ],
  animations: [
    ToolbarAnimator.createTrigger('toolbarLMobile', '10%','100px',  '0px','auto' ,_animate,_animate),
    ToolbarAnimator.createTrigger('toolbarL', '0px', '100px',  '0px','auto',_animate,_animate),
    ToolbarAnimator.createTrigger('toolbarR', '534px','100px',  '0px','auto',_animate,_animate),
]
})
export class ProjectMaintenanceListComponent implements OnInit, AfterViewInit {
  @ViewChild('drawer', {static: true}) drawer: MatDrawer;
  @ViewChildren('drawercontainer') drawercontainer: QueryList<MatDrawerContainer>;
  @ViewChild("divtop", {static: true}) divtop: MatDrawerContent;
  projectMaintenances: Array<ProjectMaintenance>;
  projectMaintenanceId: number;
  form: FormGroup;
  MstProjectStatus: any;
  submitted: boolean;
  objectSearch: MatTableRequest;
  defaultAction: any='hide';
  searchedValue: any;
  mobile:boolean=false;
  startDate = "";
  endDate = "";

  constructor(private projectMaintenanceService: ProjectMaintenanceService, private formBuilder: FormBuilder, private projectService: ProjectService, 
     private commons: Commons) { }

  ngOnInit() {
    if (window.screen.width <= 1025) { 
      this.mobile = true;
    }
    this.projectMaintenanceService.getProjectMaintenances(parseInt(localStorage.getItem("projectId")))
    .subscribe(r => {
      this.projectMaintenances = r;
    });
    this.projectMaintenanceId = parseInt(localStorage.getItem("projectMaintenanceId"));
   
    this.form = this.formBuilder.group({
      MaintenanceName: new FormControl(''),
      StartDate: new FormControl(''),
      EndDate: new FormControl(''),
      ProjectStatusName: new FormControl(''),
    });
    this.projectService.getMasterData("MstProjectStatus").subscribe(r => this.MstProjectStatus = r.mst);
    this.searchedValue = {...this.form.value};
    this.drawer.openedChange.subscribe((o: boolean) => {
      if (!o) {
        this.form.patchValue(this.searchedValue);
      }
     });
  }

  ngAfterViewInit() {
    
  }

  onResize() {
    if (window.screen.width <= 1025) { // 768px portrait
      this.mobile = true;
    }
    else{
      this.mobile = false;
    }
  }
    goToTop() {
    this.divtop.scrollTo({
      top: 0,
      left: 0
    })
  }

  convertStyleObject(style: string) {
    return JSON.parse(style);
  }

  onSubmitData() {
    this.searchedValue = {...this.form.value};

    if (this.form.invalid) {
      return;
    }
    const fsv = this.form.value;
    this.objectSearch = new MatTableRequest("StartDate",
    "DESC",
      0,
      0,
      {
        ...this.searchedValue,
        StartDate: this.searchedValue.StartDate ? this.searchedValue.StartDate.format('YYYY/MM/DD') : "",
        EndDate: this.searchedValue.EndDate ? this.searchedValue.EndDate.format('YYYY/MM/DD') : ""
      });
    this.projectMaintenanceService.searchProjectMaintenances(this.objectSearch, 
      localStorage.getItem("projectId")).subscribe(r => this.projectMaintenances =r.items);
      this.drawer.close()
  }
 
  refersh(){
    this.form.reset();
  }

 
  
  
}
