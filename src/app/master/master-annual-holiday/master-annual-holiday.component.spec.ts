import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterAnnualHolidayComponent } from './master-annual-holiday.component';

describe('MasterAnnualHolidayComponent', () => {
  let component: MasterAnnualHolidayComponent;
  let fixture: ComponentFixture<MasterAnnualHolidayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MasterAnnualHolidayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterAnnualHolidayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
