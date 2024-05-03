import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Box } from '../models/box';
import {environment} from "../../environments/environment";
import { Paciente } from '../models/paciente';
import { UsuarioService } from './usuario.service';
import { HospitalService } from './hospital.service';
import { Sensor } from '../models/sensor';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BoxService {

  boxesServicio: Box[] = [];

  private actualizarCambiosComboBox = new Subject();
  cambiosEnCombobox$ = this.actualizarCambiosComboBox.asObservable();

  private seleccionBoxAjustes = new Subject<String>();
  seleccionadoBoxAjustes$ = this.seleccionBoxAjustes.asObservable();

  constructor(private httpClient: HttpClient, private hospitalService: HospitalService) { }

  public getBoxes() {
    return this.httpClient.get<Box[]>(environment.apiUrl + "boxes/" );
  }

  public addBoxToHospital(id_box: number) {
    return this.httpClient.post(environment.apiUrl + "hospitales/14/add_box/", {"id_box": id_box});
  }

  public boxSeleccionadoAjustes(boxNombre: String) {
    this.seleccionBoxAjustes.next(boxNombre);
  }

  public addBox(nombre_box: string) {
    return this.httpClient.post(environment.apiUrl + "boxes/", {"nombre": nombre_box});
  }

  public updateBox(id_box: number, nombre_box: string) {
    return this.httpClient.put<Box>(environment.apiUrl + "boxes/" + id_box + "/", {"nombre": nombre_box});
  }

  public deleteBox(id_box: number) {
    return this.httpClient.post<any>(environment.apiUrl + "boxes/" + id_box + "/delete_box/", {});
  }

  public eliminarTareaSeleccionada(idTarea: number) {
    return this.httpClient.delete(environment.apiUrl + 'tareas/' + idTarea + '/');
  }

  public obtenerUnBox(id_box: number) {
    return this.httpClient.get<Box>(environment.apiUrl + 'boxes/' + id_box + '/');
  }

  public aniadirSensorAlBox(idBox: number, id_sensor: number) {
    return this.httpClient.post(environment.apiUrl + 'boxes/' + idBox + '/add_sensor/', {"id_sensor":id_sensor});
  }

  public eliminarSensorDelBox(idBox: number, id_sensor: number) {
    return this.httpClient.post(environment.apiUrl + 'boxes/' + idBox + '/eliminar_sensor/', {"id_sensor":id_sensor});
  }

  public refreshCambiosComboBox() {
    this.actualizarCambiosComboBox.next(0);
  }

  public obtenerDispositivosThingsboard(sensor: Sensor) {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.hospitalService.getTokenThingsboard()
    });
    //let fechaStartMilisegundos: number = Date.now() - 60 * 60 * 1000; // ultima hora

    //REMPLAZRA POR LA LINEA DE ARRIBA CUANDO EMPIECE A FUNCIONONAR LOS SENSORES
    let fechaActual = new Date();
    fechaActual.setMonth(fechaActual.getMonth() - 1);
    let fechaStartMilisegundos = fechaActual.getTime();

    let fechaEndMilisegundos: number = Date.now() + 24 * 60 * 60 * 1000;
    let idDispositivoThingsboard: string = sensor.id_dispositivo_th;
    let keys: string = "keys=temperature,humidity,glucose,timestamp,r,g,b,c,temp,lux,reset,drops,diuresis";
    // const url = "http://localhost:8080/api/plugins/telemetry/DEVICE/" + idDispositivoThingsboard + 
    // "/values/timeseries?" + keys + "&startTs=" + fechaStartMilisegundos + "&endTs=" + fechaEndMilisegundos;
    const url = environment.apiUrlTH + "plugins/telemetry/DEVICE/" + idDispositivoThingsboard + 
    "/values/timeseries?" + keys + "&startTs=" + fechaStartMilisegundos + "&endTs=" + fechaEndMilisegundos;
    return this.httpClient.get(url, { headers: headers });
  }

  public transcripcionAudio(idTarea: number) {
    return this.httpClient.get(environment.apiUrl + "tareas/" + idTarea + "/transcripcion_audio/");
  }
  
}