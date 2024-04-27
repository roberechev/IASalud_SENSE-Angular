import { Component, Input } from '@angular/core';
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
  selector: 'app-combobox-dispositivos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './combobox-dispositivos.component.html',
  styleUrl: './combobox-dispositivos.component.scss'
})
export class ComboboxDispositivosComponent {

  listaSensoresNuevos: Sensor[] = [];
  listaSensoresEnBox: Sensor[] = [];

  constructor(private router: Router, private sensorService: SensorService, private boxService: BoxService, 
    private pacienteService: PacienteService) { }

  ngOnInit() {
    this.cargarSensores();
  }

  public cargarSensores() {
    this.sensorService.getSensores().subscribe((data: Sensor[]) => {
      let sensoresFiltrados = data.filter(sensor => sensor != null);
      this.listaSensoresNuevos = sensoresFiltrados.filter(sensor => !this.boxSeleccionado.sensores.some(boxSensor => boxSensor.id == sensor.id));
      this.listaSensoresEnBox = sensoresFiltrados.filter(sensor => this.boxSeleccionado.sensores.some(boxSensor => boxSensor.id == sensor.id));
      this.filteredList = this.listaSensoresNuevos.map(sensor => (sensor.nombre));
      this.filteredListEliminar = this.listaSensoresEnBox.map(sensor => (sensor.nombre));
    });
  }

  // Método para guardar cambios
  public aniadirSensorAlBox() {
    if (this.inputItem == "") {
      alert("No se ha seleccionado ningún sensor");
    }else {
      let id_sensor = this.listaSensoresNuevos.find(sensor => sensor.nombre == this.inputItem)!.id;
      //console.log("ID sensor: " + id_sensor);
      if (confirm("¿Estás seguro de que deseas añadir este sensor? : " + this.inputItem)) {
        this.boxService.aniadirSensorAlBox(this.boxSeleccionado.id!, id_sensor!).subscribe((data: any) => {
          console.log(data);
          // Actualiza los cambios
          this.boxService.refreshCambiosComboBox();
        });
      } else {
        this.recargarValoresVacios();
        console.log("Añadir sensor cancelado");
      }
    }
  }

  public eliminarSensorDelBox(){
    if (this.inputItemEliminar == "") {
      alert("No se ha seleccionado ningún sensor");
    }else {
      let id_sensor = this.listaSensoresEnBox.find(sensor => sensor.nombre == this.inputItemEliminar)!.id;
      //console.log("ID sensor: " + id_sensor);
      if (confirm("¿Estás seguro de que deseas eliminar este sensor? : " + this.inputItemEliminar)) {
        this.boxService.eliminarSensorDelBox(this.boxSeleccionado.id!, id_sensor!).subscribe((data: any) => {
          console.log(data);
          // Actualiza los cambios
          this.boxService.refreshCambiosComboBox();
        });
      } else {
        this.recargarValoresVaciosEliminar();
        console.log("Eliminar sensor cancelado");
      }
    }
  }

  /*
  -------------------------------------------------------------------------------------
  Filtro de búsqueda
  -------------------------------------------------------------------------------------
  */
  //@Input() list: string[] = [];
  @Input() boxSeleccionado: Box =  new Box('', [], new Paciente('','','','', new Date() , false), [], new Date(), false);
  @Input() btn_aniadir: boolean = true;
  filteredList: string[] = [];

