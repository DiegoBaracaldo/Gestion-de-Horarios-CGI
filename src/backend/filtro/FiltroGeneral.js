//Se recibe el criterio a comparar según el objeto
//y tabmién la palabra a usar en la busqueda
export default function FiltroGeneral(criterio, busqueda, listaCompleta){
    let listaAux = [];
    const textoRegx = new RegExp(busqueda, 'i');
    listaCompleta.forEach(element => {
        //Se obtiene el valor según el criterio esperado, así se  vuelve dinámico
        let textoObtenido = element[criterio] ? element[criterio].toString() : '';
        if(textoObtenido.match(textoRegx)) listaAux.push(element);
    });
    return listaAux;
}