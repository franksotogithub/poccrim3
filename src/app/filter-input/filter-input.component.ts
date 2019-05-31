import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-filter-input',
  templateUrl: './filter-input.component.html',
  styleUrls: ['./filter-input.component.scss']
})
export class FilterInputComponent implements OnInit {
  
  @Input() label: string;
  @Input() name: string;
  @Input() parent: string;
  @Input() options: any[];
  @Input() filters: object;

  show_options: boolean;

  constructor() { }

  ngOnInit() {
  	this.show_options = false;
  	this.filters[this.name] = this.getFilterIds();
  	/*
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
  	]*/
  }

  toggleOptions(): boolean {
  	this.show_options = !this.show_options;
  	return this.show_options;
  }

  getFilter(): string{
  	return '';
  }

  getFilterIds(): object[]{
  	console.log('filterids');
  	return this.options.filter(x=>x.selected).map(x=>x.id);
  }

  getOptions(): object[]{
  	if(this.filters.hasOwnProperty(this.parent)){
  		return this.options.filter(x=>this.filters[this.parent].includes(x.parent));	  	
	}else{
		return this.options;
	}
  	
  }

  check_all(): boolean{
  	this.options.forEach(x=>{
  		x.selected = true;
  	});
  	this.update_filters();
  	return true;
  }

  uncheck_all(): boolean{
  	this.options.forEach(x=>{
  		x.selected = false;
  	});
  	this.update_filters();
  	return true;
  }

  update_filters(): boolean{
  	this.filters[this.name] = this.options.filter(x=>x.selected).map(x=>x.id);
  	return true;
  }

}
