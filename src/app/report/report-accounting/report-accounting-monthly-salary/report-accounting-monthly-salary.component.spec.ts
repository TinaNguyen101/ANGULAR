import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportAccountingMonthlySalaryComponent } from './report-accounting-monthly-salary.component';

describe('ReportAccountingMonthlySalaryComponent', () => {
  let component: ReportAccountingMonthlySalaryComponent;
  let fixture: ComponentFixture<ReportAccountingMonthlySalaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportAccountingMonthlySalaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportAccountingMonthlySalaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
