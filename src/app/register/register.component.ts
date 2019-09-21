import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AlertBox } from '../interfaces/alert-box';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  loginData = {
    email: '',
    password: '',
    alias: ''
  };

  alertBox: AlertBox = {
    message: '',
    color: ''
  };

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authService.alertBox$.subscribe(data => {
      this.alertBox = data;
    });
  }

  emailSignUp(data: any, isValid: string) {
    this.authService.clearMessage();
    if (isValid) {
      this.authService.emailSignUp(data.email, data.password, data.alias);
      localStorage.setItem('login', JSON.stringify(data));
    } else {
      this.authService.setMessage('Email/password not valid', 'alert-danger');
    }
  }

}
