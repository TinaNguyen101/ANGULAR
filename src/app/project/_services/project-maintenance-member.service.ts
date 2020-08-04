import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, tap, catchError, retry } from 'rxjs/operators';
import { API } from '../_config/api';
import { ProjectMaintenanceMember, Member, memberMaintenance } from '../_models/project-maintenance-member';
import { MatTableRequest } from 'src/app/_models/MatTableRequest';
import { MatTableResponse } from 'src/app/_models/MatTableResponse';
import { Employee } from '../_models/employee';

@Injectable({
  providedIn: 'root'
})
export class ProjectMaintenanceMemberService {
  constructor(
  private httpClient: HttpClient,) {}
  
  public getAllMaintenanceMember(id:Number): Observable<Array<memberMaintenance>>{
    return this.httpClient.get<Array<memberMaintenance>>(`${API.MaintenanceMember.LIST}/${id}`)
    .pipe(
      tap(() => {
          retry(3);
      })
    );
  }
  public getAllMaintananceEmployee():Observable<Array<Employee>>{
    return this.httpClient.get<Array<Employee>>(`${API.MaintenanceMember.ALLEMPLOYEE}`)
    .pipe(
        tap(() => {
            retry(3);
        })
    );
  }

  public getAllMaintananceEmployeeByDept(dept:number):Observable<Array<Employee>>{
    return this.httpClient.get<Array<Employee>>(`${API.MaintenanceMember.DEPTEMPLOYEE}/${dept}`)
    .pipe(
        tap(() => {
            retry(3);
        })
    );
  }

  public getMasterPosition(MstProjectPosition: string):Observable<any>{
    return this.httpClient.get<any>(`${API.MaintenanceMember.MstProjectPosition}/${MstProjectPosition}`)
    .pipe(
      tap(() => {
          retry(3);
      })
    );
  }
  public insertMaintenanceMember(Arr_member: Array<memberMaintenance>): Observable<any>{
    return this.httpClient.post<any>(`${API.MaintenanceMember.INSERT}`, Arr_member)
    .pipe(
      tap(() => {
          retry(3);
      })
    );
  }
  public deleteMaintenanceMember(id:Number){
    return this.httpClient.delete<void>(`${API.MaintenanceMember.DELETE}/${id}`)
    .pipe(
      tap(() => {
          retry(3);
      })
    );
  }
}
