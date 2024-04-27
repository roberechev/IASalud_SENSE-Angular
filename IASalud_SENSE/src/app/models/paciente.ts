export class Paciente {
    id ?: number;
    numero_historia: string;
    nombre: string;
    genero: string;
    edad: string;
    created_at: Date;
    eliminado: boolean;

    constructor(numero_historia: string, nombre: string, genero: string, edad: string, created_at: Date, eliminado: boolean) {
        this.numero_historia = numero_historia;
        this.nombre = nombre;
        this.genero = genero;
        this.edad = edad;
        this.created_at = created_at;
        this.eliminado = eliminado;
    }
}
