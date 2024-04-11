import {
  Directive,
  ElementRef,
  Input,
  OnChanges,
  SecurityContext,
  SimpleChanges,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import * as marked from 'marked';

@Directive({
  selector: '[appMarkdown]',
  standalone: true,
})
export class MarkdownDirective implements OnChanges {
  @Input('appMarkdown') markdownContent!: string;

  constructor(private el: ElementRef, private sanitizer: DomSanitizer) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['markdownContent']) {
      this.renderMarkdownContent();
    }
  }

  renderMarkdownContent() {
    this.el.nativeElement.innerHTML = this.toMarkdownHtml(
      this.markdownContent || ''
    );
  }

  toMarkdownHtml(str: string): string {
    return this.sanitizer.sanitize(
      SecurityContext.HTML,
      marked.parse(str)
    ) as string;
  }

  sanitizeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}
