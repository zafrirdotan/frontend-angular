
export interface IBotAction {
    action: string;
    list: ICartItem[];
}

export interface ICartItem {
    name: string;
    quantity: number;
    scale: string;
}