import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ChatMassageItem } from 'src/app/interfaces/chat-item';
import { EventSourceService } from 'src/app/services/event-source-service/event-source.service';
import { LocalStorageService } from 'src/app/services/local-storage-service/local-storage.service';
import { ICartItem } from 'src/app/interfaces/grocery-bot';
import { responseDictionary } from '../crocery-bot-response-dictionary';

@Injectable({
  providedIn: 'root'
})
export class GroceryBotService {

  private readonly baseUrl = 'grocery-bot-v2';
  private readonly chatId = 'grocery-bot';

  private readonly defaultMessages: ChatMassageItem[] = [{
    content: responseDictionary.introductionMessage.en(),
    role: 'assistant',
  }]

  constructor(private localStorageService: LocalStorageService, private eventService: EventSourceService, private httpClient: HttpClient) { }

  getJSONCompletion(message: string): any {
    let messages = this.localStorageService.getItem(this.chatId) || [];

    const prompt = this.createMessageObject(message);
    messages.push(prompt);
    return this.httpClient.post(this.baseUrl, { messages, cart: this.getCart(), lastAction: this.getLastAction() });
  }

  private createMessageObject(content: string): any {
    return {
      role: 'user',
      content: content
    };
  }


  getChat(): ChatMassageItem[] {
    const chat = this.localStorageService.getItem(this.chatId);
    if (!chat || chat.length === 0) {
      this.localStorageService.setItem(this.chatId, this.defaultMessages);
      return this.defaultMessages;
    } else {
      return chat;
    }
  }

  setChat(messages: ChatMassageItem[]): void {
    this.localStorageService.setItem(this.chatId, messages);
  }

  deleteChat(): void {
    this.localStorageService.removeItem(this.chatId);
  }


  setCart(cart: ICartItem[]): void {
    this.localStorageService.setItem('cart', cart);
  }

  getCart(): ICartItem[] {
    return this.localStorageService.getItem('cart') || [];
  }

  deleteCart(): void {
    this.localStorageService.removeItem('cart');
  }


  setLastAction(fullAction: { action: string, list: any[] }) {
    this.localStorageService.setItem('lastAction', fullAction);
  }

  getLastAction() {
    return this.localStorageService.getItem('lastAction');
  }
}

