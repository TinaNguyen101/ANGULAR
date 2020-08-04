import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeAnnualEvaluationComponent } from './employee-annual-evaluation.component';

describe('EmployeeAnnualEvaluationComponent', () => {
  let component: EmployeeAnnualEvaluationComponent;
  let fixture: ComponentFixture<EmployeeAnnualEvaluationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeAnnualEvaluationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeAnnualEvaluationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
