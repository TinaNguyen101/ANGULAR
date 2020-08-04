import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MasterService } from '../_services/master.service';
import { Customer } from '../_models/Customer';
import { SharedService } from '../_share/shared-service';
import { MaskService } from 'ngx-mask';
@Component({
  selector: 'app-master-info',
  templateUrl: './master-info.component.html',
  styleUrls: ['./master-info.component.scss']
})
export class MasterInfoComponent implements OnInit {
  customer = new Customer();
  idCustomer: any;
  selectedName: string;
  constructor(private route: ActivatedRoute, private masterService: MasterService,
    private _sharedService: SharedService
    ) { 
    
  _sharedService.changeEmitted$.subscribe(
    text => {
        this.masterService.getCustomerById(this.route.snapshot.params.id).subscribe(r => this.customer = r)  
    });
  

  }
  ngOnInit() {
    this.idCustomer = this.route.snapshot.params.id;
    if (this.idCustomer) {
      localStorage.setItem("customerId", this.idCustomer); 
    this.masterService.getCustomerById(this.idCustomer).subscribe(r => this.customer = r)  
      } else {
      localStorage.removeItem("customerId"); 
      }
  }

}
