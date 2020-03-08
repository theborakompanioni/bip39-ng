import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';

import { BlockstreamInfoServiceService } from './blockstream-info-service.service';

describe('BlockstreamInfoServiceService', () => {

  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule, HttpClientModule],
    providers: [BlockstreamInfoServiceService]
  }));

  it('should be created', () => {
    const service: BlockstreamInfoServiceService = TestBed.get(BlockstreamInfoServiceService);
    expect(service).toBeTruthy();
  });
});
