import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeInfoAttachfileComponent } from './employee-info-attachfile.component';

describe('EmployeeInfoAttachfileComponent', () => {
  let component: EmployeeInfoAttachfileComponent;
  let fixture: ComponentFixture<EmployeeInfoAttachfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeInfoAttachfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeInfoAttachfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
