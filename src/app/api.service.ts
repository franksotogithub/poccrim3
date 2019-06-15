import { Injectable, EventEmitter, Output } from '@angular/core';
import {config, Observable, of} from 'rxjs';

import { Response, Dimension } from './models';
import { MessageService } from './message.service';

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { catchError, map, tap } from 'rxjs/operators';

import { ReplaySubject, Subject ,BehaviorSubject}    from 'rxjs';
import {esriMapData} from './esri-map';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

	//private api_url = 'http://192.168.34.16:8877/poccrim/';
	private api_url = 'http://devindica.inei.gob.pe/api/poccrim/';

	private loadedDataSource = new ReplaySubject<Response[]>(1);
	private loadedDimensionsSource = new ReplaySubject<Dimension[]>(1);
  private anios = new BehaviorSubject< any[] >([]);

  //private ambitoSource = new BehaviorSubject(0);

  private parametros ={};
  private config={};
  //private anios =[];
	loadedData$ = this.loadedDataSource.asObservable();
	loadedDimensions$ = this.loadedDimensionsSource.asObservable();

	constructor(	
		private http: HttpClient,
		private messageService: MessageService
	) {}

	private log(message: string) {
		this.messageService.add(`IndicadorService: ${message}`)
	}

	private handleError<T> (operation = 'operation', result?: T) {
		return (error: any): Observable<T> => {
			// TODO: send the error to remote logging infrastructure
			console.error(error); // log to console instead
			// TODO: better job of transforming error for user consumption
			this.log(`${operation} failed: ${error.message}`);
			// Let the app keep running by returning an empty result.
			return of(result as T);
		};
	}

	getIndicadorData(id: number, params: any): Observable<Object[]> {
		const url = `${this.api_url}delitos/`;
		return this.http.get<Response[]>(url, { params: params }).pipe(
			tap(_ => this.log(`fetched indicador data id=${id}`)),
			tap(response => {
			    //this.parametros=params;
			    this.loadedDataSource.next(response);
			}),							
			catchError(this.handleError<Response[]>(`getIndicadorData id=${id}`))
		);			
	}

	getParametros(): any {
	  return this.parametros;
  }

  setParametros(params) {
    this.parametros=params;
  }

  getConfig():any{
	  return this.config;
  }
  getUnique(arr){

    const final = [ ];

    arr.map((e,i)=> !final.includes(e) && final.push(e) )

    return final;
  }

  updateConfig(config){
    this.config =config;
    this.config['cols'] = this.getUnique(this.parametros['cols'].map(x=>x.label));
    this.config['rows'] = this.getUnique(this.parametros['rows'].map(x=>x.label));
    console.log('config>>',config);
    return this.config;
  }

  setAnios(anios){
	  this.anios.next(anios);
  }

  getAnios(): Observable<any> {
	  return this.anios;
  }

  obtenerQuery(params):any{

    let query={};
    this.parametros=params;
    this.config=config;
    let group_by = this.getUnique(this.parametros['cols'].concat(this.parametros['rows'])).map( x => x.name ).join(',');

    query=Object.assign({}, this.parametros['filters']);
    query['groupby'] = group_by;

    console.log('this.parametros>>>',this.parametros);
    return query;
  }

	getIndicadorDimensiones(id: number, params: any): Observable<Object[]> {
		const url = `${this.api_url}dimensiones/`;
		return this.http.get<Dimension[]>(url, { params: params }).pipe(
			tap(_ => this.log(`fetched indicador data id=${id}`)),
			tap(response => {		
				console.log("response dimensiones>>", response);
			    this.loadedDimensionsSource.next(response);
			}),							
			catchError(this.handleError<Dimension[]>(`getIndicadorDimensiones id=${id}`))
		);			
	}

}
