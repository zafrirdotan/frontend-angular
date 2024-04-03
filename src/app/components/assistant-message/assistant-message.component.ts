import { NgFor, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  Sanitizer,
  SecurityContext,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { marked } from 'marked';
import { HighlightCodeDirective } from 'src/app/directives/highlight-code.directive';
import { massageContentItem } from 'src/app/interfaces/chat-item';
@Component({
  selector: 'app-assistant-message',
  templateUrl: './assistant-message.component.html',
  styleUrls: ['./assistant-message.component.scss'],
  standalone: true,
  imports: [HighlightCodeDirective, NgFor, NgIf],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssistantMessageComponent {
  private _message: massageContentItem[] = [];

  @Input() public set message(value: string) {
    const parts = value?.split('```');

    const messageContentItems: massageContentItem[] = parts?.map(
      (part, index) => {
        // If the index is even, it's a text part
        if (index % 2 === 0) {
          return {
            content: this.toMarkdownHtml(part),
            type: 'text',
          };
        }

        // If the index is odd, it's a code part
        const [codeType, ...codeLines] = part.split('\n');

        return {
          content: codeLines.join('\n').trim(),
          type: 'code',
          codeType: codeType.trim() as massageContentItem['codeType'],
        };
      }
    );

    this._message = messageContentItems || [];
  }

  constructor(private sanitizer: DomSanitizer) {}

  get formattedMessage() {
    return this._message;
  }

  toMarkdownHtml(str: string): string {
    return this.sanitizer.sanitize(
      SecurityContext.HTML,
      marked.parse(str)
    ) as string;
  }
}
