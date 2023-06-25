export interface ChatMassageItem {
    content: string;
    role: 'user' | 'assistant';
}

export interface ChatDetails {
    name: string;
    id: string;
}

export interface ChatResponse {
    messages: ChatMassageItem[];
    name?: string;
    id?: string;

}

export interface DtoCharResponse {
    summery?: string;
    message: ChatMassageItem
}
