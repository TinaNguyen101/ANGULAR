import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, retry } from 'rxjs/operators';
import { API } from '../_config/api';

@Injectable({
  providedIn: 'root'
})
export class EmployeeReportService {

  constructor( private httpClient: HttpClient) { }


  public getAllEmployeeVehicles(yearMonth: string): Observable<any> {
    return this.httpClient.get<any>(`${API.EmployeeReport.ReportEmployeeVehicle}${yearMonth}`)
      .pipe(
        tap(() => {
          retry(3);
        })
      );
  }

}
