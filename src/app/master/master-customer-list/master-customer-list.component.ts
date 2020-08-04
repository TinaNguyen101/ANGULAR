import { Component, OnInit, ViewChild, AfterViewInit, Inject, ElementRef, Renderer2, HostListener } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator, MatSort, MatTableDataSource, MatDrawer } from '@angular/material';
import { merge, ReplaySubject, Subject } from 'rxjs';
import { tap, takeUntil } from 'rxjs/operators';
import { MatTableRequest } from 'src/app/_models/MatTableRequest';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { JsonPipe } from '@angular/common';
import { JsonpInterceptor } from '@angular/common/http';
import { Commons } from 'src/app/_shared/common_function';
import { compareDateValidator } from 'src/app/_shared/common-validations';
import * as _moment from 'moment';
import { MasterService } from '../_services/master.service';
import { Customer } from '../_models/Customer';
const moment = _moment;
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';


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
  selector: 'app-master-customer-list',
  templateUrl: './master-customer-list.component.html',
  styleUrls: ['./master-customer-list.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },

    { provide: MAT_DATE_FORMATS, useValue: FORMATS_DATE },
  ],
})

export class MasterCustomerListComponent implements OnInit {

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild("parentTablePC", { static: true }) parentTablePC: ElementRef;
  @ViewChild("parentTableMB", { static: true }) parentTableMB: ElementRef;
  @ViewChild('drawer', { static: true }) drawer: MatDrawer;

  public filterCustomer =[];
  public filterCustomerContact =[];
  public custFilterCtrl: FormControl = new FormControl(null);
  protected _onDestroy = new Subject<void>();
  isMenuLeftOpen = true;
  panelOpenState = false;
  arr_Customer_sortCustName = [];
  arr_Customer_sortCustContactName = [];
  searchedValue: any;
  matTableCustomerRequest_sortCustName = new MatTableRequest("CustName", "asc", 0, 1000000000, {});
  matTableCustomerRequest_sortCustContactName = new MatTableRequest("CustContactName", "asc", 0, 1000000000, {});
  dataSource: MatTableDataSource<Customer>;
  // displayedColumns = ['Action', 'CustName', 'CustShortName', 'CustContactName', 'CustContactEmail'
  //   , 'CustContactPhone', 'CustContactFax', 'CustContactSkype', 'CustAddress', 'CustWebsite', 'CustPostCode', 'CustComment'];
  dtFormSearch: FormGroup;
  lstCustomer: any;
  constructor(
    private formBuilder: FormBuilder,
    private masterService: MasterService,
  ) { }
  lstCustomer1 = [];
  lstCustomer2 = [];
  hasBackdropBoolean;
  mode;
  opened;
  public innerWidth: any;

  ngOnInit() {
    this.masterService.changeEmittedToggleLeftMenu.subscribe(data=>{
      this.isMenuLeftOpen = data;
    })
    // create Form Search
    this.dtFormSearch = this.formBuilder.group({
      CustName: new FormControl(''),
      CustContactName: new FormControl(''),
    });
    this.innerWidth = window.innerWidth;
    if (this.innerWidth > 960) {
      this.hasBackdropBoolean = false;
      this.mode = "side";
      this.opened = true;
    }
    else {
      this.hasBackdropBoolean = true;
      this.mode = "over";
      this.opened = false;
    }
    this.searchedValue = { ...this.dtFormSearch.value };

    this.drawer.openedChange.subscribe((o: boolean) => {
      if (!o) {
        this.dtFormSearch.patchValue(this.searchedValue);
      }
    });

    //FilterControl CustomerName
    this.masterService.getAllCustomer(this.matTableCustomerRequest_sortCustName).subscribe(res => {
      for (const item of res.items) {
        if(this.arr_Customer_sortCustName.findIndex(x=>x.CustName==item.CustName)<0){
          if(item.CustName){
            this.arr_Customer_sortCustName.push(item);
          }
        }
      }
      this.filterCustomer = this.addFirstRowEmptyInListFillter(this.arr_Customer_sortCustName);
    });
    //FilterControl CustomerContactName
    this.masterService.getAllCustomer(this.matTableCustomerRequest_sortCustContactName).subscribe(res => {
      for (const item of res.items) {
        if(this.arr_Customer_sortCustContactName.findIndex(x=>x.CustContactName==item.CustContactName)<0){
          if(item.CustContactName){
            this.arr_Customer_sortCustContactName.push(item);
          }
        }
      }
      this.filterCustomerContact = this.addFirstRowEmptyInListFillter(this.arr_Customer_sortCustContactName);
    });
    //Load all data List
    this.loadCustomer();

  }

