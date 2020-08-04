import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectInfoAttachfileComponent } from './project-info-attachfile.component';

describe('ProjectInfoAttachfileComponent', () => {
  let component: ProjectInfoAttachfileComponent;
  let fixture: ComponentFixture<ProjectInfoAttachfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectInfoAttachfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectInfoAttachfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
