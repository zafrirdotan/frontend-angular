import { TestBed } from '@angular/core/testing';

import { GroceryBotService } from './grocery-bot.service';

describe('GroceryBotService', () => {
  let service: GroceryBotService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GroceryBotService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
