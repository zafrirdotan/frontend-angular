import { ICartItem } from './grocery-bot';

export interface ChatResponse {
  role: 'assistant';
  content: string;
}

export interface GroceryRequestBody {
  message: { role: 'user'; content: string };
  cart: ICartItem[];
  lastAction: Action;
}

export interface GroceryResponseBody {
  role: 'system';
  message: string;
  cart: ICartItem[];
  action: Action;
  lastAction: Action;
}

export interface Action {
  actionType: ActionType;
  items: ICartItem[];
}

export enum ActionType {
  addToCart = 'addToCart',
  removeFromCart = 'removeFromCart',
  addX = 'addX',
  removeX = 'removeX',
  clearCart = 'clearCart',
  isProductAvailable = 'isProductAvailable',
  whatKindOfProduct = 'whatKindOfProduct',
  howAreYou = 'howAreYou',
  hallo = 'hallo',
  yes = 'yes',
  no = 'no',
  showCart = 'showCart',
  CartClearApproval = 'CartClearApproval',
}
