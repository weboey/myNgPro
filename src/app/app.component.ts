import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  inpArr = [];

  constructor(){
    for( let i=0 ; i<500 ; i++) {
      this.inpArr.push(i);
    }
  }

  doSearch(val){
    console.log("out pull==>"+val);
  }

  doOpen(isOpen){
    console.log("out pull==>"+isOpen);
  }
}
