import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient, HttpRequest ,HttpEventType, HttpHeaders, HttpResponse  } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EmployeeService } from '../../_services/employee.service';
 import { EmployeeAttachment } from '../../_models/employee-attachment';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import { MatTableDataSource,MatIconModule } from '@angular/material';
import { API } from '../../_config/api';
import { Router,ActivatedRoute,Params } from '@angular/router';
import { count, map } from 'rxjs/operators';
import { BrowserModule } from '@angular/platform-browser';
import { saveAs } from 'file-saver';
import { ProgressStatus, ProgressStatusEnum } from '../../_models/progress-status.model';
@Component({
  selector: 'app-employee-info-attachfile',
  templateUrl: './employee-info-attachfile.component.html',
  styleUrls: ['./employee-info-attachfile.component.scss']
})
export class EmployeeInfoAttachfileComponent implements OnInit {

  @ViewChild('temp', {read: ElementRef,static:false}) temp: ElementRef;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  duplicate: boolean;
  submitted: boolean;
  error: string;
  errorGlobal: string;
  uploadPercentProcess = 0;
  flagError:boolean = false; 
  dataSource: MatTableDataSource<EmployeeAttachment>;
  displayedColumns: string[] = ['Action','AttachmentFileName', 'CreatedDate'];
   arr_PAData: Array<EmployeeAttachment>= new Array<EmployeeAttachment>();
   arr_PACurrent: Array<EmployeeAttachment> = new Array<EmployeeAttachment>();
   arr_PANotUpload: Array<EmployeeAttachment> = new Array<EmployeeAttachment>();
   arr_PANotUploadFile: File[]=[];
   arr_PAError:  [string, string][]=[];
   arr_PAProcess: Array<string> = new Array<string>();
  selectedFile: File[]=[];
  mode = 'determinate';
  mobile:boolean=false;
  count = 0;
  countIndex =0;
  status;
employeeId :any;
  public showDownloadError: boolean;
  public showProgress: boolean;
  public percentage: number=0;
  private route :ActivatedRoute;

  object = JSON.parse(localStorage.getItem('authUser'));
  idUserLogin = this.object.EmpId;
  
  constructor(private http: HttpClient, 
              private employeeService: EmployeeService,
              private router: Router,
              private activeRoute :ActivatedRoute,
              private browserModule : BrowserModule) { 

  }

  ngOnInit() {
    this.activeRoute.parent.params.subscribe((params: Params) => {
    this.employeeId = params.id; 
    this.LoadData();

  });              
    this.duplicate = false;
    if (window.screen.width <= 1025) { 
      this.mobile = true;
    }
  }
  onResize() {
    if (window.screen.width <= 1025) { // 768px portrait
      this.mobile = true;
    }
    else{
      this.mobile = false;
    }
  }
  //check file existion
  checkIosExcelWordHideDL(fileName: string)
  {
    if (window.screen.width <= 1025) { // 768px portrait
      let hideDL  = fileName.lastIndexOf(".xlsx");
      if(hideDL > -1){
        return true;
      }
      hideDL  = fileName.lastIndexOf(".xls");
      if(hideDL > -1){
        return true;
      }
      hideDL  = fileName.lastIndexOf(".doc");
      if(hideDL > -1){
        return true;
      }
      hideDL  = fileName.lastIndexOf(".docx");
      if(hideDL > -1){
        return true;
      }
      return false;
   }
    else{
      return false;
    }
  }
  //get all file in API
  LoadData(){
    this.employeeService.getAttachmentFile(this.employeeId).subscribe(res => {
      this.arr_PAData =[];
      this.arr_PAData  = Object.assign([], res);
      this.arr_PACurrent =[];
      this.arr_PACurrent  = Object.assign([], res);
      this.count = res.length;
      this.arr_PAData.forEach(element => {
        element.iosExcelWordHideDL =  this.checkIosExcelWordHideDL(element.AttachmentFileName);
      });
      this.dataSource = new MatTableDataSource((this.arr_PAData));
      setTimeout(() => {this.dataSource.sort = this.sort;});
    }); 
  }
  LoadDataAndSelected(){
    this.employeeService.getAttachmentFile(this.employeeId).subscribe(res => {
      this.arr_PAData =[];
      this.arr_PAData  = Object.assign([], res);
      this.arr_PACurrent =[];
      this.arr_PACurrent  = Object.assign([], res);
      if (this.arr_PANotUpload.length>0) {   
        this.arr_PACurrent.unshift(...this.arr_PANotUpload);
      }
      this.count = res.length;
      this.arr_PACurrent.forEach(element => {
        element.iosExcelWordHideDL =  this.checkIosExcelWordHideDL(element.AttachmentFileName);
      });
      this.dataSource = new MatTableDataSource((this.arr_PACurrent));
      if(this.arr_PANotUpload.length==0)
      {
        setTimeout(() => {this.dataSource.sort = this.sort;});
      }
    }); 
  }

