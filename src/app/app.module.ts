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
import { HighchartsChartModule } from 'highcharts-angular';

import { FilterInputComponent } from './filter-input/filter-input.component';
import { EsriMapComponent } from './esri-map/esri-map.component';
import { HerramientasMapComponent } from './herramientas-map/herramientas-map.component';
import { LegendaMapComponent } from './legenda-map/legenda-map.component';
import { DatacrimChartComponent } from './datacrim-chart/datacrim-chart.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderPrincipalComponent,
    MenuPrincipalComponent,
    PivotTableComponent,
    FilterInputComponent,
    EsriMapComponent,
    HerramientasMapComponent,
    LegendaMapComponent,
    DatacrimChartComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    DragulaModule.forRoot(),
    HighchartsChartModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
