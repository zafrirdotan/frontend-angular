import { Component, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-signup-form',
  templateUrl: './signup-form.component.html',
  styleUrls: ['./signup-form.component.scss']
})
export class SignupFormComponent {

  public showForm: boolean = true;
  public errorMessage: string | undefined;
  public fullName = new FormControl('', [Validators.required]);

  constructor(
    private authService: AuthService,
    @Inject(MAT_DIALOG_DATA) public data: { token: string },
    private dialogRef: MatDialogRef<SignupFormComponent>

  ) {
    this.fullName.valueChanges.subscribe(() => {
      this.errorMessage = undefined;
    })
  }

  signupWithMagicLink() {
    if (!this.fullName.value) {
      return;
    }
    this.errorMessage = undefined;

    this.authService.signupWithMagicLink(this.data.token, this.fullName.value).subscribe({
      next: () => {
        this.showForm = false;
        this.dialogRef.close(true);
      },
      error: (error) => {

        if (error?.error.message === 'User already exists') {
          this.errorMessage = 'User already exists'
          return;
        }

        this.errorMessage = 'Something went wrong, please try again later';

      }
    });
  }
}
