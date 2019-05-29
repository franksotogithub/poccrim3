import { Component, Inject, ElementRef, OnInit, Input, OnDestroy } from '@angular/core';
import { Response } from '../models';

import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ApiService } from '../api.service';

import { Subscription }   from 'rxjs';


import 'pivottable/dist/pivot.min.js';
import 'pivottable/dist/pivot.min.css';
declare var jQuery: any;
declare var $: any;


@Component({
  selector: 'app-pivot-table',
  templateUrl: './pivot-table.component.html',
  styleUrls: ['./pivot-table.component.scss']
})

export class PivotTableComponent implements OnInit, OnDestroy {
  
  subscription: Subscription;
  data: Object[];
  parameters: any[];

  config: Object;

  private el: ElementRef;
  
  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private location: Location,
    @Inject(ElementRef)el: ElementRef
  ) {
    this.el = el;
    this.parameters = [
      { field: 'anio', label: 'Año', filter: '', status: false },
      { field: 'ccdd', label: 'Departamento', filter: '', status: false },
      { field: 'ccpp', label: 'Provincia', filter: '', status: false },
      { field: 'ccdi', label: 'Distrito', filter: '', status: false },
      { field: 'entidad', label: 'Entidad', filter: '', status: false },
      { field: 'generico', label: 'Genérico', filter: '', status: false },
      { field: 'especifico', label: 'Específico', filter: '', status: false },
      { field: 'modalidad', label: 'Modalidad', filter: '', status: false },
    ]
  }

  ngOnInit() {
  	
    this.subscription = this.apiService.loadedData$.subscribe(
      res => {
        console.log('stuff');
        let data = res.map(x => {
          let response = x._id;
          response['Denuncias'] = x.delitos
          return response;
        });
        console.log(data);
        this.updateTable(data);
      }
    );    
  }

  run(): void {
    let group_by = this.parameters.filter( x => x.status ).map( x => x.field ).join(',');
    let params = {
      groupby: group_by
    }
    this.parameters.filter( x => x.filter != '').forEach(x => {
      params[x.field] = x.filter.split(',');
    });
    console.log(params);
    let response = this.apiService.getIndicadorData(1, params).subscribe( res => {} );
    //console.log("response>>>", response);
  }

  updateTable(data: object[]): void {  

    console.log(data);

    this.data = data;  

    if (!this.el || !this.el.nativeElement || !this.el.nativeElement.children){
      console.log('cant build without element');
      return;
    }

    var container = this.el.nativeElement;
    var inst = jQuery(container);
    var targetElement = inst.find('#pivot');

    if (!targetElement){
      console.log('cant find the pivot element');
      return;
    }

    //this helps if you build more than once as it will wipe the dom for that element
    while (targetElement.firstChild){
      targetElement.removeChild(targetElement.firstChild);
    }        
    
    var tpl = $.pivotUtilities.aggregatorTemplates;
    var fmt = $.pivotUtilities.numberFormat({
      digitsAfterDecimal: 0,
      thousandsSeparator: ' ',
    });
    
    var derivers = $.pivotUtilities.derivers;
    var renderers = $.extend(
      $.pivotUtilities.renderers,
    );

    targetElement.pivotUI(this.data,{
      hiddenAttributes: ["Denuncias", "codigo_mapa"],
      rows: ["Departamento", "Provincia", "Distrito", "Generico","Especifico"],
      cols: ["Año"],
      aggregators: {
        "Denuncias": function() { return tpl.sum(fmt)(["Denuncias"])},            
      },
      onRefresh: function(){
      	console.log('refresh');
      	this.config = targetElement.data("pivotUIOptions");
      	console.log(this.config);
      }
    }, false, "es");
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.subscription.unsubscribe();
  } 

}
