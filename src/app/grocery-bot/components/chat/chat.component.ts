import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { GroceryBotService } from '../../grocery-bot-service/grocery-bot.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  GroceryBotCompletionParam,
  ICartItem,
} from 'src/app/interfaces/grocery-bot';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { MarkdownDirective } from 'src/app/directives/mark-down.directive';
import { Subscription } from 'rxjs';
import { SuggestionsComponent } from '../suggestions/suggestions.component';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatIconModule,
    NgFor,
    NgIf,
    CommonModule,
    MarkdownDirective,
    SuggestionsComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('scrollTarget') scrollTarget!: ElementRef;

  public chat$ = this.groceryBotService.chat$;
  public chatSub: Subscription = new Subscription();
  public chat: GroceryBotCompletionParam[] = [];

  constructor(
    private groceryBotService: GroceryBotService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.chatSub = this.chat$.subscribe((chat: GroceryBotCompletionParam[]) => {
      this.chat = chat;
      this.changeDetectorRef.detectChanges();
      this.scrollToEnd();
    });
  }

  ngAfterViewInit() {
    this.scrollToEnd('instant');
  }

  ngOnDestroy() {
    this.chatSub.unsubscribe();
  }

  scrollToEnd(behavior: 'smooth' | 'auto' | 'instant' = 'smooth') {
    if (!this.scrollTarget?.nativeElement) {
      console.log('No scroll target found');

      return;
    }

    if (behavior === 'instant') {
      this.scrollTarget.nativeElement.scrollTop =
        this.scrollTarget.nativeElement.scrollHeight;
      return;
    }

    this.scrollTarget.nativeElement.scroll({
      top: this.scrollTarget.nativeElement.scrollHeight,
      behavior,
    });
  }

  trackBy(index: number, chatItem: GroceryBotCompletionParam) {
    return chatItem.content; // Use index as the trackBy identifier
  }

  addItemToCartOnClick(product: ICartItem) {
    if (!this.isMobile) {
      this.addItemToCart(product);
    }
  }

  addItemToCartOnTouch(product: ICartItem) {
    if (this.isMobile) {
      this.addItemToCart(product);
    }
  }

  get isMobile() {
    return window.innerWidth < 768;
  }

  addItemToCart(product: ICartItem) {
    this.groceryBotService.addItemToCart(product);
  }
}
