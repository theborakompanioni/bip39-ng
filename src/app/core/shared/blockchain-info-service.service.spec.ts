import { TestBed } from '@angular/core/testing';

import { BlockchainInfoServiceService } from './blockchain-info-service.service';

describe('BlockchainInfoServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BlockchainInfoServiceService = TestBed.get(BlockchainInfoServiceService);
    expect(service).toBeTruthy();
  });
});
