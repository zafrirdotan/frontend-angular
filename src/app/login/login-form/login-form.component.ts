import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent {

  public showForm: boolean = true;
  public showErrorMessage: boolean = false;
  public email = new FormControl('', [Validators.email]);
  public isLogin: boolean = true;

  constructor(private authService: AuthService) {
    this.email.valueChanges.subscribe(() => {

      this.showErrorMessage = false;
    })
  }


  loginWithEmail() {
    if (this.email.invalid || !this.email.value) {
      return;
    }
    this.authService.sendMagicLinkEmail(this.email.value).subscribe({
      next: () => {
        this.showForm = false;
      },
      error: (error) => {

        this.showErrorMessage = true;
      }
    });
    console.log(this.email.value);
  }


  signIn() {
    throw new Error('Method not implemented.');
  }

}
