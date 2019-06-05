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


  all_selected: boolean;
  search_text: string;  
  show_options: boolean;

  constructor() {
    console.log('constructor');
  }

  ngOnInit() {
    this.all_selected = this.options.length == this.options.filter(x=>x.selected).length ? true : false;
    this.show_options = false;
    this.search_text = '';
  	this.update_filters();  	
  }

  toggleOptions(): boolean {
  	this.show_options = !this.show_options;
  	return this.show_options;
  }

  hide_options(): boolean {
    this.show_options = false;
    return this.show_options;
  }

  getFilterIds(): object[]{
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
    this.all_selected = true;
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

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    console.log('destroy!');    
  } 

}
