export function FormatearNombre(texto) {
    // Eliminar espacios adicionales al inicio y al final del texto
    // Luego reemplazar múltiples espacios entre palabras por un solo espacio
    let textoFormateado = texto.trim().replace(/\s+/g, ' ');

    // Convertir la primera letra de cada palabra en mayúscula
    textoFormateado = textoFormateado.replace(/(?:^|\s)[a-zñÑáéíóúÁÉÍÓÚüÜA-Z]/g, letra => letra.toUpperCase());

    return textoFormateado;
}
export function FormatearDescripcion(texto) {
    // Eliminar espacios adicionales al inicio y al final del texto
    // Luego reemplazar múltiples espacios entre palabras por un solo espacio
    let textoFormateado = texto.trim().replace(/\s+/g, ' ');

    return textoFormateado;
}
export function FormatearFecha(){
    //No es necesaria, pues se obtiene en el mismo formato de sql yyyy-mm-dd
}