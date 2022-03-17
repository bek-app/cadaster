import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { LoginModel } from 'src/app/models/auth/login.model';
import { AuthenticationService } from 'src/app/services/auth/authentication.service';
import { NotificationService } from 'src/app/services/notification.service';

declare const webSocket_init: any;
declare const getKeyInfoAuthCall: any;
declare const findSubjectAttr: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  loading: boolean = false;
  selectedTabIndex = 0;
  constructor(private router: Router,
    private titleService: Title,
    private notificationService: NotificationService,
    private authenticationService: AuthenticationService) {

    const savedLogin = localStorage.getItem('savedLogin');

    this.loginForm = new FormGroup({
        login: new FormControl(savedLogin, [Validators.required]),
        organizationName: new FormControl(''),
        password: new FormControl(''),
        rememberMe: new FormControl(savedLogin !== null),
        certificate: new FormControl(''),
    });
  }

  ngOnInit() {
    this.titleService.setTitle('Аутентификация');
    this.authenticationService.logout();

    webSocket_init();
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


  loginByCert() {
    const loginModel = new LoginModel();
    loginModel.login = this.loginForm.get('login')?.value;
    loginModel.certificateData = this.loginForm.get('certificate')?.value;

    this.loading = true;
    this.authenticationService.loginByCert(loginModel).subscribe({
      next: (data) => {
        this.loading = false;
        this.router.navigate(['/']);
      }, 
      error: (error) => {
        this.loading = false;
        if (error.status == 404) {
          this.notificationService.error("Пользователь не найден");
          this.register();
        } else {
          this.notificationService.error(error.error);
        }
      }
    });
  }


  register() {
    this.router.navigate(['/auth/registration']);
  }

  chooseEcp() {
    getKeyInfoAuthCall((res: any) => {
      const subjectAttrs = res.subjectDn.split(',');
      const iin = findSubjectAttr(subjectAttrs, 'SERIALNUMBER').substr(3);
      const email = findSubjectAttr(subjectAttrs, 'E');
      let cn = findSubjectAttr(subjectAttrs, 'CN');
      cn = cn || '';
      const bin = findSubjectAttr(subjectAttrs, 'OU');
      if (bin) this.loginForm.controls.login.setValue(bin.substr(3));

      let organizationName = findSubjectAttr(subjectAttrs, 'O');
      if (organizationName) organizationName = organizationName.replace('\\','').replace('\\','');
      this.loginForm.controls.organizationName.setValue(organizationName);

      const pem = res['pem'];
      this.loginForm.controls.certificate.setValue(pem);
    });
  }
}