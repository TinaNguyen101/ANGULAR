import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpParams, HttpHeaders, HttpEvent } from '@angular/common/http';
import { map, tap, catchError, retry } from 'rxjs/operators';
import { API } from '../_config/api';
import { Salary } from '../_models/salary';
import { MatTableRequest } from 'src/app/_models/MatTableRequest';
import { MatTableResponse } from 'src/app/_models/MatTableResponse';

@Injectable({
  providedIn: 'root'
})
export class SalaryService {
  constructor(
    private httpClient: HttpClient,
  ) {
  }
  public getAllSalary(matTableRequest: any): Observable<MatTableResponse<Salary>> {
    return this.httpClient.post<MatTableResponse<Salary>>(`${API.Salary.LIST}`, matTableRequest)
      .pipe(
        tap(() => {
          retry(3);
        })
      );
  }
  public getMstByName(name: string): Observable<any> {
    return this.httpClient.get<any>(`${API.MasterData.GET}/${name}`)
      .pipe(
        tap(() => {
          retry(3);
        })
      );
  }
  public insertSalary(obj: Salary): Observable<any> {
    return this.httpClient.post<any>(`${API.Salary.INSERT}`,obj)
      .pipe(
        tap(() => {
          retry(3);
        })
      );
  }
  public updateSalary(obj: Salary): Observable<any> {
    return this.httpClient.put<any>(`${API.Salary.INSERT}`,obj)
      .pipe(
        tap(() => {
          retry(3);
        })
      );
  }
  public deleteSalary(id: number): Observable<any>{
    return this.httpClient.delete<any>(`${API.Salary.INSERT}/${id}`)
      .pipe(
        tap(() => {
          retry(3);
        })
      );
  }
  //Accounting month salary
  public getAllMonthlySalary(request): Observable<any> {
    return this.httpClient.post(`${API.AccounttingSalary.GetAllMonthlySalary}`, request)
    .pipe(
      tap(() => {
        retry(3);
      })
    );
  }
  public getAllEmployee(matTableRequest: any): Observable<MatTableResponse<any>> {
    return this.httpClient.post<MatTableResponse<any>>(`${API.Salary.lstEmployee}`, matTableRequest)
      .pipe(
        tap(() => {
          retry(3);
        })
      );
  }
  public generateMonthlySalary(yearMonth,empId): Observable<any> {
    return this.httpClient.post(`${API.AccounttingSalary.GenerateMonthlySalary}?yearMonth=${yearMonth}&CreatedId=${empId}`, null)
    .pipe(
      tap(() => {
        retry(3);
      })
    );
  }
  public checkApprovalDate(date, EmpId): Observable<any> {
    return this.httpClient.get<any>(`${API.Salary.CheckApprovalDate}?ApprovalDate=${date}&EmpId=${EmpId}`)
      .pipe(
        tap(() => {
          retry(3);
        })
      );
  }
  public checkExistsMonthlySalary(yearMonth): Observable<any> {
    return this.httpClient.get<any>(`${API.AccounttingSalary.CheckExistsMonthlySalary}?yearMonth=${yearMonth}`)
      .pipe(
        tap(() => {
          retry(3);
        })
      );
  }

  public updateMonthlySalary(monthlySalary): Observable<any> {
    return this.httpClient.put<any>(`${API.AccounttingSalary.UpdateMonthlySalary}`,monthlySalary)
      .pipe(
        tap(() => {
          retry(3);
        })
      );
  }

  public deleteMonthlySalary(yearMonth): Observable<any>{
    return this.httpClient.delete<any>(`${API.AccounttingSalary.DeleteMonthlySalary}/${yearMonth}`)
      .pipe(
        tap(() => {
          retry(3);
        })
      );
  }

  public downloadReportMonthlySalary(yearMonth): Observable<HttpEvent<Blob>> {
    return this.httpClient.get(`${API.AccounttingSalary.DownloadReportMonthlySalary}?yearMonth=${yearMonth}`, {
      responseType: 'blob',
      observe: 'response'
    })
  }

