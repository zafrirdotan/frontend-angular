export interface IBotAction {
  action: string;
  list?: ICartItem[];
}

export interface ICartItem {
  name: string;
  quantity: number;
  unit: string;
  isAvailable?: boolean;
  price?: number;
  alternatives?: ICartItem[];
  emoji?: string;
}
