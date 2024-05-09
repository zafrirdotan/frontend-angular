import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Subscription } from 'rxjs';
import { GroceryBotService } from '../../grocery-bot-service/grocery-bot.service';
import { CommonModule, NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ChatLoaderComponent } from 'src/app/components/chat-loader/chat-loader.component';

@Component({
  selector: 'app-textarea',
  templateUrl: './textarea.component.html',
  styleUrls: ['./textarea.component.scss'],
  standalone: true,
  imports: [
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    FormsModule,
    NgIf,
    MatButtonModule,
    MatIconModule,
    ChatLoaderComponent,
    CommonModule,
  ],
})
export class TextareaComponent {
  @ViewChild('messageInputField') messageInputField: ElementRef | undefined;

  public messageInput: FormControl = new FormControl('');
  public isLoading$ = this.groceryBotService.loading$;
  private isLoadingSub: Subscription = new Subscription();

  constructor(private groceryBotService: GroceryBotService) {}

  ngOnInit(): void {
    this.isLoadingSub = this.isLoading$.subscribe((isLoading) => {
      if (isLoading) {
        this.messageInput.disable();
      } else {
        this.messageInput.enable();
        this.messageInputField?.nativeElement.focus();
      }
    });
  }

  ngOnDestroy() {
    this.isLoadingSub.unsubscribe();
  }

  sendMessage(event: Event) {
    event.preventDefault();
    this.getJsonList();
  }

  getJsonList() {
    this.groceryBotService.groceryBotCompilation(this.messageInput.value);
    this.messageInput.reset();
  }
}
