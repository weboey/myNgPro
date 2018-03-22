import { Component, OnInit, Input, Output, EventEmitter ,OnDestroy,ViewChild,ElementRef,AfterContentInit,ContentChildren,
  Directive,QueryList} from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs';
import "rxjs/add/operator/map";
import "rxjs/add/operator/debounceTime";
import "rxjs/add/operator/distinctUntilChanged";
import "rxjs/add/operator/switch";
import "rxjs/add/operator/filter";
import { coerceBooleanProperty} from '@angular/cdk/coercion';

@Directive({ selector: 'li' })
export class ListItem {}

@Component({
  selector: 'app-search-select',
  templateUrl: './search-select.component.html',
  styleUrls: ['./search-select.component.scss'],
  host: {
    '[class.ant-select]'            : 'true',
    "(click)": "_toggleClick($event)",
  }
})
export class SearchSelectComponent implements OnInit,AfterContentInit,OnDestroy {

  selectedIndex:number=0;
  _optionListShow:boolean=false;

  @Output()
  nzSearchChange: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  nzOpenChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output()
  ngModelChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Input()
  nzNotFoundContent:any;
  @Input()
  nzPlaceHolder:string="";
  @Input()
  nzOptionLabel:string;
  @Input()
  nzOptionValue:string;

  private _value: any; // select表单值
  @Output() valueChange = new EventEmitter();
  @Input()
  public get value(): any {
    return this._value;
  }
  public set value(newValue: any) {
    //this.writeValue(newValue);
    this._value=newValue;
    this.valueChange.emit(this.value);
  }

  private _data: Array<object>=[];
  @Input()
  public get data(): Array<object> | object[] {
    return this._data;
  }
  public set data(value: Array<object> | object[]) {
    this._data = value instanceof Array ? value : new Array(value);
    let selectedItem=this.data.find(item=>{
      console.log(item[this.nzOptionLabel],this.value);
      return item[this.nzOptionLabel]==this.value
    })
    this.selectedIndex=this.data.indexOf(selectedItem);
  }


  constructor() { }

  _allowClear = false;
  _disabled = false;
  _clearIcon = false;
  @Input()
  set nzAllowClear(value: boolean) {
    this._allowClear = coerceBooleanProperty(value);
  }
  get nzAllowClear(): boolean {
    return this._allowClear;
  }
  @Input()
  set nzDisabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);
  }
  get nzDisabled(): boolean {
    return this._disabled;
  }

  _showClear(event: Event){
    event.stopPropagation();
    if(this._value==null || this._value=='' || this._disabled){
      return
    }
    this._clearIcon=true;
  }
  _hiddenClear(event: Event){
    event.stopPropagation();
    this._clearIcon=false;
  }

  private sub$: any;
  @ViewChild("inputElement") inpElementRef: ElementRef;
  @ContentChildren(ListItem) items: QueryList<ListItem>;

  ngAfterContentInit():void {
    console.log(this.items);
  }

  _toggleClick(event: Event){
    event.stopPropagation();
    if(this._disabled){
      return
    }
    this._clearIcon=false;
    this._optionListShow =! this._optionListShow;
    this.nzOpenChange.emit(this._optionListShow);
    if(this._optionListShow){
      this.nzPlaceHolder=this.value;
    }else{

    }
    // if (this._$optionListHidden) {
    //   this._documentListen();
    // } else {
    //   this._documentListen = this._renderer.listen('document', 'click', () => {
    //     this._$optionListHidden = true;
    //     this._documentListen();
    //     this._documentListen = null;
    //   });
    // }
  }

  onClearSelected(event){
    event.stopPropagation();
    this._value=null;
  }


  //更改option选中状态
  _updateSelectedOption(selected){
    this._updateInputVal(selected);
    this.selectedIndex=this.data.indexOf(selected);
  }
  //关闭下拉面板
  _closeOptionContent(){
    setTimeout(()=>{
      this._optionListShow=false;
    },200)
  }

  //更新input值
  _updateInputVal(newVal){
    this.value=newVal[this.nzOptionLabel];
    this.ngModelChange.emit(this.value);
  }

  ngOnInit() {
    this.sub$ = Observable.fromEvent<KeyboardEvent>(this.inpElementRef.nativeElement, 'keyup')
      .map((e: any) => e.target.value)
      // .filter((text: string) => text!='') // filter out if empty
      .do((val)=>console.log(val))
      .debounceTime(300)
      .distinctUntilChanged()
      .subscribe(
        inpVal => {
          console.log(inpVal);
          this.nzSearchChange.next(inpVal);
        }
      );
  }

  //键盘上下选择
  onKeyDownChangeSelected(event) {
    if (this._optionListShow && event.keyCode === 38) {
      this.selectedIndex = this.selectedIndex ? this.selectedIndex - 1 : this.data.length - 1;
      if (this.selectedIndex < 0) {
        this.selectedIndex = this.data.length - 1;
      }
    } else if (this._optionListShow && event.keyCode === 40) {
      this.selectedIndex = this.selectedIndex || this.selectedIndex === 0 ? this.selectedIndex + 1 : 0;
      if (this.selectedIndex > this.data.length - 1) {
        this.selectedIndex = 0;
      }

    } else if (this._optionListShow && event.keyCode === 13) {
      event.preventDefault();
      this._updateSelectedOption(this.data[this.selectedIndex]);
      this._optionListShow=false;
    }
  }

  ngOnDestroy(): void {
    this.sub$.unsubscribe();
  }
}
