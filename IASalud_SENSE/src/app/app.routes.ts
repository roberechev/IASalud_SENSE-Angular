import { Routes } from '@angular/router';
import { HomeComponent } from './views/home/home.component';
import { LoginComponent } from './views/login/login.component';
import { AlmacenComponent } from './views/almacen/almacen.component';
import { BoxComponent } from './views/box/box.component';
import { PerfilComponent } from './views/perfil/perfil.component';
import { logueadoGuard } from './guards/logueado.guard';
import { adminGuard } from './guards/admin.guard';
import { AjustesComponent } from './views/ajustes/ajustes.component';
import { SpinnerComponent } from './views/spinner/spinner.component';
import { ComboboxPacientesComponent } from './views/combobox-pacientes/combobox-pacientes.component';


export const routes: Routes = [
    {path: 'home', component:HomeComponent, canActivate: [logueadoGuard]},
    {path: 'login', component:LoginComponent},
    {path: 'box/:id', component:BoxComponent},
    {path: 'perfil', component:PerfilComponent, canActivate: [logueadoGuard]},
    {path: 'ajustes', component:AjustesComponent, canActivate: [adminGuard]},
    {path: 'almacen', component:AlmacenComponent, canActivate: [adminGuard]},
    //{path: 'spinner', component:SpinnerComponent},
    //{path: 'combo', component:ComboboxPacientesComponent},
    {path: '**', redirectTo: 'home'}

];
