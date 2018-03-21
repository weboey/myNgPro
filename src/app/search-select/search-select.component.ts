import { Component, OnInit, Input, Output, EventEmitter ,ViewChild} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';

import "rxjs/add/operator/map";
import "rxjs/add/operator/debounceTime";
import "rxjs/add/operator/distinctUntilChanged";
import "rxjs/add/operator/switch";
import "rxjs/add/operator/filter";
@Component({
  selector: 'app-search-select',
  templateUrl: './search-select.component2.html',
  styleUrls: ['./search-select.component2.scss']
})
export class SearchSelectComponent implements OnInit {

  inputValue:string="";
  selectedIndex:number=0;
  toggleShow:boolean=false;
  mockDate=[1,2,3,4,5,6,7,8];

  private searchText$ = new Subject<string>();

  @ViewChild("inputElement")
  inpElement: HTMLElement;

  onKeyDownInput(e){
    console.log(e);
  }

  toggleShowHandler(){
    this.toggleShow=!this.toggleShow;
  }

  doSelectItem(selected){
    this.updateInputVal(selected);
    this.selectedIndex=this.mockDate.indexOf(selected);
  }

  doSearch(inputVal){
    this.searchText$.next(inputVal);
  }

  doClose(){
    setTimeout(()=>{
      this.toggleShow=false;
    },200)
  }



  updateInputVal(newVal){
      this.inputValue=newVal;
  }

  public tipInfo = [];
  // 例子
  // public data = [{key: 'bond', placeholder: '示范课搜索', search: '模拟搜索'}];
  // 搜索数据

  // 回填文字
  @Input()
  public infoBond;
  // 搜索的字段和内容
  @Output()
  public keyData: EventEmitter<any> = new EventEmitter;
  // 搜索的字段和内容
  @Output()
  public searchData: EventEmitter<any> = new EventEmitter;
  @Output()
  public searchName: EventEmitter<any> = new EventEmitter;
  // 获取的数据和字段
  public data: Array<any>;
  // 输入框提示文字
  public tip_name: string;
  // 搜索按钮文字
  public search_name: string;
  // 输入框内容
  public organization;
  // 箭头下选的位置
  public SelectInstIndex = null;
  // 是否显示下拉框
  public showTip = false;
  // 字段
  public keyCode: string;

  constructor() { }



  ngOnInit() {
    console.log(11);
    console.log(this.inpElement);
    // const input$ = Observable.fromEvent<KeyboardEvent>(this.inpElement["nativeElement"], 'keydown');

    this.searchText$
      .debounceTime(300)
      .filter(r => r !== '')
      .distinctUntilChanged()
      .switch()
      .subscribe(inp=>console.log(inp))

  }


}
