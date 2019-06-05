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
  
  subsData: Subscription;
  subsDimensions: Subscription;
  subsDragula = new Subscription();

  data: Object[];
  parameters: any[];
  filters: object;

  config: any;

  cols: string;
  rows: string;

  pool: any[];
  colsArray: any[];
  rowsArray: any[];

  dimensiones: any[];
    
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
    
    /*
    this.colsArray = [
      { field: 'anio', label: 'Año', filter: '', status: true },      
    ];
    this.rowsArray = [      
      { field: 'ccdd', label: 'Departamento', filter: '', status: true },      
    ];
    */
    this.pool = [];
    this.colsArray = [];
    this.rowsArray = [];

    this.cols = 'Año';
  	this.rows = 'Departamento';

    this.filters = {};

    this.subsDragula.add(dragulaService.dropModel(this.MANY_ITEMS)
      .subscribe(({ el, target, source, sourceModel, targetModel, item }) => {
        //console.log('el', el);
        //console.log('target', target);
        //console.log('source', source);
        //console.log('sourceModel', sourceModel);
        //console.log('targetModel', targetModel);        
        //console.log('item', item); 
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
    this.subsData = this.apiService.loadedData$.subscribe(
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
    this.subsDimensions = this.apiService.loadedDimensions$.subscribe(
      res => {
        console.log('res_dimensions', res);
        this.dimensiones = res;
        this.pool = res.filter(x=>x.name!='ccdd' && x.name!='anio');
        this.rowsArray = res.filter(x=>x.name=='ccdd');
        this.colsArray = res.filter(x=>x.name=='anio');
      }
    ); 
    this.apiService.getIndicadorDimensiones(1, {}).subscribe( res => {
      this.run();
    } );
    
  }

  run(): void {
    this.pool = this.pool.filter(x=>x!=undefined);
    this.colsArray = this.colsArray.filter(x=>x!=undefined);
    this.rowsArray = this.rowsArray.filter(x=>x!=undefined);
    console.log('pool', this.pool);
    console.log('cols', this.colsArray);
    console.log('rows', this.rowsArray);
    console.log('filters01: ', this.filters);
    console.log(this.dimensiones);
    let r = {};
    this.dimensiones.forEach(x=>{
      console.log(x);
      if(!x.all){
        let values = x.options.filter(y=>y.selected) 
        if(values.length>0){
          r[x.name] = values.map(z=>z.id)
        } 
      }           
    });
    r = this.filters;
    this.config.cols = this.colsArray.map(x=>x.label);
    this.config.rows = this.rowsArray.map(x=>x.label);
    console.log('table_cols', this.config.cols);
    console.log('table_cols', this.config.rows);
    console.log('to_group_by', this.colsArray.concat(this.rowsArray));
    let group_by = this.colsArray.concat(this.rowsArray).map( x => x.name ).join(',');
    let params = { groupby: group_by }
    //this.parameters.filter( x => x.filter != '').forEach(x => {    
    r['groupby'] = group_by;
    console.log(r);
    let response = this.apiService.getIndicadorData(1, r).subscribe( res => {} );
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
    this.subsData.unsubscribe();
    this.subsDimensions.unsubscribe();
    this.subsDragula.unsubscribe();     
  } 

}
