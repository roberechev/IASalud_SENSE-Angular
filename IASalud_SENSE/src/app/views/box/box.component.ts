import { ChangeDetectorRef, Component, ElementRef } from '@angular/core';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Box } from '../../models/box';
import { Paciente } from '../../models/paciente';
import { ActivatedRoute } from '@angular/router';
import { BoxService } from '../../services/box.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import { VerTranscripcionDialogComponentComponent } from '../ver-transcripcion-dialog-component/ver-transcripcion-dialog-component.component';
import { ComboboxPacientesComponent } from '../combobox-pacientes/combobox-pacientes.component';
import { ComboboxDispositivosComponent } from '../combobox-dispositivos/combobox-dispositivos.component';
//graficos
import { AgChartsAngularModule } from 'ag-charts-angular';
import { AgChartOptions } from 'ag-charts-community';
import { AgChartsAngular } from 'ag-charts-angular';
import { data, get } from 'jquery';
import { SensorService } from '../../services/sensor.service';
import { MatDialog } from '@angular/material/dialog';
import { Tarea } from '../../models/tarea';
import { PacienteService } from '../../services/paciente.service';
import { AddTareaDialogComponentComponent } from '../add-tarea-dialog-component/add-tarea-dialog-component.component';
import { DomSanitizer } from '@angular/platform-browser';
import { AddAudioTareaDialogComponentComponent } from '../add-audio-tarea-dialog-component/add-audio-tarea-dialog-component.component';
import { TareaService } from '../../services/tarea.service';
/*
import React, { Fragment, useState } from "react";
import { createRoot } from "react-dom/client";
import { AgChartsReact } from "ag-charts-react";
import {AgBarSeriesOptions, AgChartOptions,AgCharts} from "ag-charts-community";
*/
interface IData {
  month: string;
  avgTemp: number;
  iceCreamSales: number;
}

interface IDataUrinometro {
  fecha: Date;
  diuresis: number;
  gotas: number;
}

interface IDataFechaNumero {
  fecha: Date;
  valor: number;
}

@Component({
  selector: 'app-box',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, AgChartsAngularModule, FormsModule, ComboboxPacientesComponent, ComboboxDispositivosComponent],
  //template: '<ag-charts-angular [options]="chartOptions"/>',
  templateUrl: './box.component.html',
  styleUrl: './box.component.scss'
})
export class BoxComponent {
  private sub: any;
  boxSeleccionado: Box = new Box('', [], new Paciente('','','','', new Date() , false), [], new Date(), false);
  tareasOrdenadas: Tarea[] = [];
  datosThingsboard: Map<string, any> = new Map<string, any>();

  // Fin AUDIO
  cargando: boolean = false;
  ajustesSeleccionados: boolean = false;
  dataColorParaGraficaUrinometro: any;

  mostrarGraficaTemperatura: boolean = true;
  mostrarGraficaHumedad: boolean = true;
  mostrarGraficaUrinometro: boolean = true;
  mostrarGraficaGlucosa: boolean = true;

  //ejemploGrafica: AgChartOptions = {};
  graficaTemperatura: AgChartOptions = {};
  graficaHumedad: AgChartOptions = {};
  graficaUrinometro: AgChartOptions = {};
  graficaGlucosa: AgChartOptions = {};

  colorUrinometro: string = 'amarillo';

  constructor(private boxService: BoxService, private activatedRoute: ActivatedRoute, private router: Router,
    private usuarioService: UsuarioService, private sensorService: SensorService, private dialog: MatDialog, 
    private cdr: ChangeDetectorRef, private tareaService: TareaService, private sanitizer: DomSanitizer) { }


