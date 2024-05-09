import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { GroceryBotService } from '../../grocery-bot-service/grocery-bot.service';

@Component({
  selector: 'app-suggestions',
  templateUrl: './suggestions.component.html',
  styleUrls: ['./suggestions.component.scss'],
  standalone: true,
  imports: [NgFor, MatButtonModule],
})
export class SuggestionsComponent {
  constructor(private groceryBotService: GroceryBotService) {}
  public suggestions: string[] = [
    'Add some vegetables to my cart',
    'Add Milk',
    'Do you have a recipe for a pizza?',
    'I have a party and I want to make some healthy snacks, can you help me with that?',
  ];

  useSuggestion(suggestion: string) {
    this.groceryBotService.groceryBotCompilation(suggestion);
  }
}
