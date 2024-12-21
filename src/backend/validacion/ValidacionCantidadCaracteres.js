export function HastaDos(texto){
    return texto.toString().trim().length <= 2;
}
export function HastaTres(texto){
    return texto.toString().trim().length <= 3;
}
export function HastaVeintiCinco(texto){
    return texto.toString().trim().length <= 25;
}
export function HastaCincuenta(texto){
    return texto.toString().trim().length <= 50;
}
export function HastaCien(texto){
    return texto.toString().trim().length <= 100;
}
export function HastaDoscientosCuarentaYNueve(texto){
    return texto.toString().trim().length <= 249;
}