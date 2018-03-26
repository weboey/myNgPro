import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { AppComponent } from './app.component';
import { InputTooltipComponent } from './input/input-tooltip/input-tooltip.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { SelectSearchComponent } from './select-search/select-search.component';
import { SearchSelectComponent } from './search-select/search-select.component';
@NgModule({
  declarations: [
    AppComponent,
    InputTooltipComponent,
    SelectSearchComponent,
    SearchSelectComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule, OverlayModule,
    BrowserAnimationsModule,
    NgZorroAntdModule.forRoot()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