  ngOnInit() {
    this.cargarBoxIicialmente();
    // Render component inside root element
    this.sensorService.actualizacion$.subscribe((data: Date) => {
      this.cargaSensoresThingsboard();
    });

    this.boxService.cambiosEnCombobox$.subscribe(() => {
      (<HTMLInputElement>document.getElementById('btnAjustesSeleccionadosID')).click();
      this.refrescarBoxParaTareas();
    });

    this.tareaService.actualizacionTareas$.subscribe(() => {
      this.refrescarBoxParaTareas();
    });    
  }

public cargarTodasGraficas() {

  this.datosThingsboard.forEach(sensor => {
    
    if (sensor.temperature != undefined && sensor.temperature != null) {
      this.graficaTemperatura = {
        autoSize: true,
        data: this.getDataTemperatura(sensor),
        title: {
          text: "Temperatura",
        },
        // footnote: {
        //   text: "Source: Department for Digital, Culture, Media & Sport",
        // },
        series: [
          {
            type: "area",
            xKey: "fecha",
            yKey: "valor",
            fill: 'purple'
          }
        ],
        axes: [
          {
            type: "time",
            position: "bottom",
          },
          {
            type: "number",
            position: "left",
            title: {
              text: "ºC",
            },
            label: {
              formatter: (params) => {
                return params.value + "ºC";
              },
            },
          },
        ],
      };
    }
    
    if (sensor.humidity != undefined && sensor.humidity != null) {
      this.graficaHumedad = {
        autoSize: true,
        data: this.getDataHumedad(sensor),
        title: {
          text: "Humedad",
        },
        series: [
          {
            type: "line",
            xKey: "fecha",
            yKey: "valor",
            stroke: 'purple', // Cambiamos el color de la línea a morado
            marker: { // Configuración de los marcadores
              fill: 'purple', // Cambiamos el color de los marcadores a rojo
              stroke: 'purple'
            }
          }
        ],
        axes: [
          {
            type: "time",
            position: "bottom",
          },
          {
            type: "number",
            position: "left",
            title: {
              text: "%",
            },
            label: {
              formatter: (params) => {
                return params.value + "%";
              },
            },
          },
        ],
      };
    }

    if (sensor.diuresis != undefined && sensor.diuresis != null) {
      
      this.graficaUrinometro = {
        autoSize: true,
        title: {
          text: 'Urinómetro'
        },
        subtitle: {
          text: "Diuresis: ml/Kg/min"
        },
        footnote: {
          text: "Color: " + this.getDataColorUrinometro(sensor)
        },
        legend: {
          position: 'bottom'
        },
        data: this.getDataUrinometro(sensor),
        series: [{
          type: 'bar',
          xKey: 'fecha',
          yKey: 'gotas',
          yName: 'Gotas',
          fill: '#A096C8' // Cambiamos el color de las barras a verde
        },
        {
          type: 'line',
          xKey: 'fecha',
          yKey: 'diuresis',
          yName: 'Diuresis',
          stroke: 'purple', // Cambiamos el color de la línea a morado
          marker: { // Configuración de los marcadores
            fill: 'purple', // Cambiamos el color de los marcadores a rojo
            stroke: 'purple', // Cambiamos el color del borde de los marcadores a morado
            size: 6 // Cambiamos el tamaño de los marcadores a 6
          }
        }],
        axes: [
          {
            type: "time",
            position: "bottom",
          },
          {
            position: 'left',
            type: 'number',
            keys: ['gotas'],
            label: {
              formatter: function(params) {
                return parseFloat(params.value).toLocaleString();
              }
            }
          },
          {
            position: 'right',
            type: 'number',
            keys: ['diuresis'],
            label: {
              formatter: (params) => {
                return params.value + "ml";
              },
            }           
          },
          {
            position: 'left',
            type: 'category', // Usamos 'category' para definir franjas horizontales
            keys: ['franja'], // Utiliza un conjunto de datos ficticio para definir la franja
            label: {
              formatter: function(params) {
                return ''; // No mostrar etiquetas para la franja
              }
            }
          }
        ]
    
      };

      if (sensor.r != undefined && sensor.r != null){
        //"rgb(" + separacion[0] + ", " + separacion[1] + ", " + separacion[2] + ")";
        let ultimoColor = this.getDataColorUrinometro(sensor);
        // Buscar el índice de cada valor de r, g y b en la cadena
        let indiceR = ultimoColor.indexOf("r:");
        let indiceG = ultimoColor.indexOf("g:");
        let indiceB = ultimoColor.indexOf("b:");

        // Extraer los valores de r, g y b de la cadena usando el método substring
        let r = ultimoColor.substring(indiceR + 3, ultimoColor.indexOf(" ", indiceR + 3));
        let g = ultimoColor.substring(indiceG + 3, ultimoColor.indexOf(" ", indiceG + 3));
        let b = ultimoColor.substring(indiceB + 3, ultimoColor.indexOf(" ", indiceB + 3));

        this.dataColorParaGraficaUrinometro = this.sanitizer.bypassSecurityTrustHtml("<i class='fa-solid fa-droplet' style='color: rgb(" + r + ", " + g + ", " + b + ");'></i>");
      }

    }

      if (sensor.glucose != undefined && sensor.glucose != null) {
        this.graficaGlucosa = {
          autoSize: true,
          data: this.getDataGlucosa(sensor),
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
              title: {
                text: "mg/dl",
              },
              label: {
                formatter: (params) => {
                  return params.value + "";
                },
              },
            },
          ],
        };


      }
      
    //fin bucle
  });
}


