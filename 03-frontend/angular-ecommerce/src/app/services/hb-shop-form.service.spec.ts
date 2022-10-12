import { TestBed } from '@angular/core/testing';

import { HbShopFormService } from './hb-shop-form.service';

describe('HbShopFormService', () => {
  let service: HbShopFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HbShopFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
