import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { LoginModel } from 'src/app/models/auth/login.model';
import { AuthenticationService } from 'src/app/services/auth/authentication.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  loading: boolean = false;

  constructor(private router: Router,
    private titleService: Title,
    private notificationService: NotificationService,
    private authenticationService: AuthenticationService) {

    const savedLogin = localStorage.getItem('savedLogin');

    this.loginForm = new FormGroup({
        login: new FormControl(savedLogin, [Validators.required]),
        password: new FormControl('', Validators.required),
        rememberMe: new FormControl(savedLogin !== null),
    });
  }

  ngOnInit() {
    this.titleService.setTitle('Аутентификация');
    this.authenticationService.logout();
  }

  login() {
    const loginModel = new LoginModel();
    loginModel.login = this.loginForm.get('login')?.value;
    loginModel.password = this.loginForm.get('password')?.value;

    const rememberMe = this.loginForm.get('rememberMe')?.value;

    if (rememberMe && loginModel.login) {
      localStorage.setItem('savedLogin', loginModel.login);
    } else {
      localStorage.removeItem('savedLogin');
    }

    this.loading = true;
    this.authenticationService.login(loginModel).subscribe({
      next: (data) => {
        this.loading = false;
        this.router.navigate(['/']);
      }, 
      error: (error) => {
        this.loading = false;
        this.notificationService.error(error.error)
      }
    });
  }

  register() {
    this.router.navigate(['/auth/registration']);
  }
}