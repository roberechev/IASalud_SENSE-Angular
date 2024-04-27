import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { ComboboxDispositivosAjustesComponent } from '../combobox-dispositivos-ajustes/combobox-dispositivos-ajustes.component';
import { ComboboxPacientesComponent } from '../combobox-pacientes/combobox-pacientes.component';
import { ComboboxBoxesComponent } from '../combobox-boxes/combobox-boxes.component';
import { SensorService } from '../../services/sensor.service';
import { Sensor } from '../../models/sensor';
import { Registro } from '../../models/registro';
import { PacienteService } from '../../services/paciente.service';
import { Paciente } from '../../models/paciente';
import { BoxService } from '../../services/box.service';
import { Box } from '../../models/box';


@Component({
  selector: 'app-ajustes',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, FormsModule, ComboboxDispositivosAjustesComponent, ComboboxPacientesComponent, 
    ComboboxBoxesComponent],
  templateUrl: './ajustes.component.html',
  styleUrl: './ajustes.component.scss'
})
export class AjustesComponent {

  // Sensores
  addSensorId: string = '';
  addNombreSensor: string = '';
  updateSensorId: string = '';
  updateNombreSensor: string = '';

  // Pacientes
  addPacienteNHC: string = '';
  addNombrePaciente: string = '';
  addEdadPaciente: string = '';
  addGeneroPaciente: string = '';
  updatePacienteNHC: string = '';
  updateNombrePaciente: string = '';
  updateEdadPaciente: string = '';
  updateGeneroPaciente: string = '';

  // Boxes
  addNombreBox: string = '';
  updateNombreBox: string = '';

  sensorSeleccionado: Sensor = new Sensor('','','', [], new Date(), new Date(), false);
  pacienteSeleccionado: Paciente = new Paciente('','','','', new Date() , false);
  boxSeleccionado: Box = new Box('', [], new Paciente('','','','', new Date() , false), [], new Date(), false);
  listaSensores: Sensor[] = [];
  listaPacientes: Paciente[] = [];
  listaBoxes: Box[] = [];
  refrescarDispositivosComponente: boolean = false;
  refrescarPacientesComponente: boolean = false;
  refrescarBoxesComponente: boolean = false;

  constructor(private sensorService: SensorService, private pacienteService: PacienteService, private boxService: BoxService) { }

  ngOnInit() {
    this.cargarSensores();
    this.cargarPacientes();
    this.cargarBoxes();

    this.sensorService.seleccionadoSensorAjustes$.subscribe((data: String) => {
      this.cargarSensorSeleccionado(data);
    });

    this.pacienteService.seleccionadoPacienteAjustes$.subscribe((data: String) => {
      this.cargarPacienteSeleccionado(data);
    });

    this.boxService.seleccionadoBoxAjustes$.subscribe((data: String) => {
      this.cargarBoxSeleccionado(data);
    });
  }

  public cargarSensores() {
    this.sensorService.getSensores().subscribe((data: Sensor[]) => {
      this.listaSensores = data.filter(sensor => sensor != null);
    });
  }

  public cargarPacientes() {
    this.pacienteService.getPacientes().subscribe((data: Paciente[]) => {
      this.listaPacientes = data.filter(paciente => paciente != null);
    });
  }

  public cargarBoxes() {
    this.boxService.getBoxes().subscribe((data: Box[]) => {
      this.listaBoxes = data.filter(box => box != null);
    });
  }

  public refrescarComponenteDispositivos() {
    // Cambias el valor de refrescarComponente a true
    this.refrescarDispositivosComponente = true;
    // Luego de un pequeño tiempo, vuelves a establecerlo a false para evitar que el componente se actualice constantemente
    setTimeout(() => {
      this.refrescarDispositivosComponente = false;
    }, 100);
  }
  public refrescarComponentePacientes() {
    // Cambias el valor de refrescarComponente a true
    this.refrescarPacientesComponente = true;
    // Luego de un pequeño tiempo, vuelves a establecerlo a false para evitar que el componente se actualice constantemente
    setTimeout(() => {
      this.refrescarPacientesComponente = false;
    }, 100);
  }
  public refrescarComponenteBoxes() {
    // Cambias el valor de refrescarComponente a true
    this.refrescarBoxesComponente = true;
    // Luego de un pequeño tiempo, vuelves a establecerlo a false para evitar que el componente se actualice constantemente
    setTimeout(() => {
      this.refrescarBoxesComponente = false;
    }, 100);
  }

