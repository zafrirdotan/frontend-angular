import { TextFieldModule } from '@angular/cdk/text-field';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-textarea',
  templateUrl: './textarea.component.html',
  styleUrls: ['./textarea.component.scss'],
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, FormsModule, NgIf, MatButtonModule, MatIconModule, NgFor, CommonModule, TextFieldModule],

})
export class TextareaComponent {
  public textValue: string = '';

  @Output() onSubmit = new EventEmitter<string>();

  addToCart() {
    console.log('addToCart', this.textValue);

    this.onSubmit.emit(this.textValue);
  }

}
