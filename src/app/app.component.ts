import { Component, ElementRef, ViewChild } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { Router } from '@angular/router'
import {
  faPlus,
  faSignInAlt,
  faSignOutAlt,
} from '@fortawesome/free-solid-svg-icons'
import { TranslateService } from '@ngx-translate/core'
import { AuthService } from './services/auth.service'
import { AuthDialogComponent } from './components/auth-dialog/auth-dialog.component'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'cadaster'
  @ViewChild('closeModal') closeModal!: ElementRef
  faSignIn = faSignInAlt
  faSignOutAlt = faSignOutAlt
  dialogRef: any
  constructor(
    public translate: TranslateService,
    private router: Router,
    public authService: AuthService,
    public dialog: MatDialog,
  ) {
    translate.setDefaultLang('ru')
    translate.use('ru')
    translate.addLangs(['ru', 'en', 'kz'])
  }
  openDialog() {
    this.dialogRef = this.dialog.open(AuthDialogComponent, {
      width: '500px',
    })
    this.dialogRef.componentInstance.authDialog.subscribe((res: string) => {
      this.login(res)
      this.dialogRef.close()
    })
  }

  login(val: string) {
    this.authService.login(val).subscribe((res) => {
      if (res.success) {
        this.closeModal.nativeElement.click()
      }
    })
  }

  logout() {
    this.authService.logout().subscribe((res) => {
      if (!res.success) {
        this.router.navigate(['/plant'])
      }
    })
  }

  goToDashBoard() {
    let role = this.authService.getRole()
    if (role === 'ROLE_ADMIN') this.router.navigate(['cadaster-report'])
    if (role === 'ROLE_USER') this.router.navigate(['cadaster-report-check'])
  }
}
