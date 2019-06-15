import {Injectable} from '@angular/core';

import {HttpClient, HttpHeaders, HttpParams, HttpErrorResponse} from '@angular/common/http';

import {catchError, groupBy, map, tap} from 'rxjs/operators';

import {ReplaySubject, Subject, Observable, of, throwError, BehaviorSubject} from 'rxjs';

import {esriMapData} from './esri-map';
import {ApiService} from './api.service';


declare var palette: any;


@Injectable({
  providedIn: 'root'
})
export class EsriMapService {
  
  private url = 'http://192.168.34.39:8047/mapa/tematico';  

  private proyecto = 'frecuencias';
  private anio = 2011;
  private variable = 'P010100';
  private ambito = 0;

  private tipoValor = 1;

  private ambitoSource = new BehaviorSubject(0);
  private ambitoSourceLegenda = new BehaviorSubject(0);
  private anioSource = new BehaviorSubject(2018);
  private variableSource = new BehaviorSubject('P010100');
  private clickBtnResetPeruSource = new BehaviorSubject(0);
  private clickBtnAddGraphicSource = new BehaviorSubject(-1);

  private esriMapDataSource = new BehaviorSubject<any>(0);
  private esriMapDataSources = new BehaviorSubject<any[]>([]);
  private estratosDataSources = new BehaviorSubject<any[]>([]);
  private anios = new BehaviorSubject< any[] >([]);
  private colorGris = '#9c9c9c';
  private colores = [];
  private group = 'ccdd';
  private rows = [];
  private datoTabla;
  private ambitos = [
    {id: 0, text: 'DEPARTAMENTO',  group: 'ccdd' , rows :[ {name:'ccdd',label:'Departamento'}] },
    {id: 1, text: 'PROVINCIA', group: 'ccdd,ccpp', rows :[ {name:'ccdd',label:'Departamento'} , {name:'ccpp',label:'Provincia'} ] },
    {id: 2, text: 'DISTRITO', group: 'ccdd,ccpp,ccdi', rows :[ {name:'ccdd',label:'Departamento'}, {name:'ccpp',label:'Provincia'}, {name:'ccdi',label:'Distrito'} ]},
  ];



  constructor(private http: HttpClient , private dataMapService: ApiService) {
    this.ambitoSource.next(0);
    /*this.obtenerDatosMapaTematico().subscribe(res => {
    });*/
    this.obtenerDatosMapaTematico();

    this.dataMapService.getAnios().subscribe(anios=>
    {
      if(this.anios.value!==anios){
        this.anios.next(anios);
      }

    });

    this.dataMapService.loadedData$.subscribe(
      response => {
        this.datoTabla = response;
        var res = response.filter(x => x._id['Año'] == this.anio);
        var result =this.formatearDato(res);
        this.esriMapDataSource.next(result );

        this.ambitoSourceLegenda.next(result["ambito"]);

      }
    );


  }

  getAmbitoSourceLegenda() : Observable<any> {
    return this.ambitoSourceLegenda;
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  };

  getColorPorDato(data, rangos, colores) {
    let datax = [];
    let valor;
    let codigo = '';
    let j = 0;
    let color = '';

    data.forEach(el => {
      codigo = el.codigo;
      valor = parseFloat(el.valor);
      if (!(valor == null || valor == undefined)) {
        for (j = 0; j < rangos.length; j++) {
          if (rangos[j].min_valor <= valor && rangos[j].max_valor >= valor) {
            color = colores[j].color;
            el['estrato'] = j;
            el['color'] = color;
          }
        }
      } else {
        el['estrato'] = -1;
        el['color'] = this.colorGris;
      }
      datax.push(el);
    });
    return datax;
  }

  getRandomInt(min, max): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  getAnios(): Observable<any> {
    return this.anios;
  }

  getColores(index, cantNiveles) {
    var listScheme = [];
    palette.listSchemes('cb-sequential').forEach(function(e) {
      listScheme.push(e.scheme_name);
    });
    var i = this.getRandomInt(0, listScheme.length - 1);
    var p = palette(listScheme[index], cantNiveles);
    return p.map(function(obj, index) {
      var rObj = {color: '#' + obj, id: (index), nro_break: (index)};
      return rObj;
    });

  }

  crearRangos(arrayData, cantNiveles: number) {
    arrayData = arrayData.sort(function(a, b) {
      return a - b;
    });
    var rangos = [];
    var i = 0;
    var el = {'min_valor': 0, 'max_valor': 0, 'label': ''};
    var index_acu = 0;
    var index_min = 0;
    var index_max = 0;
    var cant: number = arrayData.length;
    var coeficiente = Math.trunc(cant / cantNiveles);
    var modulo = cant % cantNiveles;
    var max = arrayData[cant - 1];

    for (i = 0; i < cantNiveles; i++) {
      el = {'min_valor': 0, 'max_valor': 0, 'label': ''};
      index_min = index_acu;
      if (modulo > 0) {
        index_acu = index_acu + (coeficiente + 1);
        modulo--;
      } else {
        index_acu = index_acu + coeficiente;
      }
      index_max = index_acu;
      el.min_valor = arrayData[index_min];

      if (!(i == (cantNiveles - 1))) {
        el.max_valor = arrayData[index_max];
      } else {
        el.max_valor = max;
      }
      el.label = 'De ' + String(el.min_valor) + ' a ' + String(el.max_valor);
      rangos.push(el);
    }
    return rangos;

  }


