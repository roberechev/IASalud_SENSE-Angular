import { Registro } from "./registro";

export class Sensor {
    id ?: number;
    id_dispositivo_th: string;
    nombre: string;
    tipo: string;
    registros: Registro[];
    ultimo_registro: Date;
    created_at: Date;
    eliminado: boolean;

    constructor(id_dispositivo_th: string, nombre: string, tipo: string, registros: Registro[], ultimo_registro: Date, created_at: Date, eliminado: boolean) {
        this.id_dispositivo_th = id_dispositivo_th;
        this.nombre = nombre;
        this.tipo = tipo;
        this.registros = registros;
        this.ultimo_registro = ultimo_registro;
        this.created_at = created_at;
        this.eliminado = eliminado;

    }
}