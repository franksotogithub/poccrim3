import { Component, Inject, ElementRef, OnInit, Input, OnDestroy } from '@angular/core';
import { Response } from '../models';

import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ApiService } from '../api.service';

import { Subscription }   from 'rxjs';

import { DragulaService } from 'ng2-dragula';

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

  MANY_ITEMS = 'MANY_ITEMS';

  targetElement: any;
  
  subscription: Subscription;
  data: Object[];
  parameters: any[];

  config: any;

  cols: string;
  rows: string;

  pool: any[];
  colsArray: any[];
  rowsArray: any[];

  subs = new Subscription();
    
  private el: ElementRef;
  
  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private location: Location,
    private dragulaService: DragulaService,
    @Inject(ElementRef)el: ElementRef
  ) {
    this.el = el;
    this.parameters = [
      { field: 'anio', label: 'Año', filter: '', status: true },
      { field: 'ccdd', label: 'Departamento', filter: '', status: true },
      { field: 'ccpp', label: 'Provincia', filter: '', status: false },
      { field: 'ccdi', label: 'Distrito', filter: '', status: false },
      { field: 'entidad', label: 'Entidad', filter: '', status: false },
      { field: 'generico', label: 'Genérico', filter: '', status: false },
      { field: 'especifico', label: 'Específico', filter: '', status: false },
      { field: 'modalidad', label: 'Modalidad', filter: '', status: false },
    ];
    this.pool = [
      { field: 'ccpp', label: 'Provincia', filter: '', status: false },
      { field: 'ccdi', label: 'Distrito', filter: '', status: false },
      { field: 'entidad', label: 'Entidad', filter: '', status: false },
      { field: 'generico', label: 'Genérico', filter: '', status: false },
      { field: 'especifico', label: 'Específico', filter: '', status: false },
      { field: 'modalidad', label: 'Modalidad', filter: '', status: false },
    ];
    this.colsArray = [
      { field: 'anio', label: 'Año', filter: '', status: true },      
    ];
    this.rowsArray = [      
      { field: 'ccdd', label: 'Departamento', filter: '', status: true },      
    ];
    this.cols = 'Año';
  	this.rows = 'Departamento';

    this.subs.add(dragulaService.dropModel(this.MANY_ITEMS)
      .subscribe(({ el, target, source, sourceModel, targetModel, item }) => {
        /*
        console.log('dropModel:');
        console.log(el);
        console.log(source);
        console.log(target);
        console.log(sourceModel);
        console.log(targetModel);
        console.log(item);
        */
      })
    );
    this.subs.add(dragulaService.removeModel(this.MANY_ITEMS)
      .subscribe(({ el, source, item, sourceModel }) => {
        /*
        console.log('removeModel:');
        console.log(el);
        console.log(source);
        console.log(sourceModel);
        console.log(item);
        */
      })
    );

  }

  ngOnInit() {
  	if (!this.el || !this.el.nativeElement || !this.el.nativeElement.children){
      console.log('cant build without element');
      return;
    }    
  	this.targetElement = jQuery(this.el.nativeElement).find('#pivot');
  	this.config = this.getInitConfig();  	
    this.subscription = this.apiService.loadedData$.subscribe(
      res => {
        let data = res.map(x => {
          let response = x._id;
          response['Denuncias'] = x.delitos
          return response;
        });
        this.data = data;
        this.updateTable();
      }
    ); 
    this.run();
  }

  run(): void {
    this.config.cols = this.colsArray.map(x=>x.label);
    this.config.rows = this.rowsArray.map(x=>x.label);
    let group_by = this.colsArray.concat(this.rowsArray).map( x => x.field ).join(',');
    let params = { groupby: group_by }
    //this.parameters.filter( x => x.filter != '').forEach(x => {
    this.pool.concat(this.colsArray).concat(this.rowsArray).filter( x => x.filter != '').forEach(x => {
      params[x.field] = x.filter.split(',');
    });
    let response = this.apiService.getIndicadorData(1, params).subscribe( res => {} );
  }

  updateTable(): void {
    //this helps if you build more than once as it will wipe the dom for that element
    while (this.targetElement.firstChild){
      this.targetElement.removeChild(this.targetElement.firstChild);
    }        
	this.targetElement.pivotUI(this.data, this.config, true, "es");
  }

  getInitConfig(): object {
  	var tpl = $.pivotUtilities.aggregatorTemplates;
    var fmt = $.pivotUtilities.numberFormat({
      digitsAfterDecimal: 0,
      thousandsSeparator: ' ',
    });
    
    var derivers = $.pivotUtilities.derivers;
    var renderers = $.extend(
      $.pivotUtilities.renderers,
    );

  	let config = {
      hiddenAttributes: ["Denuncias", "codigo_mapa"],
      rows: this.rows.split(','),
		  cols: this.cols.split(','),
		  aggregators: {
			  "Denuncias": function() { return tpl.sum(fmt)(["Denuncias"])},            
		  },
		  onRefresh: function(){
  			console.log('refresh');			
		  }
    };
  	return config;
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.subscription.unsubscribe();
    this.subs.unsubscribe();
  } 

}