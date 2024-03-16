import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/User';
import { environment } from 'src/environments/environment';
import { Subject, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public loggedInUser = new Subject();

  constructor(private router: Router, private http: HttpClient) {

  }

  login(username: string, password: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
    return this.http.post<User>(environment.loginUrl, { username, password }, httpOptions)
      .pipe(map((user) => {
        localStorage.setItem('user', JSON.stringify(user));
        return user;
      }));
  }

  isLoggedIn() {
    // return false;
    const user: any = localStorage.getItem('user'); // JSON.parse(localStorage.getItem('user'));
    if (user) {
      return true;
    }
    return false;
  }

  getLoggedInUser() {
    return localStorage.getItem('user');
  }

  register(user: User) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
    return this.http.post(environment.authUrl, user, httpOptions)
  }

  logout() {
    localStorage.removeItem('user');
    this.router.navigate(['login']);
  }
}
