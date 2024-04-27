import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PacienteService } from '../../services/paciente.service';
import { Paciente } from '../../models/paciente';
import { Router } from '@angular/router';
import { BoxService } from '../../services/box.service';


@Component({
  selector: 'app-combobox-pacientes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './combobox-pacientes.component.html',
  styleUrl: './combobox-pacientes.component.scss'
})
export class ComboboxPacientesComponent implements OnChanges {


  constructor(private pacienteService: PacienteService, private router: Router, private boxService: BoxService) { }

  ngOnInit() {
    this.cargarPacientes();
    //this.filteredList = this.list;
  }

  @Input() actualizar: boolean = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['actualizar'] && changes['actualizar'].currentValue) {
      console.log('El componente se está refrescando...');
      this.recargarValoresVacios();
      this.cargarPacientes();
    }
  }


public cargarPacientes() {
  this.pacienteService.getPacientes().subscribe((data: Paciente[]) => {
    this.listaPacientes = data.filter(paciente => paciente != null);
    this.filteredList = this.listaPacientes.map(paciente => paciente.numero_historia);
  });
}
// Método para guardar cambios
public guardarCambiosNuevoPaciente() {
if (this.inputItem == "") {
  alert("No se ha seleccionado ningún paciente");
}else {
  let id_paciente = this.listaPacientes.find(paciente => paciente.numero_historia == this.inputItem)!.id;
  if (confirm("¿Estás seguro de que deseas cambiar el paciente?")) {
    this.pacienteService.cambiarPacienteBox(this.id_boxSeleccionado, id_paciente!).subscribe((data: any) => {
      console.log(data);
      this.boxService.refreshCambiosComboBox();
    });
  } else {
    this.recargarValoresVacios();
    console.log("Cambio de paciente cancelado");
  }
}
 
}


 /*
  -------------------------------------------------------------------------------------
  Filtro de búsqueda
  -------------------------------------------------------------------------------------
  */
  //@Input() list: string[] = [];
  @Input() id_boxSeleccionado: number = 0;
  @Input() ajustes: boolean = false;
  listaPacientes: Paciente[] = [];
  filteredList: string[] = [];

  inputItem = '';
  listHidden = true;
  showError = false;
  selectedIndex = -1;

public recargarValoresVacios(){
  this.inputItem = '';
  this.listHidden = true;
  this.showError = false;
  this.selectedIndex = -1;
  if(this.ajustes){
    this.pacienteService.pacienteSeleccionadoAjustes(this.inputItem);
  }
}

public getFilteredList() {

  this.listHidden = false;
  // this.selectedIndex = 0;
  if (!this.listHidden && this.inputItem !== undefined) {
    this.filteredList = this.listaPacientes.filter((paciente) => paciente.numero_historia.toLowerCase().startsWith(this.inputItem.toLowerCase())).map(paciente => paciente.numero_historia);
  }
}

// select highlighted item when enter is pressed or any item that is clicked
public selectItem(ind: any) {

  this.inputItem = this.filteredList[ind];
  this.listHidden = true;
  this.selectedIndex = ind;
  if(this.inputItem != '' || this.inputItem != null){
    if(this.ajustes){
      this.pacienteService.pacienteSeleccionadoAjustes(this.inputItem);
    }
  }
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
      if (!this.listaPacientes.some(paciente => paciente.numero_historia == this.inputItem)) {
        this.showError = true;
        this.filteredList = this.listaPacientes.map(paciente => paciente.numero_historia);
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
}
