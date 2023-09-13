import { NgIf, NgFor, CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AssistantMessageComponent } from '../components/assistant-message/assistant-message.component';
import { ChatLoaderComponent } from '../components/chat-loader/chat-loader.component';
import { HighlightCodeDirective } from '../directives/highlight-code.directive';
import { ChatMassageItem } from '../interfaces/chat-item';
import { Subscription } from 'rxjs';
import { ChatGptService } from '../chat-gpt-service/chat-gpt.service';
import { GroceryBotService } from './grocery-bot-service/grocery-bot.service';
import { TextareaComponent } from './components/textarea/textarea.component';
import { IBotAction, ICartItem } from '../interfaces/grocery-bot';

@Component({
  selector: 'app-grocery-bot',
  templateUrl: './grocery-bot.page.html',
  styleUrls: ['./grocery-bot.page.scss'],
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, FormsModule, NgIf, MatButtonModule, MatIconModule, NgFor, ChatLoaderComponent, MatToolbarModule, MatSidenavModule,
    MatListModule, CommonModule, HighlightCodeDirective, AssistantMessageComponent, MatDialogModule, MatSnackBarModule, TextareaComponent],
})
export class GroceryBotPage implements OnInit {
  public inputValue: string = '';
  isLoadingResponseMessage: any;
  private chatCompSub: Subscription | undefined;


  public chatList: ChatMassageItem[] = [

  ];

  public lastMessage: string = '';

  public cart: ICartItem[] = [];

  constructor(private groceryBotService: GroceryBotService
  ) { }

  ngOnInit(): void {
    this.chatList = this.groceryBotService.getChat();
    this.cart = this.groceryBotService.getCart() || [];
  }

  sendMessage() {

    this.isLoadingResponseMessage = true;
    this.getJsonList();
    this.getStreamingChatCompletion();
    // this.getDescription();

    // this.getJson(this.inputValue);
  }

  getDescription() {
    const start = Date.now();

    this.groceryBotService.getDescription(this.inputValue).subscribe((res: any) => {
      const end = Date.now();
      console.log('time description', end - start);
      console.log('res:', res);

      // if (res.selectedOption === '1') {
      //   this.getJson(this.inputValue);
      //   this.chatList.push({ content: 'Sure! I have added the items to your cart!', role: 'assistant' });
      // }
    });
  }


  getStreamingChatCompletion() {
    const start = Date.now();
    this.chatCompSub = this.groceryBotService.getChatCompletionStreaming(this.inputValue).subscribe({
      next: (tokens) => {
        if (!this.lastMessage) {
          const end = Date.now();
          console.log('time chat', end - start);
          // add the user message only after the first response
          this.chatList.push({ content: this.inputValue, role: 'user' });
        }

        this.lastMessage += tokens;
        this.inputValue = '';
        // this.scrollToLastElement()

      }, error: (err) => {
        this.isLoadingResponseMessage = false;
        console.log('error', err);

      }, complete: () => {

        this.isLoadingResponseMessage = false;
        console.log(' this.lastMessage:', this.lastMessage);

        this.chatList.push({ content: this.lastMessage, role: 'assistant' });

        this.groceryBotService.setChat(this.chatList);

        this.lastMessage = '';
      }
    });
  }

  onTextareaSubmit(text: string) {
    this.getJsonStreaming(text);
  }

  getJsonStreaming(text: string) {
    this.groceryBotService.gatSummeryStreamingJson(text).subscribe((chunk) => {
      this.cart.push(JSON.parse(chunk))
    });
  }

  getJsonList() {
    const start = Date.now();

    this.groceryBotService.getJSONCompletion(this.inputValue).subscribe((action: any) => {
      const end = Date.now();
      console.log('time json', end - start);
      console.log('res', action);

      this.groceryBotService.setLastAction(action);

      switch (action.action) {
        case 'add to cart':
          if (action?.list) {
            this.cart?.push(...action.list)
          }
          break;
        case 'remove from cart':
          if (action?.list) {
            this.cart = this.cart.filter((item) => !action.list.includes(item))
          }
          break
        case 'add x':
          if (action.name && action.quantity && this.cart) {
            const item = this.cart.find((item) => item.name === action.name);
            if (item && item.quantity >= 0) {
              item.quantity += action.quantity;
            }
          }
          break
        case 'remove x':
          if (action.name && action.quantity && this.cart) {
            const item = this.cart.find((item) => item.name === action.name);
            if (item) {
              const newQuantity: number = item.quantity - action.quantity;

              if (newQuantity <= 0) {
                item.quantity = 0;
              } else {
                item.quantity = newQuantity;
              }
            }
          }
          break
        case 'clear cart':
          this.cart = [];
          break
      }

      if (['add to cart', 'remove from cart', 'add x', 'remove x', 'clear cart'].includes(action.action)) {
        this.groceryBotService.setCart(this.cart);
      }

    });
  }

  get isMobile() {
    return window.innerWidth < 768;
  }

}