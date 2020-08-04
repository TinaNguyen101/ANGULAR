import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { MasterService } from './_services/master.service';
import { MatDrawer } from '@angular/material';

@Component({
  selector: 'app-master',
  templateUrl: './master.component.html',
  styleUrls: ['./master.component.scss']
})
export class MasterComponent implements OnInit {
  @ViewChild('drawer', { static: false }) drawer: MatDrawer;
  hasBackdropBoolean;
  mode;
  opened;
  public innerWidth: any;
  constructor(private masterService : MasterService) { }

  ngOnInit() {
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

  toggleLeftMenu(e){
    this.masterService.emitChangeToggleLeftMenu(e);
  }
  toggleLeftMenuClickLink(e){
    this.masterService.emitChangeToggleLeftMenu(e);
    if (this.drawer.open()) {
      this.drawer.close()
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
}
