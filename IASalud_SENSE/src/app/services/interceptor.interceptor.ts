import { HttpInterceptorFn } from '@angular/common/http';
import { UsuarioService } from './usuario.service';
import { inject } from '@angular/core';

export const interceptor: HttpInterceptorFn = (req, next) => {
  const usuarioService = inject(UsuarioService);
  // Clone the request and add the authorization header
  const urlExcepcion = 'http://localhost:8080/api/plugins/telemetry/DEVICE/';

  let authReq = req;

  if(usuarioService.estaLogueado() && !authReq.url.startsWith(urlExcepcion)){
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${usuarioService.getToken()}`
      }
    });
  }

  // Pass the cloned request with the updated header to the next handler
  return next(authReq);
};
