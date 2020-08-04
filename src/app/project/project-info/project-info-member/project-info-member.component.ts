import { Component, OnInit,ViewChild, ViewEncapsulation } from '@angular/core';
import { ProjectMemberService } from '../../_services/projects-member.service';
import { ProjectMaintenanceMemberService } from 'src/app/project/_services/project-maintenance-member.service';
import {Employee} from '../../_models/employee'
import {MatTableDataSource} from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';
import { ProjectMember, Member } from '../../_models/project-member';
import { ToolbarAnimator } from '../../_share/ToolbarAnimator';

export const _animate ='.5s';
@Component({
  selector: 'app-project-info-member',
  templateUrl: './project-info-member.component.html',
  styleUrls: ['./project-info-member.component.scss'],
  
  animations: [
    ToolbarAnimator.createTriggerMember('toolbarLMobile', '0%','100px',  '0px','auto' ,_animate,_animate),
]
})

export class ProjectInfoMemberComponent implements OnInit {

  //@ViewChild('drawerCard_member_mobile', {static: false}) drawerCard_member_mobile;
  @ViewChild('drawer', {static: true}) drawer; 
  //@ViewChild('myCard', {static: false}) myCard; 
  
  displayedColumns: string[] = ['select', 'name','position','close'];
  dataSource = new MatTableDataSource<Employee>();
  dataProjectPosition : any;
  id: number;
  Arr_Member = new Array<Member>();
  member = new Member;
  employee = new Employee;
  projectMember: Array<ProjectMember>;
  Arr_Employee : Array<any>;
  mode = false;
  dataSourceMember = new MatTableDataSource<ProjectMember>(this.projectMember);
  selected=2;

  constructor(private porjectMemberService: ProjectMemberService,
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
    this.LoadData();
  }
  //get Position Selected
  selectPositon(event){
    this.id = parseInt(event.id);
  }
  //Load data
  LoadEmployee(){
    this.porjectMemberService.getEmployeeByDept(1).subscribe(res=>{
      this.Arr_Employee = res;
      //add atttribute "checked"
      this.Arr_Employee.forEach(emp => {
        emp['checked'] = false;
      })
    });
  }
  LoadMember(){
    this.porjectMemberService.getAllMember(Number(localStorage.getItem("projectId"))).subscribe(res=>{
      this.projectMember = res;
      this.dataSourceMember = new MatTableDataSource<ProjectMember>(this.projectMember);
    },
    error=>{
      alert(error);
    });          
  }
  LoadPosition(){
    this.projectMaintenanceMemberService.getMasterPosition("MstProjectPosition").subscribe(res =>{
      this.dataProjectPosition = res.mst;
    }) 
  }
  LoadData(){
    this.LoadMember();
    this.LoadEmployee();
    this.LoadPosition();  
  }
  //Add Member
  onAddMember(){
    var count_Leader = 0;
    this.projectMember.forEach(element => {
      if (element.ProjectPositionId == 1 && this.id == 1) {
        count_Leader++;
      }
    });
    if (count_Leader <= 0) {
      this.Arr_Employee.filter(s => s.checked === true).forEach(element => {
        this.member = new Member();
        this.member.EmpId = element.Id;
        this.member.ProjectId = parseInt(localStorage.getItem("projectId"));
        this.member.ProjectPositionId = this.id;
        this.Arr_Member.push(this.member);
      });      
      this.porjectMemberService.addMember(this.Arr_Member).subscribe(res =>{
        this.LoadMember();
      });
      this.Arr_Member = new Array<Member>();
    }    
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
    this.porjectMemberService.removeMember(button.id).subscribe(res=>{
    this.LoadData();
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
  //Add_Click
  Add_Click(){
    this.drawer.toggle();
   
    //setTimeout(()=>{   
     
    //}, 300);    
  }
  //Touch Card Mobile
  // onTouch_Card_Mobile(){
  //   var a = this.myCard;
  //   debugger
  //   this.myCard.toggle();
  //   this.drawerCard_member_mobile.toggle();
  // }
}
