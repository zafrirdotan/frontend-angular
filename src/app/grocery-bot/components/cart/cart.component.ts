import { CurrencyPipe, NgFor, NgIf, SlicePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { ICartItem } from 'src/app/interfaces/grocery-bot';
import { MatSelectModule } from '@angular/material/select';

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
    MatSelectModule,
    CurrencyPipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartComponent {
  @Input() cart: ICartItem[] = [];
  @Output() cartChange = new EventEmitter<ICartItem[]>();

  get total() {
    return this.cart.reduce(
      (acc, item) => acc + (item.price ?? 0) * item.quantity,
      0
    );
  }

  changeToAlternative(selectedAltName: string, item: ICartItem, index: number) {
    // find the selected alternative
    const selectedAlternative = item.alternatives?.find(
      (alt) => alt.name === selectedAltName
    );

    // create a new item with the selected alternative
    const newItem = { ...item, ...selectedAlternative };
    // remove the selected alternative from the list of alternatives
    const newAlternatives = item.alternatives?.filter(
      (alt) => alt.name !== selectedAltName
    );

    const oldItem = { ...item };
    // remove the list of alternatives from the old item
    delete oldItem.alternatives;
    // add the current item to the list of alternatives
    newAlternatives?.push(oldItem);

    newItem.alternatives = newAlternatives;

    this.cart[index] = newItem;
    this.cartChange.emit(this.cart);
  }

  increaseQuantity(item: ICartItem) {
    if (isNaN(item.quantity)) {
      item.quantity = 0;
    }
    item.quantity++;
    this.cartChange.emit(this.cart);
  }

  decreaseQuantity(item: ICartItem) {
    if (isNaN(item.quantity)) {
      item.quantity = 0;
    }

    if (item.quantity === 0) {
      return;
    }
    item.quantity--;
    this.cartChange.emit(this.cart);
  }

  payNow() {
    console.log('pay now');
  }

  trackItem(index: number, item: ICartItem) {
    return item.productId ?? item.name;
  }
}
