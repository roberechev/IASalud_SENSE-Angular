import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { Usuario } from '../../models/usuario';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  isAdminLogin: boolean = false;
  username: string = "";
  password: string = "";

  constructor(private usuarioService: UsuarioService, private router: Router) { }

  public btnCambioUser(){
    this.isAdminLogin = !this.isAdminLogin;
  }

  public obtenerDatosLogin() {

    this.username = this.isAdminLogin ? "admin" : "userIasalud";
    this.password = (<HTMLInputElement>document.getElementById('password_user')).value;
    if (this.password == "") {
      alert("Rellene todos los campos");
    } else {
      this.comprobarUsuario(this.username, this.password);
    }
    //ponemos el campo de la contraseña en blanco
    (<HTMLInputElement>document.getElementById('password_user')).value = "";
  }

  private comprobarUsuario(username: string, password: string) {

    let usuario: Usuario = new Usuario(username, "", password, false);
    // alert(usuario.username + " " + usuario.password);
    this.usuarioService.login(usuario).subscribe((data: any) => {

      if (data == "Invalid Password") {
        alert('Invalid Password');
      } else if (data == 'incorrecto') {
        alert('Error al iniciar sesión');
      } else {
        console.log(data.token);
        console.log(data.user);
        this.usuarioService.guardarRefreshToken(data.refresh);
        this.usuarioService.guardarToken(data.access_token);
        //alert('Se ha iniciado sesión correctamente.')
        this.usuarioService.estaLogueado();
        this.usuarioService.navegacionNavBar('home');
        this.router.navigate(['home']);
        // setTimeout(() => {
        //   this.refrescarToken();
        // }, 3000000);
        // this.route.navigate(['perfil']);
      }
    });
  }
}
