import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { loadModules } from 'esri-loader';
import { EsriMapService } from '../esri-map.service';
import { ApiService } from '../api.service'
import { Subscription }   from 'rxjs';
//import * as esri from 'esri';
declare var palette: any;


@Component({
  selector: 'app-esri-map',
  templateUrl: './esri-map.component.html',
  styleUrls: ['./esri-map.component.css']
})
export class EsriMapComponent implements OnInit {

  
  @ViewChild('mapViewNode') private mapViewEl: ElementRef;
  private zoom = 6;
  private center: Array<number> =[-75, -9.305];

  private basemap = 'streets';
  private loaded = false;
  private map : any;
  private showLabels = true;
  private optionsApi = { 
    url: 'https://js.arcgis.com/3.25/'

  };

  private proyecto = 'indicador';
  private version ='P01';
  private variable='P010100';
  private ambitoInicial=0;
  private tipoValor=1;
  private ambitos=[2,1,0];
  private colorGris ='#9c9c9c';
  private urlServiceMap = 'https://datacrim.inei.gob.pe/mapa/arcgis/rest/services/CARTOGRAFIA_BASE_INEI/LIMITE_TEMATICOS/MapServer/';
  private capasTematicos=[];
  private ambito=0;
  private colores=[
    {id:0 , color:'#FFF9D1'},
    {id:1,color:'#FFF16E'},
    {id:2,color:'#FAB700'},
    {id:3,color:'#ED7203'},
    {id:4,color:'#E20613'},
  ];
  
  private listPaletas=[];

  dataSubs: Subscription;

  constructor(
    private esriMapService: EsriMapService,
    private dataMapService: ApiService,
  ){
    this.dataSubs = this.dataMapService.loadedData$.subscribe(
      res => {        
        let parsed = {};
        parsed['data'] = res.filter(x=>x._id['Año']=='2018').map(x=>{
          return { codigo: x._id.codigo_mapa, color: '#009ae0' };
        });
        console.log('data_map', parsed);
        this.actualizarCapaTematico(parsed,this.ambito);
      }
    );
    
    //this.colores=this.getColores(0,5);
  }


  async inicializarMapa(){
    try{
      const[Map] = await loadModules(['esri/map'],this.optionsApi);
      let mapOptions = {
        basemap: this.basemap,  // For full list of pre-defined basemaps, navigate to http://arcg.is/1JVo6Wd
        center: this.center, // longitude, latitude
        zoom: this.zoom,
        showLabels:this.showLabels,

      };
      this.map = new Map(this.mapViewEl.nativeElement, mapOptions);
      
    } 
    catch(error ){
      console.log('EsriLoader: ', error);

    }
  }

  
  async addCapa(url,index){
    try{
      var capa ={};
      const[FeatureLayer] = await loadModules(['esri/layers/FeatureLayer'],this.optionsApi);
      var urlFeature= `${url}/${index}`;
      var visible = false;
      (this.ambitoInicial==index)?visible=true:false; 

      var layer = new FeatureLayer (urlFeature,{
        maxScale:0,
        minScale:0,
        showLabels: false,
        visible:true
        
      });

      capa = {layer:layer,id:index}

      this.map.addLayer(layer)
      this.capasTematicos.push(capa);


      }
      catch(error){
        console.log('EsriLoader: ', error);
      }
    
  }

  /*async crearSimboloTematico(color, borderLine): Promise<any> {
    try{
      const[Color,SimpleFillSymbol, SimpleLineSymbol] = await loadModules(["esri/Color",
      "esri/symbols/SimpleFillSymbol", "esri/symbols/SimpleLineSymbol"],this.optionsApi);
      var c=new SimpleFillSymbol(
        "solid"
        , new SimpleLineSymbol().setWidth(borderLine)
        , new Color(color));

      
      
      return c;

    }

    catch(error)  {
      console.log('EsriLoader: ', error);
      return "";
    }
  
  }*/


