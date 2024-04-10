export class Registro {
    id ?: number;
    valor: string;
    unidades: string;
    created_at: Date;

    constructor(valor: string, unidades: string, created_at: Date) {
        this.valor = valor;
        this.unidades = unidades;
        this.created_at = created_at;
    }
}
