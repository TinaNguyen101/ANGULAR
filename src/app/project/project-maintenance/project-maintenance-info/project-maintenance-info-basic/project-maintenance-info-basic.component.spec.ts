import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectMaintenanceInfoBasicComponent } from './project-maintenance-info-basic.component';

describe('ProjectMaintenanceInfoBasicComponent', () => {
  let component: ProjectMaintenanceInfoBasicComponent;
  let fixture: ComponentFixture<ProjectMaintenanceInfoBasicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectMaintenanceInfoBasicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectMaintenanceInfoBasicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
