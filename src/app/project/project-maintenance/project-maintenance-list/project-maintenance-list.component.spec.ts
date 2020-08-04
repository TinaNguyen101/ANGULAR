import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectMaintenanceListComponent } from './project-maintenance-list.component';

describe('ProjectMaintenanceListComponent', () => {
  let component: ProjectMaintenanceListComponent;
  let fixture: ComponentFixture<ProjectMaintenanceListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectMaintenanceListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectMaintenanceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
