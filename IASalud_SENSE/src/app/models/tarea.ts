export class Tarea {
    id ?: number;
    nombre: string;
    prioridad: number;
    audio_recordatorio: File | null;
    ultimo_registro: Date;
    created_at: Date;
    eliminado: boolean;

    constructor(nombre: string, prioridad: number, audio_recordatorio: File | null, ultimo_registro: Date, created_at: Date, eliminado: boolean) {
        this.nombre = nombre;
        this.prioridad = prioridad;
        this.audio_recordatorio = audio_recordatorio;
        this.ultimo_registro = ultimo_registro;
        this.created_at = created_at;
        this.eliminado = eliminado;
    }
}
