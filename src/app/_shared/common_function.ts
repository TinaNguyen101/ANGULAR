import { Injectable } from '@angular/core';
import { debug } from 'util';

@Injectable({
    providedIn: 'root'
}) 
export class Commons {
    constructor(){}

allowNumberonly_commaSeparator(event: any)
{
    var temp: string;
    if(/^\d+$/.test(event.target.value)){  
      temp =  event.target.value;
     }
    else  {
      temp = event.target.value.replace(/[^\x00-\x7F]/g,"").replace(/[^0-9]/g, "");
    }
    var parts = temp.split(".");
    var num = parts[0].replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") +  (parts[1] ? "." + parts[1] : "");
    if (event.target.attributes.maxlength.value){
      num = num.substr(0, event.target.attributes.maxlength.value);
    }
    event.target.value =num;
}

allowDateonly(event: any)
{
    var temp;
    if(/^\d+$/.test(event.target.value)){  
      temp =  event.target.value;
     }
    else  {
      temp = event.target.value.replace(/[^\x00-\x7F]/g,"").replace(/[^0-9]/g, "");
    }
    var num = temp.replace(/^(\d{4})(\d{2})(\d{2})(\d)*/, '$1/$2/$3') ;
}
}