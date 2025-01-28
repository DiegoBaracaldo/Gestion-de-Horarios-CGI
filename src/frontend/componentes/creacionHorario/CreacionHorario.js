import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import BotonDispHoraria from '../botonDIspHoraria/BotonDispHoraria';
import './CreacionHorario.css';
import Swal from 'sweetalert2';
import InstructorServicio from '../../../backend/repository/servicios/InstructorService';
import AmbienteServicio from '../../../backend/repository/servicios/AmbienteService';
import FranjaHoraria from '../franjaHoraria/FranjaHoraria';
import CrudInstructores from '../../paginas/crudInstructores/CrudInstructores';
import CrudAmbientes from '../../paginas/crudAmbientes/CrudAmbientes';

const CreacionHorario = ({ competencia, bloque, bloqueNumero,
    ocupanciaJornada, ocupanciaBloques, tipoJornada, bloqueDevuelto, esPrimeraCargaBloque,
    devolverFalsePrimeraCarga, devolverTotalHorasBloques, totalHorasTomadasComp, listaCompleta,
    indexProgramaSelecc, indexGrupoSelecc, indexCompetenciaSelecc, indexBloqueSelecc,
    actualizarListaCompleta, setPintandoCelda
}) => {


    //Manejo de bloques
    const [instructorBloque, setInstructorBloque] = useState({});
    const [ambienteBloque, setAmbienteBloque] = useState({});
    const [franjaAgregada, setFranjaAgregada] = useState(0);
    const [franjaBorrada, setFranjaBorrada] = useState(0);
    const franjasLibres = useRef(new Set(Array.from({ length: 336 }, (_, i) => i + 1)));

    useLayoutEffect(() => {
        if (esPrimeraCargaBloque) {
            setInstructorBloque(bloque.instructor);
            setAmbienteBloque(bloque.ambiente);
            //Vuelo a ponerle en false
            if (typeof devolverFalsePrimeraCarga === 'function') devolverFalsePrimeraCarga();
        }
    }, [esPrimeraCargaBloque, bloque]);

    //Matriz para generar la matriz visual del horario
    const [matrizHorario, setMatrizHorario] = useState(
        new Array(48).fill(null).map((valorFila, i) => {
            const arrayAux = [];
            for (let j = 0; j < 7; j++) {
                const objAux = {};
                objAux.valor = (7 * i) + j + 1;
                //Los colores pueden ser white, red and green
                objAux.colorCelda = 'white'
                arrayAux.push(objAux);
            }
            return arrayAux;
        })
    );

    //******************************************************************************************//
    //**********     ENVIANDO DE VUELTA EL BLOQUE CON NUEVOS DATOS     ***************//

    useEffect(() => {
        if (franjaAgregada > 0) {
            const listaCombAux = [...listaCompleta];
            //Si se está editando un bloque VACÍo
            if (bloque.franjas.size <= 0) {
                //Se crea subLista que elimina los primeros 336 índices para una búsqueda más rápida
                //// del bloque vacío en la lista
                const subListaBloquesPers = listaCombAux[indexProgramaSelecc].grupos[indexGrupoSelecc]
                    .franjasPersonalizadas.slice(337);
                //Se busca el objeto vacío que coincida en numBloque y competencia
                const indexObj = subListaBloquesPers
                    .findIndex(franjaEncontrada => franjaEncontrada.numBloque === bloque.numBloque
                        && franjaEncontrada.idCompetencia === competencia.id
                    );
                const objIndex = subListaBloquesPers[indexObj];
                //Agrego el objeto a la franja
                listaCombAux[indexProgramaSelecc]
                    .grupos[indexGrupoSelecc].franjasPersonalizadas[franjaAgregada] = objIndex;
                //Elimino el objeto de BLOQUES VACÍOS
                listaCombAux[indexProgramaSelecc]
                    .grupos[indexGrupoSelecc].franjasPersonalizadas.splice(indexObj + 337, 1);
                //Notifico que estoy pintando celda
                if (typeof setPintandoCelda === 'function') setPintandoCelda();
                //Actualizo la listaCompleta
                if (typeof actualizarListaCompleta === 'function') actualizarListaCompleta(listaCombAux);
                setFranjaAgregada(0);
            }
            //Si se está editando uno LLENO o PARCIAL
            else {
                //Se busca el index del primer objeto que coincida en numBloque y idCompetencia
                const indexObj = listaCombAux[indexProgramaSelecc].grupos[indexGrupoSelecc]
                    .franjasPersonalizadas.findIndex(franjaEncontrada =>
                        franjaEncontrada?.numBloque === bloque.numBloque
                        && franjaEncontrada?.idCompetencia === competencia.id
                    );
                //Se obtiene ese obj farnja personalizada para ser enviado al nuevo index
                const objIndex = listaCombAux[indexProgramaSelecc].grupos[indexGrupoSelecc]
                    .franjasPersonalizadas[indexObj];
                //Agrego el objeto a la franja
                listaCombAux[indexProgramaSelecc]
                    .grupos[indexGrupoSelecc].franjasPersonalizadas[franjaAgregada] = objIndex;
                //Notifico que estoy pintando celda
                if (typeof setPintandoCelda === 'function') setPintandoCelda();
                //Actualizo la listaCompleta
                if (typeof actualizarListaCompleta === 'function') actualizarListaCompleta(listaCombAux);
                setFranjaAgregada(0);
            }
        }
    }, [franjaAgregada]);

    useEffect(() => {
        if (franjaBorrada > 0) {
            const listaCombAux = [...listaCompleta];
            const objFranjaABorrar = {
                ...listaCombAux[indexProgramaSelecc].grupos[indexGrupoSelecc]
                .franjasPersonalizadas[franjaBorrada]
            };
            listaCombAux[indexProgramaSelecc].grupos[indexGrupoSelecc]
                .franjasPersonalizadas[franjaBorrada] = undefined;
            //Verifica si era la última, y si si, obtenerla para enviarla después del 336
            const subListaComb = listaCombAux[indexProgramaSelecc].grupos[indexGrupoSelecc]
                .franjasPersonalizadas.slice(0, 336); //Objetos solo antes del 336
                //Así se evita que se hallen coincidencias desués del 336
            const aunQuedan = subListaComb.some(franjaEncontrada =>
                    franjaEncontrada?.numBloque === bloque.numBloque
                    && franjaEncontrada?.idCompetencia === competencia.id
                );
            console.log(aunQuedan);
            console.log(objFranjaABorrar);
            //Si ya no quedan, lo mando después del 336
            if (!aunQuedan) {
                const ultimoIndice = listaCombAux[indexProgramaSelecc].grupos[indexGrupoSelecc]
                    .franjasPersonalizadas.length > 0 ?
                    listaCombAux[indexProgramaSelecc].grupos[indexGrupoSelecc]
                        .franjasPersonalizadas.length - 1
                    : 0;
                if (ultimoIndice <= 336) {
                    listaCombAux[indexProgramaSelecc]
                        .grupos[indexGrupoSelecc]
                        .franjasPersonalizadas[337] = objFranjaABorrar;
                } else {
                    listaCombAux[indexProgramaSelecc]
                        .grupos[indexGrupoSelecc]
                        .franjasPersonalizadas[ultimoIndice + 1] = objFranjaABorrar;
                }
            }
            //Notifico que estoy pintando celda
            if (typeof setPintandoCelda === 'function') setPintandoCelda();
            //Actualizo la listaCompleta
            if (typeof actualizarListaCompleta === 'function') actualizarListaCompleta(listaCombAux);
            setFranjaBorrada(0);
        }
    }, [franjaBorrada]);

    useEffect(() => {
        // console.log(instructorBloque);
        if (typeof bloqueDevuelto === 'function' && !esPrimeraCargaBloque
            && Object.values(bloque).length > 0) {
            const bloqueAux = {
                ...bloque,
                instructor: instructorBloque
            }
            bloqueDevuelto(bloqueAux);
        }
    }, [instructorBloque]);

    useEffect(() => {
        if (typeof bloqueDevuelto === 'function' && !esPrimeraCargaBloque
            && Object.values(bloque).length > 0) {
            const bloqueAux = {
                ...bloque,
                ambiente: ambienteBloque
            }
            bloqueDevuelto(bloqueAux);
        }
    }, [ambienteBloque]);
    //******************************************************************************************//
    //******************************************************************************************//

    //******************************************************************************************//
    //********** SECCIÓN PARA MANEJAR PINTADA DE CELDAS Y RECOLECCIÓN DE FRANJAS ***************//

    const [arrastrandoVerde, setArrastrandoVerde] = useState(false);
    const [arrastrandoBlanco, setArrastrandoBlanco] = useState(false);
    const [valorArrastre, setValorArrastre] = useState(0);

    //Para clic individual sin arrastre
    const ManejarClickFranja = (valor, color) => {
        if (color === 'white' && totalHorasTomadasComp < competencia.horasRequeridas) {
            setFranjaAgregada(valor);
        } else if (color === 'green') {
            setFranjaBorrada(valor);
        }
    }

    const ManejarClickDownFranja = (colorPintado) => {
        setInstructorBloque({});
        setAmbienteBloque({});
        if (colorPintado === 'white') setArrastrandoVerde(true);
        else if (colorPintado === 'green') setArrastrandoBlanco(true);
    }

    const ManejarArrastreFranjas = (valor) => {
        if (valorArrastre !== valor) {
            setValorArrastre(valor);
        }
    }

    //Recibiendo todos los datos de la celda arrastrada
    useEffect(() => {
        if (valorArrastre >= 0) {
            // console.log(datosFranjaArrastre);
            if (arrastrandoBlanco) {
                setFranjaBorrada(valorArrastre);
            } else if (arrastrandoVerde && totalHorasTomadasComp < competencia.horasRequeridas) {
                setFranjaAgregada(valorArrastre);
            }
        }
    }, [valorArrastre]);

    const ManejarClickUpFranja = () => {
        setArrastrandoVerde(false);
        setArrastrandoBlanco(false);
        setValorArrastre(0);
    }

    //******************************************************************************************//
    //******************************************************************************************//


    function PintarFranjas(verdes, blancas, rojas, grises) {
        //algortimo para entrar de una vez al índice y cambiarlo
        ////en lugar de recorrer todo el array buscando la coincidencia
        const auxMatriz = [...matrizHorario];
        //    console.log("vamoa pintar...");
        verdes.forEach(franja => {
            const indexMatriz = GetMatrizIndexFromValue(franja);
            const iAux = indexMatriz[0];
            const jAux = indexMatriz[1];
            auxMatriz[iAux][jAux].colorCelda = 'green';
        });
        blancas.forEach(franja => {
            const indexMatriz = GetMatrizIndexFromValue(franja);
            const iAux = indexMatriz[0];
            const jAux = indexMatriz[1];
            auxMatriz[iAux][jAux].colorCelda = 'white';
        });
        rojas.forEach(franja => {
            const indexMatriz = GetMatrizIndexFromValue(franja);
            const iAux = indexMatriz[0];
            const jAux = indexMatriz[1];
            auxMatriz[iAux][jAux].colorCelda = 'red';
        });
        grises.forEach(franja => {
            const indexMatriz = GetMatrizIndexFromValue(franja);
            const iAux = indexMatriz[0];
            const jAux = indexMatriz[1];
            auxMatriz[iAux][jAux].colorCelda = 'gray';
        });
        setMatrizHorario([...auxMatriz]);
    }

    //Generar variables para primera columna de la matriz que indica el rango horario
    function GetRango(indice) {
        const cantidadMinutos = indice * 30;
        const desdeHora = String(Math.floor(cantidadMinutos / 60)).padStart(2, '0');
        const desdeMinutos = String(cantidadMinutos % 60).padStart(2, '0');
        const hastaHora = String(Math.floor((cantidadMinutos + 30) / 60)).padStart(2, '0');
        const hastaMinutos = String((cantidadMinutos + 30) % 60).padStart(2, '0');
        return `${desdeHora}:${desdeMinutos} - ${hastaHora}:${hastaMinutos}`;
    }

    //CADA QUE CAMBIA EL BLOQUE o se modifica el actual
    useLayoutEffect(() => {
        // console.log(bloque);
        if (bloque && Object.values(bloque).length > 0) {
            // console.log(bloque);
            //Se pintan las celdas de su color correspondiente pero se obtienen
            ///primero las libres para completar las 4 (verdes, blancas, rojas, grises)
            const auxFranjasLibres = new Set(franjasLibres.current);
            ocupanciaJornada.forEach(franja => auxFranjasLibres.delete(franja));
            bloque?.franjas?.forEach(franja => auxFranjasLibres.delete(franja));
            //Se acomoda la ocupancia para el bloque actual
            const ocupanciaNueva = new Set(ocupanciaBloques);
            bloque.franjas.forEach(franja => ocupanciaNueva.delete(franja));
            ocupanciaNueva.forEach(franja => auxFranjasLibres.delete(franja));
            PintarFranjas(bloque.franjas, auxFranjasLibres, ocupanciaJornada, ocupanciaNueva);
        }
    }, [bloque]);

    function GetMatrizIndexFromValue(valor) {
        // (Convertir bloque en índice de celda)
        //primero calculamos i
        const iCrudo = valor / 7;
        const residuo = valor % 7;
        //para entender la siguiente fórmula, ver formula inversa de franja a índice en matriz
        const iReal = residuo === 0 ? iCrudo - 1 : Math.trunc(iCrudo);
        const jReal = valor - 1 - (7 * iReal);
        return [iReal, jReal];
    }


    //******************************************************************************************//
    //************************* ÁREA DE SELECCIÓN DE AMBIENTE E INSTRUCTOR *********************//

    const [openListaInstructores, setOpenListaInstructores] = useState(false);
    const [openListaAmbientes, setOpenListaAmbientes] = useState(false);


    //******************************************************************************************//
    //******************************************************************************************//

    return (
        <div id="contCreacionHorarioVista">
            <div className='descripcionCompetenciaSelecc'>
                <h3>competencia {competencia && competencia.id}</h3>
                <label className='etDescrip'>Descripción:</label>
                <div className='parteAbajoDescripCompet'>
                    <textarea disabled value={competencia && competencia.descripcion} />
                    <div className='divisionIzq'>
                        <label>
                            <span className='datoDinamico'>{tipoJornada}</span>
                        </label>
                        <label>Bloque: <span className='datoDinamico'>
                            {typeof bloqueNumero === 'number' && bloqueNumero > 0 ? bloqueNumero : '?'}
                        </span>
                        </label>
                        <label style={{
                            color: totalHorasTomadasComp === competencia.horasRequeridas ?
                                '#39A900' : '#DC3545 '
                        }}>
                            Horas: <span className='datoDinamico'>
                                {totalHorasTomadasComp}
                                {" / "}
                                {
                                    competencia.horasRequeridas
                                }
                            </span>
                        </label>
                    </div>
                </div>
            </div>
            {
                bloque && Object.values(bloque).length > 0 ?
                    <div className='seleccInstrucAmbienteCompSelecc'>
                        <button className={bloque.franjas.size <= 0 ?
                            'seleccInstructorBtn btnOff'
                            : 'seleccInstructorBtn'}
                            style={{ backgroundColor: Object.values(instructorBloque).length > 0 ? '#39A900' : '#385C57' }}
                            onClick={() => setOpenListaInstructores(true)}>
                            {instructorBloque && Object.values(instructorBloque).length > 0 ?
                                `${instructorBloque.nombre}`
                                : 'seleccionar instructor '}
                        </button>
                        <button className={bloque.franjas.size <= 0 ?
                            'seleccAmbienteBtn btnOff'
                            : 'seleccAmbienteBtn'}
                            style={{ backgroundColor: Object.values(ambienteBloque).length > 0 ? '#39A900' : '#385C57' }}
                            onClick={() => setOpenListaAmbientes(true)}>
                            {ambienteBloque && Object.values(ambienteBloque).length > 0 ?
                                ambienteBloque.nombre
                                : 'seleccionar ambiente '}
                        </button>
                    </div>
                    :
                    <h2 style={{ padding: '10px 20px' }}>
                        Selecciona un bloque o crea uno nuevo...
                    </h2>
            }
            {
                bloque && Object.values(bloque).length > 0 ?
                    <div className='SeccionHorarioCompSelecc'>
                        {
                            bloque.franjas ?
                                <div className='contTablaMatrizHorarioCreacion'>
                                    <table className='tablaMatrizHorarioCreacion'>
                                        <thead>
                                            <tr>
                                                <th >hora</th>
                                                <th >lun</th>
                                                <th >mar</th>
                                                <th >mie</th>
                                                <th >jue</th>
                                                <th >vie</th>
                                                <th >sab</th>
                                                <th >dom</th>
                                            </tr>
                                        </thead>
                                        <tbody onMouseUp={ManejarClickUpFranja}
                                            onMouseLeave={ManejarClickUpFranja}>
                                            {
                                                matrizHorario.map((fila, i) => (
                                                    <tr key={i}>
                                                        <td className='colRango'>{GetRango(i)}</td>
                                                        {fila.map((colum, j) => (
                                                            <td key={j}
                                                                className={`colFranja 
                                                                 celda${colum.colorCelda}`}
                                                                onClick={() => ManejarClickFranja(colum.valor, colum.colorCelda)}
                                                                onMouseDown={() => ManejarClickDownFranja(colum.colorCelda)}
                                                                onMouseMove={arrastrandoBlanco || arrastrandoVerde ?
                                                                    () => ManejarArrastreFranjas(colum.valor) : null}>
                                                                {colum.valor}
                                                            </td>
                                                        ))}
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </table>
                                </div>
                                :
                                null
                        }
                    </div>
                    : null
            }
            {
                openListaInstructores ?
                    <CrudInstructores
                        onClose={() => setOpenListaInstructores(false)}
                        modoSeleccion={true}
                        responsableSeleccionado={(r) => setInstructorBloque(r)}
                        franjasDeseadas={[...bloque.franjas]}
                        listaCompletaGrupos={listaCompleta} />
                    : null
            }
            {
                openListaAmbientes ?
                    <CrudAmbientes
                        modoSeleccion={true}
                        ambienteSelecc={(a) => setAmbienteBloque(a)}
                        onClose={() => setOpenListaAmbientes(false)}
                        franjasDeseadas={[...bloque.franjas]}
                        listaCompletaGrupos={listaCompleta} />
                    : null
            }
        </div>
    );
}
export default CreacionHorario;