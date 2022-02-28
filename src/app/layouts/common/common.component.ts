import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountModel } from 'src/app/models/auth/account.model';
import { AuthenticationService } from 'src/app/services/auth/authentication.service';

@Component({
  selector: 'app-common',
  templateUrl: './common.component.html',
  styleUrls: ['./common.component.css']
})
export class CommonComponent implements OnInit {

  account: AccountModel | null;

  constructor(private authService: AuthenticationService
    , private router: Router) { 
    this.account = this.authService.getUserData();
  }

  ngOnInit(): void { }

  logout() {
    this.authService.logout();
    this.router.navigate(['/full/login']);
  }
}
