import { Component, OnInit, Input, Output, EventEmitter,
  Renderer2, OnDestroy, AfterViewInit, HostListener, ViewChild, ElementRef, NgZone} from '@angular/core';
import { coerceBooleanProperty} from '@angular/cdk/coercion';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switch';
import 'rxjs/add/operator/filter';

@Component({
  selector: 'app-search-select',
  templateUrl: './search-select.component.html',
  styleUrls: ['./search-select.component.scss']
})
export class SearchSelectComponent implements OnInit, OnDestroy, AfterViewInit {

  selectedIndex = 0; // 已选择项option索引
  keyDownIndex = 0; // 键盘上下选择索引
  _optionListShow = false; // option list 下拉框是否展开
  private _documentListen: Function; // document事件解绑函数
  private _initialized = false; // OnInit`钩子是否已经执行过
  private _sub$: any;
  _searchVal: string;
  @ViewChild('inputElement') inpElementRef: ElementRef;
  @Output()
  nzSearchChange: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  nzOpenChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output()
  ngModelChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Input()
  nzNotFoundContent: any;
  @Input()
  nzPlaceHolder: string;
  @Input()
  nzOptionLabel: string;
  @Input()
  nzOptionValue: string;

  private _value: any; // select value 双向绑定
  @Output() valueChange = new EventEmitter();
  @Input()
  public get value(): any {
    return this._value;
  }
  public set value(newValue: any) {
    if (newValue !== this._value) {
      this.writeValue(newValue);
    }
  }

  private _data: Array<object>= [];
  @Input()
  public get data(): Array<object> | object[] {
    return this._data;
  }
  public set data(value: Array<object> | object[]) {
    this._data = value instanceof Array ? value : new Array(value);
    this._initSelectOption();
  }

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

  constructor(private _renderer: Renderer2, private _elementRef: ElementRef, private _ngZone: NgZone) { }

  _showClear(event: Event) {
    event.stopPropagation();
    if (this._value == null || this._value === '' || this._disabled || this._optionListShow) {
      return;
    }
    this._clearIcon = true;
  }
  _hiddenClear(event: Event) {
    event.stopPropagation();
    this._clearIcon = false;
  }

  clearPlaceholder(searchVal: string) {
    this._searchVal = searchVal;
    if (searchVal.length) {
      this.nzPlaceHolder = '';
    }else {
      this.nzPlaceHolder = this.value;
    }
  }

  ngAfterViewInit() {
    if (this.value) {
      this._initSelectOption();
    }
  }

  @HostListener('click', ['$event'])
  _toggleClick(event: Event) {
    event.stopPropagation();
    if (this._disabled) {
      return;
    }
    this._clearIcon = false;
    this._optionListShow = !this._optionListShow;
    if (this._optionListShow) {
      this.nzPlaceHolder = this.value;
      this.keyDownIndex = this.selectedIndex;
      this._documentListen = this._renderer.listen('document', 'click', () => {
        this._optionListShow = false;
        this._documentListen();
        this._documentListen = null;
      });
      setTimeout(() => {
        this.inpElementRef.nativeElement.value = '';
        this.inpElementRef.nativeElement.focus();
      }, 0);
    }else {
      this._documentListen();
    }
    this.nzOpenChange.emit(this._optionListShow);
  }

  onClearSelected(event) {
    event.stopPropagation();
    this.value = null;
  }

  // 初始化高亮已选择项
  _initSelectOption() {
    const selectedItem = this.data.find(item => {
      return item[this.nzOptionLabel] === this.value;
    });
    this.selectedIndex = this.data.indexOf(selectedItem);
  }
  // 更改option选中状态
  _updateSelectedOption(selected) {
    this._updateInputVal(selected);
    this.selectedIndex = this.data.indexOf(selected);
  }
  // 更新input值
  _updateInputVal(newVal) {
    this.value = newVal[this.nzOptionLabel];
  }
  public writeValue (value: any): void {
    this._value = value;
    if (this._initialized) {
      this._initSelectOption();
      this.valueChange.emit(this.value);
      this.ngModelChange.emit(this.value);
    }
  }

  ngOnInit() {
    this._initialized = true;
    this._sub$ = Observable.fromEvent<KeyboardEvent>(this.inpElementRef.nativeElement, 'keyup')
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

  get isNotFoundDisplay(): boolean{
    return !this.data.length && !!this._searchVal;
  }

  // 键盘上下选择
  onKeyDownChangeSelected(event: KeyboardEvent) {
    if ([ 38, 40, 13 ].indexOf(event.keyCode) > -1) {
      event.preventDefault();
      event.stopPropagation();
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
        this._updateSelectedOption(this.data[this.keyDownIndex]);
        this._optionListShow = false;
      }
    }
  }

  _scrollIntoView(): void {
    if (this.data && this.data.length) {
      this._ngZone.runOutsideAngular(() => {
        setTimeout(() => {
          const targetLi = this._elementRef.nativeElement.querySelector('.item-keydown-selected');
          if (!!targetLi && targetLi.scrollIntoView) {
            targetLi.scrollIntoView(false);
          }
        }, 0);
      });
    }
  }

  ngOnDestroy(): void {
    this._sub$.unsubscribe();
    if (this._documentListen) {
      this._documentListen();
    }
  }
}
