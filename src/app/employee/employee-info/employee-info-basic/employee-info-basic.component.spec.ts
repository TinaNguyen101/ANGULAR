import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeInfoBasicComponent } from './employee-info-basic.component';

describe('EmployeeInfoBasicComponent', () => {
  let component: EmployeeInfoBasicComponent;
  let fixture: ComponentFixture<EmployeeInfoBasicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeInfoBasicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeInfoBasicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
