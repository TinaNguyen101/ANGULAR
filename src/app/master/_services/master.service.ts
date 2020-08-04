import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { HttpClient, HttpParams, HttpHeaders, HttpEvent } from '@angular/common/http';
import { map, tap, catchError, retry } from 'rxjs/operators';
import { API } from '../_config/api';
import { MatTableRequest } from 'src/app/_models/MatTableRequest';
import { MatTableResponse } from 'src/app/_models/MatTableResponse';
import { API_DOMAIN } from 'src/app/_configs/api';
import { Customer } from '../_models/Customer';
import { Holiday } from '../_models/Holiday';

@Injectable({
  providedIn: 'root'
})
export class MasterService {
  constructor(
    private httpClient: HttpClient,
  ) {
  }

  private emitToggleLeftMenu = new Subject<boolean>();
  // Observable string streams
  changeEmittedToggleLeftMenu = this.emitToggleLeftMenu.asObservable();
  // Service message commands
  emitChangeToggleLeftMenu(value: boolean) {
      this.emitToggleLeftMenu.next(value);
  }




  public getAllCustomer(matTableRequest : MatTableRequest): Observable<any> {
    return this.httpClient.post<any>(`${API.MASTERLIST.LIST}`,matTableRequest)
      .pipe(
        tap(() => {
          retry(3);
        }),
      );
  }

  //master-customer-basic-info
  public getCustomerById(id: number): Observable<Customer> {
    return this.httpClient.get<Customer>(`${API.MASTERLIST.LIST}/${id}`, )
      .pipe(
        tap(() => {
          retry(3);
        }),
      );
  }

  //#region Master-annual-holiday
  public getAllAnnualHoliday(year:number): Observable<any[]> {
    return this.httpClient.post<any[]>(`${API.MASTER_ANNUALHOLIDAY.LIST}/?year=${year}`,null)
      .pipe(
        tap(() => {
          retry(3);
        }),
      );
  }

  public createCustomer(customer: Customer): Observable<Customer> {
    return this.httpClient.post<Customer>(`${API.MASTERLIST.CRUD}`, customer)
      .pipe(
        tap(() => {
          retry(3);
        }),
      );
  }
  
  public getAnnualHolidayById(id: number): Observable<any> {
    return this.httpClient.get<any>(`${API.MASTER_ANNUALHOLIDAY.CRUD}/${id}`)
      .pipe(
        tap(() => {
          retry(3);
        }),
      );
  }

  public updateCustomer(customer: Customer): Observable<Customer> {
    return this.httpClient.put<Customer>(`${API.MASTERLIST.CRUD}`, customer)
      .pipe(
        tap(() => {
          retry(3);
        }),
      );
  }
  
  public deleteAnnualHoliday(id: number) {
    return this.httpClient.delete<any>(`${API.MASTER_ANNUALHOLIDAY.CRUD}/${id}` )
      .pipe(
        tap(() => {
          retry(3);
        }),
      );
  }

  public deleteCustomer(id: number) {
    return this.httpClient.delete<any>(`${API.MASTERLIST.CRUD}/${id}` )
      .pipe(
        tap(() => {
          retry(3);
        }),
      );
  }
  
  public insertAnnualHoliday(holiday: Holiday): Observable<Holiday> {
    return this.httpClient.post<Holiday>(`${API.MASTER_ANNUALHOLIDAY.CRUD}`, holiday)
      .pipe(
        tap(() => {
          retry(3);
        }),
      );
  }
  
  public updateAnnualHoliday(holiday: Holiday): Observable<Holiday> {
    return this.httpClient.put<Holiday>(`${API.MASTER_ANNUALHOLIDAY.CRUD}`, holiday)
      .pipe(
        tap(() => {
          retry(3);
        }),
      );
  }
  //Evaluator
  public getListEvaluator(searchYear): Observable<any> {
    return this.httpClient.get<any>(`${API.EVALUATOR.LIST}?year=${searchYear}`)
      .pipe(
        tap(() => {
          retry(3);
        }),
      );
  }
  public insertUpdateDetele_ListEvaluator(Evaluator): Observable<any> {
    return this.httpClient.post<any>(`${API.EVALUATOR.CRUD}`,Evaluator)
      .pipe(
        tap(() => {
          retry(3);
        }),
      );
  }
}
