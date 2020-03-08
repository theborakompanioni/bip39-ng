import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';

import { BlockchainInfoServiceService } from './blockchain-info-service.service';

describe('BlockchainInfoServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule, HttpClientModule],
    providers: [BlockchainInfoServiceService]
  }));

  it('should be created', () => {
    const service: BlockchainInfoServiceService = TestBed.get(BlockchainInfoServiceService);
    expect(service).toBeTruthy();
  });
});
