export function FormatearNombre(texto) {

    //Lista de preposiciones comunes
    const excepciones = ['y', 'de', 'en', 'por', 'con', 'para', 'sobre', 'entre', 'tras', 'desde', 'hasta'];

    // Eliminar espacios adicionales al inicio y al final del texto
    // Luego reemplazar múltiples espacios entre palabras por un solo espacio
    let textoFormateado = texto.trim().replace(/\s+/g, ' ');

    // Convertir la primera letra de cada palabra en mayúscula
    const listaPalabras = textoFormateado.split(' ');
    const listaPalabrasFormat = listaPalabras
        .map(palabra => {
            if (excepciones.includes(palabra)) return palabra;
            else {
                const nuevapalabra =
                    palabra.substring(0, 1).toUpperCase() + palabra.substring(1, palabra.length);
                return nuevapalabra;
            }
        });
    const textoFinal = listaPalabrasFormat.join(" ");

    //textoFormateado = textoFormateado.replace(/(?:^|\s)[a-zñÑáéíóúÁÉÍÓÚüÜA-Z]/g, letra => letra.toUpperCase());

    return textoFinal;
}
export function FormatearDescripcion(texto) {
    // Eliminar espacios adicionales al inicio y al final del texto
    // Luego reemplazar múltiples espacios entre palabras por un solo espacio
    let textoFormateado = texto.trim().replace(/\s+/g, ' ');
    textoFormateado = textoFormateado.charAt(0).toUpperCase() + textoFormateado.slice(1);

    return textoFormateado;
}
export function FormatearFecha() {
    //No es necesaria, pues se obtiene en el mismo formato de sql yyyy-mm-dd
}
export function FormatearCodigoGrupo(texto){
    return texto.toUpperCase();
}