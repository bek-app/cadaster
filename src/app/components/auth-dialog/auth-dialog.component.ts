import { Component, EventEmitter, OnInit, Output } from '@angular/core'
import { faUser } from '@fortawesome/free-regular-svg-icons'
import { faUserShield } from '@fortawesome/free-solid-svg-icons'

@Component({
  selector: 'app-auth-dialog',
  templateUrl: './auth-dialog.component.html',
  styleUrls: ['./auth-dialog.component.css'],
})
export class AuthDialogComponent implements OnInit {
  @Output() authDialog = new EventEmitter<any>()
  faUser = faUser
  faUSerShield = faUserShield
  constructor() {}

  ngOnInit(): void {}
  login(role: string) {
    this.authDialog.emit(role)
  }
}
