import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectMaintenanceInfoAttachfileComponent } from './project-maintenance-info-attachfile.component';

describe('ProjectMaintenanceInfoAttachfileComponent', () => {
  let component: ProjectMaintenanceInfoAttachfileComponent;
  let fixture: ComponentFixture<ProjectMaintenanceInfoAttachfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectMaintenanceInfoAttachfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectMaintenanceInfoAttachfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
