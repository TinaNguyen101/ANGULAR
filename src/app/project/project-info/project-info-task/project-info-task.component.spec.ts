import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectInfoTaskComponent } from './project-info-task.component';

describe('ProjectInfoTaskComponent', () => {
  let component: ProjectInfoTaskComponent;
  let fixture: ComponentFixture<ProjectInfoTaskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectInfoTaskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectInfoTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
