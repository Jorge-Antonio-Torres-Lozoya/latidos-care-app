import { TestBed } from '@angular/core/testing';

import { VerificationUserService } from './verification-user.service';

describe('VerificationUserService', () => {
  let service: VerificationUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VerificationUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
