import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Sensor } from '../models/sensor';
import {environment} from "../../environments/environment";
import { Registro } from '../models/registro';
import { BoxService } from './box.service';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SensorService {

  // Define un Subject para emitir eventos de actualización
  private actualizarSensorSubject = new Subject<Date>();
  actualizacion$ = this.actualizarSensorSubject.asObservable();

  constructor(private httpClient: HttpClient, private boxService: BoxService) { }

  public getSensores() {
    return this.httpClient.get<Sensor[]>(environment.apiUrl + "sensores/" );
  }

  public addRegistroToSensor(idSensor: number, registro: Registro) {
    this.httpClient.post(environment.apiUrl + "registros/", registro).subscribe((respuesta: any) => {
      var idRegistro = respuesta.id;
      //alert("Registro añadido con id: " + idRegistro);
      this.httpClient.post(environment.apiUrl + "sensores/" + idSensor + "/add_registro/", {"id_registro": idRegistro}).subscribe((data: any) => {
        console.log("Registro añadido al sensor");
        //evento de actualización
        this.actualizarSensorSubject.next(new Date());
      });
    });
  }

  // Cargar nuevo registro del shocket
  public cargarNuevoDato(message: string) {
    var registro = new Registro("", "", new Date());
    var jsonObject  = JSON.parse(message);

    var idSensor = jsonObject.subscriptionId;

    if (jsonObject.data) {
      // Verificar si existe la propiedad temperature
      if (jsonObject.data.temperature) {
        registro.valor = jsonObject.data.temperature[0][1];
        registro.unidades = "ºC";
        // eeeeeeeeeeeeeeeeeveeeeeeeeeeeeeennntoooooooooo
        // this.addRegistroToSensor(idSensor, registro);
      }
      // Verificar si existe la propiedad humidity
      if (jsonObject.data.humidity) {
          registro.valor = jsonObject.data.humidity[0][1];
          registro.unidades = "%";
          // eeeeeeeeeeeeeeeeeveeeeeeeeeeeeeennntoooooooooo
          // this.addRegistroToSensor(idSensor, registro);
      }
    }
    console.log("---Datos:" + registro.valor + " " + registro.unidades);
    // Eliminar cuando este funcionando eeeeeeeeeeeeeeeeeveeeeeeeeeeeeeennntoooooooooo
    this.actualizarSensorSubject.next(new Date());

    // Object.entries(this.dispositivosThingsboardCargados).forEach(([key, value], index) => {
    //   if(posicionDispositivo==index){
    //     console.log(`Posición: ${index}, Clave: ${key}, Valor: ${value}`);
    //   }
    // });
  }
}
