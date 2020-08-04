import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeAnnualKPIResultComponent } from './employee-annual-kpi-result.component';

describe('EmployeeAnnualKPIResultComponent', () => {
  let component: EmployeeAnnualKPIResultComponent;
  let fixture: ComponentFixture<EmployeeAnnualKPIResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeAnnualKPIResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeAnnualKPIResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
