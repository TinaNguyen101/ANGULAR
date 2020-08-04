import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, tap, catchError, retry } from 'rxjs/operators';
import { API } from '../_config/api';
import { MatTableRequest } from 'src/app/_models/MatTableRequest';
import { MatTableResponse } from 'src/app/_models/MatTableResponse';
import { TaskProject } from '../_models/task';

//import { SSL_OP_SINGLE_DH_USE } from 'constants';


@Injectable({
  providedIn: 'root'
})
export class TaskProjectService {
  constructor(
    private httpClient: HttpClient,
  ) {
  }
  
//#region TaskProject
public getTaskProject(matTableRequest: MatTableRequest): Observable<MatTableResponse<TaskProject>> {
    return this.httpClient.post<MatTableResponse<TaskProject>>(`${API.Task.LIST}`, matTableRequest)
      .pipe(
        tap(() => {
          retry(3);
        })
      );
  }
  public updateTask(task: TaskProject): Observable<TaskProject> {
    return this.httpClient.put<TaskProject>(`${API.Task.UPDATE}`, task)
      .pipe(
        tap(() => {
          retry(3);
        }),
      );
  }
  public createTask(task: TaskProject): Observable<TaskProject> {
    return this.httpClient.post<TaskProject>(`${API.Task.ADD}`, task)
      .pipe(
        tap(() => {
          retry(3);
        }),
      );
  }
  public getTaskById(id :number): Observable<TaskProject> {
    return this.httpClient.get<TaskProject>(`${API.Task.GET}/${id}`)
      .pipe(
        tap(() => {
          retry(3);
        })
      );
  }
  public deleteTask(id: number) {
    return this.httpClient.delete<any>(`${API.Task.DELETETASK}/${id}` )
      .pipe(
        tap(() => {
          retry(3);
        })
      );
  }
  public getEndDateById(start :string,duration:number,empId :number) 
  {  
    return this.httpClient.get(`${API.Task.GET_ENDDATE}?startdate=${start}&duration=${duration}&empId=${empId}`)
      .pipe(
        tap(() => {
          retry(3);
        })
      );
  }
  public getEndDate(start :string,duration:number) 
  {  
    return this.httpClient.get(`${API.Task.GET_ENDDATE}?startdate=${start}&duration=${duration}`)
      .pipe(
        tap(() => {
          retry(3);
        })
      );
  }
  //#region Maintenance Task
  public getTaskMaintenance(matTableRequest: MatTableRequest): Observable<MatTableResponse<TaskProject>> {
    return this.httpClient.post<MatTableResponse<TaskProject>>(`${API.Task.MaintenanceTask}`, matTableRequest)
      .pipe(
        tap(() => {
          retry(3);
        })
      );
  }
  public createTaskMaintenance(task: TaskProject): Observable<TaskProject> {
    return this.httpClient.post<TaskProject>(`${API.Task.ADD_MaintenanceTask}`, task)
      .pipe(
        tap(() => {
          retry(3);
        }),
      );
  }
  public updateTaskMaintenance(task: TaskProject): Observable<TaskProject> {
    return this.httpClient.put<TaskProject>(`${API.Task.UPDATE}`, task)
      .pipe(
        tap(() => {
          retry(3);
        }),
      );
  }
  }