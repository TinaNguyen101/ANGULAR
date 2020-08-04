import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProjectComponent } from './project.component';
import { ProjectListComponent } from './project-list/project-list.component';
import { ProjectInfoComponent } from './project-info/project-info.component';
import { ProjectInfoBasicComponent } from './project-info/project-info-basic/project-info-basic.component';
import { ProjectInfoAttachfileComponent } from './project-info/project-info-attachfile/project-info-attachfile.component';
import { ProjectInfoMemberComponent } from './project-info/project-info-member/project-info-member.component';
import { ProjectInfoMaintenanceComponent } from './project-maintenance/project-info-maintenance.component';
import { ProjectMaintenanceListComponent } from './project-maintenance/project-maintenance-list/project-maintenance-list.component';
import { ProjectMaintenanceInfoComponent } from './project-maintenance/project-maintenance-info/project-maintenance-info.component';
// tslint:disable-next-line:max-line-length
import { ProjectMaintenanceInfoBasicComponent } from './project-maintenance/project-maintenance-info/project-maintenance-info-basic/project-maintenance-info-basic.component';
// tslint:disable-next-line:max-line-length
import { ProjectMaintenanceInfoMemberComponent } from './project-maintenance/project-maintenance-info/project-maintenance-info-member/project-maintenance-info-member.component';
// tslint:disable-next-line:max-line-length
import { ProjectMaintenanceInfoAttachfileComponent } from './project-maintenance/project-maintenance-info/project-maintenance-info-attachfile/project-maintenance-info-attachfile.component';
import { ProjectInfoTaskComponent } from './project-info/project-info-task/project-info-task.component';
import { ProjectMaintenanceInfoTaskComponent } from './project-maintenance/project-maintenance-info/project-maintenance-info-task/project-maintenance-info-task.component';

const routes: Routes = [
  {
    path: '',
    component: ProjectComponent,
    children: [
      {
        path: '',
        component: ProjectListComponent
      },

      {
        path: 'create',
        component: ProjectInfoComponent,
        children: [
          {
            path: '',
            redirectTo: 'basic'
          },
          {
            path: 'basic',
            component: ProjectInfoBasicComponent,
          },
        ]
      },
      {
        path: 'info/:id',
        component: ProjectInfoComponent,
        children: [
          {
            path: '',
            redirectTo: 'basic'
          },
          {
            path: 'basic',
            component: ProjectInfoBasicComponent
          },
          {
            path: 'member',
            component: ProjectInfoMemberComponent
          },
          {
            path: 'attachfile',
            component: ProjectInfoAttachfileComponent
          },
          {
            path: 'task',
            component: ProjectInfoTaskComponent
          },
          {
            path: 'maintenance',
            component: ProjectInfoMaintenanceComponent,
            children: [
              {
                path: '',
                component: ProjectMaintenanceListComponent,
              },
              {
                path: 'create',
                component: ProjectMaintenanceInfoComponent,
                children: [
                  {
                    path: '',
                    redirectTo: 'basic'
                  },
                  {
                    path: 'basic',
                    component: ProjectMaintenanceInfoBasicComponent,
                  },
                ]
              },
              {
                path: 'info/:id',
                component: ProjectMaintenanceInfoComponent,
                children: [
                  {
                    path: '',
                    redirectTo: 'basic'
                  },
                  {
                    path: 'basic',
                    component: ProjectMaintenanceInfoBasicComponent,
                  },
                  {
                    path: 'member',
                    component: ProjectMaintenanceInfoMemberComponent,
                  },
                  {
                    path: 'attachfile',
                    component: ProjectMaintenanceInfoAttachfileComponent,
                  },
                  {
                    path: 'task',
                    component: ProjectMaintenanceInfoTaskComponent,
                  },
                ]
              },
            ]
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
export class ProjectRoutingModule { }
