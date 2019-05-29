import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LegendaMapComponent } from './legenda-map.component';

describe('LegendaMapComponent', () => {
  let component: LegendaMapComponent;
  let fixture: ComponentFixture<LegendaMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LegendaMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LegendaMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
