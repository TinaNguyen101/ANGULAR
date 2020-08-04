import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectMaintenanceInfoMemberComponent } from './project-maintenance-info-member.component';

describe('ProjectMaintenanceInfoMemberComponent', () => {
  let component: ProjectMaintenanceInfoMemberComponent;
  let fixture: ComponentFixture<ProjectMaintenanceInfoMemberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectMaintenanceInfoMemberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectMaintenanceInfoMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
