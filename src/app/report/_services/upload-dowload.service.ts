import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent, HttpResponse } from '@angular/common/http';
import { of, Observable } from 'rxjs';
import { API } from '../_config/api';

@Injectable({
  providedIn: 'root'
})
export class UploadDownloadService {

  constructor(private httpClient: HttpClient) {
  }
  //Download file Vehicle list
  public downloadFileEmployeeVehicle(yearMonth: string, lstEmpId: any[]): Observable<HttpEvent<Blob>> {
    return this.httpClient.get(`${API.EmployeeReport.ReportDowloadFileEmployeeVehicle}${yearMonth}`, {
      responseType: 'blob',
      observe: 'response',
      headers: {
        lstEmpId: lstEmpId
      }
    })
  }

  //Download file Employee list
  public downloadFileEmployeeList(yearMonth: string): Observable<HttpEvent<Blob>> {
    return this.httpClient.get(`${API.EmployeeReport.ReportDowloadFileEmployeeList}${yearMonth}`, {
      responseType: 'blob',
      observe: 'response'
    })
  }

  //Download file Annual list for month
  public downloadFileAnnuaListForMonth(yearMonth: string): Observable<HttpEvent<Blob>> {
    return this.httpClient.get(`${API.EmployeeReport.ReportDowloadFileAnnualLeavePaidForMonth}${yearMonth}`, {
      responseType: 'blob',
      observe: 'response'
    })
  }

  //Download file annual list for year
  public downloadFileAnnualListForYear(year: string): Observable<HttpEvent<Blob>> {
    return this.httpClient.get(`${API.EmployeeReport.ReportDowloadFileAnnualLeavePaidForYear}${year}`, {
      responseType: 'blob',
      observe: 'response'
    })
  }

    //Download file KPI list for year
    public downloadFileKPIForYear(year: string): Observable<HttpEvent<Blob>> {
      return this.httpClient.get(`${API.EmployeeReport.ReportDowloadFileKPIForYear}${year}`, {
        responseType: 'blob',
        observe: 'response'
      })
    }



}