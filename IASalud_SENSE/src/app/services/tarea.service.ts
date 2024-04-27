import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import { Registro } from '../models/registro';
import { BoxService } from './box.service';
import { Observable, Subject } from 'rxjs';
import { Tarea } from '../models/tarea';

@Injectable({
  providedIn: 'root'
})
export class TareaService {

  // Define un Subject para emitir eventos de actualización
  private actualizarTareasSubject = new Subject();
  actualizacionTareas$ = this.actualizarTareasSubject.asObservable();

  constructor(private httpClient: HttpClient) { }

  public addTareaSinAudioToBox(idBox: number, tarea: Tarea) {
    this.httpClient.post(environment.apiUrl + "tareas/", tarea).subscribe((respuesta: any) => {
      var idTarea = respuesta.id;
      this.httpClient.post(environment.apiUrl + "boxes/" + idBox + "/add_tarea/", {"id_tarea": idTarea}).subscribe((data: any) => {
        console.log("Tarea añadida al box");
        //evento de actualización
        this.actualizarTareas();
      });
    });
  }
  public actualizarTareas() {
    this.actualizarTareasSubject.next(0);
  }
}
