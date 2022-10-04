import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import LocaleRu from '@angular/common/locales/ru';

import {AppComponent} from './app.component';
import {HttpClientModule} from '@angular/common/http';
import {registerLocaleData} from '@angular/common';

registerLocaleData(LocaleRu, 'ru-RU');

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
  ],
  providers: [
    {provide: LocaleRu, useValue: 'ru-RU'},
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
