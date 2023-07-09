import { Directive, ElementRef } from '@angular/core';
import hljs from 'highlight.js';
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';

@Directive({
  selector: 'code[highlight]',
  standalone: true
})
export class HighlightCodeDirective {
  constructor(private eltRef: ElementRef) {
    hljs.registerLanguage('javascript', javascript);
    hljs.registerLanguage('typescript', typescript);

  }

  ngAfterViewInit() {
    hljs.highlightBlock(this.eltRef.nativeElement);
  }
}


