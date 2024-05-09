import { NgIf, CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { GroceryBotService } from './grocery-bot-service/grocery-bot.service';
import { TextareaComponent } from './components/textarea/textarea.component';
import { ICartItem } from '../interfaces/grocery-bot';
import { CartComponent } from './components/cart/cart.component';
import { ChatComponent } from './components/chat/chat.component';
import { SuggestionsComponent } from './components/suggestions/suggestions.component';
import { MatDialog } from '@angular/material/dialog';
import { NewChatDialogComponent } from './components/new-chat-dialog/new-chat-dialog.component';

@Component({
  selector: 'app-grocery-bot',
  templateUrl: './grocery-bot.page.html',
  styleUrls: ['./grocery-bot.page.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgIf,
    MatButtonModule,
    MatIconModule,
    SuggestionsComponent,
    MatSidenavModule,
    CommonModule,
    TextareaComponent,
    CartComponent,
    ChatComponent,
    NewChatDialogComponent,
  ],
})
export class GroceryBotPage {
  @ViewChild('messageInputField') messageInputField: ElementRef | undefined;

  public cart$ = this.groceryBotService.cart$;

  constructor(
    private groceryBotService: GroceryBotService,
    public dialog: MatDialog
  ) {}

  get isMobile() {
    return window.innerWidth < 768;
  }

  cartChange(cart: ICartItem[]) {
    this.groceryBotService.setCart(cart);
  }

  openClearChatDialog() {
    this.dialog
      .open(NewChatDialogComponent)
      .afterClosed()
      .subscribe(
        ({
          clearCart,
          clearChat,
        }: {
          clearCart?: boolean;
          clearChat: boolean;
        }) => {
          if (clearChat) {
            this.resetChat();
          }
          if (clearCart) {
            this.groceryBotService.resetCart();
          }
        }
      );
  }

  resetChat() {
    this.groceryBotService.resetChat();
  }
}
