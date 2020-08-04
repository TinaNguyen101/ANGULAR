import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MasterCustomerListComponent } from './master-customer-list/master-customer-list.component';
import { MasterAnnualHolidayComponent } from './master-annual-holiday/master-annual-holiday.component';
import { MasterComponent } from './../master/master.component';
import { MasterInfoComponent } from './master-info/master-info.component';
import { MasterCustomerBasicInfoComponent } from './master-info/master-customer-basic-info/master-customer-basic-info.component';
import { MasterAnnualEvaluatorsComponent } from './master-annual-evaluators/master-annual-evaluators.component';

const routes: Routes = [
  {
    path: '',
    component: MasterComponent,
    children: [
      {
        path: '',
        redirectTo: 'customer',       
      },
      {
        path: 'customer',
        component: MasterCustomerListComponent,       
      },
      {
        path: 'Evaluators',
        component: MasterAnnualEvaluatorsComponent,
      },
        path: 'Holiday',
        component: MasterAnnualHolidayComponent
      },
    ]
  },
  {
    path: 'customer/basic',
    component: MasterInfoComponent,
    children: [
      {
        path: '',
        redirectTo: 'create'
      },
      {
        path: 'create',
        component: MasterCustomerBasicInfoComponent,
      },      
    ]
  },
   {
        path: 'customer/info/:id',
        component: MasterInfoComponent,
        children: [
          {
            path: '',
            redirectTo: 'basic'
          },
          {
            path: 'basic',
            component: MasterCustomerBasicInfoComponent
          },
        ]
   }      
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MasterRoutingModule { }
