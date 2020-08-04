import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectMaintenanceInfoTaskComponent } from './project-maintenance-info-task.component';

describe('ProjectMaintenanceInfoTaskComponent', () => {
  let component: ProjectMaintenanceInfoTaskComponent;
  let fixture: ComponentFixture<ProjectMaintenanceInfoTaskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectMaintenanceInfoTaskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectMaintenanceInfoTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
