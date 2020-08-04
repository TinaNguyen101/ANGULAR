import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeComponent } from './employee.component';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { EmployeeInfoComponent } from './employee-info/employee-info.component';
import { EmployeeInfoBasicComponent } from './employee-info/employee-info-basic/employee-info-basic.component';
import { EmployeeInfoAttachfileComponent } from './employee-info/employee-info-attachfile/employee-info-attachfile.component';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeAnnualLeavePaidComponent } from './employee-annual-leave-paid/employee-annual-leave-paid.component';
import { EmployeeAnnualRatingFactorComponent } from './employee-annual-rating-factor/employee-annual-rating-factor.component';
import { EmployeeAnnualKPIComponent } from './employee-info/employee-annual-kpi/employee-annual-kpi.component';
import { EmployeeAnnualKPIResultComponent } from './employee-info/employee-annual-kpi/employee-annual-kpi-result/employee-annual-kpi-result.component';
import { EmployeeAnnualEvaluationComponent } from './employee-info/employee-annual-kpi/employee-annual-evaluation/employee-annual-evaluation.component';
import { EmployeeAnnualReviewComponent } from './employee-info/employee-annual-kpi/employee-annual-review/employee-annual-review.component';
import { EmployeeAnnualBonusComponent } from './employee-info/employee-annual-bonus/employee-annual-bonus.component';


const routes: Routes = [
  {
    path: '',
    component: EmployeeComponent,
    children: [
      {
        path: '',
        component: EmployeeListComponent
      },
      {
        path: 'AnnualLeavePaid',
        component: EmployeeAnnualLeavePaidComponent
      },
      {
        path: 'AnnualRatingFactor',
        component: EmployeeAnnualRatingFactorComponent
      },

      {
        path: 'create',
        component: EmployeeInfoComponent,
        children: [
          {
            path: '',
            redirectTo: 'basic'
          },
          {
            path: 'basic',
            component: EmployeeInfoBasicComponent,
          },
        ]
      },
      {
        path: 'info/:id',
        component: EmployeeInfoComponent,
        children: [
          {
            path: '',
            redirectTo: 'basic'
          },
          {
            path: 'basic',
            component: EmployeeInfoBasicComponent
          },
         
          {
            path: 'attachfile',
            component: EmployeeInfoAttachfileComponent
          },
          {
            path: 'annualBonus',
            component: EmployeeAnnualBonusComponent
          },
          {
            path: 'AnnualKPI',
            component: EmployeeAnnualKPIComponent,
            children: [
              {
                path: '',
                redirectTo: 'AnnualKPIResult'
              },
              {
                path: 'AnnualKPIResult',
                component: EmployeeAnnualKPIResultComponent,
              },
              {
                path: 'AnnualEvaluation',
                component: EmployeeAnnualEvaluationComponent,
              },
              {
                path: 'AnnualReview',
                component: EmployeeAnnualReviewComponent,
              },
            ]
          },
    
         
        ]
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeRoutingModule { }
