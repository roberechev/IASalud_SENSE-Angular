import { Component } from '@angular/core';
import { BoxService } from '../../services/box.service';
import { Box } from '../../models/box';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import { HospitalService } from '../../services/hospital.service';
import { inject } from '@angular/core';
import { SensorService } from '../../services/sensor.service';
import { Sensor } from '../../models/sensor';
import { Registro } from '../../models/registro';
import { Subject, Subscription } from 'rxjs';
import { AddTareaDialogComponentComponent } from '../add-tarea-dialog-component/add-tarea-dialog-component.component';
import { MatDialog } from '@angular/material/dialog';
import { trigger, transition, style, animate } from '@angular/animations';
import { TareaService } from '../../services/tarea.service';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  mediaRecorder!: MediaRecorder;
  chunks: Blob[] = [];
  recording = false;

  //private actualizarSensorSubscription: Subscription;
  boxes: Box[] = [];
  horaModificacion: string = '';

  // dispositivos: Record<string, string> = {};

  ngOnInit() {
    this.obtenerBoxes();
    // Suscribirse al Subject para recibir eventos de actualización
    this.sensorService.actualizacion$.subscribe((data: Date) => {
      this.obtenerBoxes();
      this.horaModificacion = this.formatDate(data);
    });
    this.tareaService.actualizacionTareas$.subscribe(() => {
      this.obtenerBoxes();
    });
  }

  public cargaFechaUltimoRegistroSensor(sensor: Sensor): string {
    return  this.formatDate(sensor.ultimo_registro);
  }

  private formatDate(date: Date): string {
    const ultimaFecha = new Date(date)
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit'
    };
    return ultimaFecha.toLocaleDateString('es-ES', options).replace(',', ' -');
  }

  constructor(private boxService: BoxService, private hospitalService: HospitalService, private sensorService: SensorService, 
    private dialog: MatDialog, private route: Router, private usuarioService: UsuarioService, private tareaService: TareaService) { }

  // se puede eliminar
  public movilidadAlmacen() {
    this.usuarioService.navegacionNavBar('almacen');
    this.route.navigate(['almacen']);
  }

  
  // public obtenerSensores(idBox: number) {
  //  return this.boxes[idBox].sensores;
  // }

  public obtenerBoxes() {
    this.boxService.getBoxes().subscribe((data: Box[]) => {
      this.boxes = data;
    });
  }

  public obtenerUltimosValores(sensor: Sensor) {
     // Crear un objeto para almacenar los últimos registros por tipo de unidad
     const ultimosRegistros: { [unidades: string]: Registro } = {};

     // Iterar sobre los registros del sensor
     sensor.registros.forEach(registro => {
         // Obtener la unidad de medida del registro actual
         const unidades = registro.unidades;
 
         // Verificar si ya hay un registro para esta unidad
         if (!ultimosRegistros[unidades] || registro.id! > ultimosRegistros[unidades].id!) {
             // Si no hay registro para esta unidad o si el ID del registro actual es mayor, actualizar el registro
             ultimosRegistros[unidades] = registro;
         }
     });
     // Convertir el objeto de últimos registros en un array y devolverlo
     return Object.values(ultimosRegistros);
  }

  public obtenerTareasHigh(idBox: number) {
    // PUEDE SER UTIL
    // this.boxes.find(box => box.id === idBox)?.tareas.filter(tarea => tarea.audio_recordatorio !== null);
    let tareas = this.boxes.find(box => box.id === idBox)?.tareas;
    // Ordena las tareas por prioridad
    if (tareas !== undefined && tareas !== null) {
      tareas.sort((a, b) => a.prioridad - b.prioridad);
      return tareas.slice(0, 3);
    }else{
      return tareas;
    }
  }

  public abrirAddTarea(box: Box) {
    let dialogRef = this.dialog.open(AddTareaDialogComponentComponent, {
      height: '50%',
      maxHeight: '350px',
      width: '50%',
      maxWidth: '600px', 
      data: { box: box },
      panelClass: 'customDialogAddTarea' // Aplica la clase personalizada al diálogo
    });
    dialogRef.afterClosed().subscribe(result => {
      // Aquí puedes manejar la lógica después de que se cierre la ventana emergente
      console.log('The dialog was closed');
    });
  }

  public eliminarTarea(): void {
    if (confirm("¿Estás seguro de que deseas eliminar esta tarea?")) {
      // Aquí llamarías a tu función para eliminar la tarea
      // Por ejemplo: this.tareaService.eliminarTarea(id);
      console.log("Tarea eliminada");
    } else {
      console.log("Eliminación de tarea cancelada");
    }
  }

  public eliminarTareaSeleccionada(idTarea: number) {
    this.boxService.eliminarTareaSeleccionada(idTarea).subscribe((data: any) => {
      console.info('Eliminada:', data);
    });
  }

  public infoBox(box: Box) {
    // this.usuarioService.navegacionNavBar('home');
    this.route.navigate(['/box', box.id]);
  }

  /* 
  -------------------------------------------------------------------------------------
  AUDIO 
  -------------------------------------------------------------------------------------
  */ 
  public toggleRecording() {
    if (!this.recording) {
      this.startRecording();
    } else {
      this.stopRecording();
    }
  }

  public startRecording() {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        this.mediaRecorder = new MediaRecorder(stream);
        this.mediaRecorder.ondataavailable = event => {
          this.chunks.push(event.data);
        };
        this.mediaRecorder.onstop = () => {
          const audioBlob = new Blob(this.chunks, { type: 'audio/mp3' });
          this.uploadAudio(audioBlob);
        };
        this.mediaRecorder.start();
        this.recording = true; // Actualizar estado de grabación
      })
      .catch(error => {
        console.error('Error accessing microphone:', error);
      });
  }

  public stopRecording() {
    if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
      this.mediaRecorder.stop();
      this.recording = false; // Actualizar estado de grabación
    }
  }

  public uploadAudio(audioBlob: Blob) {
    this.boxService.guardarAudio(audioBlob).subscribe((data: any) => {
      console.info('ROBER:', data);
    });
  }
/* 
  -------------------------------------------------------------------------------------
  FIN AUDIO 
  -------------------------------------------------------------------------------------
  */ 

}