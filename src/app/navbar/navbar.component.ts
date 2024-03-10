import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { User } from '../interfaces/user';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { LoginFormComponent } from '../login/login-form/login-form.component';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  showToolbar: boolean = true;

  private routeSubscription: Subscription | undefined;
  private userSub: Subscription | undefined;

  public user: User | null = null;
  constructor(
    private router: Router,
    private authService: AuthService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) {
    this.matIconRegistry.addSvgIcon(
      'github',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        'assets/images/github.svg'
      )
    );
  }

  ngOnInit() {
    // Remove the toolbar if the user is on the login page
    this.routeSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // This event triggers when navigation ends
        this.showToolbar = event.url !== '/login';
      }
    });

    this.userSub = this.authService.currentUser$.subscribe((user) => {
      console.log('user', user);

      this.user = user;
    });
  }

  ngOnDestroy() {
    this.routeSubscription?.unsubscribe();
    this.userSub?.unsubscribe();
  }

  goToLoginPage() {
    this.openLoginDialog();
  }

  logout() {
    this.authService.logout().subscribe(() => {
      this.openSnackBar('Logged out successfully');
      // this.router.navigateByUrl('/login');
    });
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, 'close', {
      duration: 2000,
    });
  }

  openSignupDialog() {
    this.dialog.open(LoginFormComponent, {
      data: { isLogin: false },
    });
  }

  openLoginDialog() {
    this.dialog.open(LoginFormComponent, {
      data: { isLogin: true },
    });
  }

  get isMobile() {
    return window.innerWidth < 768;
  }
}
