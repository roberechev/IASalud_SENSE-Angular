import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Box } from '../../models/box';
import {MatDialog,MatDialogRef, MatDialogTitle, MatDialogContent,MatDialogActions,MatDialogClose} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { Tarea } from '../../models/tarea';
import { BoxService } from '../../services/box.service';
import { TareaService } from '../../services/tarea.service';

@Component({
  selector: 'app-add-tarea-dialog-component',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, MatDialogTitle, MatDialogContent, MatDialogActions, 
    MatDialogClose,],
  templateUrl: './add-tarea-dialog-component.component.html',
  styleUrl: './add-tarea-dialog-component.component.scss'
})
export class AddTareaDialogComponentComponent {

  box: any;
  constructor(public dialogRef: MatDialogRef<AddTareaDialogComponentComponent>, @Inject(MAT_DIALOG_DATA) public data: {box: Box}, 
  private boxService: BoxService, private tareaService: TareaService) { }
  
  ngOnInit() {
    this.box = this.data.box;
  }

  public cancelarCambios() {
    this.dialogRef.close();
  }

  public guardarCambios() {
    let tarea : Tarea = new Tarea("", 3, null, new Date(), new Date(), false);
    let nombre = (<HTMLInputElement>document.getElementById('nombreTarea')).value;
    let prioridad = (<HTMLInputElement>document.getElementById('prioridad')).value;
    tarea.nombre = nombre;
    tarea.prioridad = parseInt(prioridad);
    console.log("---nombre:" + nombre);

    if(tarea.nombre === "" || tarea.nombre == null || tarea.nombre == "" || nombre.trim().length === 0) {  
      alert('El nombre de la tarea no puede estar vacío'); 
    }else {
      this.tareaService.addTareaSinAudioToBox(this.box.id, tarea);
      this.cancelarCambios();
    }
    //alert('Tarea guardada: ' + nombre + " " + prioridad + " " + tarea.audio_recordatorio);
  }

}