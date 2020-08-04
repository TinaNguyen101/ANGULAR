import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountingMonthlySalaryComponent } from './accounting-monthly-salary.component';

describe('AccountingMonthlySalaryComponent', () => {
  let component: AccountingMonthlySalaryComponent;
  let fixture: ComponentFixture<AccountingMonthlySalaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountingMonthlySalaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountingMonthlySalaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
