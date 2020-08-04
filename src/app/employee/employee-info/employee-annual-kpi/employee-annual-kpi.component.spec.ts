import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeAnnualKPIComponent } from './employee-annual-kpi.component';

describe('EmployeeAnnualKPIComponent', () => {
  let component: EmployeeAnnualKPIComponent;
  let fixture: ComponentFixture<EmployeeAnnualKPIComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeAnnualKPIComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeAnnualKPIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
