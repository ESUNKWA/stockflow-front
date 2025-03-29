import { TestBed } from '@angular/core/testing';

import { HistoriqueAchatService } from './historique-achat.service';

describe('HistoriqueAchatService', () => {
  let service: HistoriqueAchatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HistoriqueAchatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
