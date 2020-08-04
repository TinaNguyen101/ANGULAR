import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectMaintenanceService } from '../../_services/projects-maintenance.service'
import { ProjectMaintenance } from '../../_models/project-maintenance';
import { SharedService } from '../../_share/shared-service';
import { ToolbarAnimator } from '../../_share/ToolbarAnimator';


@Component({
  selector: 'app-project-maintenance-info',
  templateUrl: './project-maintenance-info.component.html',
  styleUrls: ['./project-maintenance-info.component.scss'],

})
export class ProjectMaintenanceInfoComponent implements OnInit {
  public projectMaitenace =new ProjectMaintenance();
  isEdit: boolean;
  constructor(private route: ActivatedRoute, private projectMaitenaceService: ProjectMaintenanceService,
    private _sharedService: SharedService) {
      _sharedService.changeEmitted$.subscribe(
        text => {
            console.log(text);
            this.projectMaitenace.MaintenanceName=text;
        });
      

     }

  public ngOnInit() {
    let id = this.route.snapshot.params.id;
    if (id) {
    localStorage.setItem("projectMaintenanceId", id); 
      this.projectMaitenaceService.getProjectMaintenancesInfo(id).subscribe(r => this.projectMaitenace = r);
      this.isEdit = true;
    } else {
    localStorage.removeItem("projectMaintenanceId"); 
      this.isEdit = false;
    }
  }

  public reloadName(name:string)
  {
    this.projectMaitenace.MaintenanceName = name;
  }
}