  //selected file 
  onFileSelected(event) {   
    this.duplicate = false;
    this.uploadPercentProcess = 0;
    this.selectedFile =  Array.from(event.target.files);     
    if (event.target.files && event.target.files[0]) {     
      for (let i = 0; i < this.selectedFile.length; i++) {   
          let empAttachmentFile = new EmployeeAttachment();
          empAttachmentFile.AttachmentFileName = event.target.files[i].name;
          empAttachmentFile.EmpId = this.employeeId;     
          empAttachmentFile.CreatedId = parseInt(this.idUserLogin);
          if(!this.arr_PACurrent.some(e => e.AttachmentFileName === empAttachmentFile.AttachmentFileName))
          {
            this.arr_PACurrent.unshift(empAttachmentFile); 
            this.arr_PANotUpload.unshift(empAttachmentFile); 
            this.arr_PANotUploadFile.unshift(this.selectedFile[i]);
          }
          else{
            this.duplicate = true;
          }          
    }        
    this.LoadDataAndSelected() ;      
  }     
}

//check error attach file
checkShowError(fileName){
  if(this.arr_PAError){
    let temp =this.arr_PAError.find(x=>x[0] == fileName)
    if(temp){
      this.error = temp[1];
      return true; 
    }
  }
  return false;
}

checkRunProcess(fileName){
  if(this.arr_PAProcess.some(e => e == fileName)){
    return true; 
  }
  return false;
}

//execute item error
removeItemError(key:string){
  const index =  this.arr_PAError.findIndex(x=>x[0]==key, 0);
  if (index > -1) {
    this.arr_PAError.splice(index, 1);
  }
}

addItemError(error:string,fileName:string){
  const index =  this.arr_PAError.findIndex(x=>x[0]==fileName, 0);
  if (index <= -1) {
    this.arr_PAError.push(
      [
        fileName,
        error
      ]);
  }
}

removeArr(arr:Array<EmployeeAttachment>, key:string){
  let index =  arr.findIndex(item => item.AttachmentFileName == key);
  if (index > -1) {
    arr.splice(index, 1);
  }
}

//Upload single file
onUpLoad_Single(fileName:string){  
  this.duplicate = false;
  this.arr_PAProcess.push(fileName);
  this.uploadPercentProcess = 0;
  if (this.arr_PANotUpload.length>0) {   
    if(!this.arr_PAData.some(e => e.AttachmentFileName == fileName)){
      let elementUpload =  this.arr_PANotUpload.find(item => item.AttachmentFileName == fileName);
      let fileUpload = this.arr_PANotUploadFile.find(f=>f.name == fileName);
      let frmData = new FormData();
      frmData.append('files',fileUpload,fileUpload.name);
      this.employeeService.uploadAttachmentFile(frmData,"0",this.employeeId).subscribe(event => {
        if (event.type === HttpEventType.UploadProgress) {
          this.uploadPercentProcess = Math.round(100 * event.loaded / event.total);
        }
        else if (event.type === HttpEventType.Response) {         
          //insert PA
          this.employeeService.insertAttachmentFile(elementUpload).subscribe(data => {
            this.arr_PAData.unshift(elementUpload);
            this.removeArr(this.arr_PANotUpload,fileName);
            this.removeItemError(fileName);
            this.LoadDataAndSelected();
          },error => {
            this.addItemError(String(error),fileName);
          });
        }
      },error => {
        this.addItemError(String(error),fileName);
      });         
    }else{
      this.addItemError("duplicate",fileName);
    }
  }
}

