import { TestBed } from '@angular/core/testing';

import { SigndocService } from './signdoc.service';

describe('SigndocService', () => {
  let service: SigndocService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SigndocService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
