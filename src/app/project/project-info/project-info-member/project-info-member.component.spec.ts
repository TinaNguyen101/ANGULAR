import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectInfoMemberComponent } from './project-info-member.component';

describe('ProjectInfoMemberComponent', () => {
  let component: ProjectInfoMemberComponent;
  let fixture: ComponentFixture<ProjectInfoMemberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectInfoMemberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectInfoMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
