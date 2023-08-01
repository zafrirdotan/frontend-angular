import { SafeHtml } from "@angular/platform-browser";

export interface ChatMassageItem {
    content: string;
    role: 'user' | 'assistant';
}

export interface massageContentItem {
    content: string | SafeHtml;
    type: 'text' | 'code';
    codeType?: 'javascript' | 'typescript' | 'python' | 'html' | 'css' | 'bash' | 'json' | 'sql' | 'markdown' | 'yaml' | 'xml' | 'java' | 'csharp' | 'cpp' | 'go' | 'ruby' | 'php' | 'perl' | 'swift' | 'kotlin' | 'rust' | 'scala' | 'groovy' | 'powershell' | 'docker' | 'nginx' | 'apache' | 'yaml' | 'ini' | 'diff' | 'http' | 'cs' | 'cpp';
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
