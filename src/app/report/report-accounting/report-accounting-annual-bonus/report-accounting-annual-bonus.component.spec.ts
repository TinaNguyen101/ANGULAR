import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportAccountingAnnualBonusComponent } from './report-accounting-annual-bonus.component';

describe('ReportAccountingAnnualBonusComponent', () => {
  let component: ReportAccountingAnnualBonusComponent;
  let fixture: ComponentFixture<ReportAccountingAnnualBonusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportAccountingAnnualBonusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportAccountingAnnualBonusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
