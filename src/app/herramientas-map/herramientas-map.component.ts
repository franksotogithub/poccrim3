import { Component, OnInit } from '@angular/core';
import {EsriMapService} from '../esri-map.service';
@Component({
  selector: 'app-herramientas-map',
  templateUrl: './herramientas-map.component.html',
  styleUrls: ['./herramientas-map.component.css']
})
export class HerramientasMapComponent implements OnInit {


  constructor(private esriMapService: EsriMapService) { 

  }



  btnResetPeru(){
    console.log('click peru');
    this.esriMapService.clickBtnResetPeru(0);
  }
  ngOnInit() {

   
    
  }

}
