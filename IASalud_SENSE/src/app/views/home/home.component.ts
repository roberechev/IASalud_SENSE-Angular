import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
import { AgChartsAngularModule } from 'ag-charts-angular';
import { AgChartOptions } from 'ag-charts-community';


interface IDataFechaNumero {
  fecha: Date;
  valor: number;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, FormsModule, AgChartsAngularModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  //private actualizarSensorSubscription: Subscription;
  boxes: Box[] = [];
  horaModificacion: string = '';
  graficaGlucosa: { [idBox: string]: AgChartOptions } = {};

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
    let fecha = "";
    if(sensor != undefined && sensor != null && sensor.ultimo_registro != undefined && sensor.ultimo_registro != null){
      fecha = this.formatDate(sensor.ultimo_registro)
    }
    return fecha;
  }

  private formatDate(date: Date): string {
    const ultimaFecha = new Date(date)
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit'
    };
    return ultimaFecha.toLocaleDateString('es-ES', options).replace(',', ' -');
  }

  constructor(private boxService: BoxService, private sensorService: SensorService, private dialog: MatDialog, private route: Router, 
    private tareaService: TareaService) { }

  public obtenerBoxes() {
    this.boxService.getBoxes().subscribe((data: Box[]) => {
      this.boxes = data.filter(box => box != null);
      this.boxes.forEach(element => {
        let filtroSensores = element.sensores.filter(sensor => sensor != null);
        this.cargarGraficaGlucosa((element.id!).toString(), filtroSensores);
      });
    });
  }

  public cargarGraficaGlucosa(idBox: string, sensores: Sensor []) {
    let registrosGlucosa: Registro[] = [];
    if (sensores != undefined && sensores != null) {

      sensores.forEach(s => {
        if (s != null && s != undefined && s.registros != undefined && s.registros != null) {
          s.registros.forEach(r => {
            if (r != null && r != undefined && r.unidades == 'glucosa') {
              registrosGlucosa.push(r);
            }
          });
        } 

        if (s != null && s != undefined){
          this.boxService.obtenerDispositivosThingsboard(s).subscribe((data: any) => {

            if (data.glucose != undefined && data.glucose != null) {
              this.graficaGlucosa[idBox] = {
                height: 300,
                data: this.getDataGlucosa(data),
                title: {
                  text: "Glucosa",
                },
                series: [
                  {
                    type: "line",
                    xKey: "fecha",
                    yKey: "valor",
                    stroke: 'purple', // Cambiamos el color de la línea a morado
                    marker: { // Configuración de los marcadores
                      fill: 'purple', // Cambiamos el color de los marcadores a morado
                      stroke: 'purple'
                    }
                  },
                ],
                axes: [
                  {
                    type: "time",
                    position: "bottom",
                  },
                  {
                    type: "number",
                    position: "left",
                    crossLines: [
                      {
                        type: "range",
                        range: [50, 150],
                        strokeWidth: 0,
                        fill: "rgba(0, 128, 0, 1)"
                      },
                    ],
                    label: {
                      formatter: (params) => {
                        return params.value + "";
                      },
                    },
                  },
                ],
              };
            }

          });
        }

      });
    }
  }

  public getDataGlucosa(sensor: any) {
    let dataGlucosa: IDataFechaNumero[] = [];
      
    sensor.glucose.forEach((elemento: any) => {
      dataGlucosa.push({ fecha: new Date(elemento.ts), valor: parseFloat(elemento.value) } as IDataFechaNumero);
    });
  
    dataGlucosa.sort((a, b) => a.fecha.getTime() - b.fecha.getTime());
    //console.log(dataGlucosa);
    return dataGlucosa;
  }

  public obtenerUltimosValores(sensor: Sensor) {
    if (sensor != undefined && sensor != null && sensor.registros != undefined && sensor.registros != null) {
        // Crear un objeto para almacenar los últimos registros por tipo de unidad
        const ultimosRegistros: { [unidades: string]: Registro } = {};

        // Iterar sobre los registros del sensor
        sensor.registros.forEach(registro => {
            // Obtener la unidad de medida del registro actual
            const unidades = registro.unidades;

            // Verificar si ya hay un registro para esta unidad
            if (!ultimosRegistros[unidades] || registro.id! > ultimosRegistros[unidades].id!) {
                // Hacer una copia del registro actual para evitar modificar el original
                const nuevoRegistro: Registro = { ...registro };

                if (unidades == 'ºC') {
                  nuevoRegistro.valor = nuevoRegistro.valor + " ºC";
                }
                if (unidades == '%') {
                  nuevoRegistro.valor = nuevoRegistro.valor + " %";
                }

                if (unidades == 'color') {
                  let separacion = nuevoRegistro.valor.split("|");
                  nuevoRegistro.tipo = "rgb(" + separacion[0] + ", " + separacion[1] + ", " + separacion[2] + ")";
                  nuevoRegistro.valor = "c: " + separacion[3] + ", temp: " + separacion[4] + ", lux: " + separacion[5];
                }

                if (unidades == 'glucosa') {
                  //nuevoRegistro.valor = nuevoRegistro.valor + " glucosa mg/dl";
                  nuevoRegistro.valor = "";
                }

                if (unidades == 'diuresis') {
                  let separacion = nuevoRegistro.valor.split("|");
                  nuevoRegistro.valor = separacion[1] + " gotas, " + separacion[2] + " ml/Kg/min";
                }

                // Asignar el nuevo registro al objeto ultimosRegistros
                ultimosRegistros[unidades] = nuevoRegistro;
            }
        });

        // Ordenamos los registros según el orden de las unidades
        const ordenUnidades = ['ºC', '%', 'diuresis', 'color', 'glucosa'];
        const registrosOrdenados = ordenUnidades.map(unidad => ({ unidad, registro: ultimosRegistros[unidad] })).filter(objeto => objeto.registro);

        return registrosOrdenados.map(objeto => objeto.registro);
    } else {
        return null;
    }
  }

  public getColor(tipo: string) {
    return tipo;
  }

  public comprobarDiuresis(box: Box, sensor: Sensor) {
    if (sensor != undefined && sensor != null && sensor.registros != undefined && sensor.registros != null){
      if (sensor.registros.filter(registro => registro.unidades == 'glucosa').length > 0 && box.id == 1) {
        return false;
      }else{
        return true;
      }
    }else{
      return true;
    }
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

  public obtenerSensores(box: Box) {
    return box.sensores.filter(sensor => sensor != null);

  }

  public abrirAddTarea(box: Box) {
    let dialogRef = this.dialog.open(AddTareaDialogComponentComponent, {
      height: '50%',
      maxHeight: '350px',
      width: '50%',
      maxWidth: '600px', 
      data: { box: box},
      panelClass: 'customDialogAddTarea' // Aplica la clase personalizada al diálogo
    });
    dialogRef.afterClosed().subscribe(result => {
      // Aquí puedes manejar la lógica después de que se cierre la ventana emergente
      console.log('The dialog was closed');
    });
  }

  public eliminarTarea(idTarea: number) {
    if (confirm("¿Estás seguro de que deseas eliminar esta tarea?")) {
      this.boxService.eliminarTareaSeleccionada(idTarea).subscribe((data: any) => {
        console.log("Tarea eliminada");
      });
      this.obtenerBoxes();
      this.tareaService.actualizarTareas();
    } else {
      (<HTMLInputElement>document.querySelector('.idClassSeleccion')).checked = false;
      console.log("Eliminación de tarea cancelada");
      this.tareaService.actualizarTareas();
    }
  }

  public infoBox(box: Box) {
    // this.usuarioService.navegacionNavBar('home');
    this.route.navigate(['/box', box.id]);
  }

}