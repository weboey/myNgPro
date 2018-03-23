import { Component, OnInit, Input, Output, EventEmitter ,Renderer2,OnDestroy,ViewChild,ElementRef,NgZone,AfterContentInit,ContentChildren,
  Directive,QueryList} from '@angular/core';
import { coerceBooleanProperty} from '@angular/cdk/coercion';
import { Observable } from 'rxjs';
import "rxjs/add/operator/map";
import "rxjs/add/operator/debounceTime";
import "rxjs/add/operator/distinctUntilChanged";
import "rxjs/add/operator/switch";
import "rxjs/add/operator/filter";


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
  keyDownIndex:number=0;
  _optionListShow:boolean=false;
  private _documentListen: Function; // document事件解绑函数

  @Output()
  nzSearchChange: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  nzOpenChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output()
  nzModelChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Input()
  nzNotFoundContent:any;
  @Input()
  nzPlaceHolder:string="";
  @Input()
  nzOptionLabel:string;
  @Input()
  nzOptionValue:string;

  private _value: any; // select value 双向绑定
  @Output() valueChange = new EventEmitter();
  @Input()
  public get value(): any {
    return this._value;
  }
  public set value(newValue: any) {
    if (newValue !== this._value) {
      this._value=newValue;
      this._initSelectOption();
      this.valueChange.emit(this.value);
    }
  }

  private _data: Array<object>=[];
  @Input()
  public get data(): Array<object> | object[] {
    return this._data;
  }
  public set data(value: Array<object> | object[]) {
    this._data = value instanceof Array ? value : new Array(value);
    this._initSelectOption();
  }

  constructor(private _renderer: Renderer2,private _elementRef: ElementRef,private _ngZone: NgZone) { }

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
    if(this._value==null || this._value=='' || this._disabled || this._optionListShow){
      return
    }
    this._clearIcon=true;
  }
  _hiddenClear(event: Event){
    event.stopPropagation();
    this._clearIcon=false;
  }

  private _searchVal:string;
  clearPlaceholder(searchVal:string){
    this._searchVal=searchVal;
    if(searchVal.length){
      this.nzPlaceHolder="";
    }else{
      this.nzPlaceHolder=this.value;
    }
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
    if(this._optionListShow){
      this.nzPlaceHolder=this.value;
      this.keyDownIndex=this.selectedIndex;
      this._documentListen = this._renderer.listen('document', 'click', () => {
        this._optionListShow = false;
        this._documentListen();
        this._documentListen = null;
      });
      setTimeout(()=>{
        this.inpElementRef.nativeElement.value="";
        this.inpElementRef.nativeElement.focus();
      },0)
    }else{
      this._documentListen();
    }
    this.nzOpenChange.emit(this._optionListShow);
  }

  onClearSelected(event){
    event.stopPropagation();
    this.value=null;
    this.nzModelChange.emit(this.value);
  }

  //初始化高亮已选择项
  _initSelectOption(){
    let selectedItem=this.data.find(item=>{
      return item[this.nzOptionLabel]==this.value
    })
    this.selectedIndex=this.data.indexOf(selectedItem);
  }
  //更改option选中状态
  _updateSelectedOption(selected){
    this._updateInputVal(selected);
    this.selectedIndex=this.data.indexOf(selected);
  }

  //更新input值
  _updateInputVal(newVal){
    this.value=newVal[this.nzOptionLabel];
    this.nzModelChange.emit(this.value);
  }

  ngOnInit() {
    this.sub$ = Observable.fromEvent<KeyboardEvent>(this.inpElementRef.nativeElement, 'keyup')
      .map((e: any) => e.target.value)
      // .filter((text: string) => text!='')
      .debounceTime(300)
      .distinctUntilChanged()
      .subscribe(
        inputVal => {
          this.nzSearchChange.next(inputVal);
        }
      );
  }

  get isNotFoundDisplay():boolean{
    return !this.data.length && !!this._searchVal
  }

  //键盘上下选择
  onKeyDownChangeSelected(event:KeyboardEvent) {
    if (this._optionListShow && event.keyCode === 38) {
      this.keyDownIndex = this.keyDownIndex ? this.keyDownIndex - 1 : this.data.length - 1;
      if (this.keyDownIndex < 0) {
        this.keyDownIndex = this.data.length - 1;
      }
      this._scrollIntoView();
    } else if (this._optionListShow && event.keyCode === 40) {
      this.keyDownIndex = this.keyDownIndex || this.keyDownIndex === 0 ? this.keyDownIndex + 1 : 0;
      if (this.keyDownIndex > this.data.length - 1) {
        this.keyDownIndex = 0;
      }
      this._scrollIntoView();
    } else if (this._optionListShow && event.keyCode === 13) {
      event.preventDefault();
      this._updateSelectedOption(this.data[this.keyDownIndex]);
      this._optionListShow=false;
    }
  }

  _scrollIntoView(): void {
    if (this.data && this.data.length) {
      this._ngZone.runOutsideAngular(() => {
        setTimeout(() => {
          const targetLi = this._elementRef.nativeElement.querySelector(".item-keydown-selected");
          targetLi && targetLi.scrollIntoViewIfNeeded && targetLi.scrollIntoViewIfNeeded(false)
        }, 0);
      });
    }
  }

  ngOnDestroy(): void {
    this.sub$.unsubscribe();
    if (this._documentListen) {
      this._documentListen();
    }
  }
}
