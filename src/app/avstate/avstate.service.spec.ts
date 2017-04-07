import { TestBed, inject } from '@angular/core/testing';

import { AvstateService } from './avstate.service';

describe('AvstateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AvstateService]
    });
  });

  it('should ...', inject([AvstateService], (service: AvstateService) => {
    expect(service).toBeTruthy();
  }));
});