 //UpLoad all file selected
 onUpLoad(){   
  this.duplicate = false;
  let flagError:boolean = false; 
  let arr_PAUploaded: Array<EmployeeAttachment> = new Array<EmployeeAttachment>();       
  if (this.arr_PANotUpload.length>0) { 
    this.arr_PANotUpload.forEach(element => {
      this.arr_PAProcess.push(element.AttachmentFileName);
      if(!this.arr_PAData.some(e => e.AttachmentFileName === element.AttachmentFileName)){
        this.uploadPercentProcess = 0;
        let fileUpload = this.arr_PANotUploadFile.find(f=>f.name == element.AttachmentFileName);
        let frmData = new FormData();
        frmData.append('file',fileUpload,fileUpload.name);
        this.employeeService.uploadAttachmentFile(frmData,"0",this.employeeId).subscribe(event => {
              if (event.type === HttpEventType.UploadProgress) {
                this.uploadPercentProcess = Math.round(100 * event.loaded / event.total);
              }
              else if (event.type === HttpEventType.Response) {                
                //insert PA
                this.employeeService.insertAttachmentFile(element).subscribe(data => {
                  this.arr_PAData.unshift(element);
                  arr_PAUploaded.unshift(element);
                  this.removeItemError(element.AttachmentFileName);
                  arr_PAUploaded.forEach(element => {
                    this.removeArr(this.arr_PANotUpload,element.AttachmentFileName);
                  });
                  this.LoadDataAndSelected();
                },error => {
                  this.addItemError(String(error),element.AttachmentFileName);
                  flagError = true;
                });
              }
        },error => {
          this.addItemError(String(error),element.AttachmentFileName);
          flagError = true;
        });      
      }   
      else{
        this.addItemError("duplicate",element.AttachmentFileName);
      }
    });
  }
}  

onClickOpenFile(event){
  event.srcElement.value = '';
}
  
//Cancel Single File
onCancel_Single(fileName:string){
  this.duplicate = false;
  this.removeArr(this.arr_PANotUpload,fileName);
  this.LoadDataAndSelected();
}

 //Cancel All file selected
 onCancel(){
  this.duplicate = false;
   this.selectedFile = [];
   this.arr_PANotUpload =[];
   this.LoadData();      
}

//Delete file selected
onDelete(id:number,fileName:string){
  var del = confirm('Are you sure want to delete this file');  
  if (!del) return;  
  this.duplicate = false;
  this.employeeService.deleteAttachmentFile(id,"0",this.employeeId).subscribe(
    result => {  
      if (result != null) {  
          this.LoadDataAndSelected();
          this.flagError = false;
      }
    }, 
    error =>{ 
      console.error(error);
      this.addItemError(String(error),fileName);
    }
); 
}
 
public downloadStatus(event: ProgressStatus) {
  switch (event.status) {
    case ProgressStatusEnum.START:
      this.showDownloadError = false;
      break;
    case ProgressStatusEnum.IN_PROGRESS:
      this.showProgress = true;
      this.percentage = event.percentage;
      break;
    case ProgressStatusEnum.COMPLETE:
      this.showProgress = false;
      break;
    case ProgressStatusEnum.ERROR:
      this.showProgress = false;
      this.showDownloadError = true;
      this.addItemError("Not found",event.fileName);
      break;
  }
}

}
