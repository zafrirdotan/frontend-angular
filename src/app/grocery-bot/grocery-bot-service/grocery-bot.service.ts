import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, from } from 'rxjs';
import { ChatMassageItem } from 'src/app/interfaces/chat-item';
import { EventSourceService } from 'src/app/services/event-source-service/event-source.service';
import { LocalStorageService } from 'src/app/services/local-storage-service/local-storage.service';
import { mockChunks } from './mock-data';
import { ICartItem } from 'src/app/interfaces/grocery-bot';
import { responseDictionary } from '../crocery-bot-response-dictionary';

@Injectable({
  providedIn: 'root'
})
export class GroceryBotService {


  private readonly baseUrl = 'grocery-bot-v1';
  private readonly chatId = 'grocery-bot';


  private readonly defaultMessages: ChatMassageItem[] = [{
    content: responseDictionary.introductionMessage.en(),
    role: 'assistant',
  }]

  constructor(private localStorageService: LocalStorageService, private eventService: EventSourceService, private httpClient: HttpClient) { }

  getChatCompletion(message: string): Observable<any> {
    const prompt = this.createMessageObject(message);
    const messages = [prompt];

    return this.httpClient.post(this.baseUrl + '/summery', { messages });
  }

  getChatCompletionStreaming(message: string): Observable<any> {

    const prompt = this.createMessageObject(message);
    // Save the message in local storage
    const messages = this.localStorageService.getItem(this.chatId) || [];
    messages.push(prompt);

    return this.eventService.postSSECompletion(this.baseUrl + '/streaming', { messages, cart: this.getCart() || [] })

  }

  // Temp for test only
  getStreamingData(): Observable<string> {
    const dataStream = new Subject<string>();

    // Simulating chunks of data arriving at different intervals
    setTimeout(() => dataStream.next(''), 0);
    setTimeout(() => dataStream.next('Here'), 2);
    setTimeout(() => dataStream.next(' is your shopping list'), 7);
    setTimeout(() => dataStream.next('in JSON format:'), 50);
    setTimeout(() => dataStream.next('```json{"name": "apples", "quantity":'), 500);
    setTimeout(() => dataStream.next(' 4}{"name": "bananas", "quantity": '), 1000);
    setTimeout(() => dataStream.next('6}```'), 1500);

    return dataStream.asObservable();
  }

  getMickStreaming(message: string): Observable<string> {
    return from(mockChunks)
  }

  getJSONCompletion(message: string): any {
    let messages = this.localStorageService.getItem(this.chatId) || [];
    // messages = messages.filter((message: ChatMassageItem) => message.role === 'assistant');
    // console.log('messages', messages);
    // // return of()
    const prompt = this.createMessageObject(message);
    messages.push(prompt);
    return this.httpClient.post(this.baseUrl + '/list-function', { messages, cart: this.getCart(), lastAction: this.getLastAction() });
  }

  gatSummeryStreaming(message: string) {
    const prompt = this.createMessageObject(message);
    // Save the message in local storage
    const messages = this.localStorageService.getItem(this.chatId) || [];
    messages.push(prompt);

    return this.eventService.postSSECompletion(this.baseUrl + '/summery-streaming', { messages, tempUserId: '123' })
  }

  gatSummeryStreamingJson(message: string) {
    const chunkArray: string[] = [];
    let isJsonStarted = false;

    return this.gatSummeryStreaming(message)
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

  getDescription(message: string) {
    const prompt = this.createMessageObject(message);
    console.log('prompt', prompt);


    return this.httpClient.post(this.baseUrl + '/description', { messages: [prompt] });
  }

  setLastAction(fullAction: { action: string, list: any[] }) {
    this.localStorageService.setItem('lastAction', fullAction);
  }

  getLastAction() {
    return this.localStorageService.getItem('lastAction');
  }
}