  async actualizarCapaTematico(res,index){
    try{
      const[Color,SimpleFillSymbol, SimpleLineSymbol,UniqueValueRenderer] = await loadModules(["esri/Color",
      "esri/symbols/SimpleFillSymbol", "esri/symbols/SimpleLineSymbol",
      "esri/renderers/UniqueValueRenderer"],this.optionsApi);
      
      
      var uniqueValueInfos = res.data.map(e => { 
        return {
          value: e.codigo,
          symbol:new SimpleFillSymbol(
            "solid"
            , new SimpleLineSymbol().setWidth(1)
            , new Color(e.color))
        };
      });

      var layerRenderer = new UniqueValueRenderer({
        "type": "uniqueValue",
        "field1": "CODIGO",
        "uniqueValueInfos": uniqueValueInfos,
      });
      
      var capa=this.capasTematicos.find(x=>x.id==index)
      capa['datos']=res;
      capa.layer.setRenderer(layerRenderer);
      capa.layer.redraw();

    
    }
      
    catch(error)  {
      console.log('EsriLoader: ', error);
    }
  }

  cambiarAmbito(ambito){
    this.capasTematicos.forEach(capa => {
      if(capa.id==ambito){
        capa.layer.setVisibility(true);                                
        capa.layer.setMaxScale(0);
        capa.layer.setMinScale(0); 
      }

      else{
        capa.layer.setVisibility(false);                                
      }
    });
  }
  

  public ngOnInit() {

     

    //console.log('coloresss>>>',this.colores);
    this.inicializarMapa().then(_=>{
      //var resultados=[];
      this.ambitos.forEach(a => {
        
        //this.esriMapService.getEsriMapData(this.proyecto,this.version,this.variable,a,this.tipoValor).subscribe(res=>{
            this.addCapa(this.urlServiceMap,a).then(_=>{
              /*this.esriMapService.obtenerDatosMapaTematico().subscribe(res=>{
                this.actualizarCapaTematico(res,a);              
              });*/
              
              
              //if(a==this.ambitoInicial){

                /*this.esriMapService.obtenerDatosMapaTematico().subscribe(res=>{
                  this.actualizarCapaTematico(res,a);
                  this.esriMapService.setEsriMapDataSource(res);              
                });
*/


              //}
              

            });          
       
        
      });


      this.esriMapService.getAmbito().subscribe( ambito=>{
            this.ambito=ambito;
            this.esriMapService.obtenerDatosMapaTematico().subscribe(res=>{
                console.log('res mapa ambito>>>>',res);
                this.esriMapService.setEsriMapDataSource(res);
                this.actualizarCapaTematico(res,this.ambito).then(_=>{
                  this.cambiarAmbito(this.ambito);                    
                });    
                
            });
         }
      );



      this.esriMapService.getVariable().subscribe( variable=>{

        
        this.variable=variable;
        this.esriMapService.obtenerDatosMapaTematico().subscribe(res=>{
            console.log('res mapa>>>> variable',res);
            this.esriMapService.setEsriMapDataSource(res);
            this.actualizarCapaTematico(res,this.ambito);                        
        });
     });
      


     this.esriMapService.getBtnResetPeruSource().subscribe(res=>{
       console.log('res boton>>>',res);
       this.map.centerAndZoom(this.center, this.zoom);
     });

      /*this.esriMapService.getAmbito().subscribe(res=>{
        var ambito = res;

        this.esriMapService.getEsriMapData(this.proyecto,this.version,this.variable,ambito,this.tipoValor).subscribe(res=>{
              res.id=ambito;
              var arrayData=res.data.map(x=>x.valor);
              var rangos=this.crearRangos(arrayData,5);
              res.rangos=rangos;
              res.colores=this.colores;
              res.data=this.getColorPorDato(res.data,res.rangos,res.colores);
              this.esriMapService.setEsriMapDataSource(res);
              this.actualizarCapaTematico(res,ambito);
              this.cambiarAmbito(ambito);
        });
      });
      */



    });  

  } // ngOnInit

}