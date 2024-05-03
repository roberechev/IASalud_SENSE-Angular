import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Hospital } from '../models/hospital';
import {environment} from "../../environments/environment";


@Injectable({
  providedIn: 'root'
})
export class HospitalService {

  dispositivosThingsboardCargados: Record<string, string> = {};

  constructor(private httpClient: HttpClient) { }


  public getHospitales() {
    return this.httpClient.get<Hospital[]>(environment.apiUrl + "hospitales/");
  }

  public addHospital(hospital: Hospital) {
    return this.httpClient.post(environment.apiUrl + "hospitales/", hospital);
  }

  public editarHospital(hospital: Hospital) {
    return this.httpClient.put(environment.apiUrl + "hospitales/" + hospital.id + "/", hospital);
  }

  public deleteHospital(idHospital: number) {
    return this.httpClient.delete(environment.apiUrl + "hospitales/" + idHospital + "/");
  }


  public getTokenThingsboardAPI() {
    // const url = "http://localhost:8080/api/auth/login";
    const url = environment.apiUrlTH + "auth/login";
    return this.httpClient.post(url, {"username": "tenant@thingsboard.org","password": "tenant"});
  }

  public getTokenThingsboard() {
    return localStorage.getItem('tokenThingsboard');
  }

  public guardarTokenThingsboard(tokenThingsboard: string) {
    localStorage.setItem('tokenThingsboard', tokenThingsboard)
    // console.info('Guardando Token Thingsboard:', tokenThingsboard);
    setInterval(() => {
      this.getTokenThingsboardAPI().subscribe((data: any) => {
        this.guardarTokenThingsboard(data.token)
        console.info('Refrescando Token con nueva peticion:', data.token);
      })
    }, 40 * 60 * 1000); // 40 minutos en milisegundos
  }

  public getDispositivosThingsboard() {
    return this.httpClient.get<any>(environment.apiUrl + "hospitales/obtenerDispositivos");
  }

 
}
