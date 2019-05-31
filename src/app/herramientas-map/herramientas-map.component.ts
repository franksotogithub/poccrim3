import { Component, OnInit } from '@angular/core';
import {EsriMapService} from '../esri-map.service';
@Component({
  selector: 'app-herramientas-map',
  templateUrl: './herramientas-map.component.html',
  styleUrls: ['./herramientas-map.component.scss']
})
export class HerramientasMapComponent implements OnInit {


  constructor(private esriMapService: EsriMapService) {

  }



  btnResetPeru(){
    console.log('click peru');
    this.esriMapService.clickBtnResetPeru(0);
  }
  btnAddGraphic(event){
    var tipo = event.target.id;
    console.log('click event',event.target.id);

    this.esriMapService.clickBtnAddGraphic(tipo);
  }

  ngOnInit() {



  }

}
