import { Component, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

import { Hospital } from './models/hospital';
import { HospitalService } from './services/hospital.service';
import $ from 'jquery';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})

export class AppComponent {
  title = 'IASalud_SENSE';
  hospitales: Hospital[] = [];

  constructor(private hospitalService: HospitalService, private elementRef: ElementRef) { }

  ngOnInit() {
    setTimeout(() => { 
      test(); 
    });
  }

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
}


function test() {
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
      test(); 
  }, 500);
});

$(document).on("click", ".navbar-toggler", function () {
  $(".navbar-collapse").slideToggle(300);
  setTimeout(function () { 
      test(); 
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