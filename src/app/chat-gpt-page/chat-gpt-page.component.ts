import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ChatGptService } from '../chat-gpt-service/chat-gpt.service';
import { ChatDetails, ChatMassageItem } from '../interfaces/chat-item';
import { ChatLoaderComponent } from '../components/chat-loader/chat-loader.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-chat-gpt-page',
  templateUrl: './chat-gpt-page.component.html',
  styleUrls: ['./chat-gpt-page.component.scss'],
  standalone: true,
  imports:
    [MatFormFieldModule,
      MatInputModule,
      FormsModule,
      NgIf,
      MatButtonModule,
      MatIconModule,
      NgFor,
      ChatLoaderComponent,
      MatToolbarModule,
      MatSidenavModule,
      MatListModule, CommonModule],


})
export class ChatGptPageComponent {
  public inputValue: string = '';

  public chat: ChatMassageItem[] = [];

  public isLoading: boolean = false;

  public $chats: Observable<ChatDetails[]> = this.chatGptService.$chats;

  public selectedChatId: string | undefined;

  constructor(private chatGptService: ChatGptService) { }

  ngOnInit(): void {
    this.selectedChatId = this.chatGptService.gatSelectedChat();
    this.getMessages(this.selectedChatId);
  }

  sendMessage() {
    if (this.inputValue === '' || this.isLoading) {
      return;
    }
    this.isLoading = true;

    this.chatGptService.sendMessage(this.inputValue, this.selectedChatId).subscribe(({ messages, id }) => {
      this.isLoading = false;
      if (!this.selectedChatId) {
        this.selectedChatId = id;
      }
      this.chat = messages;

      this.inputValue = '';
    });
  }

  getMessages(chatId: string) {
    this.chatGptService.getMessages(chatId).subscribe((res: ChatMassageItem[]) => {
      this.chat = res;
    });
  }


  changeChat(chat: ChatDetails) {
    this.selectedChatId = chat.id;
    this.chatGptService.setSelectedChat(chat.id);
    this.getMessages(this.selectedChatId);
  }

  createNewChat() {
    this.selectedChatId = undefined;
    this.chatGptService.setSelectedChat(undefined);
    this.chat = [];
  }

  deleteChat(ev: MouseEvent, chat: ChatDetails) {
    ev.stopPropagation();
    if (chat.id === this.selectedChatId) {
      this.selectedChatId = undefined;
    }
    this.chat = [];
    this.chatGptService.deleteChat(chat.id);
  }

}
