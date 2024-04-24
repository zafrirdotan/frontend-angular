export interface IBotAction {
  action: string;
  list?: ICartItem[];
}

export enum UserAction {
  addToCart = 'addToCart',
  removeFromCart = 'removeFromCart',
  addX = 'addX',
  removeX = 'removeX',
  addXMore = 'addXMore',
  clearCart = 'clearCart',
  isProductAvailable = 'isProductAvailable',
  whatKindOfProduct = 'whatKindOfProduct',
  showCart = 'showCart',
}

export enum AssistantAction {
  addedToCart = 'addedToCart',
  removedFromCart = 'removedFromCart',
  addedX = 'addedX',
  removedX = 'removedX',
  addedXMore = 'addedXMore',
  clearedCart = 'clearedCart',
  showedCart = 'showedCart',
  showAvailableProducts = 'showAvailableProducts',
  generated = 'generated',
  notUnderstood = 'notUnderstood',
  cartClearApproval = 'cartClearApproval',
  initialMessage = 'initialMessage',
}

export interface GroceryBotCompletion {
  messages: Array<GroceryBotCompletionParam>;
}

export type GroceryBotCompletionParam =
  | UserMessageParams
  | AssistantMessageParams;

export interface UserMessageParams {
  role: 'user';
  content: string;
  cart?: ICartItem[];
  actionType?: UserAction;
}
export interface AssistantMessageParams {
  role: 'assistant';
  content: string;
  actionType: AssistantAction;
  shortContentMessage?: string;
  cart?: ICartItem[];
  availableItems?: IAvailableItems[];
  unavailableItems?: ICartItem[];
}

export interface ICartItem {
  name: string;
  quantity: number;
  unit: string;
  isAvailable: boolean;
  searchKeywords?: string[];
  price?: number;
  productId?: number;
  barcode?: string;
  category?: string;
  emoji?: string;
  alternatives?: ICartItem[];
  imgUrl?: string;
}

export interface IAvailableItems {
  searchTerm: string;
  count: number;
  items: ICartItem[];
}
