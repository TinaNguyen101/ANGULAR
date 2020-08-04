import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, retry } from 'rxjs/operators';
import { API } from '../_config/api';
import { stringify } from 'querystring';

@Injectable({
  providedIn: 'root'
})
export class ReportAccountingService {

  constructor(private httpClient: HttpClient) { }

  //get Report Monthly Salary
  public getReportMonthlySalary(yearMonth: string): Observable<any> {
    return this.httpClient.get<any>(`${API.ReportAccounting.LIST_MONTHLY_SALARY}?yearMonth=${yearMonth}`)
      .pipe(
        tap(() => {
          retry(3);
        })
      );
  }
  //Download file yearMonth Monthly Salary
  public downloadFileYearMonth(yearMonth: string): Observable<HttpEvent<Blob>> {
    return this.httpClient.get(`${API.ReportAccounting.DOWNLOAD_LIST_YEARMONTH}?yearMonth=${yearMonth}`, {
      responseType: 'blob',
      observe: 'response'
    })
  }
  //get Report Annual Bonus
  public getReportAnnualBonus(yearMonth: number, rateYen: number, rateUSD: number): Observable<any> {
    return this.httpClient.get<any>(`${API.ReportAccounting.LIST_ANNUAL_BONUS}?year=${yearMonth}&rateYen=${rateYen}&rateUSD=${rateUSD}`)
      .pipe(
        tap(() => {
          retry(3);
        })
      );
  }
  // Download file year Annual Bonus
  public downloadFileYearAnnualBonus(yearMonth, rateYen, rateUSD): Observable<HttpEvent<Blob>> {
    return this.httpClient.get(`${API.ReportAccounting.DOWNLOAD_ANNUAL_BONUS}?year=${yearMonth}&rateYen=${rateYen}&rateUSD=${rateUSD}`, {
      responseType: 'blob',
      observe: 'response'
    })
  }
}
