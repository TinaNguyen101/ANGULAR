import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportAccountingComponent } from './report-accounting.component';

describe('ReportAccountingComponent', () => {
  let component: ReportAccountingComponent;
  let fixture: ComponentFixture<ReportAccountingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportAccountingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportAccountingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