public getDataTemperatura(sensor: any) {
  let dataTemperatura: IDataFechaNumero[] = [];
  
    sensor.temperature.forEach((elemento: any) => {
      dataTemperatura.push({ fecha: new Date(elemento.ts), valor: parseFloat(elemento.value) } as IDataFechaNumero);
    });
   
  dataTemperatura.sort((a, b) => a.fecha.getTime() - b.fecha.getTime());
  //console.log(dataTemperatura);
  return dataTemperatura;
}

public getDataHumedad(sensor: any) {
  let dataHumedad: IDataFechaNumero[] = [];
    
  sensor.humidity.forEach((elemento: any) => {
    dataHumedad.push({ fecha: new Date(elemento.ts), valor: parseFloat(elemento.value) } as IDataFechaNumero);
  });

  dataHumedad.sort((a, b) => a.fecha.getTime() - b.fecha.getTime());
  //console.log(dataHumedad);
  return dataHumedad;
}

public getDataUrinometro(sensor: any) {
  let dataUrinometro: IDataUrinometro[] = [];

  sensor.diuresis.forEach((elemento: any) => {
    const gotas = sensor.drops.find((drop: any) => drop.ts == elemento.ts).value;
    //console.log("elemento: " + elemento.ts + " " + elemento.value + " " + gotas);
    dataUrinometro.push({ fecha: new Date(elemento.ts), diuresis: parseFloat(elemento.value), gotas: parseFloat(gotas) } as IDataUrinometro);
  });
  dataUrinometro.sort((a, b) => a.fecha.getTime() - b.fecha.getTime());
  //console.log(dataUrinometro);
  return dataUrinometro;
}

