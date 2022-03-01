import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { AuthenticationService } from "../services/auth/authentication.service";
import { NotificationService } from "../services/notification.service";
import * as moment from 'moment';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private router: Router,
        private notificationService: NotificationService,
        private authService: AuthenticationService) { }

    canActivate() {
        const user = this.authService.getUserData();

        if (user) { // && user.expiration

            //if (moment() > moment(user.expiration)) {
                return true;
            //} else {
            //    this.notificationService.error('Your session has expired');
            //    this.router.navigate(['full/login']);
            //    return false;
            //}
        }

        this.router.navigate(['auth/login']);
        return false;
    }
}