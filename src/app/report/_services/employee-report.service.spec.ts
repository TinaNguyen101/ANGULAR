import { TestBed } from '@angular/core/testing';

import { EmployeeReportService } from './employee-report.service';

describe('EmployeeReportService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EmployeeReportService = TestBed.get(EmployeeReportService);
    expect(service).toBeTruthy();
  });
});
