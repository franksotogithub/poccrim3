import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'datacrimv3';
  active_tab = 1;
  set_active_tab(i): boolean {
  	console.log('change');
  	this.active_tab = i;
  	return true;
  }
}
