import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { MenuArbolService } from '../menu-arbol.service';


@Component({
  selector: 'app-menu-principal',
  templateUrl: './menu-principal.component.html',
  styleUrls: ['./menu-principal.component.scss']
})
export class MenuPrincipalComponent implements OnInit {
  public dataArbol: any = null;
  prueba: any = false;
  configInit: any[] =[1,2,3];
  breadCrumb: any[];


  onClickMe() {
    this.prueba = !this.prueba;
  }
  constructor(private service: MenuArbolService) { }

  ngOnInit() {
    this.recibirData();
    this.iniciarMenu(this.configInit);

  }

  recibirData(){
    this.service.getmenuArbol().subscribe(
      dataArbol => {
        this.dataArbol = dataArbol;
        console.log(dataArbol);
      }
    );
  }

  iniciarMenu(configInit){
    let tamanioArray = configInit.length;

    configInit.forEach((valor, index) => {
      let iitem = this.dataArbol.filter(x => x.item.id == valor );
      this.breadCrumb.push(iitem);
    });

    console.log(this.breadCrumb);

  }

  enviarID(id){
    //ref.value;
    alert(id);
  }
}
