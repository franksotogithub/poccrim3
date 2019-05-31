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
  configInit: any[] =[1,2,3];
  breadCrumb: any[] = [];
  elementoArray: any;
  grupoArray: any[] = [];


  constructor(private service: MenuArbolService) { }

  ngOnInit() {
    this.recibirData();
  }

  recibirData(){
    this.service.getmenuArbol().subscribe(
      dataArbol => {
        this.dataArbol = dataArbol;
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
    //this.breadCrumb[position]=this.grupoArray[position][posicionItem];


      /* Si el combo clikeado es el primero */
      if(position + 1 == 1){
        console.log(this.breadCrumb.length + " , " + (position + 1));
        this.breadCrumb=[];
        this.breadCrumb[position]=this.grupoArray[position][positionItem];
        console.log(this.breadCrumb);
        this.breadCrumb[position + 1] = {name:"Seleccione por favor"};
        this.grupoArray[position + 1] = this.grupoArray[position][positionItem].children;

      }else if(position + 1 > 1 ){
        if(this.grupoArray[position][positionItem].children.length > 0){
          let i;
          //console.log(this.breadCrumb.length + " , " + (position + 1));
          this.breadCrumb[position]=this.grupoArray[position][positionItem];
          //console.log(this.breadCrumb);

          for(i = position+1; i <= this.breadCrumb.length ; i++ ){
            this.breadCrumb.splice(i, 1);
          }
          this.breadCrumb[position + 1] = {name:"Seleccione por favor"};
          this.grupoArray[position + 1] = this.grupoArray[position][positionItem].children;
        }else{
          let i;
          if(position+1 < this.breadCrumb.length ){
            for(i = position+1; i <= this.breadCrumb.length ; i++ ){
              this.breadCrumb.splice(i, 1);
            }
          }

          this.breadCrumb[position] = {name:this.grupoArray[position][positionItem].name};
        }

      }




  }

}
