import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthService } from '../_services/auth.service';
import { User } from '../_models/user';
import { API, API_DOMAIN } from 'src/app/_configs/api';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private authService: AuthService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        if (request.url.indexOf(API_DOMAIN) === -1){
            return next.handle(request);
        }

        // add authorization header with jwt token if available
        // tslint:disable-next-line:prefer-const
        let authUser = this.authService.authUserValue;
        if (authUser && authUser.Token) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${authUser.Token}`
                }
            });
        }

        return next.handle(request);
    }
}
