import { Component, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

import $ from 'jquery';
import { UsuarioService } from './services/usuario.service';
import { HospitalService } from './services/hospital.service';
import { SensorService } from './services/sensor.service';
import { Sensor } from './models/sensor';
import { Box } from './models/box';
import { BoxService } from './services/box.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})

export class AppComponent {

constructor(private router: Router, private usuarioService: UsuarioService, private hospitalService: HospitalService, 
  private sensorService: SensorService, private boxService: BoxService) {}

ngOnInit() {
  this.comprobarToken();
  setTimeout(() => { 
    navbar();
  });
  //if (this.esUsuarioLogueado()){
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


