import { NgIf, NgFor, CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
import { GroceryBotService } from './grocery-bot-service/grocery-bot.service';
import { TextareaComponent } from './components/textarea/textarea.component';
import { ICartItem } from '../interfaces/grocery-bot';
import { CartComponent } from './components/cart/cart.component';
import { GroceryResponseBody } from '../interfaces/chet-response';

@Component({
  selector: 'app-grocery-bot',
  templateUrl: './grocery-bot.page.html',
  styleUrls: ['./grocery-bot.page.scss'],
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    NgIf,
    MatButtonModule,
    MatIconModule,
    NgFor,
    ChatLoaderComponent,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    CommonModule,
    HighlightCodeDirective,
    AssistantMessageComponent,
    MatDialogModule,
    MatSnackBarModule,
    TextareaComponent,
    CartComponent,
  ],
})
export class GroceryBotPage implements OnInit {
  @ViewChild('scrollTarget', { static: false }) scrollTarget!: ElementRef;

  public inputValue: string = '';
  isLoadingResponseMessage: boolean = false;
  private chatCompSub: Subscription | undefined;

  public chatList: ChatMassageItem[] = [];

  public lastMessage: string = '';

  public cart: ICartItem[] = [];

  constructor(private groceryBotService: GroceryBotService) {}

  ngOnInit(): void {
    this.chatList = this.groceryBotService.getChat();
    this.cart = this.groceryBotService.getCart() || [];
  }

  ngAfterViewInit() {
    this.scrollToEnd('instant');
  }

  ngOnDestroy() {
    if (this.chatCompSub) {
      this.chatCompSub.unsubscribe();
    }
  }

  sendMessage() {
    this.getJsonList();
  }

  getJsonList() {
    const start = Date.now();

    this.chatList.push({ content: this.inputValue, role: 'user' });
    this.isLoadingResponseMessage = true;
    this.chatCompSub = this.groceryBotService
      .getJSONCompletion(this.inputValue)
      .subscribe({
        next: (response: GroceryResponseBody) => {
          if (!response) {
            return;
          }
          this.inputValue = '';
          this.groceryBotService.setLastAction(response.action);

          if (response?.cart) {
            this.cart = response.cart;
            this.groceryBotService.setCart(this.cart);
          }

          if (response.message) {
            this.chatList.push({
              content: response.message,
              role: 'assistant',
            });
          }

          this.groceryBotService.setChat(this.chatList);
        },
        error: () => {},
        complete: () => {
          setTimeout(() => this.scrollToEnd('smooth'), 0);
          this.isLoadingResponseMessage = false;
        },
      });
  }

  get isMobile() {
    return window.innerWidth < 768;
  }

  scrollToEnd(behavior: 'smooth' | 'auto' | 'instant' = 'smooth') {
    if (behavior === 'instant') {
      this.scrollTarget.nativeElement.scrollTop =
        this.scrollTarget.nativeElement.scrollHeight;
      return;
    }
    this.scrollTarget.nativeElement.scrollTo({
      top: this.scrollTarget.nativeElement.scrollHeight,
      behavior,
    });
  }

  cartChange(cart: ICartItem[]) {
    this.cart = cart;

    this.groceryBotService.setCart(this.cart);
  }
}
