import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportComponent } from './report.component';
import { ReportProjectComponent } from './report-project/report-project.component';
import { ReportCustomersComponent } from './report-customers/report-customers.component';
import { ReportEmployeeComponent } from './report-employee/report-employee.component';
import { ReportAccountingComponent } from './report-accounting/report-accounting.component';
import { ReportAccountingMonthlySalaryComponent } from './report-accounting/report-accounting-monthly-salary/report-accounting-monthly-salary.component';
import { ReportAccountingAnnualBonusComponent } from './report-accounting/report-accounting-annual-bonus/report-accounting-annual-bonus.component';

const routes: Routes = [
  {
    path: '',
    component: ReportComponent,
    children: [
      {
        path: '',
        redirectTo: 'project'
      },
      {
        path: 'project',
        component: ReportProjectComponent
      },
      {
        path: 'customer',
        component: ReportCustomersComponent
      },
      {
        path: 'employee',
        component: ReportEmployeeComponent
      },
      {
        path: 'accounting',
        component: ReportAccountingComponent,
        children:[
          {
            path:'',
            redirectTo: 'monthlySalary',
          },
          {
            path:'monthlySalary',
            component:ReportAccountingMonthlySalaryComponent,
          },
          {
            path:'annualBonus',
            component:ReportAccountingAnnualBonusComponent,
          }
        ]
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportRoutingModule { }
