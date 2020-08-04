import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, tap, catchError, retry } from 'rxjs/operators';
import { API } from '../_config/api';

import { User } from '../_models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authUserSubject: BehaviorSubject<User>;
  public authUser: Observable<User>;

  constructor(private http: HttpClient) {
      this.authUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('authUser')));
      this.authUser = this.authUserSubject.asObservable();
  }

  public get authUserValue(): User {
    return this.authUserSubject.value;
  }

  login(username: string, password: string) {
    return this.http.post<User>(`${API.AUTH.LOGIN}`, {id: username, password})
        .pipe(map(user => {
            // login successful if there's a jwt token in the response
            if (user && user.Token) {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('authUser', JSON.stringify(user));
                this.authUserSubject.next(user);
            }

            return user;
        }));
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('authUser');
    this.authUserSubject.next(null);
  }

}
