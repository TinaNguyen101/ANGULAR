import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, tap, catchError, retry } from 'rxjs/operators';
import { API } from '../_config/api';
import { Project } from '../_models/project';
import { MatTableRequest } from 'src/app/_models/MatTableRequest';
import { MatTableResponse } from 'src/app/_models/MatTableResponse';
import { ProjectAttachment } from '../_models/project-attachment';
//import { SSL_OP_SINGLE_DH_USE } from 'constants';


@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  constructor(
    private httpClient: HttpClient,
  ) {
  }
  
  public getProjects(matTableRequest: MatTableRequest): Observable<MatTableResponse<Project>> {
    return this.httpClient.post<MatTableResponse<Project>>(`${API.Project.LIST}`, matTableRequest)
      .pipe(
        tap(() => {
          retry(3);
        })
      );
  }
  public getProjectInfo(id: number): Observable<Project> {
    return this.httpClient.get<Project>(`${API.Project.CRUD}/${id}`, )
      .pipe(
        tap(() => {
          retry(3);
        }),
      );
  }
  public getMstByName(name : string): Observable<any> {
    return this.httpClient.get<any>(`${API.MasterData.GET}/${name}`)
      .pipe(
        tap(() => {
          retry(3);
        })
      );
  }
  public getCustomerName(): Observable<any> {
    return this.httpClient.get<any>(`${API.Customer.LIST}`)
      .pipe(
        tap(() => {
          retry(3);
        })
      );
  }
  
  public createProject(project: Project): Observable<Project> {
    return this.httpClient.post<Project>(`${API.Project.CRUD}`, project)
      .pipe(
        tap(() => {
          retry(3);
        }),
      );
  }

  public updateProject(project: Project): Observable<Project> {
    return this.httpClient.put<Project>(`${API.Project.CRUD}`, project)
      .pipe(
        tap(() => {
          retry(3);
        }),
      );
  }

  public deleteProject(id: number) {
    return this.httpClient.delete<any>(`${API.Project.CRUD}/${id}` )
      .pipe(
        tap(() => {
          retry(3);
        }),
      );
  }
 
  //#region AttachmentFile

  public getAttachmentFile(id: number): Observable<Array<ProjectAttachment>>{
    return this.httpClient.get<Array<ProjectAttachment>>(`${API.ProjectAttachmentFile.LIST}/${id}`)
    .pipe(
      tap(() => {
          retry(3);
      }),
    );
  }

  public insertAttachmentFile(attachment: ProjectAttachment): Observable<Array<ProjectAttachment>>{
    return this.httpClient.post<Array<ProjectAttachment>>(`${API.ProjectAttachmentFile.CRUD}`, attachment)
    .pipe(
      tap(() => {
          retry(3);
      }),
    );
  }
 

 

  public uploadAttachmentFile(frmData : FormData,flag:string,id:string): Observable<any> {
    return this.httpClient.post<any>(`${API.ProjectAttachmentFile.UPLOAD}`,frmData,{
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
  public deleteAttachmentFile(id: number,flag:string,idPr:string){
    return this.httpClient.delete<void>(`${API.ProjectAttachmentFile.DELETE}/${id}`,{
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

  public getMasterData(name: string): Observable<any>{
    return this.httpClient.get<any>(`${API.MasterData.GET}/${name}`)
    .pipe(
      tap(() => {
          retry(3);
      }),
  );
  }
 
}
