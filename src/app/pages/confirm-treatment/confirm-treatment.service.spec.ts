import { TestBed } from '@angular/core/testing';

import { ConfirmTreatmentService } from './confirm-treatment.service';

describe('ConfirmTreatmentService', () => {
  let service: ConfirmTreatmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConfirmTreatmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
