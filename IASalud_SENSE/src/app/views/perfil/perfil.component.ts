import { Component } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { Router, RouterLink, RouterOutlet} from '@angular/router';
import { CommonModule } from '@angular/common';
import { Usuario } from '../../models/usuario';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.scss'
})
export class PerfilComponent {

constructor(private usuarioService: UsuarioService, private router: Router) {}

ngOnInit() {
  
}

public cerrarSesion() {
  this.usuarioService.eliminarToken();
  alert('Se ha cerrado sesión correctamente.');
  this.router.navigate(['login']);
  setTimeout(() => {
    this.usuarioService.navegacionNavBar('login');
  }, 1000); 
}

public esUsuarioLogueadoAdmin() {
  return this.usuarioService.obtenerUsuarioDelToken().is_superuser;
}

}
