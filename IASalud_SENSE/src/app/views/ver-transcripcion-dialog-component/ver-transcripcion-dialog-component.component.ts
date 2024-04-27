import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Box } from '../../models/box';
import {MatDialog, MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';

@Component({
  selector: 'app-ver-transcripcion-dialog-component',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, MatDialogTitle, MatDialogContent, MatDialogActions, 
    MatDialogClose,],
  templateUrl: './ver-transcripcion-dialog-component.component.html',
  styleUrl: './ver-transcripcion-dialog-component.component.scss'
})
export class VerTranscripcionDialogComponentComponent {
  transcripcion: string = "";

  constructor(public dialogRef: MatDialogRef<VerTranscripcionDialogComponentComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: {transcripcion: string} ) { }
  
  ngOnInit() {
    this.transcripcion = this.data.transcripcion;
  }

  public salir() {
    this.dialogRef.close();
  }
}
