import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderPrincipalComponent } from './header-principal/header-principal.component';
import { MenuPrincipalComponent } from './menu-principal/menu-principal.component';
import { PivotTableComponent } from './pivot-table/pivot-table.component';

import { HttpClientModule } from '@angular/common/http';

import { DragulaModule } from 'ng2-dragula';
import { FilterInputComponent } from './filter-input/filter-input.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderPrincipalComponent,
    MenuPrincipalComponent,
    PivotTableComponent,
    FilterInputComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    DragulaModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
