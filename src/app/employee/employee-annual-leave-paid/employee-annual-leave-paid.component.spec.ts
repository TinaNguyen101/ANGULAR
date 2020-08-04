import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeAnnualLeavePaidComponent } from './employee-annual-leave-paid.component';

describe('EmployeeAnnualLeavePaidComponent', () => {
  let component: EmployeeAnnualLeavePaidComponent;
  let fixture: ComponentFixture<EmployeeAnnualLeavePaidComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeAnnualLeavePaidComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeAnnualLeavePaidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
