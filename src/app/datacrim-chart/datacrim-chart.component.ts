import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../api.service';
import { Subscription }   from 'rxjs';



import * as Highcharts from 'highcharts';
import  More from 'highcharts/highcharts-more';
More(Highcharts);
import Drilldown from 'highcharts/modules/drilldown';
Drilldown(Highcharts);
// Load the exporting module.
import Exporting from 'highcharts/modules/exporting';
// Initialize exporting module.
Exporting(Highcharts);


@Component({
  selector: 'app-datacrim-chart',
  templateUrl: './datacrim-chart.component.html',
  styleUrls: ['./datacrim-chart.component.scss']
})
export class DatacrimChartComponent implements OnInit {

  Highcharts: typeof Highcharts = Highcharts; // required
  chartConstructor: string = 'chart'; // optional string, defaults to 'chart'
  chartOptions: Highcharts.Options = {};
  chartCallback: Highcharts.ChartCallbackFunction = function (chart) { return null; } // optional function, defaults to null
  updateFlag: boolean = false; // optional boolean
  oneToOneFlag: boolean = true; // optional boolean, defaults to false
  runOutsideAngular: boolean = false; // optional boolean, defaults to false

  subsData: Subscription;

  constructor(
  	private apiService: ApiService,
  ) { }

  ngOnInit() {  

    this.chartOptions.chart = {
		height: '75%', // 16:9 ratio
		type: 'bar'
    };

  	this.chartOptions.title = {
    	text: 'Este es un gráfico de muestra'
    };	  	
	this.chartOptions.xAxis = {
        type: 'category',
        title: {
            text: null
        }
    };

    /*
    this.chartOptions.plotOptions = {}
    this.chartOptions.plotOptions.series = {}
    this.chartOptions.plotOptions.series.events = {

    }
    */
        
    class ChartSerie{
	    name: String;
	    data: any[];
	    rangos :any[];
	    colores :any[];
	}
    

    this.subsData = this.apiService.loadedData$.subscribe(
      res => {
        let series = {};
        res.sort( (a,b) => b.delitos-a.delitos).forEach(x=>{
        	if (!series.hasOwnProperty(x._id['Año'])) { 
				series[x._id['Año']] = {
					name: x._id['Año'],
					data: [],
					type: 'bar',
					//type: type,
					visible: false					
				};
			}
			series[x._id['Año']].data.push({
				name: x._id['Departamento'],
				y: x.delitos,
				drilldown: 'drilldown_' + x._id['Año'] + '_' + x._id['codigo_mapa']
			})
		});
		let series_array: any[];		
		series_array = Object.values(series);		
		series_array[series_array.length-1]['visible'] = true;
		series_array.forEach( x =>
			x['data'] = x['data'].sort( (a,b) => b.y-a.y)
		);
		this.chartOptions.series = series_array;
		this.updateFlag = true;
      }
    ); 
    
	this.chartOptions.drilldown = {
		series: [
			{
				name: 'Delitos',
				id: 'drilldown_2018_15',
				data: [
					{
						name: 'BAGUA',
						y: 702,
						drilldown: 'distritos-bagua'
					},
					{
						name: 'BONGARA',
						y: 430,
						drilldown: 'distritos-bagua'
					},
					{
						name: 'CHACHAPOYAS',
						y: 614,
						drilldown: 'distritos-bagua'
					},
					{
						name: 'CONDORCANQUI',
						y: 110,
						drilldown: 'distritos-bagua'
					},
					{
						name: 'LUYA',
						y: 301,
						drilldown: 'distritos-bagua'
					},
					{
						name: 'RODRIGUEZ DE MENDOZA',
						y: 153,
						drilldown: 'distritos-bagua'
					},
					{
						name: 'UTCUBAMBA',
						y: 999,
						drilldown: 'distritos-bagua'
					},
				],
				type: 'bar',
			},
			{
				name: 'Delitos',
				id: 'drilldown_2011_01',
				data: [
					{
						name: 'BAGUA',
						y: 510,
					},
					{
						name: 'ARAMANGO',
						y: 87,
					},
					{
						name: 'COPALLIN',
						y: 26,
					},
					{
						name: 'IMAZA',
						y: 0,
					},
					{
						name: 'LA PECA',
						y: 79,
					},					
				],
				type: 'bar',
			},
		]
	}
	
  }
}
