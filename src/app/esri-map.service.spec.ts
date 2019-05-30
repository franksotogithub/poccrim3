import { TestBed } from '@angular/core/testing';

import { EsriMapService } from './esri-map.service';



describe('EsriMapService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EsriMapService = TestBed.get(EsriMapService);
    expect(service).toBeTruthy();
  });
});
