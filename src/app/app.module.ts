import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {LoginModule} from './login/login.module';
import {HeaderComponent} from './shared/components/header/header.component';
import {SharedModule} from './shared/shared.module';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';

@NgModule({
  declarations: [AppComponent],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    RouterModule,
    FormsModule,
    LoginModule,
    SharedModule,
  ],
  exports: [HeaderComponent],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
