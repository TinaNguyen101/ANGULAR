import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, tap, catchError, retry } from 'rxjs/operators';
import { API } from '../_config/api';
import { API  as commonAPI} from '../../_configs/api';
import { ProjectReport } from '../_models/project-report';

@Injectable({
  providedIn: 'root'
})
export class ProjectReportService {
  constructor(
  private httpClient: HttpClient,
) {
}
  public getProjectReports(reportByValue: string, reportMonth: any,  reportYear: string, reportStatusValue: any, rateJPY: string, rateUSD: string): Observable<any[]> {
    // tslint:disable-next-line:max-line-length
    return this.httpClient.get<any[]>(`${API.ProjectReport.Report}`, {
      params: new HttpParams()
                .set('yearMonth', reportByValue === 'm' ? reportMonth.format('YYYYMM') : '')
                .set('year', reportByValue === 'y' ? reportYear : '')
                .set('statusId', reportStatusValue)
                .set('rateYen', rateJPY)
                .set('rateUSD', rateUSD)
    })
    .pipe(
        tap(() => {
            retry(3);
        })
    );
  }

  public getReportStatistics(reportByValue: string, reportMonthFrom: any, reportMonthTo: any,  reportYear: string, rateJPY: string, rateUSD: string): Observable<any[]> {
    return this.httpClient.get<any[]>(`${API.ProjectReport.ReportStatistics}`, {
      params: new HttpParams()
      .set('yearMonthStart', reportByValue === 'm' ? reportMonthFrom.format('YYYYMM') : '')
      .set('yearMonthEnd', reportByValue === 'm' ? reportMonthTo.format('YYYYMM') : '')
      .set('year', reportByValue === 'y' ? reportYear : '')
      .set('rateYen', rateJPY)
      .set('rateUSD', rateUSD)
    })
    .pipe(
        tap(() => {
            retry(3);
        })
    );
  }

  public getMstByName(name: string): Observable<any> {
    return this.httpClient.get<any>(`${commonAPI.MasterData.GET}/${name}`)
      .pipe(
        tap(() => {
          retry(3);
        })
      );
  }

}
