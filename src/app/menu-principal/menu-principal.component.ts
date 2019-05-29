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
  arrayBooleanMenu: any[] = [];
  configInit: any[] =[1,48,10071];
  breadCrumb: any[] = [];
  elementoArray: any;
  grupoArray: any[] = [];


  onClickMe(indice) {
    this.arrayBooleanMenu[indice] = !this.arrayBooleanMenu[indice];
  }
  constructor(private service: MenuArbolService) { }

  ngOnInit() {
    this.recibirData();
  }

  recibirData(){
    this.service.getmenuArbol().subscribe(
      dataArbol => {
        this.dataArbol = dataArbol;
        //console.log(dataArbol);
        this.iniciarMenu(this.configInit);
      }
    );


  }

  buscarItem(variable){
    /* Busca un array dentro del objeto y lo guarda para utilizar el nuevo array*/
    this.grupoArray.push(this.elementoArray);
    let iitem = this.elementoArray.filter(x => x.item_id == variable);
    this.elementoArray = iitem[0].children;
    this.breadCrumb.push(iitem[0]);

    this.arrayBooleanMenu.push(false);

  }


  iniciarMenu(configInit){
    this.elementoArray = this.dataArbol;
    configInit.forEach((valor, index) => {
      this.buscarItem(valor);
    });

  }

  enviarID(id,posicion, posicionItem,idpadre){
    let position = parseInt(posicion);
    let positionItem = parseInt(posicionItem);
    //let idpadre = parseInt(idpadre);
    //this.breadCrumb=[];
    //this.breadCrumb[2].push("Holi");
    //this.breadCrumb[position]=this.grupoArray[position][posicionItem];
    //console.log(this.grupoArray[position][posicionItem]);



      if(position + 1 == 1){
        console.log(this.breadCrumb.length + " , " + (position + 1));
        this.breadCrumb=[];
        this.breadCrumb[position]=this.grupoArray[position][positionItem];
        console.log(this.breadCrumb);
        this.breadCrumb[position + 1] = {name:"Seleccione por favor"};
        this.grupoArray[position + 1] = this.grupoArray[position][positionItem].children;

      }else if(position + 1 > 1 ){
        console.log(this.breadCrumb.length + " , " + (position + 1));
        this.breadCrumb[position]=this.grupoArray[position][positionItem];
        console.log(this.breadCrumb);
        this.breadCrumb[position + 1] = {name:"Seleccione por favor"};
        this.grupoArray[position + 1] = this.grupoArray[position][positionItem].children;
      }




  }

  verificarIdMenu(){

}


}
