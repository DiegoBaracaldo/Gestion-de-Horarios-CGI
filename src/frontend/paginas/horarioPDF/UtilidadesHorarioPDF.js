export function FranjasContiguasVerticales(franjas) {

    const arraySubBloques = [];

    let acumuladorAux = [];
    franjas.forEach((franja, index) => {
        if (acumuladorAux.length <= 0) {
            acumuladorAux.push(franja);
        } else {
            if (franja - acumuladorAux[acumuladorAux.length - 1] <= 7) {
                //Se mantiene contiguidad vertical
                acumuladorAux.push(franja);
            } else {
                //Se pierde contiguidad vertical
                arraySubBloques.push(acumuladorAux);
                acumuladorAux = [];
                //// Si es la última franja, para que no se pierda
                if (index >= franjas.length - 1) {
                    arraySubBloques.push([franja]);
                }
            }
        }
    });

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

function GetMatrizIndexFromValue(valor) {
    //primero calculamos i
    const iCrudo = valor / 7;
    const residuo = valor % 7;
    //para entender la siguiente fórmula, ver formula inversa de franja a índice en matriz
    const iReal = residuo === 0 ? iCrudo - 1 : Math.trunc(iCrudo);
    const jReal = valor - 1 - (7 * iReal);
    return [iReal, jReal];
}

function HoraMilitarEndFranja(indiceFila) {
    const cantidadMinutos = indiceFila * 30;
    const horas = String(Math.floor(cantidadMinutos / 60)).padStart(2, '0');
    //const horas = String(Math.floor(cantidadMinutos / 60)).padStart(2, '0');
    const minutos = String(cantidadMinutos % 60).padStart(2, '0');
    return `${horas}${minutos}`;
}

function HoraMilitarStartFranja(indiceFila) {
    const cantidadMinutos = (indiceFila * 30) - 30;
    const horas = String(Math.floor(cantidadMinutos / 60)).padStart(2, '0');
    const minutos = String(cantidadMinutos % 60).padStart(2, '0');
    return `${horas}${minutos}`;
}
