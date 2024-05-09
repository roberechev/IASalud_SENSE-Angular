import { HttpClient, HttpHeaders } from '@angular/common/http';
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

  public guardarTareaConAudioToBox(audioBlob: Blob, idBox: number, nombreTarea: string, prioridad: number) {
    let formData = new FormData();
    formData.append("audio", audioBlob, "audio.mp3");
    formData.append("prioridad", prioridad.toString());
    formData.append("nombreTarea", nombreTarea + "|");
  
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
  
    this.httpClient.post(environment.apiUrl + 'boxes/' + idBox + '/upload-audio/', formData, { headers: headers }).subscribe((data: any) => {
      console.log("Audio subido");
      this.actualizarTareas();
    });
  }

  public modificarTarea(tarea: Tarea) {
    return this.httpClient.put(environment.apiUrl + "tareas/" + tarea.id + "/", {"nombre": tarea.nombre, "prioridad": tarea.prioridad});
  }
}
