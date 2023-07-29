import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, of, tap } from 'rxjs';
import { User } from '../interfaces/user';
import { LocalStorageService } from '../services/local-storage-service/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentUser = new BehaviorSubject<User | null>(this.localStorageService.getItem('user'));
  public currentUser$ = this.currentUser.asObservable();

  constructor(private http: HttpClient, private localStorageService: LocalStorageService,) { }

  sendMagicLinkEmail(email: string) {
    return this.http.post('http://localhost:3000/auth/login', { destination: email });
  }

  loginWithMagicLink(token: string): Observable<User> {
    return this.http.get<User>('http://localhost:3000/auth/login/callback?token=' + token, { withCredentials: true }).pipe(
      tap((user: User) => {
        this.localStorageService.setItem('user', user);
        this.currentUser.next(user);
      }));
  }

  getTempUserCookie() {
    return this.http.get('http://localhost:3000/auth/temp-user', { withCredentials: true });
  }

  checkIfUserLoggedIn() {
    if (!this.currentUser.getValue()) {
      return of(false)
    }

    return this.http.get<User>('http://localhost:3000/auth/is-logged-in', { withCredentials: true }).pipe(map((res: any) => {
      if (!res) {
        return false;
      }

      if (res.isLoggedIn === false) {
        this.localStorageService.removeItem('user');
        this.currentUser.next(null);
        return false;
      }

      this.localStorageService.setItem('user', res.user);
      this.currentUser.next(res.user);
      return true;
    }));
  }

  logout() {
    return this.http.get('http://localhost:3000/auth/logout', { withCredentials: true }).pipe(
      tap(() => {
        this.localStorageService.removeItem('user');
        this.currentUser.next(null);
      })
    )
  }
}
