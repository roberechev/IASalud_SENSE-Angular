import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Box } from '../models/box';
import {environment} from "../../environments/environment";
import { Paciente } from '../models/paciente';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PacienteService {

  private seleccionPacienteAjustes = new Subject<String>();
  seleccionadoPacienteAjustes$ = this.seleccionPacienteAjustes.asObservable();

  constructor(private httpClient: HttpClient) { }

  public pacienteSeleccionadoAjustes(pacienteNombre: String) {
    this.seleccionPacienteAjustes.next(pacienteNombre);
  }

  public getPacientes() {
    return this.httpClient.get<Paciente[]>(environment.apiUrl + "pacientes/" );
  }

  public cambiarPacienteBox(idBox: number, id_paciente: number) {
    return this.httpClient.post<any>(environment.apiUrl + "boxes/" + idBox + "/add_paciente/", {"id_paciente": id_paciente});
  }

  public addPacienteToHospital(id_paciente: number) {
    return this.httpClient.post<Paciente>(environment.apiUrl + "hospitales/14/add_paciente/", {"id_paciente": id_paciente});
  }

  public addPaciente(paciente: Paciente) {
    return this.httpClient.post<Paciente>(environment.apiUrl + "pacientes/", paciente);
  }

  public updatePaciente(id_paciente: number, paciente: Paciente) {
    return this.httpClient.put<Paciente>(environment.apiUrl + "pacientes/" + id_paciente + "/", paciente);
  }

  public deletePaciente(id_paciente: number) {
    return this.httpClient.post<any>(environment.apiUrl + "pacientes/" + id_paciente + "/delete_paciente/", {});
  }
}
