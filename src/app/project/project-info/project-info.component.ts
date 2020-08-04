import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from '../_services/projects.service';
import { Project } from '../_models/project';
import { SharedService } from '../_share/shared-service';

@Component({
  selector: 'app-project-info',
  templateUrl: './project-info.component.html',
  styleUrls: ['./project-info.component.scss'],
})
export class ProjectInfoComponent implements OnInit {
  projects = new Project();
  idProject: any;
  selectedName: string;
  constructor(private route: ActivatedRoute, private projectService: ProjectService,
    private _sharedService: SharedService
    ) { 
    
  _sharedService.changeEmitted$.subscribe(
    text => {
        this.projectService.getProjectInfo(this.route.snapshot.params.id).subscribe(r => this.projects = r)  
    });
  

  }
  
  ngOnInit() {
    this.idProject = this.route.snapshot.params.id;
    if (this.idProject) {
      localStorage.setItem("projectId", this.idProject); 
    this.projectService.getProjectInfo(this.idProject).subscribe(r => this.projects = r)  
      } else {
      localStorage.removeItem("projectId"); 
      }
    
      
  }

}
