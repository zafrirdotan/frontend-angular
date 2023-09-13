import { HttpClient, } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs';
import { LocalStorageService } from '../services/local-storage-service/local-storage.service';
import { ChatDetails, ChatMassageItem, } from '../interfaces/chat-item';
import { EventSourceService } from '../services/event-source-service/event-source.service';
@Injectable({
  providedIn: 'root'
})
export class ChatGptService {
  private baseUrl = 'conversation';

  constructor(private localStorageService: LocalStorageService, private eventService: EventSourceService) {
  }

  getChatCompletionStreaming(message: string, chatId: string): Observable<any> {

    const prompt = this.createMessageObject(message);

    // Save the message in local storage
    const messages = this.localStorageService.getItem(chatId) || [];
    messages.push(prompt);

    return this.eventService.postSSECompletion(this.baseUrl + '/streaming', { messages, tempUserId: '123' })

  }

  getChat(chatId: string): ChatMassageItem[] {
    return this.localStorageService.getItem(chatId) || [];
  }

  setChat(chatId: string, messages: ChatMassageItem[]): void {
    this.localStorageService.setItem(chatId, messages);
  }

  deleteChat(chatId: string): void {
    this.localStorageService.removeItem(chatId);
  }

  getChatSummery(prompt: string): Observable<string> {
    return this.eventService.postSSECompletion(this.baseUrl + '/question-summery', { prompt: prompt });
  }

  setChats(chats: ChatDetails[]): void {
    this.localStorageService.setItem('chats', chats);
  }

  getChats(): ChatDetails[] {
    return this.localStorageService.getItem('chats');
  }

  gatSelectedChat(): string {
    return this.localStorageService.getItem('selectedChatId') || '';
  }

  setSelectedChat(chatId: string): void {
    this.localStorageService.setItem('selectedChatId', chatId);
  }

  private createMessageObject(content: string): any {
    return {
      role: 'user',
      content: content
    };
  }

}
