import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectMaintenanceInfoComponent } from './project-maintenance-info.component';

describe('ProjectMaintenanceInfoComponent', () => {
  let component: ProjectMaintenanceInfoComponent;
  let fixture: ComponentFixture<ProjectMaintenanceInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectMaintenanceInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectMaintenanceInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
