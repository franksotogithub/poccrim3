import { Component, OnInit } from '@angular/core';
import {EsriMapService} from '../esri-map.service';
import {esriMapData} from '../esri-map'

@Component({
  selector: 'app-legenda-map',
  templateUrl: './legenda-map.component.html',
  styleUrls: ['./legenda-map.component.css']
})
export class LegendaMapComponent implements OnInit {
  private datos:esriMapData={data:[],rangos:[],colores:[],id:0} ; 
  private datosList:esriMapData[];
  private ambito=0;

  private items =[
    {id:0, text: "DEPARTAMENTO"},
    {id:1, text: "PROVINCIA"},
    {id:2, text: "DISTRITO"},
  ] 
  private selectedItem =this.items[0];

  private itemsVariables =[
    {id:'P010100' ,text:'P010100' },
    {id:'P010101' ,text:'P010101' },
    {id:'P010102' ,text:'P010102' },
    {id:'P010802' ,text:'P010802' },
  ]

  private selectedItemVariable =this.itemsVariables[0];

  constructor(private esriMapService: EsriMapService ){
    
  }

  selected(value:any){
    this.esriMapService.cambiarAmbito(value.id);
  }


  selectedVariables(value:any){
    //console.log("item select variable>>>",value);
    this.esriMapService.cambiarVariable(value.id);
    
  }

  ngOnInit() {

    this.esriMapService.getEsriMapDataSource().subscribe(res=>{
      this.datos=res;
    });

  

  }

}
