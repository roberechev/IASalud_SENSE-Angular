import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Box } from '../../models/box';
import { Paciente } from '../../models/paciente';
import { SensorService } from '../../services/sensor.service';
import { Sensor } from '../../models/sensor';
import { BoxService } from '../../services/box.service';
import { PacienteService } from '../../services/paciente.service';

@Component({
  selector: 'app-combobox-dispositivos-ajustes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './combobox-dispositivos-ajustes.component.html',
  styleUrl: './combobox-dispositivos-ajustes.component.scss'
})
export class ComboboxDispositivosAjustesComponent implements OnChanges{

  listaSensores: Sensor[] = [];
  @Input() actualizar: boolean = false;

  constructor(private router: Router, private sensorService: SensorService, private boxService: BoxService, 
    private pacienteService: PacienteService) { }

  ngOnInit() {
    this.cargarSensores();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['actualizar'] && changes['actualizar'].currentValue) {
      console.log('El componente se está refrescando...');
      this.recargarValoresVacios();
      this.cargarSensores();
    }
  }

  public cargarSensores() {
    this.sensorService.getSensores().subscribe((data: Sensor[]) => {
      this.listaSensores = data.filter(sensor => sensor != null);
      this.filteredList = this.listaSensores.map(sensor => (sensor.nombre));
    });
  }

  filteredList: string[] = [];

  inputItem = '';
  listHidden = true;
  showError = false;
  selectedIndex = -1;

public getFilteredList() {

  this.listHidden = false;
  // this.selectedIndex = 0;
  if (!this.listHidden && this.inputItem !== undefined) {
    this.filteredList = this.listaSensores.filter((sensor) => (sensor.nombre).toLowerCase().startsWith(this.inputItem.toLowerCase())).map(sensor => (sensor.nombre));
  }
}

// select highlighted item when enter is pressed or any item that is clicked
public selectItem(ind: any) {

  this.inputItem = this.filteredList[ind];
  this.listHidden = true;
  this.selectedIndex = ind;
  if(this.inputItem != '' || this.inputItem != null){
    this.sensorService.sensorSeleccionadoAjustes(this.inputItem);
  }
}

public recargarValoresVacios(){
  this.inputItem = '';
  this.listHidden = true;
  this.showError = false;
  this.selectedIndex = -1;
  this.sensorService.sensorSeleccionadoAjustes(this.inputItem);
}

// navigate through the list of items
public onKeyPress(event: any) {

  if (!this.listHidden) {
    if (event.key === 'Escape') {
      this.selectedIndex = -1;
      this.toggleListDisplay(0);
    }

    if (event.key === 'Enter') {

      this.toggleListDisplay(0);
    }
    if (event.key === 'ArrowDown') {

      this.listHidden = false;
      this.selectedIndex = (this.selectedIndex + 1) % this.filteredList.length;
      if (this.filteredList.length > 0 && !this.listHidden) {
        document.getElementsByTagName('list-item')[this.selectedIndex].scrollIntoView();
      }
    } else if (event.key === 'ArrowUp') {

      this.listHidden = false;
      if (this.selectedIndex <= 0) {
        this.selectedIndex = this.filteredList.length;
      }
      this.selectedIndex = (this.selectedIndex - 1) % this.filteredList.length;

      if (this.filteredList.length > 0 && !this.listHidden) {

        document.getElementsByTagName('list-item')[this.selectedIndex].scrollIntoView();
      }
    }
  } 
}

// show or hide the dropdown list when input is focused or moves out of focus
public toggleListDisplay(sender: number) {

  if (sender === 1) {
    // this.selectedIndex = -1;
    this.listHidden = false;
    this.getFilteredList();
  } else {
    // helps to select item by clicking
    setTimeout(() => {
      this.selectItem(this.selectedIndex);
      this.listHidden = true;
      /*if (!this.listaPacientes.includes(this.inputItem)) {
        this.showError = true;
        this.filteredList = this.listaPacientes;
      } else {
        this.showError = false;
      }*/
      if (!this.listaSensores.some(sensor => (sensor.nombre) == this.inputItem)) {
        this.showError = true;
        this.filteredList = this.listaSensores.map(sensor => (sensor.nombre));
      } else {
        this.showError = false;
      }
    }, 500);
  }
}
}
