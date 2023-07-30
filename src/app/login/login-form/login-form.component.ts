import { Component, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent {

  public showForm: boolean = true;
  public errorMessage: string | undefined;
  public email = new FormControl('', [Validators.email]);

  constructor(
    private authService: AuthService,
    @Inject(MAT_DIALOG_DATA) public data: { isLogin: boolean }
  ) {
    this.email.valueChanges.subscribe(() => {
      this.errorMessage = undefined;
    })
  }

  onButtonClick() {
    if (this.data.isLogin) {
      this.loginWithEmail();
    } else {
      this.signupWithMagicLink();
    }
  }

  loginWithEmail() {
    if (this.email.invalid || !this.email.value) {
      return;
    }

    this.authService.sendMagicLoginEmail(this.email.value).subscribe({
      next: () => {
        this.showForm = false;
      },
      error: (error) => {

        this.errorMessage = 'This email is not registered in this site';
      }
    });
  }


  signupWithMagicLink() {
    if (this.email.invalid || !this.email.value) {
      return;
    }
    this.authService.sendMagicSignupEmail(this.email.value).subscribe({
      next: () => {
        this.showForm = false;
      },
      error: (error) => {
        console.log(error);

        if (error?.error.message === 'User already exists') {
          this.errorMessage = 'User already exists'
          return;
        }

        this.errorMessage = 'Something went wrong, please try again later';

      }
    });
  }

}
