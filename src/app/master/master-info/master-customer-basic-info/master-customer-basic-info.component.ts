import { Component, OnInit, Renderer2, NgModule, ViewChild, ElementRef, ViewEncapsulation, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MasterService } from '../../_services/master.service';
import { Location } from '@angular/common';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { ReplaySubject, Subject } from 'rxjs';
import { Customer } from '../../_models/Customer';
import { MatSelect, MatDialog } from '@angular/material';
import { takeUntil } from 'rxjs/operators';
import { Commons } from 'src/app/_shared/common_function';
import { phoneNumberValidator  } from 'src/app/_shared/common-validations';
import { MyAlertDialogComponent } from 'src/app/_shared/control/my-alert-dialog/my-alert-dialog.component';
import { SharedService } from '../../_share/shared-service';
export const MONTH_ONLY_FORMATS = {
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
  selector: 'app-master-customer-basic-info',
  templateUrl: './master-customer-basic-info.component.html',
  styleUrls: ['./master-customer-basic-info.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },

    { provide: MAT_DATE_FORMATS, useValue: MONTH_ONLY_FORMATS },
  ],
})
export class MasterCustomerBasicInfoComponent implements OnInit {
  customerId : number;
  idLogin:number;
  error: string;
  submitted:boolean;
  dtCustomerForm:FormGroup;
  customer : Customer;
  constructor(
    private formBuilder: FormBuilder,
    private route: Router,
    private masterService: MasterService,
    private commons: Commons,
    private dialog: MatDialog, private _sharedService: SharedService
  ) { }

  ngOnInit() {
    this.customerId = parseInt(localStorage.getItem("customerId"));
    const userLogin = JSON.parse(localStorage.getItem("authUser"));
    this.idLogin = userLogin.EmpId;

    this.dtCustomerForm = this.formBuilder.group({
      id: new FormControl(''),
      CustomerName: new FormControl('', 
      {
        validators: [
          Validators.required,
        ]
      }
      ),
      ShortName: new FormControl(''),               
      EngName: new FormControl(''),
      ContactName: new FormControl(''),
      ContactEmail: new FormControl(''),
      ContactPhone: new FormControl(''),
      ContactFax: new FormControl(''),
      ContactSkype: new FormControl(''),
      ContactWebsite: new FormControl(''),
      PostCode: new FormControl(''),
      Address: new FormControl(''),      
      Comment: new FormControl(''),
      ProjectCount: new FormControl(''),
      StyleCss:new FormControl('')
    });

     //load Employee Data
   if(this.customerId)
   {
     this.masterService.getCustomerById(this.customerId).subscribe(data=>{
       this.customer = data;
       let id = this.customerId;
       this.dtCustomerForm.patchValue({        
        CustomerName: data.CustName,
        ShortName :data.CustShortName,
        EngName:data.CustEngName,
        ContactName:data.CustContactName,
        ContactEmail :data.CustContactEmail,
        ContactPhone :data.CustContactPhone,
        ContactFax :data.CustContactFax,
        ContactSkype:data.CustContactSkype,
        Address:data.CustAddress,
        ContactWebsite:data.CustWebsite,
        PostCode:data.CustPostCode,
        Comment:data.CustComment,
        StyleCss:data.CustStyleCss,
       })    
     })
   }
  }

  //submit data
  onSubmitData()
  {
    this.submitted = true;
    if(this.dtCustomerForm.invalid)
    {
      return
    }
    const formValue = this.dtCustomerForm.value;
    let customer = new Customer();

    customer.CustName = formValue.CustomerName;
    customer.CustShortName = formValue.ShortName;
    customer.CustEngName = formValue.EngName;
    customer.CustContactName = formValue.ContactName;
    customer.CustContactEmail = formValue.ContactEmail;
    customer.CustContactPhone = formValue.ContactPhone;
    customer.CustContactFax = formValue.ContactFax;
    customer.CustContactSkype = formValue.ContactSkype;
    customer.CustWebsite = formValue.ContactWebsite;
    customer.CustPostCode = formValue.PostCode;
    customer.CustAddress = formValue.Address;
    customer.CustComment = formValue.Comment;
    customer.CustStyleCss = formValue.StyleCss;
    if(this.customerId)
    {
      customer.Id = this.customerId;
      customer.UpdatedId = this.idLogin;
      customer.UpdatedDate = new Date();
      this.masterService.updateCustomer(customer).subscribe(data => {
        alert('Update customer successfull');
      },
      error => {
        this.error = error;        
       });
    }
    else
    {
      customer.CustIsDelete = false;
      customer.CreatedId = this.idLogin;
      customer.CreatedDate = new Date();
      this.masterService.createCustomer(customer).subscribe(data =>{
        console.log(data);
        this.route.navigate(['master/customer/info/'+data+'/basic']);
      },      
        error => {
          this.error = error;
          console.log(this.error);
        });        
    }
  }

  //delete employee
  deleteCustomer() {
    var del = confirm('Are you sure want to delete this customer ?');
    if (!del) return;
    this.masterService.deleteCustomer(this.customerId).subscribe(data => {
      this.route.navigate(['master'])
    }),
      error => {
        this.error = error;
      }
  }

  //go to top
  goToTop()
  {
    if(this.dtCustomerForm.invalid)
    {
      window.scrollTo(0,0);
    }
  }
  //go to back
  goBack() {
    this.route.navigate(['master']);
  }
}