public getDataColorUrinometro(sensor: any) {
  let color = "prueba";
  if (sensor.r != undefined && sensor.r != null){
    const r = sensor.r.reduce((latest: any, r:any) => {
        // Si 'latest' aún no está definido o si el valor de 'ts' de 'r' es mayor que el de 'latest', actualiza 'latest'
        if (!latest || r.ts > latest.ts) {
            return r;
        } else {
            return latest;
        }
    }, null);
    const g = sensor.g.find((g: any) => g.ts == r.ts).value;
    const b = sensor.b.find((b: any) => b.ts == r.ts).value;
    const c = sensor.c.find((c: any) => c.ts == r.ts).value;
    const temp = sensor.temp.find((temp: any) => temp.ts == r.ts).value;
    const lux = sensor.lux.find((lux: any) => lux.ts == r.ts).value;
    //console.log("colores: " + r.ts + ", r:" + r.value + " g:" + g + " b:" + b + " c:" + c + " temp:" + temp + " lux:" + lux);
    color = "r: " + r.value + " g: " + g + " b: " + b + " c: " + c + " temp: " + temp + " lux: " + lux;
  }
  return color;
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
/*
  public getData() {
    return [
      {fecha: new Date(1712612451254), calor: parseInt('23')},
      {fecha: new Date(1712612226743), calor: parseInt('26')},
      {fecha: new Date(1712490432571), calor: parseInt('23')},
      {fecha: new Date(1710767792468), calor: parseInt('22')},
      {fecha: new Date(1710668743813), calor: parseInt('30')},
      {fecha: new Date(1710668626706), calor: parseInt('25')},
      ] as IDataTemperatura[];
  }
*/

  
  public cargarBoxIicialmente() {
    this.sub = this.activatedRoute.params.subscribe(params => {
      const id_box = +params['id']; // (+) converts string 'id' to a number
      this.boxService.obtenerUnBox(id_box).subscribe((data: Box) => {
        this.boxSeleccionado = data;
        this.boxSeleccionado.sensores = this.boxSeleccionado.sensores.filter(sensor => sensor != null);
        this.cargaSensoresThingsboard();
        this.obtenerTareasOrdenadas();
        this.obtenerGraficasSeleccionadas();
      })
    });
  }

  public refrescarBoxParaTareas() {
    this.boxService.obtenerUnBox(this.boxSeleccionado.id!).subscribe((data: Box) => {
      this.boxSeleccionado = data;
      this.boxSeleccionado.sensores = this.boxSeleccionado.sensores.filter(sensor => sensor != null);
      // console.log("--------------------" + this.boxSeleccionado.tareas[0].nombre);
      this.obtenerTareasOrdenadas();
      this.cargaSensoresThingsboard();
    });
  }

  public cargaSensoresThingsboard() {
    this.boxSeleccionado.sensores.forEach(sensor => {
      this.boxService.obtenerDispositivosThingsboard(sensor, this.boxSeleccionado.id!).subscribe((data: any) => {
        this.datosThingsboard.set(sensor.id_dispositivo_th, data);
        //console.log("datos de thingsboard: " + data); //toda la data
        this.cargarTodasGraficas();
      });
    });
  }

  public salirAlHome() {
    this.usuarioService.navegacionNavBar('home');
    this.router.navigate(['home']);
  }

  public obtenerTareasOrdenadas() {
    let tareas = this.boxSeleccionado.tareas;
    // Ordena las tareas por prioridad
    if (this.boxSeleccionado.tareas !== undefined && this.boxSeleccionado.tareas !== null) {
      tareas.sort((a, b) => a.prioridad - b.prioridad);
    }
    this.tareasOrdenadas = tareas;
    // Notifica a Angular sobre el cambio en los datos
    this.cdr.detectChanges();
  }

  public scrollToTareas() {
    const tituloTareas = document.getElementById('tituloTareas');
    if (tituloTareas) {
      tituloTareas.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  public cargarNombreTarea(tarea: Tarea) {
    if (tarea.audio_recordatorio != null && tarea.audio_recordatorio != undefined) {
      return (tarea.nombre.split("|")[0]).replace("-", " ");
    }
    return tarea.nombre;

  }

  public abrirAddTarea() {
    let dialogRef = this.dialog.open(AddTareaDialogComponentComponent, {
      height: '50%',
      maxHeight: '350px',
      width: '50%',
      maxWidth: '600px', 
      data: { box: this.boxSeleccionado},
      panelClass: 'customDialogAddTarea' // Aplica la clase personalizada al diálogo
    });
    dialogRef.afterClosed().subscribe(result => {
      // Aquí puedes manejar la lógica después de que se cierre la ventana emergente
      console.log('The dialog was closed');
    });
  }

  public abrirAddAudioTarea() {
    let dialogRef = this.dialog.open(AddAudioTareaDialogComponentComponent, {
      height: '50%',
      maxHeight: '450px',
      width: '50%',
      maxWidth: '620px', 
      data: { box: this.boxSeleccionado},
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
      this.refrescarBoxParaTareas();
    } else {
      console.log("Eliminación de tarea cancelada");
    }
  }

  public comprobacionAudioParaTrancripcion(audio: File){
    if(audio == null || audio == undefined){
      return false;
    }else{
      return true;
    }
  }

  public abrirDialogoTranscripcion(idTarea: number) {
    this.cargando = true;
    this.boxService.transcripcionAudio(idTarea).subscribe((data: any) => {
      //console.log(data);
      this.cargando = false;
      let dialogRef = this.dialog.open(VerTranscripcionDialogComponentComponent, {
        height: '50%',
        maxHeight: '350px',
        width: '50%',
        maxWidth: '600px', 
        data: { transcripcion: data.texto_transcrito},
        panelClass: 'customDialogAddTarea' // Aplica la clase personalizada al diálogo
      });
      dialogRef.afterClosed().subscribe(result => {
        // Aquí puedes manejar la lógica después de que se cierre la ventana emergente
        console.log('The dialog was closed');
      });
    });
    //this.dialog.open(DialogoTranscripcionComponent, { data: { tarea: tarea } });
  }


  /*
  -------------------------------------------------------------------------------------
  Graficas Seleccionadas
  -------------------------------------------------------------------------------------
  */
  public guardarGraficasSeleccionadas() {
    // Guardar las selecciones en el almacenamiento local
    let nombreGuardar = "graficasSeleccionadas" + this.boxSeleccionado.id!;
    localStorage.setItem(nombreGuardar, JSON.stringify({
        mostrarTemperatura: this.mostrarGraficaTemperatura,
        mostrarHumedad: this.mostrarGraficaHumedad,
        mostrarUrinometro: this.mostrarGraficaUrinometro,
        mostrarGlucosa: this.mostrarGraficaGlucosa
    }));
}

  public obtenerGraficasSeleccionadas() {
    // Obtener las selecciones guardadas del almacenamiento local al iniciar el componente
    let nombreGuardar = "graficasSeleccionadas" + this.boxSeleccionado.id;
    const seleccionesGuardadas = JSON.parse(localStorage.getItem(nombreGuardar)!);
    if (seleccionesGuardadas) {
        this.mostrarGraficaTemperatura = seleccionesGuardadas.mostrarTemperatura;
        this.mostrarGraficaHumedad = seleccionesGuardadas.mostrarHumedad;
        this.mostrarGraficaUrinometro = seleccionesGuardadas.mostrarUrinometro;
        this.mostrarGraficaGlucosa = seleccionesGuardadas.mostrarGlucosa;
    }
}
/*
  -------------------------------------------------------------------------------------
  FIN Graficas Seleccionadas
  -------------------------------------------------------------------------------------
  */
}




 

  

    /*return [
      {
        date: new Date(2015, 1, 1),
        "Tate Britain": 145525,
        "Tate Modern": 365921,
        "Tate Liverpool": 40130,
        "Tate St Ives": 8145,
      },
      {
        date: new Date(2015, 2, 1),
        "Tate Britain": 166384,
        "Tate Modern": 393326,
        "Tate Liverpool": 33696,
        "Tate St Ives": 10328,
      },
      {
        date: new Date(2015, 3, 1),
        "Tate Britain": 148871,
        "Tate Modern": 566058,
        "Tate Liverpool": 47671,
        "Tate St Ives": 20663,
      },
    ];
  }*/

  /*if (true) {
      this.ejemploGrafica = {
        autoSize: true,
        //height: 300,
        //width: 500,
        title: {
          text: 'Temperatura'
        },
        subtitle: {
          text: 'subtitle'
        },
        legend: {
          position: 'bottom'
        },
        data: [
        { month: "Jan", avgTemp: 2.3, iceCreamSales: 162000 },
        { month: "Mar", avgTemp: 6.3, iceCreamSales: 302000 },
        { month: "May", avgTemp: 16.2, iceCreamSales: 800000 },
        { month: "Jul", avgTemp: 22.8, iceCreamSales: 1254000 },
        { month: "Sep", avgTemp: 14.5, iceCreamSales: 950000 },
        { month: "Nov", avgTemp: 8.9, iceCreamSales: 200000 }
        ] as IData[],
        series: [{
          type: 'bar',
          xKey: 'month',
          yKey: 'iceCreamSales',
          yName: 'Num. Dos',
        },
        {
          type: 'line',
          xKey: 'month',
          yKey: 'avgTemp',
          yName: 'avgTempLabel',
        }],
        axes: [
          {
            type: 'category',
            position: 'bottom'
          },
          {
            position: 'left',
            type: 'number',
            keys: ['iceCreamSales'],
            label: {
              formatter: function(params) {
                return parseFloat(params.value).toLocaleString();
              }
            }
          },
          {
            position: 'right',
            type: 'number',
            keys: ['avgTemp'],
            label: {
              formatter: function(params) {
                return params.value + '°C';
              }
            }            
          }
        ]        
      }
    }*/
