import {Component, OnInit} from '@angular/core';
import {EsriMapService} from '../esri-map.service';
import {esriMapData} from '../esri-map';

@Component({
  selector: 'app-legenda-map',
  templateUrl: './legenda-map.component.html',
  styleUrls: ['./legenda-map.component.scss']
})
export class LegendaMapComponent implements OnInit {
  private datos: esriMapData = {data: [], rangos: [], colores: [], id: 0};
  private datosList: esriMapData[];
  private ambito = 0;

  private items = [
    {id: 0, text: 'DEPARTAMENTO', group: 'ccdd'},
    {id: 1, text: 'PROVINCIA', group: 'ccdd,ccpp'},
    {id: 2, text: 'DISTRITO', group: 'ccdd,ccpp,ccdi'},
  ];
  private selectedItem = this.items[0];

  private estratos =[];

  private itemsVariables = [
    /*{id: 'P010100', text: 'P010100'},
    {id: 'P010101', text: 'P010101'},
    {id: 'P010102', text: 'P010102'},
    {id: 'P010802', text: 'P010802'},*/

    {id: 2016, text: '2016'},
    {id: 2017, text: '2017'},
    {id: 2018, text: '2018'},
  ];

  private itemsAnios = [
    {id: 2011, text: '2011'},
    {id: 2017, text: '2017'},
    {id: 2018, text: '2018'},
  ];

  private selectedItemVariable = this.itemsVariables[0];
  private selectedItemAnio = this.itemsAnios[0];

  constructor(private esriMapService: EsriMapService) {

  }

  selected(value: any) {
    this.esriMapService.cambiarAmbito(value);
  }


  selectedVariables(value: any) {
    //console.log("item select variable>>>",value);
    this.esriMapService.cambiarVariable(value.id);

  }

  selectedAnio(value: any) {
    this.esriMapService.cambiarAnio(value.id);
  }

  setSelectedAmbito(ambito: any) {
    this.selectedItem = this.items.find(x => x.id === ambito);
  }

  checkedEstrato(estrato: any,event:any){
    let checked = event.target.checked;
    (checked)? this.estratos.push(estrato) : this.estratos = this.estratos.filter(item=> item !== estrato );
    this.esriMapService.setEstratosDataSources(this.estratos);

  }

  ngOnInit() {

    this.esriMapService.getEsriMapDataSource().subscribe(res => {
      this.datos = res;
    });


    this.esriMapService.getAmbito().subscribe(ambito => {
        this.ambito = ambito;
        this.setSelectedAmbito(ambito);
      }
    );

  }

}
