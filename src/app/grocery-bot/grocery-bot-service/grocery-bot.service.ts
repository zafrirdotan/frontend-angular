import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ChatMassageItem } from 'src/app/interfaces/chat-item';
import { LocalStorageService } from 'src/app/services/local-storage-service/local-storage.service';
import {
  AssistantAction,
  AssistantMessageParams,
  GroceryBotCompletionParam,
  ICartItem,
  UserMessageParams,
} from 'src/app/interfaces/grocery-bot';
import { responseDictionary } from '../crocery-bot-response-dictionary';
import { Action } from 'src/app/interfaces/chet-response';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GroceryBotService {
  private readonly baseUrl = 'grocery-bot-v2';
  private readonly chatId = 'grocery-bot';

  private readonly defaultMessage: GroceryBotCompletionParam = {
    role: 'assistant',
    content: responseDictionary.introductionMessage.en(),
    actionType: AssistantAction.initialMessage,
  };

  private chatSubject = new BehaviorSubject<GroceryBotCompletionParam[]>(
    this.localStorageService.getItem(this.chatId)
  );
  private cartSubject = new BehaviorSubject<ICartItem[]>(this.getCart() || []);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  public chat$ = this.chatSubject.asObservable();
  public cart$ = this.cartSubject.asObservable();
  public loading$ = this.loadingSubject.asObservable();

  constructor(
    private localStorageService: LocalStorageService,

    private httpClient: HttpClient
  ) {
    if (!this.getChat()?.length) {
      this.addToChat(this.defaultMessage);
    }
  }

  // Completion methods
  groceryBotCompilation(contact: string) {
    const newMessage: UserMessageParams = {
      role: 'user',
      content: contact,
    };

    const messages = this.addToChat(newMessage);
    console.log('messages:', messages);

    this.loadingSubject.next(true);
    this.httpClient
      .post<AssistantMessageParams>(this.baseUrl, {
        messages: messages.slice(-6),
        cart: this.getCart(),
      })
      .subscribe({
        next: (assistantMessage: AssistantMessageParams) => {
          if (!assistantMessage) {
            console.log('error: no response');
            return;
          }

          if (assistantMessage.cart) {
            this.setCart(assistantMessage.cart);
          }

          this.addToChat(assistantMessage);
          this.loadingSubject.next(false);
        },
        error: (error) => {
          this.loadingSubject.next(false);
          console.log('error:', error);
        },
      });
  }

  // Chat methods
  getChat(): GroceryBotCompletionParam[] {
    return this.localStorageService.getItem(this.chatId);
  }

  addToChat(message: GroceryBotCompletionParam): GroceryBotCompletionParam[] {
    const chat = this.localStorageService.getItem(this.chatId) || [];

    chat.push(message);
    this.localStorageService.setItem(this.chatId, chat);
    this.chatSubject.next(chat);
    return chat;
  }

  deleteChat(): void {
    this.localStorageService.removeItem(this.chatId);
    this.addToChat(this.defaultMessage);
  }

  // Cart methods

  setCart(cart: ICartItem[]): void {
    this.localStorageService.setItem('cart', cart);
    this.cartSubject.next(cart);
  }

  getCart(): ICartItem[] {
    return this.localStorageService.getItem('cart') || [];
  }

  deleteCart(): void {
    this.localStorageService.removeItem('cart');
  }

  setLastAction(action: Action) {
    this.localStorageService.setItem('lastAction', action);
  }

  getLastAction() {
    return this.localStorageService.getItem('lastAction');
  }

  addItemToCart(product: ICartItem) {
    const cart = this.getCart();
    const existingProduct = cart.find((item) => item.name === product.name);

    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      product.quantity = 1;
      cart.push(product);
    }

    this.setCart(cart);
  }
}
