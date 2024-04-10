import { Component } from '@angular/core';
import { Box } from '../../models/box';
import { Paciente } from '../../models/paciente';
import { ActivatedRoute } from '@angular/router';
import { BoxService } from '../../services/box.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
//graficos
import { AgChartsAngularModule } from 'ag-charts-angular';
import { AgChartOptions } from 'ag-charts-community';
/*
import React, { Fragment, useState } from "react";
import { createRoot } from "react-dom/client";
import { AgChartsReact } from "ag-charts-react";
import {AgBarSeriesOptions, AgChartOptions,AgCharts} from "ag-charts-community";
*/
interface IData {
  month: string;
  value: number;
  numDos: number;
}

@Component({
  selector: 'app-box',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, AgChartsAngularModule],
  template: '<ag-charts-angular [options]="chartOptions"/>'
  //templateUrl: './box.component.html',
  //styleUrl: './box.component.scss'
})
export class BoxComponent {
  private sub: any;
  boxSeleccionado: Box = new Box('', [], new Paciente('', new Date(), false), [], new Date(), false);

  public chartOptions: AgChartOptions;

  constructor(private boxService: BoxService, private activatedRoute: ActivatedRoute, private router: Router,
    private usuarioService: UsuarioService) { 
      this.chartOptions = {
        autoSize: true,
        data: [
          { month: 'Jan', value: 10, numDos: 120 },
          { month: 'Feb', value: 20, numDos: 130 },
          { month: 'Mar', value: 30, numDos: 140 },
          { month: 'Apr', value: 40, numDos: 150 },
          { month: 'May', value: 50, numDos: 160 },
          { month: 'Jun', value: 60, numDos: 170 },
          { month: 'Jul', value: 70, numDos: 180 },
          { month: 'Aug', value: 80, numDos: 190 },
          { month: 'Sep', value: 90, numDos: 1100 },
          { month: 'Oct', value: 100, numDos: 1110 },
          { month: 'Nov', value: 110, numDos: 1120 },
          { month: 'Dec', value: 120, numDos: 1130 }
        ] as IData[],
        series: [{
          type: 'bar',
          xKey: 'month',
          yKey: 'numDos'
        } ]
      }
    }





  ngOnInit() {
    this.cargarBox();
    // Render component inside root element

  }
  
  public cargarBox() {
    this.sub = this.activatedRoute.params.subscribe(params => {
      const id_box = +params['id']; // (+) converts string 'id' to a number
      this.boxService.obtenerUnBox(id_box).subscribe((data: Box) => {
        this.boxSeleccionado = data;
        
      })
    });
  }

  public salirAlHome() {
    this.usuarioService.navegacionNavBar('home');
    this.router.navigate(['home']);
  }


  // BORRAR
  public obtenerTareasSinAudios(idBox: number) {
    return this.boxSeleccionado.tareas;
  }
  //boxes: Box[] = [];
}


/*

<div>
    <h1>BOXES</h1>
    <div class="container-fluid">
    <div class="row overflow-x-auto">
      <div *ngFor="let box of boxes" class="col-md-3">
        <div class="card custom-card" ><!--(click)="infoBox(box)"-->
          <div class="card-body">
            
            <!-- Sección para el nombre y la historia del paciente -->
            <div class="card inner-card">
              <div class="card-body inner-card-body">
                <h3><i class="fa-solid fa-circle" style="color: #74C0FC;"></i> <i class="fa-solid fa-bed" style="margin-left: 5px;"></i> #{{ box.nombre }}</h3>
                <h4><b>NHC</b> {{ box.paciente.numero_historia }}</h4>
              </div>
            </div>
  
            <!-- Sección para la información del sensor -->
            <div class="card inner-card">
              <div class="card-body">
                <div *ngFor="let sensor of box.sensores"><!--obtenerSensores(box.id!)-->
                  <h4>{{ sensor.nombre }}</h4>
                  <p>{{ sensor.tipo }}</p>
                  <p>{{ sensor.valor }}</p>
                </div>
              </div>
            </div>
            <h1>{{ box.id }}</h1>
            <!-- Sección para la información de las tareas -->
            <div class="card inner-card">
              <div class="card-body">
                <div *ngFor="let tarea of obtenerTareasSinAudios(box.id!)">
                  <h4>{{ tarea.nombre }}</h4>
                  <p>{{ tarea.prioridad }}</p>
                  <audio controls>
                    <source src="{{ tarea.audio_recordatorio }}" type="audio/mpeg">
                    Tu navegador no soporta la reproducción de audio.
                  </audio>
                  <button class="btn btn-danger" >Tarea Delete</button><!--(click)="eliminarTareaSeleccionada(tarea.id!)"-->
                </div>
              </div>
            </div>
  
            <div class="card rounded border-0 shadow-sm position-relative">
              <div class="card-body p-5">
                  <div class="form-check mb-3" ><!--(click)="eliminarTarea()"-->
                      <input class="form-check-input" id="uno" type="checkbox" checked>
                      <label class="form-check-label" for="uno"><span class="fst-italic pl-1">Buy a new sweatshirt</span></label>
                  </div>
              </div>
            </div>
  
  
  
          </div>
        </div>
      </div>
    </div>
  </div>
  </div>*/