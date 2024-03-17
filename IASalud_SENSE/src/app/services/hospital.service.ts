import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Hospital } from '../models/hospital';
import {environment} from "../../environments/environment";


@Injectable({
  providedIn: 'root'
})
export class HospitalService {

  constructor(private httpClient: HttpClient) { }


  public getHospitales() {
    return this.httpClient.get<Hospital[]>(environment.apiUrl + "hospitales/" );
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

}
