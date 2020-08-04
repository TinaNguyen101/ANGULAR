import { Component, OnInit, Renderer2,ChangeDetectorRef, NgModule, ViewChild, ElementRef, ViewEncapsulation, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormArray,FormControl, Validators, FormBuilder, FormsModule } from '@angular/forms';
import { ActivatedRoute,Params,Router } from '@angular/router';
import { Location } from '@angular/common';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { ReplaySubject, Subject } from 'rxjs';
import { MatSelect, MatDialog } from '@angular/material';
import { takeUntil } from 'rxjs/operators';
import { EmployeeService } from '../../_services/employee.service';
import { Employee } from '../../_models/employee';
import { Commons } from 'src/app/_shared/common_function';
import { costCurrencySymboyRequiredValidator, compareDateValidator } from 'src/app/_shared/common-validations';
import { MyAlertDialogComponent } from 'src/app/_shared/control/my-alert-dialog/my-alert-dialog.component';
import { SharedService } from '../../_share/shared-service';
export class Gender {
  Id: number;
  GenderName: string;
}
export const FORMATS_DATE = {
  parse: {
    dateInput: 'YYYY/MM/DD',
  },
  display: {
    dateInput: 'YYYY/MM/DD',
    monthYearLabel: 'YYYY MMM DD',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY MMM DDD',
  },
};
@Component({
  selector: 'app-employee-info-basic',
  templateUrl: './employee-info-basic.component.html',
  styleUrls: ['./employee-info-basic.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },

    { provide: MAT_DATE_FORMATS, useValue: FORMATS_DATE },
  ],
})

export class EmployeeInfoBasicComponent implements OnInit {
  EmployeeForm: FormGroup;
  departmentList: any;
  employeeId: any;
  submitted:boolean;
  defaultCheckGender :number;
  defaultCheckEmpStatus:number;
  defaultCheckDep:number;
  arrPosition: [];
  vehicleTypeList:[];
  employyeeStatusList :[];
  lstGender = [];
  employee = new Employee();
  idLogin: number;
  error: string;
  imgEmployee :any
  //image
  editFile: boolean = true;
  removeUpload: boolean = false;
  imgUrl :any;
  file :any;
  public positionFilterCtrl: FormControl = new FormControl();
  public vehicleTypeFilterCtrl: FormControl = new FormControl();
  constructor(
     
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private route :ActivatedRoute,
    private router: Router,
    private employeeService: EmployeeService,
    public dialog: MatDialog,
    private _sharedService: SharedService,

    //image
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
    const userLogin = JSON.parse(localStorage.getItem("authUser"));
    this.idLogin = userLogin.EmpId;
     //get EmployeeId
     this.route.parent.params.subscribe((params: Params) => {
      this.employeeId = params.id;      
  });
    this.EmployeeForm = this.formBuilder.group({
      DepartmentName: new FormControl(''),
      Position: new FormControl(''),
      EmpName: new FormControl(''
        , {
          validators: [Validators.required]
        }
      ),
      Birthday: new FormControl(''),
      Address: new FormControl(''),
      AddressBirth: new FormControl(''),
      StartDate: new FormControl('', {
        validators: [Validators.required,compareDateValidator('StartDate', 'EndDate')
        ]
      }),
      EndDate: new FormControl('', {
        validators: [compareDateValidator('StartDate', 'EndDate')
        ]
      }),
      RegularDate: new FormControl('', {
        validators: [compareDateValidator('RegularDate', 'EndDate'),
        compareDateValidator('StartDate', 'RegularDate')

        ]
      }),
      IdentityNo: new FormControl(''),
      IdentityDate: new FormControl(''),
      IdentityPlace: new FormControl(''),
      LicensePlate: new FormControl(''),
      VehicleType: new FormControl(''),
      EmpGender: new FormControl(''),
      EmpMobile1: new FormControl(''),
      EmpMobile2: new FormControl(''),
      EmpEmail1: new FormControl(''),
      EmpEmail2: new FormControl(''),
      PassportNo: new FormControl(''),
      PassportDate: new FormControl(''),
      PassportExDate: new FormControl(''),
      VehicleComment: new FormControl(''),
      EmployeeStatus: new FormControl(''),
      Comment: new FormControl(''),
      EmpImage: new FormControl('')
     
    });
    //create Gender data
    this.Create_data_Gender();
    if(!this.employeeId)
    {
      this.defaultCheckGender = this.lstGender[0].Id;
    }
    //get MstPosition Data
    this.employeeService.getMstByName('MstPosition').subscribe(data => {
      this.arrPosition = data.mst;
    });
     //get MtsVehicle Data
     this.employeeService.getMstByName('MstVehicleType').subscribe(data => {
      this.vehicleTypeList = data.mst;
    });
    //get MtsDepartment Data
    this.employeeService.getMstByName('MstDepartment').subscribe(res => {
      this.departmentList = res.mst;
      if (!this.employeeId) {
        this.defaultCheckDep = res.mst[0].Id;
      }
    });
    //get MtsEmployeeStatus 
    this.employeeService.getMstByName('MstEmplomentStatus').subscribe(data => {
      this.employyeeStatusList = data.mst;
      if (!this.employeeId) {
        this.defaultCheckEmpStatus = data.mst[0].Id;
      }
    });

    //load Employee Data
   if(this.employeeId)
   {
     this.employeeService.getEmployeeById(this.employeeId).subscribe(data=>{
       this.employee = data;
       let id = this.employeeId;
        this.imgEmployee = data.EmpImage;
       this.EmployeeForm.patchValue({        
        DepartmentName: data.DeptId,
        Position :data.PosId,
        EmpName:data.EmpName,
        RegularDate:data.RegularDate,
        Birthday :data.EmpBirthday,
        Address :data.EmpAddress,
        AddressBirth :data.EmpAddressBirth,
        StartDate:data.EmpStartDate,
        EndDate:data.EmpEndDate,
        IdentityNo:data.EmpIdentityNo,
        IdentityDate:data.EmpIdentityDate,
        IdentityPlace:data.EmpIdentityPlace,
        LicensePlate:data.LicensePlate,
        VehicleType:data.VehicleTypeId,
        EmployeeStatus : data.EmpStatusId,
        EmpGender:data.EmpGender,
        EmpMobile1:data.EmpMobile1,
        EmpMobile2:data.EmpMobile2,
        EmpEmail1:data.EmpEmail1,
        EmpEmail2:data.EmpEmail2,
        VehicleComment:data.VehicleComment,
        PassportNo:data.EmpPassportNo,
        PassportDate:data.EmpPassportDate,
        PassportExDate:data.EmpPassportExpiryDate,
        Comment:data.EmpComment,
        // EmpImage :data.EmpImage
       })    
     })
   }      
  }
  
