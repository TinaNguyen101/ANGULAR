import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeAnnualRatingFactorComponent } from './employee-annual-rating-factor.component';

describe('EmployeeAnnualRatingFactorComponent', () => {
  let component: EmployeeAnnualRatingFactorComponent;
  let fixture: ComponentFixture<EmployeeAnnualRatingFactorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeAnnualRatingFactorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeAnnualRatingFactorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
