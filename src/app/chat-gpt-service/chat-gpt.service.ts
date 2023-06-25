import { HttpClient, } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, Observable, Subject, map, of, } from 'rxjs';
import { LocalStorageService } from '../services/local-storage-service/local-storage.service';
import { ChatDetails, ChatMassageItem, ChatResponse, DtoCharResponse } from '../interfaces/chat-item';
import { v4 as uuidv4 } from 'uuid';
@Injectable({
  providedIn: 'root'
})
export class ChatGptService {
  private SERVER_URL = 'http://localhost:3000/conversation';
  public chats = new BehaviorSubject<ChatDetails[]>(this.localStorageService.getItem('chats') || []);
  public $chats = this.chats.asObservable();
  // public selectedChat = new BehaviorSubject<{ id: string, name: string }>(this.localStorageService.getItem('selectedState') || '');
  // public $selectedChat = this.selectedChat.asObservable();
  // public messages = new BehaviorSubject<ChatHistoryItem[]>(this.localStorageService.getItem(this.selectedChat?.value?.id) || []);
  // public $messages = this.messages.asObservable();

  constructor(private httpClient: HttpClient, private _zone: NgZone, private localStorageService: LocalStorageService) {
  }


  sendMessage(message: string, chatId?: string): Observable<ChatResponse> {
    const isFirstMessage = !chatId;
    if (isFirstMessage) {
      chatId = uuidv4();
      this.localStorageService.setItem(chatId, []);
    }

    const prompt = this.createMessageObject(message);

    // Save the message in local storage
    const messages = this.localStorageService.getItem(chatId!) || [];
    messages.push(prompt);

    this.localStorageService.setItem(chatId!, messages);

    // Send the message to the backend
    return this.httpClient.post<DtoCharResponse>(this.SERVER_URL, messages).pipe(
      map((response: DtoCharResponse) => {

        // Is it the first message? 
        if (isFirstMessage && response.summery) {
          this.addChatToList({ name: response.summery, id: chatId! });
        }
        const messagesWithResponse: ChatMassageItem[] = this.localStorageService.getItem(chatId!) || [];
        messagesWithResponse.push(response.message);
        this.localStorageService.setItem(chatId!, messagesWithResponse);
        return {
          messages: messagesWithResponse,
          id: chatId!,
          name: response.summery
        };
      })
    );
  }
  private createMessageObject(content: string): any {
    return {
      role: 'user',
      content: content
    };
  }

  getMessages(chatId: string): Observable<ChatMassageItem[]> {
    return of(this.localStorageService.getItem(chatId) || []);
  }

  addChatToList(chat: ChatDetails): void {
    const chats = this.getChats();
    chats.push(chat);
    this.localStorageService.setItem('chats', chats);
    this.chats.next(chats);
    this.setSelectedChat(chat.id);
  }

  getChats(): ChatDetails[] {
    return this.localStorageService.getItem('chats') || [];
  }

  setSelectedChat(chatId?: string): void {
    if (!chatId) {
      this.localStorageService.removeItem('selectedChatId');
      return;
    }
    this.localStorageService.setItem('selectedChatId', chatId);
  }

  gatSelectedChat(): string {
    return this.localStorageService.getItem('selectedChatId') || '';
  }

  deleteChat(chatId: string): void {
    const chats = this.getChats();
    const index = chats.findIndex(chat => chat.id === chatId);
    chats.splice(index, 1);
    this.localStorageService.setItem('chats', chats);
    this.chats.next(chats);
    this.localStorageService.removeItem(chatId);
  }

}
