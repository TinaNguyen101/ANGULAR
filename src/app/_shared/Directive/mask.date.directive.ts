import { Directive, HostListener, ElementRef, Input } from '@angular/core';
import * as _moment from 'moment';
const moment = _moment;
@Directive({
  selector: '[dateFormat]'
})
export class dateFormatDirective {


  constructor(private el: ElementRef) { }

  get nativeEl(){
    return this.el.nativeElement;
  }


  @HostListener('keydown', ['$event']) onKeydown(event) {
    var key = event.keyCode;
    if(key == 37 || key == 38 || key == 39 || key == 40 || key == 8 || key == 46) { 
      // Left / Up / Right / Down Arrow, Backspace, Delete keys
      return;
  }
 
    var regexStr = '^[0-9]*$';
    return new RegExp(regexStr).test(event.key);
  }
  
  @HostListener('keyup', ['$event']) onKeyup(event) {
    this.nativeEl.value = this.formatValue(0);
  }

  @HostListener('blur', ['$event']) onBlur(event) {
    this.nativeEl.value = this.formatValue(1);
  }

formatValue(flag: number)
{
  var temp;
    if(/^\d+$/.test(this.nativeEl.value)){  
      temp =  this.nativeEl.value;
     }
    else  {
      temp = this.nativeEl.value.replace(/[^\x00-\x7F]/g,"").replace(/[^0-9]/g, "");
    }
    var num = temp.replace(/^(\d{4})(\d{2})(\d{2})(\d)*/, '$1/$2/$3') ;
    if(flag == 1)
    {
      var date = moment(num);
      if(date.isValid()){
        return num;
      }
      else{
        return "";
      }
    }
    return num;
   
}
  
}