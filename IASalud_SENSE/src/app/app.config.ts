import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { interceptor } from './services/interceptor.interceptor';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideToastr } from 'ngx-toastr';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient( withInterceptors ([interceptor])), provideAnimationsAsync(),
    provideToastr({timeOut: 10000, positionClass: 'toast-top-left', preventDuplicates: false, closeButton: true, progressBar: true, progressAnimation: 'increasing'}),
],
};