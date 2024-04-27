import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PacienteService } from '../../services/paciente.service';
import { Router } from '@angular/router';
import { BoxService } from '../../services/box.service';
import { Box } from '../../models/box';

@Component({
  selector: 'app-combobox-boxes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './combobox-boxes.component.html',
  styleUrl: './combobox-boxes.component.scss'
})
export class ComboboxBoxesComponent {

  listaBoxes: Box[] = [];
  @Input() actualizar: boolean = false;

  constructor(private router: Router, private boxService: BoxService) { }

  ngOnInit() {
    this.cargarBoxes();
    //this.filteredList = this.list;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['actualizar'] && changes['actualizar'].currentValue) {
      console.log('El componente se está refrescando...');
      this.recargarValoresVacios();
      this.cargarBoxes();
    }
  }

  

  public cargarBoxes() {
    this.boxService.getBoxes().subscribe((data: Box[]) => {
      this.listaBoxes = data.filter(box => box != null);
      this.filteredList = this.listaBoxes.map(box => box.nombre);
    });
  }



  /*
  -------------------------------------------------------------------------------------
  Filtro de búsqueda
  -------------------------------------------------------------------------------------
  */

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
  this.boxService.boxSeleccionadoAjustes(this.inputItem);
}

public getFilteredList() {

  this.listHidden = false;
  // this.selectedIndex = 0;
  if (!this.listHidden && this.inputItem !== undefined) {
    this.filteredList = this.listaBoxes.filter((box) => box.nombre.toLowerCase().startsWith(this.inputItem.toLowerCase())).map(box => box.nombre);
  }
}

// select highlighted item when enter is pressed or any item that is clicked
public selectItem(ind: any) {

  this.inputItem = this.filteredList[ind];
  this.listHidden = true;
  this.selectedIndex = ind;
  if(this.inputItem != '' || this.inputItem != null){
    this.boxService.boxSeleccionadoAjustes(this.inputItem);
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
      if (!this.listaBoxes.some(box => box.nombre == this.inputItem)) {
        this.showError = true;
        this.filteredList = this.listaBoxes.map(box => box.nombre);
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
