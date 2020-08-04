import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterCustomerListComponent } from './master-customer-list.component';

describe('MasterCustomerListComponent', () => {
  let component: MasterCustomerListComponent;
  let fixture: ComponentFixture<MasterCustomerListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MasterCustomerListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterCustomerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
