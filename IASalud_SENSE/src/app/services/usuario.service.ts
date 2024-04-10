import { Injectable } from '@angular/core';
import { Usuario } from '../models/usuario';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { jwtDecode } from "jwt-decode";
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  rutaParaNavBar: string = "";

  constructor(private httpClient: HttpClient, private router: Router) { }

  public login(usuario: Usuario) {
    // alert(environment.apiUrl + "login")
    return this.httpClient.post<any>(environment.apiUrl + "login", {usuario});
  }

  public guardarToken(token: string) {
    localStorage.setItem('token', token)
  }
  public guardarRefreshToken(refresh_token: string) {
    localStorage.setItem('refresh_token', refresh_token)
  }
  
  public eliminarToken() {
    if (this.getToken() != null) {
      localStorage.removeItem('token');
    }
  }

  //si falla el token es cuando intenta obtenerlo aqui
  public getToken() {
    return localStorage.getItem('token');
  }


  public estaLogueado(){
    if (this.getToken() != null) {
      return this.comprobarToken();
    } else {
      return false;
    }
  }

  public comprobarToken() {
    const token = this.getToken();
    const decodedToken = jwtDecode(token!) as any;
    const expirationTime = decodedToken.exp * 1000; // Multiplica por 1000 para convertirlo a milisegundos
    const currentTime = Date.now();
    const timeRemaining = expirationTime - currentTime;
    if (timeRemaining > 0) {
      return true;
    } else {
      alert('Debe iniciar sesión');
      this.eliminarToken();
      this.router.navigate(['login']);
      setTimeout(() => {
        this.navegacionNavBar('login');
      }, 1000);
      return false;
    }
  }

  public obtenerUsuarioDelToken() {
    let usuario = new Usuario('','','', false);
    if (this.getToken() != null) {
      // Decodifica el token para obtener su contenido
      const decodedToken: any = jwtDecode(this.getToken()!);
      // Extrae el usuario del token decodificado
      usuario = decodedToken.usuario;
    }
    return usuario;
  }


/*
-------------------------------------
 NAVEGACION
-------------------------------------
*/
  public navegacionNavBar(ruta: string) {
    this.rutaParaNavBar = ruta;
    
    switch(ruta) {
      case 'home':
        console.log('Movilidad a home');
        (<HTMLInputElement>document.getElementById('home')).click();
        break;
      case 'login':
        console.log('Movilidad a login');
        (<HTMLInputElement>document.getElementById('login')).click();
        break;
      case 'perfil':
        console.log('Movilidad a perfil');
        (<HTMLInputElement>document.getElementById('perfil')).click();
        break;
      case 'almacen':
        console.log('Movilidad a almacen');
        (<HTMLInputElement>document.getElementById('almacen')).click();
        break;
    }
    
    this.getRutaNavBar();
  }
  public getRutaNavBar() {
    return this.rutaParaNavBar;
  }
/*
-------------------------------------
 FIN NAVEGACION
-------------------------------------
*/
}
