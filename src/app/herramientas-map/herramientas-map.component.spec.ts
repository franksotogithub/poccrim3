import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HerramientasMapComponent } from './herramientas-map.component';

describe('HerramientasMapComponent', () => {
  let component: HerramientasMapComponent;
  let fixture: ComponentFixture<HerramientasMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HerramientasMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HerramientasMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
