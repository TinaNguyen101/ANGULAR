import { Component, OnInit } from '@angular/core';
import { trigger, state, transition, style, animate, keyframes } from '@angular/animations';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss'],
  animations: [
    // trigger('drawerChanged', [
    //   state('false', style({ left: '0px'})),
    //   state('true', style({ left: '180px', 'z-index': '9999'})),
    //   transition('true<=>false', animate('250ms', keyframes ( [
    //     style({ display: 'none' }),
    //     style({ display: '*' }),
    //   ]))),
    // ]),
  ],
})
export class ReportComponent implements OnInit {
  constructor() { }

  ngOnInit() {
  }

}
