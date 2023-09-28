import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroceryBotPage } from './grocery-bot.page';

describe('GroceryBotPage', () => {
  let component: GroceryBotPage;
  let fixture: ComponentFixture<GroceryBotPage>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GroceryBotPage]
    });
    fixture = TestBed.createComponent(GroceryBotPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
