import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: 'textarea[appAutoResize]',
  standalone: true,
})
export class AutoResizeDirective {
  constructor(public element: ElementRef) {}

  onInit(): void {
    this.resetHeight();
  }

  @HostListener('keydown.enter', ['$event'])
  onEnterKeyDown(event: KeyboardEvent): void {
    console.log('onEnterKeyDown', event);

    this.resetHeight();
  }

  resetHeight(): void {
    this.element.nativeElement.style.height = '24px';
  }

  @HostListener('input', ['$event.target'])
  onInput(textArea: HTMLTextAreaElement): void {
    console.log('textArea', textArea.value);

    this.adjust();
  }

  adjust(): void {
    console.log(this.element.nativeElement.scrollHeight);

    this.element.nativeElement.style.overflow = 'hidden';
    this.element.nativeElement.style.height = '24px';
    this.element.nativeElement.style.height =
      this.element.nativeElement.scrollHeight + 'px';
  }
}
