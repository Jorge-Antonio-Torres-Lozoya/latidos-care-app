import { TestBed } from '@angular/core/testing';

import { RecoverPasswordUserService } from './recover-password-user.service';

describe('RecoverPasswordUserService', () => {
  let service: RecoverPasswordUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecoverPasswordUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