  public getWageBonusImageOfPhotoshop(imageTypeId , totalImage ): Observable<any> {
    return this.httpClient.get<any>(`${API.AccounttingSalary.GetWageBonusImageOfPhotoshop}/${imageTypeId}/${totalImage}`)
      .pipe(
        tap(() => {
          retry(3);
        })
      );
  }

  public getTotalImageBonus(totalImageInMonth): Observable<any> {
    return this.httpClient.get<any>(`${API.AccounttingSalary.GetTotalImageBonus}/${totalImageInMonth}`)
      .pipe(
        tap(() => {
          retry(3);
        })
      );
  }

  public getAllMonthlyBonus(yearMonth, empId): Observable<any> {
    return this.httpClient.get<any>(`${API.AccounttingSalary.GetAllMonthlyBonus}?yearMonth=${yearMonth}&empid=${empId}`)
      .pipe(
        tap(() => {
          retry(3);
        })
      );
  }

  public insertMonthlyBonus(monthlyBonus): Observable<any> {
    return this.httpClient.post<any>(`${API.AccounttingSalary.InsertMonthlyBonus}`,monthlyBonus)
      .pipe(
        tap(() => {
          retry(3);
        })
      );
  }

  public updateMonthlyBonus(monthlySalary): Observable<any> {
    return this.httpClient.put<any>(`${API.AccounttingSalary.UpdateMonthlyBonus}`,monthlySalary)
      .pipe(
        tap(() => {
          retry(3);
        })
      );
  }

  public getMonthlyBonusById(id): Observable<any> {
    return this.httpClient.get<any>(`${API.AccounttingSalary.GetMonthlyBonusById}/${id}`)
      .pipe(
        tap(() => {
          retry(3);
        })
      );
  }

  public deleteMonthlyBonus(id): Observable<any>{
    return this.httpClient.delete<any>(`${API.AccounttingSalary.DeleteMonthlyBonus}/${id}`)
      .pipe(
        tap(() => {
          retry(3);
        })
      );
  }

  public getWageOvertime(empId ,timeOT , dateOT): Observable<any> {
    return this.httpClient.get<any>(`${API.AccounttingSalary.GetWageOvertime}/${empId}/${timeOT}/${dateOT}`)
      .pipe(
        tap(() => {
          retry(3);
        })
      );
  }

  public getAllMonthlyOT(yearMonth, empId): Observable<any> {
    return this.httpClient.post<any>(`${API.AccounttingSalary.GetAllMonthlyOT}?yearMonth=${yearMonth}&empid=${empId}`,null)
      .pipe(
        tap(() => {
          retry(3);
        })
      );
  }

  public getMonthlyOTById(id ): Observable<any> {
    return this.httpClient.get<any>(`${API.AccounttingSalary.GetMonthlyOTById}/${id}`)
      .pipe(
        tap(() => {
          retry(3);
        })
      );
  }

  public deleteMonthlyOT(id): Observable<any>{
    return this.httpClient.delete<any>(`${API.AccounttingSalary.DeleteMonthlyOT}/${id}`)
      .pipe(
        tap(() => {
          retry(3);
        })
      );
  }

  public updateMonthlyOT(MonthlyOT): Observable<any> {
    return this.httpClient.put<any>(`${API.AccounttingSalary.UpdateMonthlyOT}`,MonthlyOT)
      .pipe(
        tap(() => {
          retry(3);
        })
      );
  }

  public InsertMonthlyOT(MonthlyOT): Observable<any> {
    return this.httpClient.post<any>(`${API.AccounttingSalary.InsertMonthlyOT}`,MonthlyOT)
      .pipe(
        tap(() => {
          retry(3);
        })
      );
  }

  public getProjectFinish(year, flagProject): Observable<any> {
    return this.httpClient.get<any>(`${API.AccounttingSalary.GetProjectFinish}/${year}/${flagProject}`).pipe(
      tap(() => {
        retry(3);
      }),
    );
  }

  public getTotalImageBasicMonth(): Observable<any> {
    return this.httpClient.get<any>(`${API.AccounttingSalary.GetTotalImageBasicMonth}`).pipe(
      tap(() => {
        retry(3);
      }),
    );
  }
}