  getEsriMapData(proyecto, version, variable, ambito, tipoValor) {


    const url = `${this.url}/${proyecto}/${version}/${variable}/${ambito}/${tipoValor}/`;
    return this.http.get<esriMapData>(url).pipe(
      tap(response => {


      }),
      catchError(this.handleError)
    );
  }

  /*
  obtenerDatosMapaTematico() {

    const url = `${this.url}/${this.proyecto}/${this.anio}/${this.variable}/${this.ambito}/${this.tipoValor}/`;
    console.log('url>>>',url);
    return this.http.get<esriMapData>(url).pipe(
      tap(response => {

        this.colores = this.getColores(0, 5);
        response.id = this.ambito;
        var arrayData = response.data.map(x => x.valor);
        var rangos = this.crearRangos(arrayData, 5);
        response.rangos = rangos;
        response.colores = this.colores;
        response.data = this.getColorPorDato(response.data, response.rangos, response.colores);
        console.log(response);
        this.esriMapDataSource.next(response);

      }),
      catchError(this.handleError)
    );
  }

  */

    obtenerDatosMapaTematico(){

      let params=this.dataMapService.getParametros();
      let config = this.dataMapService.getConfig();
      let query;
      let ambitos =['ccdd','ccpp','ccdi'];

      if(params['rows']!==undefined){
        params['rows']=params['rows'].filter((e,index)=>{ !(ambitos.includes(e.name))});

        params['rows']=params['rows'].concat(this.rows);
        query = this.dataMapService.obtenerQuery(params);
        this.dataMapService.updateConfig(config);
      }

      this.dataMapService.getIndicadorData(1, query).subscribe( res => {} );



    }

  formatearDato(response) {

    var res={};
    var datos,rangos,arrayData=[];
    this.colores=this.getColores(0,5);

    datos=response.map(x => {
      return {'codigo': x._id.codigo_mapa, 'valor': x.delitos};
    });

    datos.forEach(e => {
      arrayData.push(e.valor);
    });
    rangos=this.crearRangos(arrayData,5);
    var datosx=this.getColorPorDato(datos,rangos,this.colores);
    var r=response[0]._id;
    (r.hasOwnProperty('Distrito'))?this.ambito=2:(r.hasOwnProperty('Provincia'))?this.ambito=1:(r.hasOwnProperty('Departamento'))?this.ambito=0:this.ambito=-1;

    res['id']=this.ambito;
    res['rangos']=rangos;
    res['colores']=this.colores;
    res['data']=datosx;
    res['ambito']=this.ambito;
    return res;
  }


  getEsriMapDataSources(): Observable<esriMapData[]> {
    return this.esriMapDataSources;
  }


  setEsriMapDataSources(data) {
    return this.esriMapDataSources.next(data);
  }


  getEsriMapDataSource(): Observable<esriMapData> {
    return this.esriMapDataSource;
  }

  setEsriMapDataSource(data) {
    return this.esriMapDataSource.next(data);
  }


  getAmbito(): Observable<any> {

    return this.ambitoSource;
  }

  cambiarAmbito(ambito) {
    this.ambito = ambito;
    this.group = this.ambitos.find(x=>x.id ===ambito).group;
    this.rows = this.ambitos.find(x=>x.id ===ambito).rows;


    this.ambitoSource.next(this.ambito);
    return ambito;
  }

  getAnio(): Observable<any> {
    return this.anioSource;
  }

  cambiarAnio(anio) {
    const res = this.datoTabla.filter(x => x._id['Año'] == anio);

    //console.log('res>>>',res);
    this.anio = anio;
    this.anioSource.next(anio);
    this.esriMapDataSource.next( this.formatearDato(res));
    return anio;
  }

  getVariable(): Observable<any> {

    return this.variableSource;
  }


  cambiarVariable(variable) {
    this.variable = variable;
    this.variableSource.next(variable);

    return variable;
  }

  clickBtnResetPeru(value) {
    this.clickBtnResetPeruSource.next(value);
  }



  getBtnResetPeruSource(): Observable<any> {
    return this.clickBtnResetPeruSource;
  }


  clickBtnAddGraphic(value) {
    this.clickBtnAddGraphicSource.next(value);
  }


  getBtnAddGraphicSource(): Observable<any> {
    return this.clickBtnAddGraphicSource;
  }

  getEstratosDataSources(): Observable<any> {
      return this.estratosDataSources;
  }

  setEstratosDataSources(estratos){

    this.estratosDataSources.next(estratos);
  }


}
