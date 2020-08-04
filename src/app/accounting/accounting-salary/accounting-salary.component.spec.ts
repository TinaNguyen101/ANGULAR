import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountingSalaryComponent } from './accounting-salary.component';

describe('AccountingSalaryComponent', () => {
  let component: AccountingSalaryComponent;
  let fixture: ComponentFixture<AccountingSalaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountingSalaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountingSalaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
