import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { DataInfoServiceService } from './data-info-service.service';

describe('DataInfoServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientModule],
    providers: []
  }));

  it('should be created', () => {
    const service: DataInfoServiceService = TestBed.get(DataInfoServiceService);
    expect(service).toBeTruthy();
  });
});
