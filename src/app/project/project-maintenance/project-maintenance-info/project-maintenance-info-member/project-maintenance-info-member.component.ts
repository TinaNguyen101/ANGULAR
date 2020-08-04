import { Component, OnInit,ViewChild } from '@angular/core';
import { ProjectMaintenanceMember, Member, memberMaintenance } from 'src/app/project/_models/project-maintenance-member';
import { ProjectMaintenanceMemberService } from 'src/app/project/_services/project-maintenance-member.service';
import { Employee } from 'src/app/project/_models/employee';
import { MatTableDataSource } from '@angular/material';
import {SelectionModel} from '@angular/cdk/collections';
import {MatSelectModule} from '@angular/material/select';
import { ProjectMaintenanceService } from 'src/app/project/_services/projects-maintenance.service';
import { ProjectMember} from '../../../_models/project-member';
import { ProjectMemberService } from 'src/app/project/_services/projects-member.service';
import { ToolbarAnimator } from 'src/app/project/_share/ToolbarAnimator';

export const _animate ='.5s';
@Component({
  selector: 'app-project-maintenance-info-member',
  templateUrl: './project-maintenance-info-member.component.html',
  styleUrls: ['./project-maintenance-info-member.component.scss'],
  animations: [
    ToolbarAnimator.createTriggerMember('toolbarLMobile', '0%','100px',  '0px','auto' ,_animate,_animate),
]
})

export class ProjectMaintenanceInfoMemberComponent implements OnInit {

  @ViewChild('drawer', {static: true}) drawer; 

  displayedColumns: string[] = ['select', 'name','position','close'];
  dataSource = new MatTableDataSource<Employee>();
  dataProjectPosition : any;
  id: number;
  Arr_Member = new Array<memberMaintenance>();
  member = new memberMaintenance;
  employee = new Employee;
  Arr_ProjectMaintenanceMember: Array<memberMaintenance>;
  Arr_Employee : Array<any>;
  dataSourceMember = new MatTableDataSource<ProjectMaintenanceMember>(this.Arr_ProjectMaintenanceMember);
  selected=2;
  mode = false;
  
  constructor(private projectMaintenanceService: ProjectMaintenanceService,
    private porjectMemberService: ProjectMemberService,
    private projectMaintenanceMemberService:ProjectMaintenanceMemberService) { }
  
  masterToggle($event) {
    this.Arr_Employee.forEach(emp => {
      emp.checked = $event.checked;
    });     
  }
  //checked All checkbox
  isAllSelected() {
      const checkedCount = this.Arr_Employee.filter(s => s.checked === true).length;
      return checkedCount === this.Arr_Employee.length;
  }
  //check anyone checkbox checked
  isHasSelected() {
    if(this.Arr_Employee){
    const checkedCount = this.Arr_Employee.filter(s => s.checked === true).length;
    return checkedCount > 0;
    }
  }
  ngOnInit() {
    this.id= this.selected;
    this.LoadPage();
  }
  //get Position Selected
  selectPositon(event){
    this.id = parseInt(event.id);
  }
  //Load data
  LoadPage(){
    this.projectMaintenanceMemberService.getAllMaintenanceMember(Number(localStorage.getItem("projectMaintenanceId"))).subscribe(res=>{
      this.Arr_ProjectMaintenanceMember = res;
      this.dataSourceMember = new MatTableDataSource<memberMaintenance>(this.Arr_ProjectMaintenanceMember);
    });
    this.projectMaintenanceMemberService.getAllMaintananceEmployeeByDept(1).subscribe(res=>{
      this.Arr_Employee = res;
      //add atttribute "checked"
      this.Arr_Employee.forEach(emp => {
        emp['checked'] = false;
      })
    });
    this.projectMaintenanceMemberService.getMasterPosition("MstProjectPosition").subscribe(res =>{
      this.dataProjectPosition = res.mst;
    })   
  }
  //Add Member
  onAddMember(){
    var count_Leader = 0;
    
    if (this.id == 1) {
      this.Arr_ProjectMaintenanceMember.forEach(element => {
        if (element.ProjectPositionId == 1) {
          count_Leader++;
        }
      });
      if (count_Leader <= 0) {
        this.Arr_Employee.filter(s => s.checked === true).forEach(element => {
          this.member = new memberMaintenance();
          this.member.EmpId = element.Id;
          this.member.ProjectMaintenanceId = parseInt(localStorage.getItem("projectMaintenanceId"));
          this.member.ProjectPositionId = this.id;
          this.Arr_Member.push(this.member);
          element.checked = false;
        });      
      }
    }
    else{
      this.Arr_Employee.filter(s => s.checked === true).forEach(element => {
        this.member = new memberMaintenance();
        this.member.EmpId = element.Id;
        this.member.ProjectMaintenanceId = parseInt(localStorage.getItem("projectMaintenanceId"));
        this.member.ProjectPositionId = this.id;
        this.Arr_Member.push(this.member);
        element.checked = false;
      });  
    }   
    this.projectMaintenanceMemberService.insertMaintenanceMember(this.Arr_Member).subscribe(res =>{
      this.LoadPage();
    });
    this.Arr_Member = new Array<memberMaintenance>();
    setTimeout(()=>{    
      this.Arr_Employee.filter(s => s.checked === true).forEach(element => {
        element.checked = false;
      }); 
      this.drawer.toggle();
    }, 200); 
  }
  //Delete member
  onDeleteMember(button){
    var del = confirm('Are you sure want to delete this member');  
    if (!del) return;  
    this.projectMaintenanceMemberService.deleteMaintenanceMember(button.id).subscribe(res=>{
    this.LoadPage();
    })
  }
  convertStyleObject(style: string) {
    return JSON.parse(style);
  }
  //change Position
  onChange($event){
    var countLst = this.Arr_Employee.filter(s => s.checked === true).length;
    if ($event.value == 1) {  
      this.mode = true;       
      if (countLst > 1) {
        this.Arr_Employee.filter(s => s.checked === true).forEach(element => {
          element.checked = false;
        }); 
      }
    }
    else{
      this.mode = false;
    }    
  }
  //Checkbox is checked Chang
  onCheckedChanged($event, checkedEmp: any){
    if(this.id  == 1){
      this.Arr_Employee.filter(s => s.checked === true).forEach(element => {
        element.checked = false;
      }); 
    }
    checkedEmp.checked = $event.checked; 
  }
}
