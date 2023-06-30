import { HttpClient, } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, Observable, Subject, map, of, tap, } from 'rxjs';
import { LocalStorageService } from '../services/local-storage-service/local-storage.service';
import { ChatDetails, ChatMassageItem, ChatResponse, DtoCharResponse } from '../interfaces/chat-item';
import { v4 as uuidv4 } from 'uuid';
import { EventSourceService } from '../services/event-source-service/event-source.service';
@Injectable({
  providedIn: 'root'
})
export class ChatGptService {
  private SERVER_URL = 'http://localhost:3000/conversation';


  constructor(private httpClient: HttpClient, private _zone: NgZone, private localStorageService: LocalStorageService, private eventService: EventSourceService) {
  }

  getChatCompletionStreaming(message: string, chatId: string): Observable<any> {

    const prompt = this.createMessageObject(message);

    // Save the message in local storage
    const messages = this.localStorageService.getItem(chatId) || [];
    messages.push(prompt);

    return this.eventService.postSSECompletion(this.SERVER_URL + '/streaming', messages)

  }

  getChat(chatId: string): ChatMassageItem[] {
    return this.localStorageService.getItem(chatId) || [];
  }

  setChat(chatId: string, messages: ChatMassageItem[]): void {
    this.localStorageService.setItem(chatId, messages);
  }

  getChatSummery(prompt: string): Observable<string> {
    return this.eventService.postSSECompletion(this.SERVER_URL + '/question-summery', { prompt: prompt });
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

  // addChatToList(chatName: string): void {
  //   const chats = this.getChats();
  //   this.selectedChatId.next(uuidv4());
  //   this.localStorageService.setItem('selectedChatId', this.selectedChatId.value);
  //   chats.push({ name: chatName, id: this.selectedChatId.value });
  //   this.localStorageService.setItem('chats', chats);
  //   this.chats.next(chats);
  // }



  // sendMessage(message: string, chatId?: string): Observable<ChatResponse> {
  //   const isFirstMessage = !chatId;
  //   if (isFirstMessage) {
  //     chatId = uuidv4();
  //     this.localStorageService.setItem(chatId, []);
  //   }

  //   const prompt = this.createMessageObject(message);

  //   // Save the message in local storage
  //   const messages = this.localStorageService.getItem(chatId!) || [];
  //   messages.push(prompt);

  //   this.localStorageService.setItem(chatId!, messages);

  //   // Send the message to the backend
  //   return this.httpClient.post<DtoCharResponse>(this.SERVER_URL, messages).pipe(
  //     map((response: DtoCharResponse) => {

  //       // Is it the first message? 
  //       if (isFirstMessage && response.summery) {
  //         this.addChatToList({ name: response.summery, id: chatId! });
  //       }
  //       const messagesWithResponse: ChatMassageItem[] = this.localStorageService.getItem(chatId!) || [];
  //       messagesWithResponse.push(response.message);
  //       this.localStorageService.setItem(chatId!, messagesWithResponse);
  //       return {
  //         messages: messagesWithResponse,
  //         id: chatId!,
  //         name: response.summery
  //       };
  //     })
  //   );
  // }

  private createMessageObject(content: string): any {
    return {
      role: 'user',
      content: content
    };
  }

  // setSelectedChat(chatId?: string): void {
  //   if (!chatId) {
  //     this.selectedChatId.next('');
  //     this.localStorageService.removeItem('selectedChatId');
  //     return;
  //   }
  //   this.selectedChatId.next(chatId);

  //   this.localStorageService.setItem('selectedChatId', chatId);
  // }



  // deleteChat(chatId: string): void {
  //   const chats = this.getChats();
  //   const index = chats.findIndex(chat => chat.id === chatId);
  //   chats.splice(index, 1);
  //   this.localStorageService.setItem('chats', chats);
  //   this.chats.next(chats);
  //   this.localStorageService.removeItem(chatId);
  // }

  // updateChatId(chatId: string): void {
  //   this.localStorageService.setItem('selectedChatId', chatId);
  //   this.selectedChatId.next(chatId);
  // }

  // saveChat(messages: ChatMassageItem[]): void {
  //   this.localStorageService.setItem(this.selectedChatId.value, messages);
  // }



}
