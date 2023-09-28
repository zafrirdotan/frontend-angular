import { NgFor } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { ICartItem } from 'src/app/interfaces/grocery-bot';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
  standalone: true,
  imports: [NgFor, MatButtonModule, MatIconModule, MatDividerModule],
})
export class CartComponent {

  @Input() cart: ICartItem[] = [];

  increaseQuantity(item: ICartItem) {

    item.quantity++;
  }

  decreaseQuantity(item: ICartItem) {
    if (item.quantity === 0) {
      return;
    }
    item.quantity--;
  }
}
