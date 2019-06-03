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


  search_text: string;
  all_selected: boolean;
  show_options: boolean;

  constructor() { }

  ngOnInit() {
  	this.show_options = false;
  	this.all_selected = true;
    this.search_text = '';
  	this.update_filters();
  	//this.filters[this.name] = this.getFilterIds();
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

  hide_options(): boolean {
    this.show_options = false;
    return this.show_options;
  }

  getFilter(): string{
  	return '';
  }

  getFilterIds(): object[]{
  	console.log('filterids');
  	return this.getOptions().filter(x=>x.selected).map(x=>x.id);
  }

  getOptions(): any[]{
    let response = this.options;
    if(this.search_text!=''){
      response = response.filter(x=>x.label.includes(this.search_text.toUpperCase()));
    }    
  	if(this.filters.hasOwnProperty(this.parent)){
  		if(this.filters[this.parent] != null){
  			return response.filter(x=>this.filters[this.parent].includes(x.parent));
  		}
  	}
  	return response; 	
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
  	this.all_selected = false;
  	this.update_filters();
  	return true;
  }

  update_filters(): boolean{
  	if(this.all_selected){
  		this.filters[this.name] = null;
  		delete this.filters[this.name];
  	}else{
  		this.filters[this.name] = this.options.filter(x=>x.selected).map(x=>x.id);
  	}  	
  	return true;
  }

}
