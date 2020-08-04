import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeAnnualBonusComponent } from './employee-annual-bonus.component';

describe('EmployeeAnnualBonusComponent', () => {
  let component: EmployeeAnnualBonusComponent;
  let fixture: ComponentFixture<EmployeeAnnualBonusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeAnnualBonusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeAnnualBonusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
