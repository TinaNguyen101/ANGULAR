import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, tap, catchError, retry } from 'rxjs/operators';
import { API } from '../_config/api';
import { ProjectMember, Member } from '../_models/project-member';
import { MatTableRequest } from 'src/app/_models/MatTableRequest';
import { MatTableResponse } from 'src/app/_models/MatTableResponse';

import {Employee} from '../_models/employee'

@Injectable({
  providedIn: 'root'
})
export class ProjectMemberService {
  constructor(
  private httpClient: HttpClient,
) {
}
  public getAllMember(id: number): Observable<Array<ProjectMember>> {
    return this.httpClient.get<Array<ProjectMember>>(`${API.ProjectMember.LIST}/${id}`)
    .pipe(
        tap(() => {
            retry(3);
        })
    );
  }
  public getAllEmployee():Observable<Array<Employee>>{
    return this.httpClient.get<Array<Employee>>(`${API.ProjectMember.ALLMEMBER}`)
    .pipe(
        tap(() => {
            retry(3);
        })
    );
  }

  public getEmployeeByDept(dept:number):Observable<Array<Employee>>{
    return this.httpClient.get<Array<Employee>>(`${API.ProjectMember.DEPTMEMBER}/${dept}`)
    .pipe(
        tap(() => {
            retry(3);
        })
    );
  }

  //#ProjectMemberRegion
  public removeMember(id:number): Observable<any>{
    return this.httpClient.delete<any>(`${API.ProjectMember.GET}/${id}`)
    .pipe(
      tap(() => {
          retry(3);
      }),
  );
}
public addMember (arr: Array<Member>): Observable<any>{
  return this.httpClient.post<any>(`${API.ProjectMember.ADD}`,arr)
  .pipe(
    tap(() => {
        retry(3);
    }),
);}
}