  public cargarSensorSeleccionado(sensorNombre: String) {
    this.sensorSeleccionado = this.listaSensores.find(sensor => sensor.nombre == sensorNombre)!;
    if(this.sensorSeleccionado != null && this.sensorSeleccionado != undefined && this.sensorSeleccionado.nombre != ''){
      this.updateSensorId = (this.sensorSeleccionado.id_dispositivo_th!).toString();
      this.updateNombreSensor = this.sensorSeleccionado.nombre;
    } else {
      this.updateSensorId = '';
      this.updateNombreSensor = '';
    }
  }

  public cargarPacienteSeleccionado(pacienteNHC: String) {
    this.pacienteSeleccionado = this.listaPacientes.find(paciente => paciente.numero_historia == pacienteNHC)!;
    if(this.pacienteSeleccionado != null && this.pacienteSeleccionado != undefined && this.pacienteSeleccionado.numero_historia != ''){
      this.updatePacienteNHC = this.pacienteSeleccionado.numero_historia;
      this.updateNombrePaciente = this.pacienteSeleccionado.nombre;
      this.updateEdadPaciente = this.pacienteSeleccionado.edad;
      this.updateGeneroPaciente = this.pacienteSeleccionado.genero;
    } else {
      this.updatePacienteNHC = '';
      this.updateNombrePaciente = '';
      this.updateEdadPaciente = '';
      this.updateGeneroPaciente = '';
    }
  }

  public cargarBoxSeleccionado(boxNombre: String) {
    this.boxSeleccionado = this.listaBoxes.find(box => box.nombre == boxNombre)!;
    if(this.boxSeleccionado != null && this.boxSeleccionado != undefined && this.boxSeleccionado.nombre != ''){
      this.updateNombreBox = this.boxSeleccionado.nombre;
    } else {
      this.updateNombreBox = '';
    }
  }

  public agregarSensor() {
    if(this.addSensorId != '' && this.addNombreSensor != '') {
      this.sensorService.addSensor(new Sensor(this.addSensorId, this.addNombreSensor, '', [], new Date(), new Date(), false)).subscribe((data: any) => {
        this.cargarSensores();
        this.refrescarComponenteDispositivos();
        alert('Sensor añadido correctamente.');
        this.addSensorId = '';
        this.addNombreSensor = '';
      });
    } else {
      alert('Por favor, rellene todos los campos para añadir un sensor.');
    }
  }

  public agregarPaciente() {
    if(this.addPacienteNHC != '') {
      this.pacienteService.addPaciente(new Paciente(this.addPacienteNHC, this.addNombrePaciente, this.addGeneroPaciente,this.addEdadPaciente, new Date() , false)).subscribe((data: any) => {
        this.cargarPacientes();
        this.refrescarComponentePacientes();
        alert('Paciente añadido correctamente.');
        this.addPacienteNHC = '';
        this.addNombrePaciente = '';
        this.addEdadPaciente = '';
        this.addGeneroPaciente = '';
        this.pacienteService.addPacienteToHospital(data.id!).subscribe((data: any) => {
          console.log("Paciente añadido al Hospital Universitario HLA Moncloa");
        });
      });
    } else {
      alert('La NHC es obligatoria para añadir un paciente. Por favor, rellene el campo.');
    }
  }

  public agregarBox() {
    if(this.addNombreBox != '') {
      this.boxService.addBox(this.addNombreBox).subscribe((data: any) => {
        this.refrescarComponenteBoxes();
        alert('Box añadido correctamente.');
        this.addNombreBox = '';
        this.boxService.addBoxToHospital(data.id!).subscribe((data: any) => {
          console.log("Box añadido al Hospital Universitario HLA Moncloa");
        });
      });
    } else {
      alert('Por favor, rellene todos los campos para añadir un box.');
    }
  }

