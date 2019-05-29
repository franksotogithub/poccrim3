import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-filter-input',
  templateUrl: './filter-input.component.html',
  styleUrls: ['./filter-input.component.scss']
})
export class FilterInputComponent implements OnInit {
  
  label: string;
  show_options: boolean;
  options: object[];
  filter

  constructor() { }

  ngOnInit() {
  	this.label = 'Departamento';
  	this.show_options = false;
  	this.options = [
  		{ id: '01', label: 'AMAZONAS', selected: true },
  		{ id: '02', label: 'APURIMAC', selected: true },
  		{ id: '03', label: 'AREQUIPA', selected: true },
  		{ id: '04', label: 'AYACUCHO', selected: true },
  		{ id: '05', label: 'CAJAMARCA', selected: true },
  		{ id: '06', label: 'CUSCO', selected: true },
  		{ id: '07', label: 'HUANCAVELICA', selected: true },
  	]
  }

  toggleOptions(): boolean {
  	this.show_options = !this.show_options;
  	return this.show_options;
  }

}
