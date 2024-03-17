export class Hospital {
    id ?: number;
    nombre: string;
    direccion: string;
    numBoxes: number;

    constructor(nombre: string, direccion: string, numBoxes: number) {
        this.nombre = nombre;
        this.direccion = direccion;
        this.numBoxes = numBoxes;
    }
}
