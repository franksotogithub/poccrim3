import { TestBed } from '@angular/core/testing';

import { MenuArbolService } from './menu-arbol.service';

describe('MenuArbolService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MenuArbolService = TestBed.get(MenuArbolService);
    expect(service).toBeTruthy();
  });
});
