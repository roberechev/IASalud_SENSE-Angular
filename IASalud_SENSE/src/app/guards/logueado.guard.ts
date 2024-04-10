import { CanActivateFn, Router } from '@angular/router';
import { UsuarioService } from '../services/usuario.service';
import { inject } from '@angular/core';

export const logueadoGuard: CanActivateFn = (route, state) => {
  const usuarioService = inject(UsuarioService);
  const router = inject(Router);

  if (usuarioService.estaLogueado()) {
    return true;
  }else{
    alert('Debes estar logueado para acceder a esta página');
    usuarioService.navegacionNavBar('login');
    router.navigate(['login']);
    return false;
  }
};
