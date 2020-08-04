import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Employee } from '../_models/employee';
import { ActivatedRoute } from '@angular/router';
import { EmployeeService } from '../_services/employee.service';
import { SharedService } from '../_share/shared-service';


@Component({
  selector: 'app-employee-info',
  templateUrl: './employee-info.component.html',
  styleUrls: ['./employee-info.component.scss']
})
export class EmployeeInfoComponent implements OnInit {

  employee = new Employee();
  idEmployee: any;
  selectedName: string;

  constructor(private route: ActivatedRoute,
    private employService: EmployeeService,
    private _sharedService: SharedService
  ) {
    
    _sharedService.changeEmitted$.subscribe(
      text => {
        this.employService.getEmployeeInfo(this.route.snapshot.params.id).subscribe(r => this.employee = r)
      });
  }

  ngOnInit() {
    
    this.idEmployee = this.route.snapshot.params.id;
    if (this.idEmployee) {
      localStorage.setItem("emplpyeeId", this.idEmployee);
      this.employService.getEmployeeInfo(this.idEmployee).subscribe(r => 
      {
        this.employee = r;
        console.log(this.employee);
      })
    } else {
      localStorage.removeItem("emplpyeeId");
    }
  }
}

