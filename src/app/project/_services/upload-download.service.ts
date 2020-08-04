import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent, HttpResponse } from '@angular/common/http';
import { of, Observable } from 'rxjs';
import { API } from '../_config/api';

@Injectable()
export class UploadDownloadService {

  constructor(private httpClient: HttpClient) {
  }

  public downloadFile(file: string,flag: string,id: string): Observable<HttpEvent<Blob>> {
    if(flag == "0"){
        return this.httpClient.get(`${API.ProjectAttachmentFile.DOWNLOAD}?fileName=${file}&flag=${flag}&id=${id}`, {
            responseType:  'blob', observe: 'response' 
        })
    }
    else if(flag == "1"){
        return this.httpClient.get(`${API.ProjectMaintenanceAttachment.DOWNLOAD}?fileName=${file}&flag=${flag}&id=${id}`, {
            responseType:  'blob', observe: 'response' 
        })
    }
  }
}