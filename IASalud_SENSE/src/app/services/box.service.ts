import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Box } from '../models/box';
import {environment} from "../../environments/environment";
import { Paciente } from '../models/paciente';

@Injectable({
  providedIn: 'root'
})
export class BoxService {

  boxesServicio: Box[] = [];

  constructor(private httpClient: HttpClient) { }

  public getBoxes() {
    return this.httpClient.get<Box[]>(environment.apiUrl + "boxes/" );
  }

  public guardarAudio(audioBlob: Blob) {
    let formData = new FormData();
    formData.append("audio", audioBlob, "audio.mp3");
    formData.append("prioridad", "3");
  
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
  
    return this.httpClient.post(environment.apiUrl + 'boxes/1/upload-audio/', formData, { headers: headers });

  }

  public eliminarTareaSeleccionada(idTarea: number) {
    return this.httpClient.delete(environment.apiUrl + 'tareas/' + idTarea + '/');
  }

  public obtenerUnBox(id_box: number) {
    return this.httpClient.get<Box>(environment.apiUrl + 'boxes/' + id_box + '/');
  }
  
}
