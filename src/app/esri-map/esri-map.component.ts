import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {loadModules} from 'esri-loader';
import {EsriMapService} from '../esri-map.service';
import {ApiService} from '../api.service';
import {Subscription} from 'rxjs';
//import * as esri from 'esri';
declare var palette: any;


@Component({
  selector: 'app-esri-map',
  templateUrl: './esri-map.component.html',
  styleUrls: ['./esri-map.component.scss']
})
export class EsriMapComponent implements OnInit {


  @ViewChild('mapViewNode') private mapViewEl: ElementRef;
  private zoom = 6;
  private center: Array<number> = [-75, -9.305];

  private basemap = 'streets';
  private loaded = false;
  private map: any;
  private showLabels = true;
  private optionsApi = {
    url: 'https://js.arcgis.com/3.25/'

  };

  private proyecto = 'indicador';
  private version = 'P01';
  private variable = 'P010100';
  private anio = 2011;
  private ambitoInicial = 0;
  private tipoValor = 1;
  private ambitos = [2, 1, 0];
  private colorGris = '#9c9c9c';
  private urlServiceMap = 'https://datacrim.inei.gob.pe/mapa/arcgis/rest/services/CARTOGRAFIA_BASE_INEI/LIMITE_TEMATICOS/MapServer/';
  private capasTematicos = [];
  private ambito = 0;
  private colores = [
    {id: 0, color: '#FFF9D1'},
    {id: 1, color: '#FFF16E'},
    {id: 2, color: '#FAB700'},
    {id: 3, color: '#ED7203'},
    {id: 4, color: '#E20613'},
  ];

  private datosResponse;

  dataSubs: Subscription;

  constructor(
    private esriMapService: EsriMapService
    //private dataMapService: ApiService,
  ) {

    /*
        this.dataSubs = this.dataMapService.loadedData$.subscribe(
          res => {
            let parsed = {};
            parsed['data'] = res.filter(x => x._id['Año'] == '2018').map(x => {
              return {codigo: x._id.codigo_mapa, color: '#009ae0'};
            });
            console.log('data_map', parsed);
            this.actualizarCapaTematico(parsed, this.ambito);
          }
        );
    */

    /*    this.esriMapService.getEsriMapDataSource().subscribe(res => {
          console.log('res map>>>',res);
          this.actualizarCapaTematico(res, this.ambito).then(_ => {
            //this.cambiarAmbito(this.ambito);
          });
        });
    */

    //this.colores=this.getColores(0,5);
  }

  async getExtentUbigeos(queryText: Text, urlService: Text) {
    try {
      const [QueryTask, Query] = await loadModules(['esri/tasks/QueryTask', 'esri/tasks/query'], this.optionsApi);

      let queryTask = new QueryTask(urlService);
      let query = new Query();
      query.returnGeometry = true;
      query.outFields = ['*'];
      query.where = queryText;


      queryTask.executeForExtent(query, function(result) {
        console.log('result>>>>', result);
        this.map.setExtent(result.extent);

      });

    } catch (error) {
      console.log('EsriLoader: ', error);

    }
  }

  async iniciarToolDraw(tipo) {
    try {
      const [Draw, SimpleFillSymbol, SimpleLineSymbol, Graphic, Color] = await loadModules(['esri/toolbars/draw', 'esri/symbols/SimpleFillSymbol', 'esri/symbols/SimpleLineSymbol', 'esri/graphic', 'esri/Color'], this.optionsApi);

      const tb = new Draw(this.map);

      const symbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
        new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
          new Color([255, 0, 0]), 2), new Color([0, 0, 0, 0]));

      let graphic;
      tb.on('draw-end',function (evt){
        tb.deactivate();
        this.map.enableMapNavigation();

        // figure out which symbol to use


        /*if ( evt.geometry.type === "point" || evt.geometry.type === "multipoint") {
          symbol = markerSymbol;
        } else if ( evt.geometry.type === "line" || evt.geometry.type === "polyline") {
          symbol = lineSymbol;
        }
        else {
          symbol = fillSymbol;
        }*/
        graphic = new Graphic(evt.geometry, symbol)
        //this.map.graphics.add(graphic);
        this.map.setExtent(evt.geometry.getExtent());


      });

