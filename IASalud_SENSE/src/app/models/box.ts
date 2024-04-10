import { Paciente } from "./paciente";
import { Sensor } from "./sensor";
import { Tarea } from "./tarea";

export class Box {
    id ?: number;
    nombre: string;
    sensores: Sensor[];
    paciente: Paciente;
    tareas: Tarea[];
    created_at: Date;
    eliminado: boolean;

    constructor(nombre: string, sensores: Sensor[], paciente: Paciente, tareas: Tarea[], created_at: Date, eliminado: boolean) {
        this.nombre = nombre;
        this.sensores = sensores;
        this.paciente = paciente;
        this.tareas = tareas;
        this.created_at = created_at;
        this.eliminado = eliminado;

    }
}
