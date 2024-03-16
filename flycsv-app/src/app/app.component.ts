import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'flycsv-app';
  public user: any;

  constructor(private authService: AuthService) {
    if (localStorage.getItem('user')) {
      const user = localStorage.getItem('user')
      this.user = JSON.parse((user) ? user : '');
    }
  }

  ngOnInit(): void {
    if (localStorage.getItem('user')) {
      this.authService.loggedInUser.subscribe((user) => {
        this.user = user;
      });
    }
  }

  logout(): void {
    this.authService.logout();
    this.user = null;
  }
}
