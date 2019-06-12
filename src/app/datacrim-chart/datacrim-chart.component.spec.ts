import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatacrimChartComponent } from './datacrim-chart.component';

describe('DatacrimChartComponent', () => {
  let component: DatacrimChartComponent;
  let fixture: ComponentFixture<DatacrimChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatacrimChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatacrimChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
