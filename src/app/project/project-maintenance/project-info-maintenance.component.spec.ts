import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectInfoMaintenanceComponent } from './project-info-maintenance.component';

describe('ProjectInfoMaintenanceComponent', () => {
  let component: ProjectInfoMaintenanceComponent;
  let fixture: ComponentFixture<ProjectInfoMaintenanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectInfoMaintenanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectInfoMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