   //Create_data_Gender
   Create_data_Gender() {
    for (let index = 0; index < 2; index++) {
      let gen = new Gender();
      gen.Id = index;
      if (index<1) {
        gen.GenderName = "Male";
      }
      else{
        gen.GenderName = "Female";
      }
      this.lstGender.push(gen);
    }
  }
//check start-end-regular date
checkValidDate(flag: number) {
  if (flag == 0 || flag==2) {
    if (this.EmployeeForm.controls.StartDate.errors) {
      if (this.EmployeeForm.controls.StartDate.errors.compareDate) {
        this.EmployeeForm.controls['StartDate'].setErrors(null);
      }
    }
  }
  if (flag == 1 || flag==3) {
    if (this.EmployeeForm.controls.EndDate.errors) {
      if (this.EmployeeForm.controls.EndDate.errors.compareDate) {
        this.EmployeeForm.controls['EndDate'].setErrors(null);
      }
    }
  } 
}

onblur()
{
  this.EmployeeForm.controls.RegularDate.setValidators([compareDateValidator('RegularDate', 'EndDate'),
  compareDateValidator('StartDate', 'RegularDate')]);
  this.EmployeeForm.controls.RegularDate.updateValueAndValidity();

}
//Employee avatar
onDeleteImage(button)
{
  var del =  confirm("Do you want delete this avatar of "+ this.employee.EmpName + " ?");
  if(!del) return;
  else{
    this.employee.EmpImage = "avatar_female.png";
    this.router.navigate(['employee/info/' + this.employeeId +'/basic']);
  }
}
uploadImageFile(event)
{
  let reader = new FileReader();
  this.file = event.target.files[0];
  let res = true;
    if(this.checkImageValid(this.file.name))
    {
      if (event.target.files[0].size < 4000000)
      {
        if (event.target.files && event.target.files[0]) {
          reader.readAsDataURL(this.file);
    
          // When file uploads set it to file formcontrol
          reader.onload = () => {
            this.employee.EmpImage = reader.result.toString();
            this.imgUrl = this.file.name;
            this.EmployeeForm.patchValue({
              file: reader.result
            });
            this.editFile = false;
            this.removeUpload = true;
          }
          // ChangeDetectorRef since file is loading outside the zone
          this.cd.markForCheck();        
        }
      }
      else{
        res = false;
      }      
    }
   else{
    res = false;
   }
   if(!res)
   {
    alert("Unable to upload photo.");
   }
}
checkImageValid(fileName: string){
  let hideImage  = fileName.toLowerCase().lastIndexOf(".jpg");
  if(hideImage > -1){
    return true;
  }
  hideImage  = fileName.toLowerCase().lastIndexOf(".png");
  if(hideImage > -1){
    return true;
  }
  hideImage  = fileName.toLowerCase().lastIndexOf(".gif");
  if(hideImage > -1){
    return true;
  }
  hideImage  = fileName.toLowerCase().lastIndexOf(".tiff");
  if(hideImage > -1){
    return true;
  }
  hideImage  = fileName.toLowerCase().lastIndexOf(".heif");
  if(hideImage > -1){
    return true;
  }
  return false;
}

checkEmployeeStatus()
{
  //check employeeStatus == leave
  if(this.EmployeeForm.controls.EmployeeStatus.value == '5')
  {
    this.EmployeeForm.controls.EndDate.setValidators(Validators.required);
    this.EmployeeForm.controls.EndDate.updateValueAndValidity();
    this.EmployeeForm.controls.EndDate.markAsTouched();
  }
  else{
    this.EmployeeForm.controls.EndDate.setValidators(null);
    this.EmployeeForm.controls.EndDate.updateValueAndValidity();
  } 
//check employee status == regular
  if(this.EmployeeForm.controls.EmployeeStatus.value != '')
  {
    if(this.EmployeeForm.controls.EmployeeStatus.value == '1')
    {
      this.EmployeeForm.controls.RegularDate.setValidators([Validators.required,compareDateValidator('RegularDate', 'EndDate'),
      compareDateValidator('StartDate', 'RegularDate')]);
      this.EmployeeForm.controls.RegularDate.updateValueAndValidity();
      this.EmployeeForm.controls.RegularDate.markAsTouched();
    }
    else{
      if(this.EmployeeForm.controls.RegularDate.value == null)
      {
        this.EmployeeForm.controls.StartDate.setValidators(compareDateValidator('StartDate','EndDate'));
        this.EmployeeForm.controls.StartDate.updateValueAndValidity();
        this.EmployeeForm.controls.StartDate.markAsTouched();
      }
      this.EmployeeForm.controls.RegularDate.setValidators([compareDateValidator('RegularDate', 'EndDate'),
      compareDateValidator('StartDate', 'RegularDate')]);
      this.EmployeeForm.controls.RegularDate.updateValueAndValidity();
      this.EmployeeForm.controls.RegularDate.markAsTouched();
    }    

  } 
  else{
  this.EmployeeForm.controls.RegularDate.setValidators(null);
    this.EmployeeForm.controls.RegularDate.updateValueAndValidity();
  }  
}

ngAfterViewInit(): void {
  if(this.EmployeeForm.controls.EmployeeStatus.value == '5')
  {
    this.EmployeeForm.controls.EndDate.setValidators(Validators.required);
    this.EmployeeForm.controls.EndDate.updateValueAndValidity();
  }
 
}

//Submit employee data
onSubmitEmployeeData()
{
  this.checkValidDate
  this.submitted = true;
  this.checkEmployeeStatus();
  if(this.employeeId == null)
  { 
    if(this.EmployeeForm.controls.EmpName.value == "" )
    {
      this.EmployeeForm.controls.EmpName.setValidators(Validators.required);
      this.EmployeeForm.controls.EmpName.updateValueAndValidity();
      this.EmployeeForm.controls.EmpName.markAsTouched();
      return;
    }
    if(this.EmployeeForm.controls.StartDate.value == "" )
    {
      this.EmployeeForm.controls.StartDate.setValidators(Validators.required);
      this.EmployeeForm.controls.StartDate.updateValueAndValidity();
      this.EmployeeForm.controls.StartDate.markAsTouched();
      return;
    }    
  }
 
//check form invalid
  if (this.EmployeeForm.invalid) {
    return;
  }
  
  let employ = new Employee();
  const emp = this.EmployeeForm.value;
  employ.Id = this.employeeId;
  employ.DeptId = emp.DepartmentName;
  employ.PosId = emp.Position;
  employ.EmpName = emp.EmpName;
  employ.EmpBirthday = emp.Birthday;
  employ.EmpAddress =emp.Address;
  employ.EmpAddressBirth =emp.AddressBirth;
  employ.EmpStartDate =emp.StartDate;
  employ.EmpEndDate =emp.EndDate;
  employ.RegularDate = emp.RegularDate;
  employ.EmpIdentityNo=emp.IdentityNo;
  employ.EmpIdentityDate=emp.IdentityDate;
  employ.EmpIdentityPlace = emp.IdentityPlace;
  employ.LicensePlate=emp.LicensePlate;
  employ.VehicleTypeId = emp.VehicleType;
  employ.EmpStatusId  = emp.EmployeeStatus;
  employ.EmpGender=emp.EmpGender;
  employ.EmpMobile1=emp.EmpMobile1;
  employ.EmpMobile2=emp.EmpMobile2;
  employ.EmpEmail1 = emp.EmpEmail1;
  employ.VehicleComment=emp.VehicleComment;
  employ.EmpPassportNo=emp.PassportNo;
  employ.EmpPassportDate=emp.PassportDate;
  employ.EmpPassportExpiryDate=emp.PassportExDate;
  employ.EmpComment=emp.Comment;
  employ.EmpEmail2 = emp.EmpEmail2;
 //upload avatar-employee
 let formData = new FormData();
 if(this.imgUrl == null)
 {
    if(this.employeeId != null)
    {
      employ.EmpImage = this.imgEmployee;
      employ.CreatedDate = new Date();
      employ.CreatedId = this.idLogin;
      this.employeeService.updateEmployee(employ).subscribe(
        data => {
          alert('Update employee successfull');
          this._sharedService.emitChange(this.employeeId);
        },
        error => {
          this.error = error;        
         });          
      }
      //  insert employee
      else{
        employ.CreatedDate = new Date();
        employ.CreatedId = this.idLogin;
        this.employeeService.createEmployee(employ).subscribe(
          data => {
            this.router.navigate(['employee/info/' + data +'/basic'])
          },
          error => {
            this.error = error;
            console.log(this.error);
          });
      }
 }
 else
 {  
  if(this.employeeId != null)
  {
  formData.append('file',this.file,this.imgUrl);
  this.employeeService.uploadEmpImage(Number(this.employeeId),formData).subscribe(
    data => {
      employ.EmpImage = data.split('/').pop();
      //update employee
      
        employ.CreatedDate = new Date();
        employ.CreatedId = this.idLogin;
        this.employeeService.updateEmployee(employ).subscribe(
          data => {
            alert('Update employee successfull');
          },
          error => {
            this.error = error;        
           });                         
    },
    error => {
      this.error = error;          
     });
    }
    //  insert employee
  else{
    employ.CreatedDate = new Date();
    employ.CreatedId = this.idLogin;
    this.employeeService.createEmployee(employ).subscribe(
      data => {
        this.employeeId = data;
        formData.append('file',this.file,this.imgUrl);
        this.employeeService.uploadEmpImage(Number(this.employeeId),formData).subscribe(
          data => {
            employ.EmpImage = data.split('/').pop();
            employ.Id = this.employeeId;
            //update employee again                         
              this.employeeService.updateEmployee(employ).subscribe(
                data => {                 
                  this._sharedService.emitChange(this.employeeId);
                  this.router.navigate(['employee/info/' + this.employeeId +'/basic'])
                },
                error => {
                  this.error = error;        
                 });                               
          },
          error => {
            this.error = error;          
           });                
      },
      error => {
        this.error = error;
        console.log(this.error);
      });      
  }
 }   
}
  //delete employee
  deleteEmployee() {
    var del = confirm('Are you sure want to delete this employee');
    if (!del) return;
    this.employeeService.deleteEmployee(this.employeeId).subscribe(data => {
      this.router.navigate(['employee'])
    }),
      error => {
        this.error = error;
      }
  }
  goBack() {
    this.router.navigate(['employee']);
  }
  goToTop() {
    if (this.EmployeeForm.invalid) {
      window.scrollTo(0, 0)
    }
  }
  convertStyleObject(style: string) {
    return JSON.parse(style);
  }
}
