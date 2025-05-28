import { NgFor, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  SecurityContext,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { marked } from 'marked';
import { HighlightCodeDirective } from 'src/app/directives/highlight-code.directive';

type MessageContentType =
  | { type: 'text'; content: string }
  | { type: 'code'; content: string; codeType: string };

@Component({
  selector: 'app-assistant-message',
  templateUrl: './assistant-message.component.html',
  styleUrls: ['./assistant-message.component.scss'],
  standalone: true,
  imports: [HighlightCodeDirective, NgFor, NgIf],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssistantMessageComponent {
  private _message: MessageContentType[] = [];
  private _rawValue = '';

  @Input() set message(value: string) {
    if (value === this._rawValue) return;
    this._rawValue = value;

    if (!value) {
      this._message = [];
      return;
    }

    const parts = value.split('```');
    const parsed: MessageContentType[] = [];

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (!part.trim()) continue;

      if (i % 2 === 0) {
        // Text part
        const html = this.toMarkdownHtml(part);
        if (html) parsed.push({ type: 'text', content: html });
      } else {
        // Code part
        const [codeType, ...codeLines] = part.split('\n');
        parsed.push({
          type: 'code',
          content: codeLines.join('\n').trim(),
          codeType: codeType.trim() || 'plaintext',
        });
      }
    }

    this._message = parsed;
  }

  constructor(private sanitizer: DomSanitizer) {}

  get formattedMessage(): MessageContentType[] {
    return this._message;
  }

  toMarkdownHtml(str: string): string {
    const raw = marked.parse(str);
    return this.sanitizer.sanitize(SecurityContext.HTML, raw) || '';
  }
}
