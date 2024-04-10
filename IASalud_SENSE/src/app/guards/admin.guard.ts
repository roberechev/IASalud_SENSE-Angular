import { CanActivateFn, Router } from '@angular/router';
import { UsuarioService } from '../services/usuario.service';
import { inject } from '@angular/core';

export const adminGuard: CanActivateFn = (route, state) => {
  const usuarioService = inject(UsuarioService);
  const router = inject(Router);

  if (usuarioService.estaLogueado() && usuarioService.obtenerUsuarioDelToken().is_superuser) {
    return true;
  }else{
    alert('No tienes permisos para acceder a esta página');
    //usuarioService.navegacionNavBar('login');
    router.navigate(['login']);
    return false;
  }
};
