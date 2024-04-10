import { HttpInterceptorFn } from '@angular/common/http';
import { UsuarioService } from './usuario.service';
import { inject } from '@angular/core';

export const interceptor: HttpInterceptorFn = (req, next) => {
  const usuarioService = inject(UsuarioService);
  // Clone the request and add the authorization header

  let authReq = req;

  if(usuarioService.estaLogueado()){
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${usuarioService.getToken()}`
      }
    });
  }

  // Pass the cloned request with the updated header to the next handler
  return next(authReq);
};