  inputItem = '';
  listHidden = true;
  showError = false;
  selectedIndex = -1;

public getFilteredList() {

  this.listHidden = false;
  // this.selectedIndex = 0;
  if (!this.listHidden && this.inputItem !== undefined) {
    this.filteredList = this.listaSensoresNuevos.filter((sensor) => (sensor.nombre).toLowerCase().startsWith(this.inputItem.toLowerCase())).map(sensor => (sensor.nombre));
  }
}

// select highlighted item when enter is pressed or any item that is clicked
public selectItem(ind: any) {

  this.inputItem = this.filteredList[ind];
  this.listHidden = true;
  this.selectedIndex = ind;
}

public recargarValoresVacios(){
  this.inputItem = '';
  this.listHidden = true;
  this.showError = false;
  this.selectedIndex = -1;
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
      if (!this.listaSensoresNuevos.some(sensor => (sensor.nombre) == this.inputItem)) {
        this.showError = true;
        this.filteredList = this.listaSensoresNuevos.map(sensor => (sensor.nombre));
      } else {
        this.showError = false;
      }
    }, 500);
  }
}

  /*
  -------------------------------------------------------------------------------------
  FIN Filtro de búsqueda
  -------------------------------------------------------------------------------------
  */

   /*
  -------------------------------------------------------------------------------------
  Filtro de búsqueda ELIMINAR
  -------------------------------------------------------------------------------------
  */
  filteredListEliminar: string[] = [];
  
  inputItemEliminar = '';
  listHiddenEliminar = true;
  showErrorEliminar = false;
  selectedIndexEliminar = -1;

public getFilteredListEliminar() {

  this.listHiddenEliminar = false;
  // this.selectedIndex = 0;
  if (!this.listHiddenEliminar && this.inputItemEliminar !== undefined) {
    this.filteredListEliminar = this.listaSensoresEnBox.filter((sensor) => (sensor.nombre).toLowerCase().startsWith(this.inputItemEliminar.toLowerCase())).map(sensor => (sensor.nombre));
  }
}

// select highlighted item when enter is pressed or any item that is clicked
public selectItemEliminar(ind: any) {

  this.inputItemEliminar = this.filteredListEliminar[ind];
  this.listHiddenEliminar = true;
  this.selectedIndexEliminar = ind;
}

public recargarValoresVaciosEliminar(){
  this.inputItemEliminar = '';
  this.listHiddenEliminar = true;
  this.showErrorEliminar = false;
  this.selectedIndexEliminar = -1;
}

// navigate through the list of items
public onKeyPressEliminar(event: any) {

  if (!this.listHiddenEliminar) {
    if (event.key === 'Escape') {
      this.selectedIndexEliminar = -1;
      this.toggleListDisplayEliminar(0);
    }

    if (event.key === 'Enter') {

      this.toggleListDisplayEliminar(0);
    }
    if (event.key === 'ArrowDown') {

      this.listHiddenEliminar = false;
      this.selectedIndexEliminar = (this.selectedIndexEliminar + 1) % this.filteredListEliminar.length;
      if (this.filteredListEliminar.length > 0 && !this.listHiddenEliminar) {
        document.getElementsByTagName('list-item')[this.selectedIndexEliminar].scrollIntoView();
      }
    } else if (event.key === 'ArrowUp') {

      this.listHiddenEliminar = false;
      if (this.selectedIndexEliminar <= 0) {
        this.selectedIndexEliminar = this.filteredListEliminar.length;
      }
      this.selectedIndexEliminar = (this.selectedIndexEliminar - 1) % this.filteredListEliminar.length;

      if (this.filteredListEliminar.length > 0 && !this.listHiddenEliminar) {

        document.getElementsByTagName('list-item')[this.selectedIndexEliminar].scrollIntoView();
      }
    }
  } 
}

// show or hide the dropdown list when input is focused or moves out of focus
public toggleListDisplayEliminar(sender: number) {

  if (sender === 1) {
    // this.selectedIndex = -1;
    this.listHiddenEliminar = false;
    this.getFilteredListEliminar();
  } else {
    // helps to select item by clicking
    setTimeout(() => {
      this.selectItemEliminar(this.selectedIndexEliminar);
      this.listHiddenEliminar = true;
      /*if (!this.listaPacientes.includes(this.inputItem)) {
        this.showError = true;
        this.filteredList = this.listaPacientes;
      } else {
        this.showError = false;
      }*/
      if (!this.listaSensoresEnBox.some(sensor => (sensor.nombre) == this.inputItemEliminar)) {
        this.showErrorEliminar = true;
        this.filteredListEliminar = this.listaSensoresEnBox.map(sensor => (sensor.nombre));
      } else {
        this.showErrorEliminar = false;
      }
    }, 500);
  }
}

  /*
  -------------------------------------------------------------------------------------
  FIN Filtro de búsqueda ELIMINAR
  -------------------------------------------------------------------------------------
  */
}
