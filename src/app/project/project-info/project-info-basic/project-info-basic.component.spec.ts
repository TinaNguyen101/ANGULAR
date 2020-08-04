import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectInfoBasicComponent } from './project-info-basic.component';

describe('ProjectInfoBasicComponent', () => {
  let component: ProjectInfoBasicComponent;
  let fixture: ComponentFixture<ProjectInfoBasicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectInfoBasicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectInfoBasicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
