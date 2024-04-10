import { Component } from '@angular/core';
import { Hospital } from '../../models/hospital';
import { HospitalService } from '../../services/hospital.service';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';



@Component({
  selector: 'app-almacen',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './almacen.component.html',
  styleUrl: './almacen.component.scss'
})
export class AlmacenComponent {
  title = 'IASalud_SENSE';
  hospitales: Hospital[] = [];

  constructor(private hospitalService: HospitalService) { }

 

  public obtenerHospitales() {
    this.hospitalService.getHospitales().subscribe((data: Hospital[]) => {
      this.hospitales = data;
    });
  }
  
  public aniadirHospital() {
    let hospital: Hospital = {
      nombre: "Hospital de prueba",
      direccion: "Calle de prueba",
      numBoxes: 9
    };
    this.hospitalService.addHospital(hospital).subscribe((data: any) => {
      this.hospitales = data;
    });
  }

  public editarHospital() {
    let hosp: Hospital;

    hosp = this.hospitales.find(h => h.id === 8)!;
    hosp.direccion = "modificado";

    this.hospitalService.editarHospital(hosp).subscribe((data: any) => {
      alert("Hospital modificado " + data);
    });
  }

  public eliminarHospital() {
    this.hospitalService.deleteHospital(7).subscribe((data: any) => {
      alert("Hospital eliminado " + data);
    });
  } 

  public pruebaThingsboard() {
    this.hospitalService.getDispositivosThingsboard().subscribe((data: any) => {
      console.info("getThingsboard: " + data.message);
      console.info("getThingsboard2: " + data.misId);
    });
  }
}
