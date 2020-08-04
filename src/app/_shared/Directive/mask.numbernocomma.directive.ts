import { Directive, HostListener, ElementRef, Input } from '@angular/core';
@Directive({
  selector: '[number]'
})
export class numberDirective {


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
    this.nativeEl.value = this.formatValue();
  }

  @HostListener('blur', ['$event']) onBlur(event) {
    this.nativeEl.value = this.formatValue();
  }

formatValue()
{
  var temp: string;
  if(/^\d+$/.test(this.nativeEl.value)){  
    temp =  this.nativeEl.value;
   }
  else  {
    temp = this.nativeEl.value.replace(/[^\x00-\x7F]/g,"").replace(/[^0-9]/g, "");
  }
  if (this.nativeEl.attributes['maxlength']){
    temp = temp.substr(0, this.nativeEl.attributes.maxlength.value);
  }

  if(temp === ''){
    return '';
  }
  
  let num = parseInt(temp);
  
  return num;
}
  
}