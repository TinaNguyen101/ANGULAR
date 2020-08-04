import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { NotificationComponent } from './_shared/notification/notification.component';
import { ErrorInterceptor } from './auth/_helpers/error.interceptor';
import { JwtInterceptor } from './auth/_helpers/jwt.interceptor';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher,MatDialogModule } from '@angular/material';
import { UpdateTimeZoneInterceptor } from './_shared/updatetimezone.interceptor';
import { MyAlertDialogComponent } from './_shared/control/my-alert-dialog/my-alert-dialog.component';
import { MasterComponent } from './master/master.component';



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NotificationComponent,
   // MasterComponent,
    
  //  MyAlertDialogComponent,
    
    
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    MatDialogModule,
  ],
  providers: [
        { provide: HTTP_INTERCEPTORS, useClass: UpdateTimeZoneInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
        {provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher}
  ],
  bootstrap: [AppComponent],
 //entryComponents: [  MyAlertDialogComponent]
})
export class AppModule { }
