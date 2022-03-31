import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountModel } from 'src/app/models/auth/account.model';
import { AuthenticationService } from 'src/app/services/auth/authentication.service';

@Component({
  selector: 'app-common',
  templateUrl: './common.component.html',
  styleUrls: ['./common.component.css'],
})
export class CommonComponent implements OnInit {
  account: AccountModel | null;

  isDeclarant = false;
  isValidator = false;
  isAdmin = false;

  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {
    this.account = this.authService.getUserData();
  }

  ngOnInit(): void {
    const userInfo = this.authService.getUserData();
    const roles = userInfo?.roles;

    for (let role of roles!!) {
      if (role === 'declarant') {
        this.isDeclarant = true;
      } else if (role == 'validator') {
        this.isValidator = true;
      } else if (role == 'administrator') {
        this.isAdmin = true;
      }
    }
  }

  logout() {
    this.authService.logout().subscribe((r) => {
      this.router.navigate(['/auth/login']);
    });
  }
}
