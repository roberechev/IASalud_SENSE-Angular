export class Paciente {
    id ?: number;
    numero_historia: string;
    created_at: Date;
    eliminado: boolean;

    constructor(numero_historia: string, created_at: Date, eliminado: boolean) {
        this.numero_historia = numero_historia;
        this.created_at = created_at;
        this.eliminado = eliminado;
    }
}
