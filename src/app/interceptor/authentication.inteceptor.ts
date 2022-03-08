import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { Observable, tap } from "rxjs";
import { AuthenticationService } from "../services/auth/authentication.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private authService: AuthenticationService,
        private router: Router,
        private dialog: MatDialog) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const user = this.authService.getUserData();

        if (user && user.token) {
            const cloned = req.clone({
                headers: req.headers.set('Authorization', 'Bearer ' + user.token)
            });

            return next.handle(cloned).pipe(tap(() => { }, (err: any) => {
                if (err instanceof HttpErrorResponse) {
                    if (err.status === 401) {
                        this.dialog.closeAll();
                        this.router.navigate(['/auth/login']);
                    } else if (err.status === 403) {
                        
                    }
                }
            }));

        } else {
            return next.handle(req);
        }
    }
}