import { Component, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { SpinnerComponent } from './views/spinner/spinner.component';

import $ from 'jquery';
import { UsuarioService } from './services/usuario.service';
import { HospitalService } from './services/hospital.service';
import { SensorService } from './services/sensor.service';
import { Sensor } from './models/sensor';
import { environment } from '../environments/environment';
import { BoxService } from './services/box.service';
import { Box } from './models/box';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, SpinnerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})

export class AppComponent {

 // isLoading: boolean = false;

constructor(private router: Router, private usuarioService: UsuarioService, private hospitalService: HospitalService, 
  private sensorService: SensorService, private boxService: BoxService) {}

ngOnInit() {
  //this.isLoading = true;

  this.comprobarToken();
  setTimeout(() => { 
    navbar();
    //this.isLoading = false;
  });
  //if (this.esUsuarioLogueado()){
  this.cargarTokenYSocketThingsboard();
  //}
}

public esUsuarioLogueado() {
  return this.usuarioService.estaLogueado();
}

public comprobarToken() {
  if (!this.usuarioService.estaLogueado()) {
      console.log('Token expirado');
  }
}

/* 
  -------------------------------------------------------------------------------------
  TOKEN Y WEB SOCKET THINGSBOARD 
  -------------------------------------------------------------------------------------
  */
  public cargarTokenYSocketThingsboard() {
    this.hospitalService.getTokenThingsboardAPI().subscribe((data: any) => {
      //console.info('---------Token Thingsboard:', data.token);
      this.hospitalService.guardarTokenThingsboard(data.token)
      this.boxService.getBoxes().subscribe((dataBoxes: any) => {
        let boxes = dataBoxes.filter((box: Box) => box != null);
        boxes.forEach((box: any) => {          
          let filtroSensores = box.sensores.filter((sensor: Sensor) => sensor != null);
          if (filtroSensores != null && filtroSensores != undefined){
            //console.log('Sensores de la box:', filtroSensores[0].nombre);
            WebSocketAPIExample(this.hospitalService.getTokenThingsboard()!, filtroSensores, this.sensorService, box);
          }
        });
      });
      // this.hospitalService.getDispositivosThingsboard().subscribe((dataIds: any) => { 
      //   //get bd boxes
      //   this.hospitalService.dispositivosThingsboardCargados = dataIds.dispositivosIds;
      //   this.dispositivos = this.hospitalService.dispositivosThingsboardCargados;
      //   WebSocketAPIExample(this.hospitalService.getTokenThingsboard()!, this.dispositivos, this.hospitalService);
      // });
    });
  }
  /* 
  -------------------------------------------------------------------------------------
  FIN TOKEN Y WEB SOCKET THINGSBOARD 
  -------------------------------------------------------------------------------------
  */

}

/* 
  -------------------------------------------------------------------------------------
  NAVBAR 
  -------------------------------------------------------------------------------------
*/ 

function navbar() {
  var tabsNewAnim = $('#navbarSupportedContent');
  var selectorNewAnim = $('#navbarSupportedContent').find('li').length;
  var activeItemNewAnim = tabsNewAnim.find('.active');
  var activeWidthNewAnimHeight = activeItemNewAnim.innerHeight();
  var activeWidthNewAnimWidth = activeItemNewAnim.innerWidth();
  var itemPosNewAnimTop = activeItemNewAnim.position();
  var itemPosNewAnimLeft = activeItemNewAnim.position();
  $(".hori-selector").css({
      "top": itemPosNewAnimTop.top + "px",
      "left": itemPosNewAnimLeft.left + "px",
      "height": activeWidthNewAnimHeight + "px",
      "width": activeWidthNewAnimWidth + "px"
  });
  $("#navbarSupportedContent").on("click", "li", function (e) {
      $('#navbarSupportedContent ul li').removeClass("active");
      $(this).addClass('active');
      var activeWidthNewAnimHeight = $(this).innerHeight();
      var activeWidthNewAnimWidth = $(this).innerWidth();
      var itemPosNewAnimTop = $(this).position();
      var itemPosNewAnimLeft = $(this).position();
      $(".hori-selector").css({
          "top": itemPosNewAnimTop.top + "px",
          "left": itemPosNewAnimLeft.left + "px",
          "height": activeWidthNewAnimHeight + "px",
          "width": activeWidthNewAnimWidth + "px"
      });
  });
}

$(window).on('resize', function () {
  setTimeout(function () { 
    navbar(); 
  }, 500);
});

$(document).on("click", ".navbar-toggler", function () {
  $(".navbar-collapse").slideToggle(300);
  setTimeout(function () { 
    navbar(); 
  });
});

// Add active class on another-page move
jQuery(document).ready(function ($) {
  // Get current path and find target link
  var path = window.location.pathname.split("/").pop();

  // Account for home page with empty path
  if (path == '') {
      path = 'index.html';
  }

  var target = $('#navbarSupportedContent ul li a[href="' + path + '"]');
  // Add active class to target link
  target.parent().addClass('active');
});

/* 
  -------------------------------------------------------------------------------------
  FIN NAVBAR 
  -------------------------------------------------------------------------------------
*/
/* 
  -------------------------------------------------------------------------------------
  WEB SOCKET THINGSBOARD 
  -------------------------------------------------------------------------------------
  */
  function WebSocketAPIExample(tokenThingsboard: string, dispositivos: Sensor[], sensorService: SensorService, box: Box) {
    // var entityIds = ["6f9c11c0-deda-11ee-82da-4d2b8f4eb4f7", "6f9ef7f0-deda-11ee-82da-4d2b8f4eb4f7"];
    
    // var webSocket = new WebSocket("ws://localhost:8080/api/ws");
    var webSocket = new WebSocket(environment.shoketUrlTH);
    var messageCount = 0;
  
    webSocket.onopen = function () {
      var authCmd = {
        cmdId: 0,
        token: tokenThingsboard
      };

      var cmds = dispositivos.map((sensor) => ({
        entityType: "DEVICE",
        entityId: sensor.id_dispositivo_th,
        scope: "LATEST_TELEMETRY",
        cmdId: sensor.id, // Aquí asumimos que sensor.id corresponde al id del sensor
        type: "TIMESERIES"
      }));
  
      var object = {
        authCmd: authCmd,
        cmds: cmds
      };
  
      var data = JSON.stringify(object);
      webSocket.send(data);
      //console.log("Message is sent: " + data);
    };
  
    webSocket.onmessage = function (event) {
      console.log("numero: " + messageCount);
      console.log("box: " + box.nombre);
      var received_msg = event.data;
      console.log("Message is received: " + received_msg);
      sensorService.cargarNuevoDato(received_msg, messageCount, box);
      messageCount++;
    };
  
    webSocket.onclose = function (event) {
      console.log("Connection is closed!");
    };
  }
/* 
  -------------------------------------------------------------------------------------
  FIN WEB SOCKET THINGSBOARD 
  -------------------------------------------------------------------------------------
  */

