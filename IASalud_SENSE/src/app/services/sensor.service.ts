import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Sensor } from '../models/sensor';
import {environment} from "../../environments/environment";
import { Registro } from '../models/registro';
import { BoxService } from './box.service';
import { Observable, Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Box } from '../models/box';

@Injectable({
  providedIn: 'root'
})
export class SensorService {

  // Define un Subject para emitir eventos de actualización
  private actualizarSensorSubject = new Subject<Date>();
  actualizacion$ = this.actualizarSensorSubject.asObservable();

  private seleccionSensorAjustes = new Subject<String>();
  seleccionadoSensorAjustes$ = this.seleccionSensorAjustes.asObservable();

  constructor(private httpClient: HttpClient, private boxService: BoxService, private toastSvc: ToastrService) { }

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
        //this.actualizarSensorSubject.next(new Date());
      });
    });
  }

  // Cargar nuevo registro del shocket
  public cargarNuevoDato(message: string, messageCount: number, box: Box) {
    var registro = new Registro("", "", "", new Date());
    var jsonObject  = JSON.parse(message);

    var idSensor = jsonObject.subscriptionId;

    if (jsonObject.data) {
      let bandera = false;
      // Verificar si existe la propiedad temperature
      if (jsonObject.data.temperature) {
        registro.valor = jsonObject.data.temperature[0][1];
        registro.unidades = "ºC";
        let nombreGuardar = "grados|" + idSensor;
        localStorage.setItem(nombreGuardar, JSON.stringify({
            'grados': registro.valor
        }));
        if (parseFloat(registro.valor) > 32 && messageCount > 0){
          this.toastSvc.warning('Temperatura alta: ' + registro.valor + " ºC", 'Alerta box: ' + box.nombre);
        } else if (parseFloat(registro.valor) < 20 && messageCount > 0){
          this.toastSvc.warning('Temperatura baja: ' + registro.valor + " ºC", 'Alerta box: ' + box.nombre);
        }
        //console.log("Temperatura: " + jsonObject.data.temperature[0][1]);
        bandera = true;
        // eeeeeeeeeeeeeeeeeveeeeeeeeeeeeeennntoooooooooo
        //this.addRegistroToSensor(idSensor, registro);
      }
      // Verificar si existe la propiedad humidity
      if (jsonObject.data.humidity) {
        registro.valor = jsonObject.data.humidity[0][1];
        registro.unidades = "%";
        let nombreGuardar = registro.unidades + "|" + idSensor;
        localStorage.setItem(nombreGuardar, JSON.stringify({
          '%': registro.valor
      }));
      if (parseFloat(registro.valor) > 86 && messageCount > 0){
        this.toastSvc.warning('Humedad alta: ' + registro.valor + " %", 'Alerta box: ' + box.nombre);
      } else if (parseFloat(registro.valor) < 60 && messageCount > 0){
        this.toastSvc.warning('Humedad baja: ' + registro.valor + " %", 'Alerta box: ' + box.nombre);
      }
        //console.log("Humedad: " + jsonObject.data.humidity[0][1]);
        bandera = true;
        // eeeeeeeeeeeeeeeeeveeeeeeeeeeeeeennntoooooooooo
        //this.addRegistroToSensor(idSensor, registro);
      }
      if (jsonObject.data.r || jsonObject.data.g || jsonObject.data.b || jsonObject.data.c || jsonObject.data.temp || jsonObject.data.lux) {
        let valorColorimetro = "";
        valorColorimetro = jsonObject.data.r[0][1] + "|" + jsonObject.data.g[0][1] + "|" + jsonObject.data.b[0][1]
          + "|" + jsonObject.data.c[0][1] + "|" + jsonObject.data.temp[0][1] + "|" + jsonObject.data.lux[0][1];
        registro.valor = valorColorimetro;
        registro.unidades = "color";
        let nombreGuardar = registro.unidades + "|" + idSensor;
        localStorage.setItem(nombreGuardar, JSON.stringify({
          'color': valorColorimetro
        }));
        // console.log("Colorimetro: " + valorColorimetro);
        bandera = true;
        // eeeeeeeeeeeeeeeeeveeeeeeeeeeeeeennntoooooooooo
        //this.addRegistroToSensor(idSensor, registro);
      }
      if (jsonObject.data.glucose) {
        let valorGlucosa = "";
        valorGlucosa = jsonObject.data.glucose[0][1] + "|" + jsonObject.data.timestamp;
        registro.valor = valorGlucosa;
        registro.unidades = "glucosa";
        let nombreGuardar = registro.unidades + "|" + idSensor;
        localStorage.setItem(nombreGuardar, JSON.stringify({
          'glucosa': registro.valor
        }));
        if (parseFloat(registro.valor) > 150 && messageCount > 0){
          this.toastSvc.warning('Glucosa alta: ' + jsonObject.data.glucose[0][1] + " mg/dl", 'Alerta box: ' + box.nombre);
        } else if (parseFloat(registro.valor) < 50 && messageCount > 0){
          this.toastSvc.warning('Glucosa baja: ' + jsonObject.data.glucose[0][1] + " mg/dl", 'Alerta box: ' + box.nombre);
        }
        // console.log("Glucosa: " + valorGlucosa);
        bandera = true;
        // eeeeeeeeeeeeeeeeeveeeeeeeeeeeeeennntoooooooooo
        //this.addRegistroToSensor(idSensor, registro);
      }
      if (jsonObject.data.reset || jsonObject.data.drops || jsonObject.data.diuresis) {
        let valorDiuresis = "";
        valorDiuresis = jsonObject.data.reset[0][1] + "|" + jsonObject.data.drops[0][1] + "|" + jsonObject.data.diuresis[0][1];
        registro.valor = valorDiuresis;
        registro.unidades = "diuresis";
        let nombreGuardar = registro.unidades + "|" + idSensor;
        localStorage.setItem(nombreGuardar, JSON.stringify({
          'diuresis': registro.valor
        }));
        if (parseFloat(jsonObject.data.drops[0][1]) > 144 && messageCount > 0){
          this.toastSvc.warning('Número de gotas alto en Urinometro: ' + jsonObject.data.drops[0][1] + " gotas", 'Alerta box: ' + box.nombre);
        }
        if (parseFloat(jsonObject.data.diuresis[0][1]) > 2.5 && messageCount > 0){
          this.toastSvc.warning('Diuresis alta en Urinometro: ' + jsonObject.data.diuresis[0][1] + " ml", 'Alerta box: ' + box.nombre);
        }
        // console.log("Diuresis: " + valorDiuresis);
        bandera = true;
        // eeeeeeeeeeeeeeeeeveeeeeeeeeeeeeennntoooooooooo
        //this.addRegistroToSensor(idSensor, registro);
      }
      // comprobacion de 13 para que no añada los que ya estan en la bbdd
      if(bandera && messageCount > 0){
        this.actualizarSensorSubject.next(new Date());
      }
    }
    // console.log("---Datos:" + registro.valor + " " + registro.unidades);
    // Eliminar cuando este funcionando eeeeeeeeeeeeeeeeeveeeeeeeeeeeeeennntoooooooooo ACTUALIZACION AUTOMATICA SI NO INSERTO EN BBDD
    //this.actualizarSensorSubject.next(new Date());

    // Object.entries(this.dispositivosThingsboardCargados).forEach(([key, value], index) => {
    //   if(posicionDispositivo==index){
    //     console.log(`Posición: ${index}, Clave: ${key}, Valor: ${value}`);
    //   }
    // });
  }
}
