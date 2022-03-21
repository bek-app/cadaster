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
  hideMenuItem: boolean = false;
  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {
    this.account = this.authService.getUserData();
  }

  ngOnInit(): void {
    const userInfo = this.authService.getUserData();
    const role = userInfo?.roles?.[0];
    if (role === 'declarant') {
      this.hideMenuItem = true;
    }
  }

  logout() {
    this.authService.logout().subscribe((r) => {
      this.router.navigate(['/auth/login']);
    });
  }
}
