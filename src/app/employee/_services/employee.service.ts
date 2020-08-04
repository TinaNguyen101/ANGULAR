import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpParams, HttpHeaders, HttpEvent } from '@angular/common/http';
import { map, tap, catchError, retry } from 'rxjs/operators';
import { API } from '../_config/api';
import { Employee } from '../_models/employee';
import { AnnualRatingFactor } from '../_models/annualRatingFactor';
import { MatTableRequest } from 'src/app/_models/MatTableRequest';
import { MatTableResponse } from 'src/app/_models/MatTableResponse';
import { API_DOMAIN } from 'src/app/_configs/api';
import { EmployeeAttachment } from '../_models/employee-attachment';
import { AnnualEvaluationResult } from '../_models/annualEvaluationResult';
import { AnnualEvaluationKPIResult } from '../_models/annualKPIResult';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  constructor(
    private httpClient: HttpClient,
  ) {
  }
  public getEmployeeInfo(id: number): Observable<Employee> {
    return this.httpClient.get<Employee>(`${API.Employee.CRUD}/${id}`)
      .pipe(
        tap(() => {
          retry(3);
        }),
      );
  }
  public getAllEmployee(matTableRequest: any): Observable<MatTableResponse<Employee>> {
    return this.httpClient.post<MatTableResponse<Employee>>(`${API.Employee.LIST}`, matTableRequest)
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
  public getAllYearAnnualRatingFactor(): Observable<any> {
    return this.httpClient.get<any>(`${API.AnnualRatingFactor.YEAR}`)
      .pipe(
        tap(() => {
          retry(3);
        })
      );
  }
  public UpdateAnnualRatingFactor(matTableRequest: any): Observable<any> {
    return this.httpClient.post<MatTableResponse<AnnualRatingFactor>>(`${API.AnnualRatingFactor.YEAR}`, matTableRequest)
      .pipe(
        tap(() => {
          retry(3);
        })
      );
  }
  public getAllAnnualRatingFactor(year: number): Observable<any[]> {
    return this.httpClient.get<any[]>(`${API.AnnualRatingFactor.LIST}/?year=${year}`)
      .pipe(
        tap(() => {
          retry(3);
        })
      );
  }

  public getAllAnnualLeavePaid(year: string): Observable<any> {
    return this.httpClient.get(`${API.Employee.AnnualLeavePaid}${year}`).pipe(
      tap(
        () => {
          retry(3);
        }
      )
    )
  }
  public getAllDayOff(yearMonth): Observable<any> {
    return this.httpClient.get(`${API.DayOff.AllDayOff}${yearMonth}`).pipe(
      tap(
        () => {
          retry(3);
        }
      )
    )
  }
  public downloadFileAnnualLeavePaid(year: string): Observable<HttpEvent<Blob>> {
    return this.httpClient.get(`${API.Employee.DownloadAnnualLeavePaid}${year}`, {
      responseType: 'blob',
      observe: 'response'
    })
  }
  public getAllApproved(): Observable<any> {
    return this.httpClient.get(API.Employee.Approved).pipe(
      tap(
        () => {
          retry(3);
        }
      )
    )
  }
  public updateDayOf(dayOff: any): Observable<any> {
    return this.httpClient.put(API.DayOff.UpdateDayOff, dayOff)
      .pipe(
        tap(() => {
          retry(3);
        })
      );
  }

  public addDayOf(dayOff: any): Observable<any> {
    return this.httpClient.post(API.DayOff.UpdateDayOff, dayOff)
      .pipe(
        tap(() => {
          retry(3);
        })
      );
  }
  //employee-info-basic
  public getEmployeeById(id: number): Observable<Employee> {
    return this.httpClient.get<Employee>(`${API.Employee.EmployeeById}/${id}`)
      .pipe(
        tap(() => {
          retry(3);
        }),
      );
  }
  public createEmployee(employee: Employee): Observable<Employee> {
    return this.httpClient.post<Employee>(`${API.Employee.Create_UpdateEmpployee}`, employee)
      .pipe(
        tap(() => {
          retry(3);
        }),
      );
  }
  public updateEmployee(employee: Employee): Observable<Employee> {
    return this.httpClient.put<Employee>(`${API.Employee.Create_UpdateEmpployee}`, employee)
      .pipe(
        tap(() => {
          retry(3);
        }),
      );
  }
  

  public deleteEmployee(id: number) {
    return this.httpClient.delete<any>(`${API.Employee.CRUD}/${id}`)
      .pipe(
        tap(() => {
          retry(3);
        }),
      );
  }

  public addAnnualLeavePaid(year: any, createId): Observable<any> {
    return this.httpClient.post(`${API.AnnualRatingFactor.AddAnnualLeavePaid}${year}&createId=${createId}`, null)
      .pipe(
        tap(() => {
          retry(3);
        })
      );
  }
  public deleteDayOf(id): Observable<any> {
    return this.httpClient.delete(API.DayOff.DeleteDayOff + id)
      .pipe(
        tap(() => {
          retry(3);
        })
      );
  }
  public GetAllBonusForEmpByYear(year, empId): Observable<any> {
    return this.httpClient.get<Employee>(`${API.Bonus.GetAllBouusForEmpByYear}?year=${year}&empId=${empId}`)
      .pipe(
        tap(() => {
          retry(3);
        }),
      );
  }
  public getProjectFinish(year, flagProject): Observable<any> {
    return this.httpClient.get<any>(`${API.Bonus.GetProjectFinish}/${year}/${flagProject}`).pipe(
      tap(() => {
        retry(3);
      }),
    );
  }

  public getBonus(day, empId, year): Observable<any> {
    return this.httpClient.get<any>(`${API.Bonus.GetBonus}?day=${day}&empId=${empId}&year=${year}`).pipe(
      tap(() => {
        retry(3);
      }),
    );
  }

  public getBonusLeader(proId, isProject, rateYen, rateUSD, empId, year): Observable<any> {
    return this.httpClient.get<any>(`${API.Bonus.GetBonusLeader}?proId=${proId}&isProject=${isProject + ""}&rateYen=${rateYen}&rateUSD=${rateUSD}&empId=${empId}&year=${year}`).pipe(
      tap(() => {
        retry(3);
      }),
    );
  }

  public insertBonus(bonus): Observable<any> {
    return this.httpClient.post<any>(`${API.Bonus.Main}`, bonus)
      .pipe(
        tap(() => {
          retry(3);
        }),
      );
  }

  public updateBonus(bonus): Observable<any> {
    return this.httpClient.put<any>(`${API.Bonus.Main}`, bonus)
      .pipe(
        tap(() => {
          retry(3);
        }),
      );
  }

  public deleteBonus(bonusId): Observable<any> {
    return this.httpClient.delete(`${API.Bonus.Main}/${bonusId}`)
      .pipe(
        tap(() => {
          retry(3);
        }),
      );
  }

  public getAnnualRatingFactor(year, empId): Observable<any> {
    return this.httpClient.get<any>(`${API.Bonus.GetAnnualRatingFactor}?year=${year}&empId=${empId}`).pipe(
      tap(() => {
        retry(3);
      }),
    );
  }


  public uploadEmpImage(empId: number, frmData: FormData): Observable<any> {
    return this.httpClient.post<any>(`${API.Employee.UploadEmpImage}?empId=${empId}`, frmData)
      .pipe(
        tap(() => {
          retry(3);
        }),
      );
  }

  public getTop1Salary(empId, year): Observable<any>{
    return this.httpClient.get<any>(`${API.Bonus.GetTop1Salary}/${empId}/${year}`).pipe(
      tap(() => {
        retry(3);
      }),
    );
  }

  public CheckYearAnnualLeavePaid(year): Observable<any>{
    return this.httpClient.get<any>(`${API.Bonus.CheckYearAnnualLeavePaid}?year=${year}`).pipe(
      tap(() => {
        retry(3);
      }),
    );
  }

  public checkExistDayOff(dateTime,timeOff, empId,idDayoff): Observable<any>{
    return this.httpClient.get<any>(`${API.DayOff.CheckExistDayoff}?dayOff=${dateTime}&TimeOff=${timeOff}&empId=${empId}&idDayoff=${idDayoff}`).pipe(
      tap(() => {
        retry(3);
      }),
    );
  }


  public getDayAndBonusMember(empId, year,url,proId): Observable<any> {
    return this.httpClient.get<any>(`${API.Bonus.GetDayAndBonusNember}?empId=${empId}&year=${year}&${url}=${proId}`).pipe(
      tap(() => {
        retry(3);
      }),
    );

  }

  public autoCreateBonus(empId, year, isOverwrite, loginId, rateYen, rateUSD): Observable<any> {
    return this.httpClient.get<any>(`${API.Bonus.AutoCreate}?empId=${empId}&year=${year}&isOverwrite=${isOverwrite}&loginId=${loginId}&rateYen=${rateYen}&rateUSD=${rateUSD}`).pipe(
      tap(() => {
        retry(3);
      })
    );
  }

  //#region employee-attach-file
  public getAttachmentFile(id: number): Observable<Array<EmployeeAttachment>> {
    return this.httpClient.get<Array<EmployeeAttachment>>(`${API.EmployeeAttachmentFile.LIST}/${id}`)
      .pipe(
        tap(() => {
          retry(3);
        }),
      );
  }
  public uploadAttachmentFile(frmData: FormData, flag: string, id: string): Observable<any> {
    return this.httpClient.post<any>(`${API.EmployeeAttachmentFile.UPLOAD}`, frmData, {
      reportProgress: true,
      observe: 'events',
      headers: {
        flag: flag,
        id: id
      }
    })
      .pipe(
        tap(() => {
          retry(3);
        }),
      );
  }

  public insertAttachmentFile(attachment: EmployeeAttachment): Observable<Array<EmployeeAttachment>> {
    return this.httpClient.post<Array<EmployeeAttachment>>(`${API.EmployeeAttachmentFile.CRUD}`, attachment)
      .pipe(
        tap(() => {
          retry(3);
        }),
      );
  }
  public deleteAttachmentFile(id: number, flag: string, idPr: string) {
    return this.httpClient.delete<void>(`${API.EmployeeAttachmentFile.DELETE}/${id}`, {
      headers: {
        flag: flag,
        idPr: idPr
      }
    })
      .pipe(
        tap(() => {
          retry(3);
        }),
      );
  }
  
  //#endregion


  //Get List Evalutor
  public GetListEvaluator(year): Observable<any> {
    return this.httpClient.get<any>(`${API.KPIAnnual.ListEvaluator}/${year}`)
      .pipe(
        tap(() => {
          retry(3);
        }),
      );
  }
  //Get List EvaluationResult
  public GetListEvaluationResult(year, evaluatorId, EmpId): Observable<any> {
    return this.httpClient.get<any>(`${API.AnnualEvaluationResult.ListEvalutionResult}?year=${year}&evaluatorId=${evaluatorId}&EmpId=${EmpId}`)
      .pipe(
        tap(() => {
          retry(3);
        }),
      );
  }
  //Update EvaluationResult
  public updateEvaluationResult(evaluationResult: any): Observable<any> {
    return this.httpClient.post<any>(`${API.AnnualEvaluationResult.UpdateEvaluationResult}`, evaluationResult)
      .pipe(
        tap(() => {
          retry(3);
        })
      );
  }
  //Get MstKPIDetail By KPIID
  public getAnnualKPIResult(year, evaluatorId, EmpId): Observable<any> {

    return this.httpClient.get<any>(`${API.AnnualKPIResult.ListAnnualKPIResult}?year=${year}&evaluatorId=${evaluatorId}&EmpId=${EmpId}`)
      .pipe(
        tap(() => {
          retry(3);
        }),
      );
  }
  //Update AnnualKPI
  public updateAnnualKPIResult(matTableRequest: any): Observable<any> {
    return this.httpClient.post<MatTableResponse<AnnualEvaluationKPIResult>>(`${API.AnnualKPIResult.UpdateAnnualKPIResult}`, matTableRequest)
      .pipe(
        tap(() => {
          retry(3);
        })
      );
  }
  // Get AnnualReview
  public getAnnualReview(year, EmpId): Observable<any> {
    return this.httpClient.get<any>(`${API.AnnualReview.ListAnnualReview}?year=${year}&EmpId=${EmpId}`)
      .pipe(
        tap(() => {
          retry(3);
        }),
      );
  }
  //Update AnnualReview
  public updateAnnualReview(annualReview: any): Observable<any> {
    return this.httpClient.post<any>(`${API.AnnualReview.UpdateAnnualReview}`, annualReview)
      .pipe(
        tap(() => {
          retry(3);
        })
      );
  }

}
