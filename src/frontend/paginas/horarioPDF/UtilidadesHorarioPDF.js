export function FranjasContiguasVerticales(franjas) {
    console.log(franjas);
    const arraySubBloques = [];
    let acumuladorAux = [];

    if(franjas.length <= 1){
        arraySubBloques.push([franjas]);
    }else{
        franjas.forEach((franja, index) => {
            if (acumuladorAux.length <= 0) {
                acumuladorAux.push(franja);
            } else {
                if (franja - acumuladorAux[acumuladorAux.length - 1] <= 7) {
                    acumuladorAux.push(franja);
                    //Se mantiene contiguidad vertical
                    //// Si es la última franja y no se ha perdido continuidad
                    if (index >= franjas.length - 1) {
                        arraySubBloques.push(acumuladorAux);
                    }
                } else {
                    //Se pierde contiguidad vertical
                    arraySubBloques.push([...acumuladorAux]);
                    acumuladorAux = [franja];
                    //// Si es la última franja, para que no se pierda
                    if (index >= franjas.length - 1) {
                        arraySubBloques.push([franja]);
                    }
                }
            }
        });
    }
    console.log(arraySubBloques);
    return arraySubBloques;
}

export function GetHoraInicioHoraFin(arrayFranjas) {
    // console.log(arrayFranjas);
    //El array de franjas debe ser contiguo vericalmente
    const [indexFilaMenor, indexColumnaMenor] = GetMatrizIndexFromValue( Math.min(...arrayFranjas));
    const [indexFilaMayor, indexColumnaMayor] =  GetMatrizIndexFromValue( Math.max(...arrayFranjas));
    return [HoraMilitarStartFranja(indexFilaMenor), HoraMilitarEndFranja(indexFilaMayor)];
}

export function GetDiaCorrespondiente(franja) {
    //Se averigua el día según la franja dada (puede ser cualquiera del sub bloque)y se retorna en string
    const [i, j] = GetMatrizIndexFromValue(franja);
    let dia = '';
    switch (j) {
        case 0:
            dia = 'lunes';
            break;
        case 1:
            dia = 'martes';
            break;
        case 2:
            dia = 'miercoles';
            break;
        case 3:
            dia = 'jueves';
            break;
        case 4:
            dia = 'viernes';
            break;
        case 5:
            dia = 'sabado'
            break;
        case 6:
            dia = 'domingo'
            break;
        default:
            dia = '';
            break;
    }
    return dia;
}

export function GetBloquesPorDia(franjas){
    const objAuxDias = {
        lunes :[],
        martes: [],
        miercoles: [],
        jueves :[],
        viernes: [],
        sabado: [],
        domingo: []
    }
    franjas.forEach(franja => {
        const [fila, columna] = GetMatrizIndexFromValue(franja);
        switch (columna) {
            case 0:
                objAuxDias.lunes.push(franja);
                break;
            case 1:
                objAuxDias.martes.push(franja);
                break;
            case 2:
                objAuxDias.miercoles.push(franja);
                break;
            case 3:
                objAuxDias.jueves.push(franja);
                break;
            case 4:
                objAuxDias.viernes.push(franja);
                break;
            case 5:
                objAuxDias.sabado.push(franja);
                break;
            case 6:
                objAuxDias.domingo.push(franja);
                break;
        
            default:
                break;
        }
    });
    return objAuxDias;
}

function GetMatrizIndexFromValue(valor) {
    //primero calculamos i
    const iCrudo = valor / 7;
    const residuo = valor % 7;
    //para entender la siguiente fórmula, ver formula inversa de franja a índice en matriz
    const iReal = residuo === 0 ? iCrudo - 1 : Math.trunc(iCrudo);
    const jReal = valor - 1 - (7 * iReal);
    return [iReal, jReal];
}

function HoraMilitarStartFranja(indiceFila) {
    const cantidadMinutos = indiceFila * 30;
    const horas = String(Math.floor(cantidadMinutos / 60)).padStart(2, '0');
    const minutos = String(cantidadMinutos % 60).padStart(2, '0');
    return `${horas}${minutos}`;
}

function HoraMilitarEndFranja(indiceFila) {
    const cantidadMinutos = (indiceFila * 30) + 30;
    const horas = String(Math.floor(cantidadMinutos / 60)).padStart(2, '0');
    //const horas = String(Math.floor(cantidadMinutos / 60)).padStart(2, '0');
    const minutos = String(cantidadMinutos % 60).padStart(2, '0');
    return `${horas}${minutos}`;
}

