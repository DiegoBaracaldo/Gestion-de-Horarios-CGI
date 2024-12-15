export function CamposVacios(objeto) {
    const todosSonValidos =
        Object.values(objeto)
            .every(value => value !== '' && value !== null && value !== undefined && !Number.isNaN(value));

    return !todosSonValidos;
}

export function TextoConEspacio(texto) {
    const todosSonTextoYEspacios = typeof texto === 'string' && /^[A-Za-z\s]*$/.test(texto.trim());
    return todosSonTextoYEspacios;
}

export function TextoSinEspacio(texto) {
    const todosSonTextoSinEspacios = typeof texto === 'string' && /^[A-Za-z]*$/.test(texto);
    return todosSonTextoSinEspacios;
}

export function AlfaNumericaSinEspacio(texto) {
    const todosSonAlfaNumericaSinEspacios = typeof texto === 'string' && /^\d+$/.test(texto);
    return todosSonAlfaNumericaSinEspacios;
}

export function SoloNumeros(texto) {
    const todosSonNumeros = typeof texto === 'string' && /^[A-Za-z0-9]+$/.test(texto.trim());
    return todosSonNumeros;
}

export function EsFranjaDisponibilidad(horario){
    return Array.isArray(horario) && horario.every(item => Number.isInteger(item));
}

export function EsFecha(fecha){
    //Evalúa que sea formato fecha, y que además que exista el día.
    return fecha instanceof Date && !isNaN(fecha.getTime());
}