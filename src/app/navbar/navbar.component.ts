import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {

  showToolbar: boolean = true;

  private routeSubscription: Subscription | undefined;
  constructor(private router: Router) { }

  ngOnInit() {
    this.routeSubscription = this.router.events.subscribe((event) => {


      if (event instanceof NavigationEnd) {
        // This event triggers when navigation ends
        this.showToolbar = event.url !== '/login';
      }

    });
  }

  ngOnDestroy() {
    // It's important to unsubscribe your subscriptions when the component is destroyed
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }


  goToLoginPage() {

    this.router.navigateByUrl('/login');
  }
}
