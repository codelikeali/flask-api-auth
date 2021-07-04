import { TestBed } from '@angular/core/testing';

import { AuthheadersService } from './authheaders.service';

describe('AuthheadersService', () => {
  let service: AuthheadersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthheadersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
