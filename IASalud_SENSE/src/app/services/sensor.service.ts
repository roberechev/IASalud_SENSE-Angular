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

  private seleccionSensorAjustes = new Subject<String>();
  seleccionadoSensorAjustes$ = this.seleccionSensorAjustes.asObservable();

  constructor(private httpClient: HttpClient, private boxService: BoxService) { }

  public getSensores() {
    return this.httpClient.get<Sensor[]>(environment.apiUrl + "sensores/" );
  }

  public sensorSeleccionadoAjustes(sensorNombre: String) {
    this.seleccionSensorAjustes.next(sensorNombre);
  }

  public addSensor(sensor: Sensor) {
    return this.httpClient.post<any>(environment.apiUrl + "sensores/", {"id_dispositivo_th": sensor.id_dispositivo_th, "nombre": sensor.nombre});
  }

  public updateSensor(id_sensor: number, sensor: Sensor) {
    return this.httpClient.put<any>(environment.apiUrl + "sensores/" + id_sensor + "/", {"id_dispositivo_th": sensor.id_dispositivo_th, "nombre": sensor.nombre});
  }

  public deleteSensor(id_sensor: number) {
    return this.httpClient.post<any>(environment.apiUrl + "sensores/" + id_sensor + "/delete_sensor/", {});
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
    var registro = new Registro("", "", "", new Date());
    var jsonObject  = JSON.parse(message);

    var idSensor = jsonObject.subscriptionId;

    if (jsonObject.data) {
      // Verificar si existe la propiedad temperature
      if (jsonObject.data.temperature) {
        registro.valor = jsonObject.data.temperature[0][1];
        registro.unidades = "ºC";
        //console.log("Temperatura: " + jsonObject.data.temperature[0][1]);
        // eeeeeeeeeeeeeeeeeveeeeeeeeeeeeeennntoooooooooo
        // this.addRegistroToSensor(idSensor, registro);
      }
      // Verificar si existe la propiedad humidity
      if (jsonObject.data.humidity) {
          registro.valor = jsonObject.data.humidity[0][1];
          registro.unidades = "%";
          //console.log("Humedad: " + jsonObject.data.humidity[0][1]);
          // eeeeeeeeeeeeeeeeeveeeeeeeeeeeeeennntoooooooooo
          // this.addRegistroToSensor(idSensor, registro);
      }
      if (jsonObject.data.r || jsonObject.data.g || jsonObject.data.b || jsonObject.data.c || jsonObject.data.temp || jsonObject.data.lux) {
        let valorColorimetro = "";
        registro.valor 
        valorColorimetro = jsonObject.data.r[0][1] + "|" + jsonObject.data.g[0][1] + "|" + jsonObject.data.b[0][1]
          + "|" + jsonObject.data.c[0][1] + "|" + jsonObject.data.temp[0][1] + "|" + jsonObject.data.lux[0][1];
        registro.valor = valorColorimetro;
        registro.unidades = "color";
        console.log("Colorimetro: " + valorColorimetro);
        // eeeeeeeeeeeeeeeeeveeeeeeeeeeeeeennntoooooooooo
        // this.addRegistroToSensor(idSensor, registro);
      }
      if (jsonObject.data.glucose) {
        let valorGlucosa = "";
        valorGlucosa = jsonObject.data.glucose[0][1] + "|" + jsonObject.data.timestamp;
        registro.valor = valorGlucosa;
        registro.unidades = "glucosa";
        console.log("Glucosa: " + valorGlucosa);
        // eeeeeeeeeeeeeeeeeveeeeeeeeeeeeeennntoooooooooo
        // this.addRegistroToSensor(idSensor, registro);
      }
      if (jsonObject.data.reset || jsonObject.data.drops || jsonObject.data.diuresis) {
        let valorDiuresis = "";
        valorDiuresis = jsonObject.data.reset[0][1] + "|" + jsonObject.data.drops[0][1] + "|" + jsonObject.data.diuresis[0][1];
        registro.valor = valorDiuresis;
        registro.unidades = "diuresis";
        console.log("Diuresis: " + valorDiuresis);
        // eeeeeeeeeeeeeeeeeveeeeeeeeeeeeeennntoooooooooo
        // this.addRegistroToSensor(idSensor, registro);
      }
    }
    // console.log("---Datos:" + registro.valor + " " + registro.unidades);
    // Eliminar cuando este funcionando eeeeeeeeeeeeeeeeeveeeeeeeeeeeeeennntoooooooooo ACTUALIZACION AUTOMATICA SI NO INSERTO EN BBDD
    this.actualizarSensorSubject.next(new Date());

    // Object.entries(this.dispositivosThingsboardCargados).forEach(([key, value], index) => {
    //   if(posicionDispositivo==index){
    //     console.log(`Posición: ${index}, Clave: ${key}, Valor: ${value}`);
    //   }
    // });
  }
}
