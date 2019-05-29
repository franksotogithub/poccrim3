import { TestBed } from '@angular/core/testing';

import { BreadCrumbServService } from './bread-crumb-serv.service';

describe('BreadCrumbServService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BreadCrumbServService = TestBed.get(BreadCrumbServService);
    expect(service).toBeTruthy();
  });
});
