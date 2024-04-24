import { TestBed } from '@angular/core/testing';

import { HomemeService } from './home.service';

describe('HomemeService', () => {
  let service: HomemeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HomemeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
