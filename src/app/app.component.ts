import { Component } from '@angular/core';

import { AuthService } from './auth/_services/auth.service';
import { User } from './auth/_models/user';
import { Router } from '@angular/router';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { enGbLocale } from 'ngx-bootstrap/locale';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  currentUser: User;
  title = 'clientApp';

  constructor(
    private router: Router,
    private authenticationService: AuthService
  ) {
      this.authenticationService.authUser.subscribe(x => this.currentUser = x);
      defineLocale('engb', enGbLocale);
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['auth/login']);
  }

  ToggleNavBar() {
    let element: HTMLElement = document.getElementsByClassName( 'navbar-toggler' )[ 0 ] as HTMLElement;
    if ( element.getAttribute( 'aria-expanded' ) === 'true' ) {
        element.click();
    }
}
}
