import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, tap, catchError, retry } from 'rxjs/operators';
import { API } from '../_config/api';
import { ProjectMaintenance } from '../_models/project-maintenance';
import{MatTableResponse} from '../../_models/MatTableResponse'
import { ProjectMaitenanceAttachment } from '../_models/project-attachment';


@Injectable({
  providedIn: 'root'
})
export class ProjectMaintenanceService {
  constructor(
    private httpClient: HttpClient,
  ) {
  }
  public getProjectMaintenances(projectId: number): Observable<Array<ProjectMaintenance>> {
    return this.httpClient.get<Array<ProjectMaintenance>>(`${API.ProjectMaintenance.LIST}/${projectId}`)
      .pipe(
        tap(() => {
          retry(3);
        })
      );
  }
  public getProjectMaintenancesInfo(projectMaintenanceId: number): Observable<ProjectMaintenance> {
    return this.httpClient.get<ProjectMaintenance>(`${API.ProjectMaintenance.CRUD}/${projectMaintenanceId}`);
  }
  public createProjectMaintenances(projectMaintenance: ProjectMaintenance): Observable<ProjectMaintenance> {
    return this.httpClient.post<ProjectMaintenance>(`${API.ProjectMaintenance.CRUD}`, projectMaintenance)
      .pipe(
        tap(() => {
          retry(3);
        }),
      );
  }
  public editProjectMaintenances(projectMaintenance: ProjectMaintenance): Observable<ProjectMaintenance> {
    return this.httpClient.put<ProjectMaintenance>(`${API.ProjectMaintenance.CRUD}`, projectMaintenance)
      .pipe(
        tap(() => {
          retry(3);
        }),
      );
  }
  public deleteProjectMaintenances(id: number): Observable<any> {
    return this.httpClient.delete<any>(`${API.ProjectMaintenance.CRUD}/${id}`)
      .pipe(
        tap(() => {
          retry(3);
        }),
      );
  }
  public searchProjectMaintenances(paging: any, projectId: any) :Observable<MatTableResponse<ProjectMaintenance>>{
    return this.httpClient.post<MatTableResponse<ProjectMaintenance>>(`${API.ProjectMaintenance.LIST}/${projectId}`, paging).pipe(
      tap(() => {
        retry(3);
      }),
    );
  }
    //#region AttachmentFile

    public getAttachmentFile(id: number): Observable<Array<ProjectMaitenanceAttachment>>{
      return this.httpClient.get<Array<ProjectMaitenanceAttachment>>(`${API.ProjectMaintenanceAttachment.LIST}/${id}`)
      .pipe(
        tap(() => {
            retry(3);
        }),
      );
    }
  
    public insertAttachmentFile(attachment: ProjectMaitenanceAttachment): Observable<Array<ProjectMaitenanceAttachment>>{
      return this.httpClient.post<Array<ProjectMaitenanceAttachment>>(`${API.ProjectMaintenanceAttachment.CRUD}`, attachment)
      .pipe(
        tap(() => {
            retry(3);
        }),
      );
    }
    
  
    public downloadAttachmentFile(filename : string): Observable<any> {
      return this.httpClient.post<Blob>(`${API.ProjectMaintenanceAttachment.DOWNLOAD}`, filename, {
      
          headers: new HttpHeaders({
          'Content-Type': 'application/json'
          }),
          observe: 'response' as 'body',
          responseType: 'blob' as 'json' 
      })
      .pipe(
        tap(() => {
            retry(3);
        }),
      );
    }
  
   
  
    public uploadAttachmentFile(frmData : FormData,flag:string,id:string): Observable<any> {
      return this.httpClient.post<any>(`${API.ProjectMaintenanceAttachment.UPLOAD}`,frmData,{
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
      return this.httpClient.delete<void>(`${API.ProjectMaintenanceAttachment.DELETE}/${id}`,{
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
}
