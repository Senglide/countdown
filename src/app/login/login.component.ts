import { Component, OnInit } from '@angular/core';
import { AlertBox } from '../interfaces/alert-box';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: []
})
export class LoginComponent implements OnInit {

  loginData = {
    email: '',
    password: ''
  };

  alertBox: AlertBox = {
    message: '',
    color: ''
  };

  constructor(public authService: AuthService, private router: Router) { }

  ngOnInit() {
    if (localStorage.getItem('loginData')) {
      this.loginData = JSON.parse(localStorage.getItem('loginData'));
    }
    this.authService.alertBox$.subscribe(data => {
      this.alertBox = data;
    });
  }

  emailLogin(data: any, isValid: string) {
    this.authService.clearMessage();
    if (isValid) {
      this.authService.emailLogin(data.email, data.password);
      localStorage.setItem('loginData', JSON.stringify(data));
    } else {
      this.authService.setMessage('Email/password not valid...', 'alert-danger');
    }
  }

  toSignUp() {
    this.router.navigate(['/register']);
  }

}
