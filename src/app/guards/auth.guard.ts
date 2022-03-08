import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { AuthenticationService } from "../services/auth/authentication.service";
import { NotificationService } from "../services/notification.service";


@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private router: Router,
        private notificationService: NotificationService,
        private authService: AuthenticationService) { }

    canActivate() {
        const user = this.authService.getUserData();

        if (user && this.authService.isAuthorized()) {
            return true;
        }

        this.router.navigate(['auth/login']);
        return false;
    }
}