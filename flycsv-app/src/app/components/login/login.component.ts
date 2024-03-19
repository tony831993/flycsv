import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/models/User';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  overlayDisplay: boolean = false
  public loginError = false;
  public loginForm!: FormGroup;

  constructor(private router: Router, private authService: AuthService, private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      username: ['', Validators.compose([Validators.required])],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {

  }
  // On login
  onSubmit(): void {
    if (this.loginForm.valid) {
      this.overlayDisplay = true;
      this.loginError = false;
      const loginData = this.loginForm.value;

      this.authService.login(loginData.username, loginData.password).subscribe((data: any) => {
        this.overlayDisplay = false;
        this.authService.loggedInUser.next(data)
        this.router.navigate(['home']);
      }, (error) => {
        this.overlayDisplay = false;
        this.loginError = true;
        console.error('Error:', error);
      });
    }
  }

}
