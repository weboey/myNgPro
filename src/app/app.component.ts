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
    console.log("Search==>"+val);
    console.log(this.initVal);
    if(val!=""){
      let reg=new RegExp(`${val}`,"i");
      this.testDate=this.mockDate.filter((item)=>{
        if(item["bond_shortname"].match(reg)){
          return item
        }
      })
    }else {
      this.testDate=[];
    }
  }
  test(){
    this.initVal={name:"00资金509"};
  }
  doOpen(isOpen){
    console.log("Open==>"+isOpen);
  }
  change(val){
    console.log("change"+val);
  }
  isDisable=false;
  initVal={name:"00资金09"};
  testDate=[];
  mockDate=[{
    "bond_shortname": "00国债01",
  }, {
    "bond_shortname": "00国债02",

  }, {
    "bond_shortname": "00国债03",
  }, {
    "bond_shortname": "00国债09",
  }, {
    "bond_shortname": "00资金01",
  }, {
    "bond_shortname": "00资金09",

  }, {
    "bond_shortname": "00资金019",
  }, {
    "bond_shortname": "00资金309",
  }, {
    "bond_shortname": "00资金509",
  }, {
    "bond_shortname": "00资金809",
  }];

}
