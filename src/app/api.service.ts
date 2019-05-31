import { Injectable, EventEmitter, Output } from '@angular/core';
import { Observable, of } from 'rxjs';

import { Response, Dimension } from './models';
import { MessageService } from './message.service';

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { catchError, map, tap } from 'rxjs/operators';

import { ReplaySubject, Subject }    from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

	private api_url = 'http://192.168.34.16:8877/poccrim/';

	private loadedDataSource = new ReplaySubject<Response[]>(1);
	private loadedDimensionsSource = new ReplaySubject<Dimension[]>(1);

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
			    this.loadedDataSource.next(response);
			}),							
			catchError(this.handleError<Response[]>(`getIndicadorData id=${id}`))
		);			
	}

	getIndicadorDimensiones(id: number, params: any): Observable<Object[]> {
		const url = `${this.api_url}dimensiones/`;
		return this.http.get<Dimension[]>(url, { params: params }).pipe(
			tap(_ => this.log(`fetched indicador data id=${id}`)),
			tap(response => {		
				console.log("response>>", response);		
			    this.loadedDimensionsSource.next(response);
			}),							
			catchError(this.handleError<Dimension[]>(`getIndicadorDimensiones id=${id}`))
		);			
	}

}
