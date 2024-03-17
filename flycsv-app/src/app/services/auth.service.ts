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

  constructor(private router: Router, private http: HttpClient) { }
  /**
   * User login
   * @param username 
   * @param password 
   * @returns 
   */
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
  /**
   * Check if user is loggedIn
   * @returns boolean
   */
  isLoggedIn() {
    // return false;
    const user: any = localStorage.getItem('user'); // JSON.parse(localStorage.getItem('user'));
    if (user) {
      return true;
    }
    return false;
  }
  /**
   * Get loggedIn user details
   * @returns 
   */
  getLoggedInUser() {
    if (localStorage.getItem('user')) {
      const user = localStorage.getItem('user');
      return JSON.parse((user) ? user : '');
    }
    return null;
  }
  /**
   * Register new user
   * @param user 
   * @returns 
   */
  register(user: User) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
    return this.http.post(environment.authUrl, user, httpOptions)
  }
  /**
   * Logout user
   */
  logout() {
    localStorage.removeItem('user');
    this.router.navigate(['login']);
  }
}
