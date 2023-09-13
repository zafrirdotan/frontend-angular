import { NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, Sanitizer, SecurityContext } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { marked } from 'marked';
import { HighlightCodeDirective } from 'src/app/directives/highlight-code.directive';
import { massageContentItem } from 'src/app/interfaces/chat-item';
@Component({
  selector: 'app-assistant-message',
  templateUrl: './assistant-message.component.html',
  styleUrls: ['./assistant-message.component.scss'],
  standalone: true,
  imports: [HighlightCodeDirective, NgFor, NgIf],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssistantMessageComponent {
  private _message: massageContentItem[] = [];

  @Input() public set message(value: string) {
    // value = "Yes, you can use Highlight.js in Angular without relying on the ngx-highlightjs library. Here's how you can do it:\n\n1. Install Highlight.js library via npm:\n```bash\nnpm install highlight.js\n```\n\n2. Import the required Highlight.js styles and scripts in your Angular project. You can do this by adding the following lines to the `styles` and `scripts` arrays in the `angular.json` file:\n```json\n\"styles\": [\n  // ...\n  \"node_modules/highlight.js/styles/default.css\",\n  // Add any other styles you want to include\n],\n\"scripts\": [\n  // ...\n  \"node_modules/highlight.js/lib/highlight.js\",\n  // Add any other scripts you want to include\n]\n```\n\n3. Import Highlight.js in your component file (e.g., `example.component.ts`):\n```typescript\nimport * as hljs from 'highlight.js';\n\n@Component({\n  // ...\n})\nexport class ExampleComponent {\n  code = `console.log('Hello, World!');`;\n\n  ngAfterViewInit(): void {\n    hljs.highlightAll();\n  }\n}\n```\n\n4. In your component template (`example.component.html`), use the `pre` and `code` tags to display your code and apply the appropriate CSS class for syntax highlighting:\n```html\n<pre><code class=\"hljs\">{{ code }}</code></pre>\n```\n\n5. (Optional) You may need to import additional Highlight.js languages. You can import specific languages by importing them from `highlight.js/lib/languages` and then registering them using `hljs.registerLanguage()` before calling `highlightAll()`. For example:\n```typescript\nimport * as hljs from 'highlight.js/lib/core';\nimport javascript from 'highlight.js/lib/languages/javascript';\n\nhljs.registerLanguage('javascript', javascript);\nhljs.highlightAll();\n```\n\nRemember to include the appropriate language-specific scripts and styles in your Angular project if you are using languages other than the default language.\n\nWith these steps, you can utilize Highlight.js to highlight code syntax within your Angular application without relying on the ngx-highlightjs library."


    const parts = value.split('```');

    const messageContentItems: massageContentItem[] = parts.map((part, index) => {
      // If the index is even, it's a text part
      if (index % 2 === 0) {

        return {
          content: this.toMarkdownHtml(part),
          type: 'text'
        }
      }

      // If the index is odd, it's a code part
      const [codeType, ...codeLines] = part.split("\n");


      return {
        content: codeLines.join("\n").trim(),
        type: 'code',
        codeType: codeType.trim() as massageContentItem['codeType']
      }
    });

    this._message = messageContentItems || [];
  };


  get formattedMessage() {

    return this._message;
  }

  toMarkdownHtml(str: string): string {
    return this.sanitizer.sanitize(SecurityContext.HTML, marked.parse(str)) as string;
  }


  constructor(private sanitizer: DomSanitizer) { }

}


