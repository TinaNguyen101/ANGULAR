import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeAnnualReviewComponent } from './employee-annual-review.component';

describe('EmployeeAnnualReviewComponent', () => {
  let component: EmployeeAnnualReviewComponent;
  let fixture: ComponentFixture<EmployeeAnnualReviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeAnnualReviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeAnnualReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
