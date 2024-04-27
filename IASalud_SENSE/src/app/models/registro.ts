export class Registro {
    id ?: number;
    valor: string;
    unidades: string;
    tipo: string;
    created_at: Date;

   constructor(valor: string, unidades: string, tipo: string, created_at: Date) {
         this.valor = valor;
         this.unidades = unidades;
         this.tipo = tipo;
         this.created_at = created_at;
    }
}
