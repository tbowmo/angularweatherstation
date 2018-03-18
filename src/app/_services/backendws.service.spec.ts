import { TestBed, inject } from '@angular/core/testing';

import { BackendwsService } from './backendws.service';

describe('BackendwsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BackendwsService]
    });
  });

  it('should ...', inject([BackendwsService], (service: BackendwsService) => {
    expect(service).toBeTruthy();
  }));
});
