// Aqui sobrecreve o caminho padrão dos @types
// na node_modules.
// O código abaixo mantém os métodos padrão do request,
// mas faz com que ele entenda o user_id como que fizesse parte
// do padrão
declare namespace Express {
    export interface Request {
        user_id: string;
        type: string;
    }
}