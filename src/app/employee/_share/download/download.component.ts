import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { HttpEventType } from '@angular/common/http';
import { ProgressStatus, ProgressStatusEnum } from '../../_models/progress-status.model';
import { saveAs } from 'file-saver';
import { UploadDownloadService } from '../../_services/upload-download.service';

@Component({
  selector: 'app-download',
  templateUrl: './download.component.html',
  styleUrls: ['./download.component.scss']
})
export class DownloadComponent implements OnInit {
  @Input() public disabled: boolean;
  @Input() public fileName: string;
  @Input() public flag: string;
  @Input() public id: string;
  @Input() public isEnable: boolean;
  @Output() public downloadStatus: EventEmitter<ProgressStatus>;
  constructor(private service: UploadDownloadService) {
    this.downloadStatus = new EventEmitter<ProgressStatus>();
  }


  ngOnInit() {
  }
  // public download() {
  //   this.downloadStatus.emit( {status: ProgressStatusEnum.START});
  //   this.service.downloadFile(this.fileName,this.flag,this.id).subscribe(
  //     data => {
  //       switch (data.type) {
  //         case HttpEventType.DownloadProgress:
  //           this.downloadStatus.emit( {status: ProgressStatusEnum.IN_PROGRESS, percentage: Math.round((data.loaded / data.total) * 100)});
  //           break;
  //         case HttpEventType.Response:
  //           this.downloadStatus.emit( {status: ProgressStatusEnum.COMPLETE});
  //           const downloadedFile = new Blob([data.body], { type: data.body.type });
  //           const a = document.createElement('a');
  //           a.setAttribute('style', 'display:none;');
  //           document.body.appendChild(a);
  //           a.download = this.fileName;
  //           a.href = URL.createObjectURL(downloadedFile);
  //           a.target = '_blank';
  //           a.click();
  //           document.body.removeChild(a);
  //           break;
  //       }
  //     },
  //     error => {
  //       this.downloadStatus.emit( {status: ProgressStatusEnum.ERROR});
  //     }
  //   );
  // }

  public download() {
    this.downloadStatus.emit( {status: ProgressStatusEnum.START});
    //window.open('rhttp://192.168.1.5:1115/api/AttachmentFile/Download2Get?fileName=Book1.xlsx&flag=0&id=144') 
    this.service.downloadFile(this.fileName,this.flag,this.id).subscribe(
      data => {
        switch (data.type) {
          case HttpEventType.DownloadProgress:
            this.downloadStatus.emit( {
              status: ProgressStatusEnum.IN_PROGRESS, 
              percentage: Math.round((data.loaded / data.total) * 100),
              fileName:this.fileName
            },);
            break;
          case HttpEventType.Response:
            this.downloadStatus.emit( {status: ProgressStatusEnum.COMPLETE});
            const downloadedFile = new Blob([data.body], { type: data.body.type });

            saveAs(downloadedFile,this.fileName)
            break;
        }
      },
      error => {
        this.downloadStatus.emit( {status: ProgressStatusEnum.ERROR,fileName:this.fileName});
      }
    );
  }
}
