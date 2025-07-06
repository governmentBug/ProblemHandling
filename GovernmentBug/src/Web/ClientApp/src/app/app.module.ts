import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AuthorizeInterceptor } from 'src/api-authorization/authorize.interceptor';
import { routes } from './app.routes';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        RouterModule.forRoot(routes),
        BrowserAnimationsModule,
        ModalModule.forRoot()
    ],
    providers: [
        { provide: APP_ID, useValue: 'ng-cli-universal' },
        { provide: HTTP_INTERCEPTORS, useClass: AuthorizeInterceptor, multi: true },
        provideHttpClient(withInterceptorsFromDi())
    ]
})
export class AppModule { }