  ngAfterViewInit(): void {
    this.dtFormSearch.patchValue(this.searchedValue);
  }

  // Load lst Customer
  loadCustomer() {
    this.matTableCustomerRequest_sortCustName = new MatTableRequest("CustName", "desc", 0, 1000000000,
      {
        ...this.searchedValue,
      });

    this.masterService.getAllCustomer(this.matTableCustomerRequest_sortCustName).subscribe(res => {
      this.lstCustomer = res.items;
      let i = 0;
      this.lstCustomer1 = [];
      this.lstCustomer2 = [];
      for (const item of res.items) {
        if (i < res.itemscount / 2) {
          this.lstCustomer1.push(item);
        } else {
          this.lstCustomer2.push(item);
        }
        i++;
      }
    })
  }

  // Click paging Scroll to Top
  goToTop() {
    this.parentTableMB.nativeElement.scrollTo(0, 0);
    this.parentTablePC.nativeElement.scrollTo(0, 0);
  }

  //Refresh form search
  refersh() {
    this.dtFormSearch.patchValue(
      {
        CustName: '',
        CustContactName: '',
      }
    );
  }

  // Submit Search
  onSubmitSearch() {

    this.searchedValue = { ...this.dtFormSearch.value };

    this.loadCustomer();

    setTimeout(()=>{
      this.drawer.close()
    }, 300);
    
  }

  //Drag and Drop Mobile
  dropMB(event: CdkDragDrop<string[]>) {
    //this.loadCustomer();
    moveItemInArray(this.lstCustomer, event.previousIndex, event.currentIndex);
  }

  //Format Name
  formatNameCustShortName(name) {
    if (name) {
      return name.substring(0, 1);
    }
  }

  //Drag and Drop PC
  dropPC(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
    if (this.innerWidth > 960) {
      this.hasBackdropBoolean = false;
      this.mode = "side";
      this.opened = true;
    }
    else {
      this.hasBackdropBoolean = true;
      this.mode = "over";
      this.opened = false;
    }
  }

  //Control Filter
  filterCustName() {
    if (this.custFilterCtrl.value) {
      this.filterCustomer = this.arr_Customer_sortCustName.filter(x => {
        return x.CustName.toLowerCase().includes(this.custFilterCtrl.value.toLowerCase())
      })
    } else this.filterCustomer = this.addFirstRowEmptyInListFillter(this.arr_Customer_sortCustName);
  }
  filterCustContactName() {
    if (this.custFilterCtrl.value) {
      this.filterCustomerContact = this.arr_Customer_sortCustContactName.filter(x => {
        return (x.CustContactName.toLowerCase().includes(this.custFilterCtrl.value.toLowerCase()))
      })
    } else this.filterCustomerContact = this.addFirstRowEmptyInListFillter(this.arr_Customer_sortCustContactName);
  }

  //clearInput
  clearInput(){
    if(this.filterCustomer.length==0){
      this.dtFormSearch.controls.CustName.setValue(null);
      this.filterCustomer = this.addFirstRowEmptyInListFillter([]);
    }
    if(this.filterCustomerContact.length==0){
      this.dtFormSearch.controls.CustName.setValue(null);
      this.filterCustomerContact = this.addFirstRowEmptyInListFillter([]);
    }
  }
  //add firstRowEmpty in lst Filter
  addFirstRowEmptyInListFillter = (arraySource) =>{
    return [{CustName: null}].concat(arraySource)
  }
  //
  // preventdefault(event){
  //   event.preventDefault();
  //   return;
  // }
}
