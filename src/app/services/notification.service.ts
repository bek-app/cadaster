import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(public snackBar: MatSnackBar) {}

  config: MatSnackBarConfig = {
    duration:1000,
    horizontalPosition: 'right',
    verticalPosition: 'top',
  };

  success(msg: string, action: string) {
    this.config['panelClass'] = ['success', 'notification'];
    this.snackBar.open(msg, action, this.config);
  }

  error(msg: string, action: string) {
    this.config['panelClass'] = ['error', 'notification'];
    this.snackBar.open(msg, action, this.config);
  }
}
