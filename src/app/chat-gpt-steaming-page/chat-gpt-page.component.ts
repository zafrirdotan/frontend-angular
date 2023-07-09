import { CommonModule, NgFor, NgIf, ViewportScroller } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
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
import { v4 as uuidv4 } from 'uuid';
import { HighlightCodeDirective } from '../directives/highlight-code.directive';
import { AssistantMessageComponent } from '../components/assistant-message/assistant-message.component';

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
      MatListModule, CommonModule, HighlightCodeDirective, AssistantMessageComponent],
})


export class ChatGptPageComponent {
  @ViewChild('scrollTarget', { static: false }) scrollTarget!: ElementRef;

  public inputValue: string = '';

  public chat: ChatMassageItem[] = [];
  public chatsList: ChatDetails[] = [];

  public lastMessage: string = '';

  public newChatName: string = '';

  public isLoadingChatName: boolean = false;
  public isLoadingResponseMessage: boolean = false;

  public selectedChatId!: string | undefined;

  constructor(private chatGptService: ChatGptService) { }

  ngOnInit(): void {
    this.selectedChatId = this.chatGptService.gatSelectedChat();
    this.chatsList = this.chatGptService.getChats() || [];
    if (this.selectedChatId) {
      this.chat = this.chatGptService.getChat(this.selectedChatId);

    }
    if (!this.selectedChatId) {
      this.createNewChat()
    }


  }

  sendMessage() {
    if (this.inputValue === '' || this.isLoadingResponseMessage) {
      return;
    }

    if (!this.selectedChatId) {
      this.createNewChat();
    }

    if (!this.chat.length) {
      this.getChatName();
    }

    this.chat.push({ content: this.inputValue, role: 'user' });
    this.isLoadingResponseMessage = true;
    // temp code
    this.chatGptService.getChatCompletionStreaming(this.inputValue, this.selectedChatId!).subscribe({
      next: (tokens) => {
        // this.addTokenToLastMessage(tokens);
        this.lastMessage += tokens;
        this.inputValue = '';
        this.scrollToLastElement()

      }, error: (err) => {
        this.isLoadingResponseMessage = false;
        console.log('error', err);

      }, complete: () => {


        this.isLoadingResponseMessage = false;
        this.chat.push({ content: this.lastMessage, role: 'assistant' });

        this.chatGptService.setChat(this.selectedChatId!, this.chat);
        this.lastMessage = ''
      }
    });


  }

  getChatName() {

    if (this.inputValue.length < 20) {
      this.newChatName = this.inputValue;
      this.updateChatName();
      return;
    }

    this.isLoadingChatName = true;
    this.chatGptService.getChatSummery(this.inputValue).subscribe({
      next: (token: string) => {

        this.newChatName += token;

      }, error: (err) => {
        this.isLoadingChatName = false;
        console.log('error', err);

      }, complete: () => {
        if (this.newChatName) {
          this.updateChatName();
        }
        this.newChatName = '';

        this.isLoadingChatName = false;
      }
    });

  }

  updateChatName() {
    const chat = this.chatsList.find(chat => chat.id === this.selectedChatId);
    if (!chat) {
      return;
    }
    chat.name = this.newChatName;
    this.chatGptService.setChats(this.chatsList);
  }

  changeChat(chat: ChatDetails) {
    this.selectedChatId = chat.id;
    this.chatGptService.setSelectedChat(chat.id);
    this.chat = this.chatGptService.getChat(this.selectedChatId);
  }

  createNewChat() {
    this.selectedChatId = uuidv4();
    this.chatGptService.setSelectedChat(this.selectedChatId);
    this.chat = [];
    this.chatsList = this.chatGptService.getChats() || [];
    this.chatsList.push({ id: this.selectedChatId, name: 'New Chat' });
    this.chatGptService.setChats(this.chatsList);
  }

  deleteChat(ev: MouseEvent, chat: ChatDetails) {
    ev.stopPropagation();
    if (chat.id === this.selectedChatId) {
      this.chat = [];
      this.selectedChatId = undefined;

    }
    this.chatsList = this.chatsList.filter(({ id }) => id !== chat.id);
    this.chatGptService.setChats(this.chatsList);
    this.chatGptService.deleteChat(chat.id);
  }

  scrollToLastElement() {
    const element = this.scrollTarget.nativeElement;
    element.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
  }

}