      /*
      tb.on('draw-end').then(evt => {
        tb.deactivate();
        this.map.enableMapNavigation();


        this.map.graphics.add(new Graphic(evt.geometry, symbol));
      });
*/
      let tool = tipo.toLowerCase();
      (tool=='')?tool='extent':true;
      this.map.disableMapNavigation();
      tb.activate(tool);


    } catch (error) {
      console.log('EsriLoader: ', error);

    }
  }

  async inicializarMapa() {
    try {
      const [Map] = await loadModules(['esri/map'], this.optionsApi);
      let mapOptions = {
        basemap: this.basemap,  // For full list of pre-defined basemaps, navigate to http://arcg.is/1JVo6Wd
        center: this.center, // longitude, latitude
        zoom: this.zoom,
        showLabels: this.showLabels,

      };
      this.map = new Map(this.mapViewEl.nativeElement, mapOptions);

    } catch (error) {
      console.log('EsriLoader: ', error);

    }
  }


  async addCapa(url, index) {
    try {
      var capa = {};
      const [FeatureLayer] = await loadModules(['esri/layers/FeatureLayer'], this.optionsApi);
      var urlFeature = `${url}/${index}`;
      var visible = false;
      (this.ambitoInicial == index) ? visible = true : false;

      var layer = new FeatureLayer(urlFeature, {
        maxScale: 0,
        minScale: 0,
        showLabels: false,
        visible: true

      });

      capa = {layer: layer, id: index};

      this.map.addLayer(layer);
      this.capasTematicos.push(capa);


    } catch (error) {
      console.log('EsriLoader: ', error);
    }

  }


  async actualizarCapaTematico(res, index, estratos) {
    try {
      const [Color, SimpleFillSymbol, SimpleLineSymbol, UniqueValueRenderer] = await loadModules(['esri/Color',
        'esri/symbols/SimpleFillSymbol', 'esri/symbols/SimpleLineSymbol',
        'esri/renderers/UniqueValueRenderer'], this.optionsApi);

      var c = [];
      var color;
      var found;
      var outline = 1;
      var uniqueValueInfos = res.data.map(e => {
        color = e.color;
        outline = 1;
        c = this.hex2rgb(color).rgb;

        found = estratos.find(estrato => e.estrato === estrato);

        if (found == undefined) {
          outline = 0;
          c.push(0.2);
        } else {
          outline = 1;
          c.push(1);
        }

        return {
          value: e.codigo,
          symbol: new SimpleFillSymbol(
            'solid'
            , new SimpleLineSymbol().setWidth(outline)
            , new Color(c))
        };


      });

      /*var uniqueValueInfos = res.data.map(e => {
        return {
          value: e.codigo,
          symbol: new SimpleFillSymbol(
            'solid'
            , new SimpleLineSymbol().setWidth(1)
            , new Color(e.color))
        };
      });*/

      var defaultSymbol = new SimpleFillSymbol(
        'solid'
        , new SimpleLineSymbol('solid', new Color([0, 0, 0, 1]), 1)
        , new Color(this.colorGris));

      var layerRenderer = new UniqueValueRenderer({
        'type': 'uniqueValue',
        'field1': 'CODIGO',
        'uniqueValueInfos': uniqueValueInfos,

        'defaultSymbol': defaultSymbol,
      });

      var capa = this.capasTematicos.find(x => x.id == index);
      capa['datos'] = res;
      capa.layer.setRenderer(layerRenderer);
      capa.layer.redraw();


    } catch (error) {
      console.log('EsriLoader: ', error);
    }
  }

  cambiarAmbito(ambito) {
    this.capasTematicos.forEach(capa => {
      if (capa.id == ambito) {
        capa.layer.setVisibility(true);
        capa.layer.setMaxScale(0);
        capa.layer.setMinScale(0);
      } else {
        capa.layer.setVisibility(false);
      }
    });
  }

  hex2rgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
      rgb: [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
    } : null;
  }


  public ngOnInit() {

    this.inicializarMapa().then(_ => {
      this.ambitos.forEach(a => {

        this.addCapa(this.urlServiceMap, a).then(_ => {
          if (a === 0) {
            this.esriMapService.obtenerDatosMapaTematico().subscribe(res => {
            });
          }
        });

      });

      this.esriMapService.getAmbito().subscribe(ambito => {
          this.ambito = ambito;
          this.esriMapService.obtenerDatosMapaTematico().subscribe(res => {
            console.log('getAmbito res>>', res);
          });

        }
      );

      this.esriMapService.getAnio().subscribe(anio => {
        this.anio = anio;
      });

      this.esriMapService.getBtnResetPeruSource().subscribe(res => {
        this.map.centerAndZoom(this.center, this.zoom);
      });

      this.esriMapService.getEsriMapDataSource().subscribe(res => {
        this.datosResponse = res;
        this.ambito = res['ambito'];

        this.actualizarCapaTematico(res, this.ambito, [0, 1, 2, 3, 4]).then(_ => {
          this.cambiarAmbito(this.ambito);
        });
      });

      this.esriMapService.getEstratosDataSources().subscribe(estratos => {
        this.actualizarCapaTematico(this.datosResponse, this.ambito, estratos);
      });

      this.esriMapService.getBtnAddGraphicSource().subscribe(tipo => {
        this.iniciarToolDraw(tipo);
      });


    });

  } // ngOnInit

}
