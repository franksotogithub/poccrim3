import {Component, OnInit} from '@angular/core';
import {EsriMapService} from '../esri-map.service';
import {BuscadorService} from '../buscador.service';


@Component({
  selector: 'app-herramientas-map',
  templateUrl: './herramientas-map.component.html',
  styleUrls: ['./herramientas-map.component.scss']
})
export class HerramientasMapComponent implements OnInit {
  private itemsUbicacion = [
    {id: '0', text: ''},

  ];

  private search = '';

  private itemSelectedUbicacion = this.itemsUbicacion[0];

  constructor(private esriMapService: EsriMapService, private buscadorService: BuscadorService) {
  }

  selectedUbicacion(value: any) {
    console.log('selectedUbicacion>>>', value);
    //this.esriMapService.cambiarAnio(value.id);
  }

  btnResetPeru(value: any) {
    console.log('click peru');
    this.esriMapService.clickBtnResetPeru(0);
  }

  searchUbicacion(event: any) {

    console.log('search',  event.target.value);
    var search=event.target.value;

    let params = {'search': search};

    this.buscadorService.buscarUbicaciones(params).subscribe(ubicaciones=>{

      this.itemsUbicacion=ubicaciones.data.map( x=>{ return { id:x._id , text: x.value}});
      console.log(this.itemsUbicacion);
    });
  }

  btnAddGraphic(event) {
    var tipo = event.target.id;

    console.log('click event', event);

    this.esriMapService.clickBtnAddGraphic(tipo);
  }

  ngOnInit() {


  }

}
