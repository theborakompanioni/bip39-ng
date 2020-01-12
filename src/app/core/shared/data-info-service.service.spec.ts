import { TestBed } from '@angular/core/testing';

import { DataInfoServiceService } from './data-info-service.service';

describe('DataInfoServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DataInfoServiceService = TestBed.get(DataInfoServiceService);
    expect(service).toBeTruthy();
  });
});