  public modificarSensor() {
    if (this.updateSensorId != '' && this.updateNombreSensor != '' && this.sensorSeleccionado != null && this.sensorSeleccionado != undefined) {
      if (confirm("Se modificará el sensor actual: " + this.sensorSeleccionado.nombre)) {
        this.sensorService.updateSensor(this.sensorSeleccionado.id!, new Sensor(this.updateSensorId, this.updateNombreSensor, '', [], new Date(), new Date(), false)).subscribe((data: any) => {
          this.cargarSensores();
          this.refrescarComponenteDispositivos();
          alert('Sensor modificado correctamente.');
          this.updateSensorId = '';
          this.updateNombreSensor = '';
        });
      } else {
        console.log("Modificación de sensor cancelada");
      }
    } else {
      alert('Por favor, seleccione un sensor para modificar.');
    }
  }

  public modificarPaciente() {
    if (this.updatePacienteNHC != '' && this.updateNombrePaciente != '' && this.pacienteSeleccionado != null && this.pacienteSeleccionado != undefined) {
      if (confirm("Se modificará el paciente actual: " + this.pacienteSeleccionado.numero_historia)){
        this.pacienteService.updatePaciente(this.pacienteSeleccionado.id!, new Paciente(this.updatePacienteNHC, this.updateNombrePaciente, this.updateGeneroPaciente, this.updateEdadPaciente, new Date(), false)).subscribe((data: any) => {
          this.cargarPacientes();
          this.refrescarComponentePacientes();
          alert('Paciente modificado correctamente.');
          this.updatePacienteNHC = '';
          this.updateNombrePaciente = '';
          this.updateEdadPaciente = '';
          this.updateGeneroPaciente = '';
        });
      } else {
        console.log("Modificación de paciente cancelada");
      }
    } else {
      alert('Por favor, seleccione un paciente para modificar.');
    }
  }

  public modificarBox() {
    if(this.updateNombreBox != '') {
      if (confirm("Se modificará el box actual: " + this.boxSeleccionado.nombre)){
        this.boxService.updateBox(this.boxSeleccionado.id!, this.updateNombreBox).subscribe((data: any) => {
          this.cargarBoxes();
          this.refrescarComponenteBoxes();
          alert('Box modificado correctamente.');
          this.updateNombreBox = '';
        });
      } else {
        console.log("Modificación de box cancelada");
      }
    }else {
      alert('Por favor, seleccione un box para modificar.');
    }
  }

  public eliminarSensor() {
    if (this.updateSensorId != '' && this.updateNombreSensor != '' && this.sensorSeleccionado != null && this.sensorSeleccionado != undefined) {
      if (confirm("Se ELIMINARÁ el sensor: " + this.updateNombreSensor)) {
        this.sensorService.deleteSensor(this.sensorSeleccionado.id!).subscribe((data: any) => {
          this.cargarSensores();
          this.refrescarComponenteDispositivos();
          alert('Sensor eliminado correctamente.');
          this.updateSensorId = '';
          this.updateNombreSensor = '';
        });
      } else{
        console.log("Eliminación de sensor cancelada");
      }
    } else {
      alert('Por favor, seleccione un sensor para eliminar.');
    }
  }

  public eliminarPaciente() {
    if (this.updatePacienteNHC != '' && this.pacienteSeleccionado != null && this.pacienteSeleccionado != undefined) {
      if (confirm("Se ELIMINARÁ el paciente: " + this.updatePacienteNHC)) {
          this.pacienteService.deletePaciente(this.pacienteSeleccionado.id!).subscribe((data: any) => {
            this.cargarPacientes();
            this.refrescarComponentePacientes();
            alert('Paciente eliminado correctamente.');
            this.updatePacienteNHC = '';
            this.updateNombrePaciente = '';
            this.updateEdadPaciente = '';
            this.updateGeneroPaciente = '';
          });
       } else {
          console.log("Eliminación de paciente cancelada");
      }
    } else {
      alert('Por favor, seleccione un paciente para eliminar.');
    }
  }

  public eliminarBox() {
   
      
    
    if(this.updateNombreBox != ''  && this.boxSeleccionado != null && this.boxSeleccionado != undefined) {
      if (confirm("Se ELIMINARÁ el box: " + this.updateNombreBox)) {
        this.boxService.deleteBox(this.boxSeleccionado.id!).subscribe((data: any) => {
          this.cargarBoxes();
          this.refrescarComponenteBoxes();
          alert('Box eliminado correctamente.');
          this.updateNombreBox = '';
        });
      } else {
        console.log("Eliminación de tarea cancelada");
      }
    } else {
      alert('Por favor, seleccione un box para eliminar.');
    }
  }
}
