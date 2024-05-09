import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-new-chat-dialog',
  templateUrl: './new-chat-dialog.component.html',
  styleUrls: ['./new-chat-dialog.component.scss'],
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatDialogModule],
})
export class NewChatDialogComponent {
  constructor(private dialogRef: MatDialogRef<NewChatDialogComponent>) {}

  createNewChat(clearCart: boolean = false) {
    this.dialogRef.close({
      clearCart,
      clearChat: true,
    });
  }

  close() {
    this.dialogRef.close({
      clearCart: false,
      clearChat: false,
    });
  }
}
