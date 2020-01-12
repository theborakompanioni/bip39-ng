import { TestBed } from '@angular/core/testing';

import { BlockstreamInfoServiceService } from './blockstream-info-service.service';

describe('BlockstreamInfoServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BlockstreamInfoServiceService = TestBed.get(BlockstreamInfoServiceService);
    expect(service).toBeTruthy();
  });
});
