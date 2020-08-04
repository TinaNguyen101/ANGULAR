import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { AuthGuard } from './auth/_guards/auth.guard';

const routes: Routes = [
  // Default url
  { path: '', pathMatch: 'full' , redirectTo: 'home'},

  // Home url
  { path: 'home', component: HomeComponent,
    canActivate: [AuthGuard] },
  {

  path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(mod => mod.AuthModule)
  },

  {
  path: 'project',
    loadChildren: () => import('./project/project.module').then(mod => mod.ProjectModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'employee',
      loadChildren: () => import('./employee/employee.module').then(mod => mod.EmployeeModule),
      canActivate: [AuthGuard]
    },
    {
      path: 'accounting',
        loadChildren: () => import('./accounting/accounting.module').then(mod => mod.AccountingModule),
        canActivate: [AuthGuard]
      },
  {
  path: 'report',
    loadChildren: () => import('./report/report.module').then(mod => mod.ReportModule),
    canActivate: [AuthGuard]
  },
  
  {
  path: 'master',
    loadChildren: () => import('./master/master.module').then(mod => mod.MasterModule),
    canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
