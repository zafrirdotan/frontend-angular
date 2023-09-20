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
import { Language, responseDictionary } from './crocery-bot-response-dictionary';

@Component({
  selector: 'app-grocery-bot',
  templateUrl: './grocery-bot.page.html',
  styleUrls: ['./grocery-bot.page.scss'],
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, FormsModule, NgIf, MatButtonModule, MatIconModule, NgFor, ChatLoaderComponent, MatToolbarModule, MatSidenavModule,
    MatListModule, CommonModule, HighlightCodeDirective, AssistantMessageComponent, MatDialogModule, MatSnackBarModule, TextareaComponent, CartComponent],
})
export class GroceryBotPage implements OnInit {
  @ViewChild('scrollTarget', { static: false }) scrollTarget!: ElementRef;

  public inputValue: string = '';
  isLoadingResponseMessage: any;
  private chatCompSub: Subscription | undefined;

  public chatList: ChatMassageItem[] = [

  ];

  public lastMessage: string = '';

  public cart: ICartItem[] = [];

  private language: string = Language.EN;


  private isClearCartMessage: boolean = false;

  constructor(private groceryBotService: GroceryBotService
  ) { }

  ngOnInit(): void {
    this.chatList = this.groceryBotService.getChat();
    this.cart = this.groceryBotService.getCart() || [];
  }

  ngAfterViewInit() {
    this.scrollToEnd('instant');
  }

  sendMessage() {

    // this.isLoadingResponseMessage = true;
    this.getJsonList();
    // this.getStreamingChatCompletion();
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

    this.chatList.push({ content: this.inputValue, role: 'user' });

    this.groceryBotService.getJSONCompletion(this.inputValue).subscribe((action: any) => {
      this.inputValue = '';
      const end = Date.now();
      console.log('res', action);
      console.log('time json', end - start);
      if (!action) {
        return;
      }
      const language = Language.EN;
      this.groceryBotService.setLastAction(action);

      switch (action.action) {
        case 'add to cart':
          if (action?.list) {
            const availableItems = action.list.filter((item: ICartItem) => item.isAvailable && item.name !== 'item');
            const unavailableItems = action.list.filter((item: ICartItem) => !item.isAvailable && item.name !== 'item');

            this.chatList.push({ content: responseDictionary.addingItemsToCart[language](availableItems, unavailableItems), role: 'assistant' });

            this.addToCart(availableItems);

          }
          break;
        case 'remove from cart':
          if (action?.list) {
            this.chatList.push({ content: responseDictionary.removingItemsFromCart[language](action), role: 'assistant' });
            this.removeFromCart(action.list);
          }
          break
        case 'add x':
          if (action?.list && this.cart) {
            const availableItems = action.list.filter((item: ICartItem) => item.isAvailable && item.name !== 'item');

            this.addToCart(availableItems);
            this.chatList.push({ content: responseDictionary.addingItemsToCart[language](availableItems), role: 'assistant' });

          } else {
            this.chatList.push({ content: responseDictionary.addingBeMoreSpecific[language](action), role: 'assistant' });
          }
          break
        case 'remove x':

          if (action?.list && this.cart) {
            this.removeFromCart(action.list);
            this.chatList.push({ content: responseDictionary.removingItemsFromCart[language](action), role: 'assistant' });
          } else {
            this.chatList.push({ content: responseDictionary.removingBeMoreSpecific[language](action), role: 'assistant' });
          }
          break

        case 'user saying hallo':
          this.chatList.push({ content: responseDictionary.sayingHallo[language](action), role: 'assistant' });
          break

        case 'show cart':
          this.chatList.push({ content: `${responseDictionary.showCart[language](action)} ${this.cart.map(item => `\n- ${item.quantity} ${item.unit} ${item.name} price: ${item.price}`)}`, role: 'assistant' });
          break
        case 'clear cart':
          this.chatList.push({ content: responseDictionary.clearCart[language](action), role: 'assistant' });
          this.isClearCartMessage = true;
          // this.cart = [];
          break
        case 'yes':
          if (this.isClearCartMessage) {
            this.cart = [];
            this.isClearCartMessage = false;
          }
          break
        case 'no':
          if (this.isClearCartMessage) {
            this.isClearCartMessage = false;
          }
      }

      if (['add to cart', 'remove from cart', 'add x', 'remove x', 'clear cart'].includes(action.action)) {
        this.groceryBotService.setCart(this.cart);
      }
      this.groceryBotService.setChat(this.chatList);
      this.scrollToEnd('smooth');
    });
  }

  addToCart(availableItems: any) {
    this.cart = mergeArrays(this.cart, availableItems);
  }

  removeFromCart(removedItems: any) {
    this.cart = reduceArrays(this.cart, removedItems);
  }

  get isMobile() {
    return window.innerWidth < 768;
  }

  scrollToEnd(behavior: 'smooth' | 'auto' | 'instant' = 'smooth') {
    if (behavior === 'instant') {
      this.scrollTarget.nativeElement.scrollTop = this.scrollTarget.nativeElement.scrollHeight;
      return;
    }
    this.scrollTarget.nativeElement.scrollTo({ top: this.scrollTarget.nativeElement.scrollHeight, behavior });;
  }

  payNow() {

  }



}


function mergeArrays(cart: ICartItem[], addedItems: ICartItem[]) {
  const mergedArray = [...cart, ...addedItems];
  const nameToItem = new Map();

  mergedArray.forEach((item) => {
    if (!nameToItem.has(item.name)) {
      nameToItem.set(item.name, { ...item });
    } else {
      const existingItem = nameToItem.get(item.name);
      existingItem.quantity = (existingItem.quantity || 0) + (item.quantity || 0);
      nameToItem.set(item.name, existingItem);
    }
  });

  return Array.from(nameToItem.values());
}

function reduceArrays(cart: ICartItem[], removedItems: ICartItem[]) {
  const nameToItem = new Map();

  cart.forEach((item) => {
    nameToItem.set(item.name?.toLowerCase(), { ...item });
  });

  removedItems.forEach((item) => {
    if (nameToItem.has(item.name?.toLowerCase())) {
      const existingItem = nameToItem.get(item.name?.toLowerCase());
      existingItem.quantity = (existingItem.quantity || 0) - ((item.quantity || 0));
      if (existingItem.quantity <= 0) {
        nameToItem.delete(item.name?.toLowerCase());
      } else {
        nameToItem.set(item.name?.toLowerCase(), existingItem);
      }
    }
  });

  return Array.from(nameToItem.values());
}