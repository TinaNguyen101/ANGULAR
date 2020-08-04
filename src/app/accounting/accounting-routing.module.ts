import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountingComponent } from './accounting.component';
import { AccountingSalaryComponent } from './accounting-salary/accounting-salary.component';
import { AccountingMonthlySalaryComponent } from './accounting-monthly-salary/accounting-monthly-salary.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: AccountingComponent,
    children: [
      {
        path: '',
        redirectTo: 'salary'
      },
      {
        path: 'salary',
        component: AccountingSalaryComponent
      },
      {
        path: 'monthlysalary',
        component: AccountingMonthlySalaryComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class AccountingRoutingModule { }
