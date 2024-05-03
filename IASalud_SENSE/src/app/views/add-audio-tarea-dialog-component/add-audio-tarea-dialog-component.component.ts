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
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-audio-tarea-dialog-component',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, MatDialogTitle, MatDialogContent, MatDialogActions, 
    MatDialogClose, CommonModule,],
  templateUrl: './add-audio-tarea-dialog-component.component.html',
  styleUrl: './add-audio-tarea-dialog-component.component.scss'
})
export class AddAudioTareaDialogComponentComponent {

  box: any;
  // AUDIO
  mediaRecorder!: MediaRecorder;
  chunks: Blob[] = [];
  recording = false;
  audioBlob: Blob = null as any as Blob;
  blobCargado: boolean = false;

  constructor(public dialogRef: MatDialogRef<AddAudioTareaDialogComponentComponent>, @Inject(MAT_DIALOG_DATA) public data: {box: Box}, 
  private boxService: BoxService, private tareaService: TareaService) { }
  
  ngOnInit() {
    this.box = this.data.box;
  }

  public cancelarCambios() {
    this.dialogRef.close();
  }

  public guardarCambios() {
    let nombre = (<HTMLInputElement>document.getElementById('nombreTarea')).value;
    let prioridad = (<HTMLInputElement>document.getElementById('prioridad')).value;

    if(nombre == "" || nombre == null || this.audioBlob == null || this.audioBlob == undefined) {  
      alert('El nombre o el audio no han sido rellenados'); 
    }else {
      this.tareaService.guardarTareaConAudioToBox(this.audioBlob, this.box.id, nombre, parseInt(prioridad));
      this.cancelarCambios();
    }
    //alert('Tarea guardada: ' + nombre + " " + prioridad + " " + tarea.audio_recordatorio);
  }




  /* 
  -------------------------------------------------------------------------------------
  AUDIO 
  -------------------------------------------------------------------------------------
  */ 
  public toggleRecording() {
    if (!this.recording) {
      this.startRecording();
    } else {
      this.stopRecording();
    }
  }

  public startRecording() {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        this.mediaRecorder = new MediaRecorder(stream);
        this.mediaRecorder.ondataavailable = event => {
          this.chunks.push(event.data);
        };
        this.mediaRecorder.onstop = () => {
          const audioBlob = new Blob(this.chunks, { type: 'audio/mp3' });
          this.audioBlob = audioBlob;
        };
        this.mediaRecorder.start();
        this.recording = true;
      })
      .catch(error => {
        console.error('Error accessing microphone:', error);
      });
  }

  public stopRecording() {
    this.blobCargado = true;
    if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
      this.mediaRecorder.stop();
      this.recording = false; // Actualizar estado de grabación
    }
  }
/* 
  -------------------------------------------------------------------------------------
  FIN AUDIO 
  -------------------------------------------------------------------------------------
  */ 
}


