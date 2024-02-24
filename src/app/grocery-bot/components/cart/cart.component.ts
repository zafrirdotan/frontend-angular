import { NgFor, NgIf, SlicePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { ICartItem } from 'src/app/interfaces/grocery-bot';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
  standalone: true,
  imports: [
    NgFor,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    SlicePipe,
    NgIf,
  ],
})
export class CartComponent {
  toggleCart() {
    throw new Error('Method not implemented.');
  }
  clearCart() {
    throw new Error('Method not implemented.');
  }

  @Input() cart: ICartItem[] = [];
  @Output() cartChange = new EventEmitter<ICartItem[]>();

  increaseQuantity(item: ICartItem) {
    item.quantity++;
    this.cartChange.emit(this.cart);
  }

  decreaseQuantity(item: ICartItem) {
    if (item.quantity === 0) {
      return;
    }
    item.quantity--;
    this.cartChange.emit(this.cart);
  }

  payNow() {
    console.log('pay now');
  }
}
