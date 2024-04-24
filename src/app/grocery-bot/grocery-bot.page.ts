import { NgIf, NgFor, CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { GroceryBotService } from './grocery-bot-service/grocery-bot.service';
import { TextareaComponent } from './components/textarea/textarea.component';
import { ICartItem } from '../interfaces/grocery-bot';
import { CartComponent } from './components/cart/cart.component';
import { AutoResizeDirective } from '../directives/auto-resize.directive';
import { Subscription } from 'rxjs';
import { MarkdownDirective } from '../directives/mark-down.directive';

@Component({
  selector: 'app-grocery-bot',
  templateUrl: './grocery-bot.page.html',
  styleUrls: ['./grocery-bot.page.scss'],
  standalone: true,
  imports: [
    MatFormFieldModule,
    ReactiveFormsModule,
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
    AutoResizeDirective,
    MarkdownDirective,
  ],
})
export class GroceryBotPage implements OnInit {
  @ViewChild('scrollTarget', { static: false }) scrollTarget!: ElementRef;

  public messageInput: FormControl = new FormControl('');

  @ViewChild('messageInputField') messageInputField: ElementRef | undefined;

  public chat$ = this.groceryBotService.chat$;
  public cart$ = this.groceryBotService.cart$;
  public isLoading$ = this.groceryBotService.loading$;
  private isLoadingSub: Subscription = new Subscription();

  constructor(private groceryBotService: GroceryBotService) {}

  ngOnInit(): void {
    this.isLoadingSub = this.isLoading$.subscribe((isLoading) => {
      if (isLoading) {
        this.messageInput.disable();
      } else {
        this.messageInput.enable();
        this.messageInputField?.nativeElement.focus();
      }
    });

    this.chat$.subscribe((chat) => {
      console.log('chat:', chat);
    });
  }

  ngAfterViewInit() {
    this.scrollToEnd('instant');
  }

  ngAfterViewChecked() {
    this.scrollToEnd();
  }

  ngOnDestroy() {
    this.isLoadingSub.unsubscribe();
  }

  sendMessage(event: Event) {
    event.preventDefault();
    this.getJsonList();
  }

  getJsonList() {
    this.groceryBotService.groceryBotCompilation(this.messageInput.value);
    this.messageInput.reset();
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
    this.groceryBotService.setCart(cart);
  }

  addItemToCart(product: ICartItem) {
    this.groceryBotService.addItemToCart(product);
  }
}
