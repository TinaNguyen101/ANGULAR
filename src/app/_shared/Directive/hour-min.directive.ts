import { Directive, ElementRef, HostListener } from '@angular/core';
import * as _moment from 'moment';
const moment = _moment;
@Directive({
  selector: '[appHourMin]'
})
export class HourMinDirective {

  constructor(private el: ElementRef) { }

  get nativeEl() {
    return this.el.nativeElement;
  }


  @HostListener('keydown', ['$event']) onKeydown(event) {
    var key = event.keyCode;
    if (key == 37 || key == 38 || key == 39 || key == 40 || key == 8 || key == 46 || key == 16) {
      // Left / Up / Right / Down Arrow, Backspace, Delete keys
      return;
    }

    var regexStr = '(^[0-9])|(\:)$';
    return new RegExp(regexStr).test(event.key);
  }

  @HostListener('keyup', ['$event']) onKeyup(event) {
    this.nativeEl.value = this.formatValue(0);
  }


  @HostListener('blur', ['$event']) onBlur(event) {
    if (event.target.value) {
      this.formatValue(1);
    }
  }
  checkAndReturn = (_h, _m) => {
    if (_h > 23) {
      return '';
    }
    if (_m > 60) {
      return ''
    }
    let hr = (+_h) > 9 ? (+_h) : "0" + (+_h);
    let mr = (+_m) > 9 ? (+_m) : "0" + (+_m);
    return hr + ':' + mr;
  }
  formatValue(flag: number) {
    let temp;

    if (flag == 0) {
      if (/(^\d+$)|(^\d{2}\:\d*$)/.test(this.nativeEl.value)) {
        temp = this.nativeEl.value;
      }
      else {
        temp = this.nativeEl.value.replace(/[^\x00-\x7F]/g, "").replace(/[^0-9]/g, "");
      }
      let num;
      if (/^\d{3,}$/.test(temp)) {
        num = temp.replace(/(\d{2})(\d*)|(\d{2})/, '$1:$2');
        return num;
      } else {
        return temp
      }
    }


    if (flag == 1) {
      temp = this.nativeEl.value.replace(/[^\x00-\x7F]/g, "").replace(/[^0-9]/g, "");
      let h, m;
      //Khi nhập vào số đầu tiên là 2 (2h:mm)
      if (temp.slice(0, 1) == 2 && temp.length > 1) {
        h = temp.slice(0, 2);
        m = temp.slice(2) ? temp.slice(2) : '00';
        this.nativeEl.value = this.checkAndReturn(h, m);
        return
      }
      //Khi nhập vào số đầu tiên là 0 (0h:mm)
      if (temp.slice(0, 1) == 0) {
        h = temp.slice(0, 2);
        m = temp.slice(2)
        this.nativeEl.value = this.checkAndReturn(h, m);
        return;
      }
      //Khi chỉ nhập giờ
      if (temp.length == 1 || temp.length == 2) {
        let h = temp, m = '00';
        this.nativeEl.value =  this.checkAndReturn(h, m);
        return;
      }
      //Khi nhap vao 3 so
      if(temp.length == 3){
        h = temp.slice(0, 2);
        m = temp.slice(2)
        this.nativeEl.value = this.checkAndReturn(h, m);
        return;
      }

      m = temp.slice(temp.length - 2, temp.length);
      h = temp.replace(m, '');      
      this.nativeEl.value = this.checkAndReturn(h, m);
        return;
    }
    let num = temp.replace(/(\d{2})(\d*)|(\d{2})/, '$1:$2');
    return num;

  }

}
