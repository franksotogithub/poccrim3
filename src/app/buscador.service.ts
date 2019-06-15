import {Injectable} from '@angular/core';
import {esriMapData} from './esri-map';
import {catchError, tap} from 'rxjs/operators';
import {HttpClient, HttpHeaders, HttpParams, HttpErrorResponse} from '@angular/common/http';
import {BehaviorSubject, Observable, throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BuscadorService {
  private urlSearch = 'http://192.168.34.39:3002/ubicacion/buscar';
  private search = '';
  private ubicacionesDataSource = new BehaviorSubject<any>('');

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
  }

  buscarUbicaciones(params: any): Observable<any> {
    //this.search = value;

    //params['search'] = value;

    return this.http.get<esriMapData>(this.urlSearch, { params : params}).pipe(
      tap(response => {
        console.log(response);
        this.ubicacionesDataSource.next(response);

      }),
      catchError(this.handleError)
    );
  }

  constructor(private http: HttpClient) {

  }
}
