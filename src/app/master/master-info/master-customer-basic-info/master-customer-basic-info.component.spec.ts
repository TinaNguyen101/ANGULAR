import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterCustomerBasicInfoComponent } from './master-customer-basic-info.component';

describe('MasterCustomerBasicInfoComponent', () => {
  let component: MasterCustomerBasicInfoComponent;
  let fixture: ComponentFixture<MasterCustomerBasicInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MasterCustomerBasicInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterCustomerBasicInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
