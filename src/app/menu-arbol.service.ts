import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class MenuArbolService {

  constructor(private http: HttpClient) { }

  getmenuArbol(): Observable<any> {
    //const url = 'http://192.168.34.16:8877/poccrim/menu_principal/?format=json';
    const url = 'http://devindica.inei.gob.pe/api/poccrim/menu_principal/?format=json';
    return this.http.get(url);
  }

}


