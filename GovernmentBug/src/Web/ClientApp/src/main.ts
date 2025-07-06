import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { routes } from './app/app.routes';

export function getBaseUrl() {
  return document.getElementsByTagName('base')[0].href;
}

const providers = [
  { provide: 'BASE_URL', useFactory: getBaseUrl, deps: [] },
  provideHttpClient(withInterceptorsFromDi()),
  importProvidersFrom(RouterModule.forRoot(routes))
];

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: providers
}).catch(err => console.error(err));
