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
    {id: 0, text: 'DEPARTAMENTO',  },
    {id: 1, text: 'PROVINCIA',  },
    {id: 2, text: 'DISTRITO', },

  ];
  private selectedItem = this.items[0];

  private estratos =[];

  private itemsVariables = [

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
    this.esriMapService.cambiarAmbito(value.id);
  }


  selectedVariables(value: any) {
    //console.log("item select variable>>>",value);
    this.esriMapService.cambiarVariable(value.id);

  }

  selectedAnio(value: any) {
    this.esriMapService.cambiarAnio(value.id);
  }

  setSelectedAmbito(ambito: any) {
    console.log('ambito setSelectedAmbito>>>',ambito);
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


    this.esriMapService.getAmbitoSourceLegenda().subscribe(ambito => {
      //console.log("getAmbito()>>>",ambito);
        this.ambito = ambito;
        this.setSelectedAmbito(ambito);
      }
    );

    this.esriMapService.getAnios().subscribe(anios=>{

         //console.log('anios>>>',anios.map(x=>{return  { id:x.id,text:x.label}}));
         this.itemsAnios= anios.map(x=>{return { id:x.id,text:x.label}});

         console.log(this.itemsAnios);



        //console.log('anios>>>',anios);
    });



  }

}
