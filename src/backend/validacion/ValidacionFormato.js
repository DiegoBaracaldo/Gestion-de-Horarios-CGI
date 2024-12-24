export function CamposVacios(objeto) {
    const todosSonValidos =
        Object.values(objeto)
            .every(value => value !== '' && value !== null
                && value !== undefined && !Number.isNaN(value));

    return !todosSonValidos;
}

export function TextoConEspacio(texto) {
    const todosSonTextoYEspacios = typeof texto === 'string' && /^[A-Za-zñÑáéíóúÁÉÍÓÚüÜ\s]*$/.test(texto);
    return todosSonTextoYEspacios;
}

export function TextoSinEspacio(texto) {
    const todosSonTextoSinEspacios = typeof texto === 'string' && /^[A-Za-zñÑáéíóúÁÉÍÓÚüÜ]*$/.test(texto);
    return todosSonTextoSinEspacios;
}

export function SoloNumeros(texto) {
    const todosSonAlfaNumericaSinEspacios = /^\d+$/.test(texto) && texto > 0;
    return todosSonAlfaNumericaSinEspacios;
}

export function AlfaNumericaSinEspacio(texto) {
    const todosSonNumeros = typeof texto === 'string' && /^[A-ZñÑáéíóúÁÉÍÓÚüÜa-z0-9]+$/.test(texto);
    return todosSonNumeros;
}

export function AlfaNumericaConEspacio(texto) {
    const todosSonNumeros = typeof texto === 'string' && /^[A-ZñÑáéíóúÁÉÍÓÚüÜa-z\s0-9]+$/.test(texto);
    return todosSonNumeros;
}

export function EsFranjaDisponibilidad(horario) {
    return Array.isArray(horario) && horario.every(item => Number.isInteger(item));
}

export function EsFecha(fecha) {
    //Evalúa que sea formato fecha, y que además que exista el día.
    return fecha instanceof Date && !isNaN(fecha.getTime());
}

export function EsCorreo(correo) {
    const regex = /^[a-zñÑA-Z0-9._%+-]+@[a-zñÑA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(correo);
}

export function EsTelefono(telefono){
    const regex = /^\+?\d{7,}$/;
    return regex.test(telefono);
}