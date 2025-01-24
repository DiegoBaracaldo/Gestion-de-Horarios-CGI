import './Horario.css';
import BotonDestructivo from "../../componentes/botonDestructivo/BotonDestructivo";
import BotonPositivo from "../../componentes/botonPositivo/BotonPositivo";
import MarcoGralHorario from "../../componentes/marcoGeneralHorario/MarcoGralHorario";
import ProgramasGrupos from "../../componentes/programasGrupos/ProgramasGrupos";
import { useEffect, useLayoutEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProgramaServicio from '../../../backend/repository/servicios/ProgramaService';
import GrupoServicio from '../../../backend/repository/servicios/GrupoService';
import Swal from 'sweetalert2';
import CompetenciaServicio from '../../../backend/repository/servicios/CompetenciaService';
import CreacionHorario from '../../componentes/creacionHorario/CreacionHorario';
import FranjaServicio from '../../../backend/repository/servicios/FranjaService';
import JornadaServicio from '../../../backend/repository/servicios/JornadaService';
import PiscinaServicio from '../../../backend/repository/servicios/PiscinaService';


const Horario = () => {
    const navegar = useNavigate();
    const [horarioConfirmado, setHorarioConfirmado] = useState(false);

    const [listaProgramas, setListaProgramas] = useState([]);
    const [listaGruposInicial, setListaGruposInicial] = useState([]);
    const [listaGruposDinamica, setListaGruposDinammica] = useState([...listaGruposInicial]);
    const [listaCombinada, setListaCombinada] = useState([]);
    //Para pintar los grupos y programas según si han sido completados o no
    //Se supone que de esta manera se sincroniza la estructura de índices en la lista
    //con la listaCombinada.
    const [programasGruposCompletados, setProgramasGruposCompletados] = useState([]);

    const [grupoSeleccionado, setGrupoSeleccionado] = useState({});
    const [competenciaSelecc, setCompetenciaSelecc] = useState({});
    const [bloqueSelecc, setBloqueSelecc] = useState({});
    const [indexBloqueSelecc, setIndexBloqueSelecc] = useState(-1);
    const [competenciasGrupo, setCompetenciasGrupo] = useState([]);
    const [ocupanciaJornada, setOcupanciaJornada] = useState(new Set());
    const [tipoJornada, setTipoJornada] = useState('');
    const [bloques, setBloques] = useState([]);
    const [seleccBloqueRadioArray, setSeleccBloqueRadioArray] = useState(new Array(bloques).fill(false));

    useLayoutEffect(() => {
        GetListas();
    }, []);

    useEffect(() => {
        setListaGruposDinammica([...listaGruposInicial]);
    }, [listaGruposInicial]);

    async function GetListas() {
        try {
            const programas = new ProgramaServicio().CargarLista();
            const grupos = new GrupoServicio().CargarLista();
            const franjas = new FranjaServicio().CargarFranjas();
            const respuesta = await Promise.all([programas, grupos, franjas]);
            const auxProgramas = respuesta[0];
            let auxGrupos = respuesta[1];
            const auxArrayPiscinasComp = await Promise.all
                (auxGrupos.map((grupo) => new CompetenciaServicio().CargarListaSegunPiscina(grupo.id)));
            const auxFranjas = respuesta[2];
            //Con ayuda de las franjas sacamos bloques para mejorar el algoritmos
            ////a la hora de agregar los bloques a las competencias dentro de los grupos
            //los bloques los saco según coincidencia entre grupo  competencia
            let agrupados = {};
            auxFranjas.forEach(obj => {
                const claveUnica = `${obj.idGrupo}-${obj.idInstructor}-${obj.idCompetencia}-${obj.idAmbiente}`;

                if (!agrupados[claveUnica]) {
                    agrupados[claveUnica] = {
                        idGrupo: obj.idGrupo,
                        idAmbiente: obj.idAmbiente,
                        idInstructor: obj.idInstructor,
                        idCompetencia: obj.idCompetencia,
                        franjas: []
                    }

                }
                agrupados[claveUnica].franjas.push(obj.franja);
            });
            const arrayBloques = Object.values(agrupados);
            //Agrego las competencias que cada grupo debe ver (piscina) y las franjas completas
            ////y a su vez en cada competencias, los bloques.
            auxGrupos = auxGrupos.map((grupo, index) => (
                {
                    ...grupo,
                    competencias: auxArrayPiscinasComp[index].map(compet => (
                        {
                            ...compet,
                            //Agrego los bloques pertinentes a la competencia en este grupo
                            bloques: arrayBloques
                                .filter(bloque => bloque.idGrupo === grupo.id
                                    && bloque.idCompetencia === compet.id)
                                .map((bloque, j) => ({
                                    ...bloque,
                                    numBloque: j + 1
                                }))
                        }
                    ))
                }));


            setListaGruposInicial([...auxGrupos]);
            //setListaProgramas de último ya que activa todo 
            setListaProgramas([...auxProgramas]);
        } catch (error) {
            console.log(error);
            Swal.fire(error);
            navegar(-1);
        }
    }

    useEffect(() => {
        if (Array.isArray(listaProgramas) && listaProgramas.length > 0) {
            if (Array.isArray(listaGruposInicial) && listaGruposInicial.length > 0) {
                setListaCombinada(CombinarLista());
            }
        }
    }, [listaProgramas]);

    useEffect(() => {
        //Esto crea una estructura de una lista de objetos programa que tienen
        //el estado de completado en false, además una llave que es un array
        //del mismo tamaño de los grupos que contiene, y un false por cada uno de ellos
        //para que coincida con la estructura de la lista
        if (Array.isArray(listaCombinada) && listaCombinada.length > 0) {
            if (Array.isArray(listaCombinada) && listaCombinada.length > 0) {
                const listaAux = new Array(listaCombinada.length).fill(null).map(() => ({
                    completado: false,
                    gruposCompletados: []
                }));
                listaCombinada.forEach((programa, index) => {
                    if (Array.isArray(programa.grupos)) {
                        listaAux[index].gruposCompletados =
                            listaCombinada[index]
                                .grupos.map(grupo => {
                                    return false;
                                });
                    }
                });
                //Pintar programas si están completados
                listaAux.forEach(programa => {
                    if (programa.gruposCompletados.every(valor => valor === true)) {
                        programa.completado = true
                    }
                });
                setProgramasGruposCompletados([...listaAux]);
            }
        }
    }, [listaCombinada]);

    useEffect(() => {
        if (programasGruposCompletados.length > 0 &&
            programasGruposCompletados.every(programa => programa.completado === true))
            setHorarioConfirmado(true);
        else setHorarioConfirmado(false);
    }, [programasGruposCompletados]);

    function CombinarLista() {
        return listaProgramas.map(programa => {
            return {
                ...programa,
                grupos: listaGruposInicial.filter(grupo => grupo.idPrograma === programa.id)
            }
        });
    }

    const ManejarSeleccGrupo = (grupo, indexPrograma, indexGrupo) => {
        setGrupoSeleccionado(grupo);
    }

    //CADA QUE SE SELECCIONA UN GRUPO
    useEffect(() => {
        if (Object.values(grupoSeleccionado).length > 0
            && Array.isArray(grupoSeleccionado.competencias)) {
            //console.log(grupoSeleccionado.competencias);
            PedirDatosForaneosGrupo();
            setCompetenciasGrupo([...grupoSeleccionado.competencias]);
            setCompetenciaSelecc({});
            setBloques([]);
            setBloqueSelecc({});
        }
    }, [grupoSeleccionado]);

    //CADA QUE SE SELECCIONA UNA COMPETENCIA
    useEffect(() => {
        if (Array.isArray(competenciaSelecc.bloques)) {
            setTotalHorasTomadasComp(
                bloques.reduce((acc, bloque) => {
                    return acc + ([...bloque.franjas].length / 2);
                }, 0));
            //console.log(competenciaSelecc.bloques);
            setBloques([...competenciaSelecc.bloques]);
            setBloqueSelecc({});
        }
    }, [competenciaSelecc]);

    //CADA QUE SE SELECCIONA UN BLOQUE
    const [esPrimeraCargaBloque, setEsPrimeraCargaBloque] = useState(false)
    const [seleccionandoBloque, setSeleccionandoBloque] = useState(false);
    const [guardandoBloqueSelecc, setGuardandoBloqueSelecc] = useState(false);
    //HOOK PARA ELIMINAR BLOQUE
    const [indexBloqueEliminado, setIndexBloqueEliminado] = useState(-1);

    const ManejarCheckBloque = (bloque, i) => {
        //El bloque recibido como parámetro es el último seleccionado
        //// y sirve solamente para detectar redundamente que se ha seleccionado
        // console.log("indice de check es: " + i);
        setSeleccionandoBloque(true);
        let auxBloques = [...bloques];
        //SI ES ADD Se almacenan los cambios del bloque, mandandolo a la lsita de bloques
        ////en su index correspondiente antes de cambiar la selección a uno nuevo
        ////Si el anterior no es vacío, si es uno diferente (numBloque) y si no es eliminación
        if (Object.values(bloqueSelecc).length > 1 &&
            bloque.numBloque !== bloqueSelecc.numBloque && indexBloqueEliminado < 0) {
            // console.log("Guardando bloque anterior");
            setGuardandoBloqueSelecc(true);
            auxBloques[indexBloqueSelecc] = { ...bloqueSelecc };
            setBloques(auxBloques);
        }
        //Se se debe guardar bloque seleccionado por eliminación de diferente bloque
        else if (Object.values(bloqueSelecc).length > 1 &&
            bloque.numBloque !== bloqueSelecc.numBloque && indexBloqueEliminado >= 0
            && indexBloqueEliminado !== indexBloqueSelecc) {
            // console.log("Guardando bloque seleccionado");
            setGuardandoBloqueSelecc(true);
            //Se le cambia el nombre dle bloque para que se acomo  d e con los otros
            auxBloques[i] = {
                ...bloqueSelecc,
                numBloque: i + 1
            };
            setBloques(auxBloques);
        }
        setSeleccBloqueRadioArray(auxBloques.map((selecc, j) => (i === j ? true : false)));
    }

    // useEffect(() => {
    //     console.log(bloqueSelecc);
    // }, [bloqueSelecc]);

    //Si vino por guardar bloque anterior
    //No borrar, se necesita
    useEffect(() => {
        if (guardandoBloqueSelecc) {
            setGuardandoBloqueSelecc(false);
        }
    }, [bloques, guardandoBloqueSelecc]);


    async function PedirDatosForaneosGrupo() {
        try {
            const JornadaAux = new JornadaServicio().CargarJornada(grupoSeleccionado.idJornada);

            const resultadoAux = await Promise.all([JornadaAux]);
            setTipoJornada(resultadoAux[0].tipo);
            //Ahora convierto las franjas de ocupancia de jornada en un array de números
            //Obtengo primero la lista de disponibilidad
            const arrayDisponibilidadAux = resultadoAux[0].franjaDisponibilidad.toString()
                .split(',').map(item => Number(item.trim()));
            const setDisponibilidadAux = new Set(arrayDisponibilidadAux);
            //Ahora obtengo el array de ocupancia iniciado con los 336 valores
            const arrayOcupanciaAux = new Array(336).fill(null).map((valor, i) => (
                i + 1
            ));
            //Filtro el array de ocupancia para que quede sin lovalores de disponibilidad
            //Se elimina de atraás para adelante porque el array se va modificando en cada ciclo
            //y de la manera normal los indices no coincidirian después de la primera eliminación
            const listaFiltradaOcupancia = [
                ...arrayOcupanciaAux.filter(valor => !setDisponibilidadAux.has(valor))
            ]
            // console.log(listaFiltradaOcupancia);
            setOcupanciaJornada(new Set(listaFiltradaOcupancia));

        } catch (error) {
            Swal.fire('Error a obtener los datos del grupo');
            navegar(-1);
        }
    }

    const ManejarSeleccCompetencia = (competencia) => {
        setIndexBloqueSelecc(-1);
        setCompetenciaSelecc(competencia);
    }

    //SECCIÓN AGREGAR NUEVO BLOQUE
    const [totalHorasTomadasComp, setTotalHorasTomadasComp] = useState(0);
    //Hook para detectar que es una agregación
    const [indexBloqueAdd, setIndexBloqueAdd] = useState(-1);

    const ManejarAddBloque = () => {
        if (totalHorasTomadasComp < competenciaSelecc.horasRequeridas) {
            const auxBloques = [...bloques];
            const cantidadObj = auxBloques.length;
            const objAux = {
                idInstructor: 0,
                idAmbiente: 0,
                idCompetencia: competenciaSelecc.id,
                idGrupo: grupoSeleccionado.id,
                franjas: new Set()

            };
            if (cantidadObj > 0) objAux.numBloque = Math.max(...auxBloques.map(bloque => (bloque.numBloque))) + 1;
            else objAux.numBloque = 1;
            //Agrego el nuevo bloque a los bloques
            auxBloques.push(objAux);
            //Se asigna el índice del bloque recién agregado
            setIndexBloqueAdd(auxBloques.length - 1);
            setBloques(auxBloques);
        } else {
            Swal.fire(`Ya están completas las horas requeridas para esta competencia,
                        debes liberar un bloque para poder crear otro.`);
        }

    }

    //Cambio de bloques por agregar nuevo bloque
    useEffect(() => {
        if (bloques.length > 0 && indexBloqueAdd >= 0 && !guardandoBloqueSelecc) {
            console.log("agregando...");
            //El hook indexBloqueAdd es redundante pero sirve para detectar cuando el cambio
            ////de bloques es por agregación
            const i = indexBloqueAdd;
            //Ahora se aplica selección con la sección dedicada a ello
            ManejarCheckBloque(bloques[i], i);
        }
    }, [bloques, indexBloqueAdd]);


    // SECCIÓN PARA ELIMINAR EL BLOQUE, EL HOOK SE ENCUENTRA EN LA PARTE DE SELECCIÓN
    const [futuriIndexSelecc, setFuturoIndexSelecc] = useState(-1);

    const ManejarRemoveBloque = (bloque, index) => {
        //Se agrega e bloque eliminado solo si es diferente al seleccionado para guardar
        ////los datos del bloque seleccionado al cambiar la estructura de bloques
        //Primero elimino y luego selecciono
        setIndexBloqueEliminado(index);
        let listaAux = [...bloques];

        //Reiniciar valores si se elimina el último de la lista
        if (listaAux.length === 1) {
            setSeleccBloqueRadioArray([]);
            setBloqueSelecc({});
            setIndexBloqueSelecc(-1);
            setBloques([]);
            setIndexBloqueEliminado(-1);
        } else {
            let i = indexBloqueSelecc;

            //Si se elimina el seleccionado y es el último de la lista Ó 
            //// si se elimina otro que está por encima del seleccionado
            if ((index === indexBloqueSelecc && index === listaAux.length - 1) ||
                (index < indexBloqueSelecc)
            )
                i = indexBloqueSelecc - 1;

            console.log("i vale ", i);

            //Se eliminan los bloques
            listaAux.splice(index, 1);
            //Se reorganiza el nombre de los bloques
            listaAux = listaAux.map((bloque, index) => {
                return {
                    ...bloque,
                    numBloque: index + 1
                }
            });
            setFuturoIndexSelecc(i);
            setBloques(listaAux);
        }
    }

    useEffect(() => {
        if (bloques.length > 0 && indexBloqueEliminado >= 0 && futuriIndexSelecc >= 0) {
            //// (el objeto enviado no importa ya que será ignorado)
            ManejarCheckBloque(bloques[futuriIndexSelecc], futuriIndexSelecc);
        }
    }, [bloques, indexBloqueEliminado, futuriIndexSelecc]);

    ///////////////////////// --------------- /////////////////

    //ESTO ES CONTINUACIÓN DE SELECCIÓN
    useEffect(() => {
        if (seleccBloqueRadioArray.some(valor => valor === true) &&
            (seleccionandoBloque || indexBloqueEliminado >= 0 || indexBloqueAdd >= 0)) {
            if (indexBloqueEliminado >= 0) setIndexBloqueSelecc(-1);
            else setIndexBloqueSelecc(seleccBloqueRadioArray.findIndex(valor => valor === true));
        }
    }, [seleccBloqueRadioArray]);

    //Solo para reiniciar el indexSelecc para poder seguir con la selección al eliminar
    useEffect(() => {
        if (indexBloqueSelecc < 0 && seleccBloqueRadioArray.some(valor => valor === true) &&
            indexBloqueEliminado >= 0 && indexBloqueAdd < 0) {
            const seleccAux = seleccBloqueRadioArray.findIndex(valor => valor === true);
            setIndexBloqueSelecc(seleccAux);
        }
    }, [indexBloqueSelecc]);

    //ESTO ES CONTINUACIÓN DE SELECCIÓN
    useEffect(() => {
        // console.log(indexBloqueSelecc)
        if ((indexBloqueSelecc >= 0) &&
            (seleccionandoBloque || indexBloqueEliminado >= 0 || indexBloqueAdd >= 0)) {
            setBloqueSelecc({ ...bloques[indexBloqueSelecc] });
        }
    }, [indexBloqueSelecc]);

    //Finaliza la selección
    useEffect(() => {
        // console.log(bloqueSelecc);
        if ((Object.values(bloqueSelecc).length >= 0) &&
            (seleccionandoBloque || indexBloqueEliminado >= 0 || indexBloqueAdd >= 0)) {
            // console.log("El objeto final seleccionado es: ", bloqueSelecc)
            setEsPrimeraCargaBloque(true);
            setIndexBloqueAdd(-1);
            setIndexBloqueEliminado(-1);
            setFuturoIndexSelecc(-1);
            setSeleccionandoBloque(false);
            setTotalHorasTomadasComp(
                bloques.reduce((acc, bloque) => {
                    return acc + ([...bloque.franjas].length / 2);
                }, 0)
            );
        }
    }, [bloqueSelecc]);

    //CADA QUE SE MODIFICAN LOS BLOQUES
    useEffect(() => {
        // console.log(bloques);
        if (bloques.length > 0) {
            // const objAux = {
            //     idGrupo: grupoSeleccionado.id,
            //     idCompetencia: competenciaSelecc.id,
            //     bloques: bloques
            // }
            // listaAux.push(objAux);
            // setContObjBloques(listaAux);
            //Se calcula el tiempo total de horas en cada selección, eliminación y agregación
        } else {
            setSeleccBloqueRadioArray([]);
            setBloqueSelecc({});
            setIndexBloqueSelecc(-1);
        }
    }, [bloques]);

    const ManjearReciboBloque = (bloque) => {
        // console.log("Se recibe desde hijo...", bloque);
        setBloqueSelecc(bloque);
    }

    return (
        <div id="contCreacionHorario">
            <MarcoGralHorario titulo={"creación de horario"}>
                <ProgramasGrupos listaProgramas={listaCombinada} grupoSelecc={ManejarSeleccGrupo}
                    listaParaListaCompletado={programasGruposCompletados} />
                {
                    Object.values(grupoSeleccionado).length > 0 ?
                        <div className='ladoDerechoMarcoHorario'>
                            <div className='ladoIzqInterno'>
                                <table className='tablaCompetenciasPiscina'>
                                    <thead>
                                        <tr>
                                            <th>competencias</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            competenciasGrupo.map((comp, index) => (
                                                <tr key={comp.id.toString() + grupoSeleccionado.codigoGrupo.toString()}>
                                                    <td>
                                                        <input type='radio' name='compSeleccGrupo'
                                                            id={grupoSeleccionado.codigoGrupo + comp.id}
                                                            onChange={() => ManejarSeleccCompetencia(comp)}>
                                                        </input>
                                                        <label htmlFor={grupoSeleccionado.codigoGrupo + comp.id}>
                                                            {comp.id}
                                                        </label>
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                                {
                                    Object.keys(competenciaSelecc).length > 0 ?
                                        <table className='tablaBloquesCompetencia'>
                                            <thead>
                                                <tr>
                                                    <th><label>bloques </label>
                                                        <button
                                                            onClick={ManejarAddBloque}>
                                                            +
                                                        </button></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    bloques?.length > 0 ?
                                                        bloques.map((bloque, index) => (
                                                            <tr key={grupoSeleccionado.codigoGrupo + competenciaSelecc.id + index}>
                                                                <td className='colBloque'>
                                                                    <input type='radio' name='seleccBloque'
                                                                        id={'bloqueComp' + index}
                                                                        onChange={() => ManejarCheckBloque(bloque, index)}
                                                                        checked={seleccBloqueRadioArray[index]}>
                                                                    </input>
                                                                    <label htmlFor={'bloqueComp' + index}>
                                                                        <button onClick={() => ManejarRemoveBloque(bloque, index)}>
                                                                            X
                                                                        </button>
                                                                        <span>
                                                                            Bloque {bloque.numBloque}
                                                                        </span>
                                                                    </label>
                                                                </td>
                                                            </tr>
                                                        ))
                                                        : null
                                                }
                                            </tbody>
                                        </table>
                                        :
                                        null
                                }
                            </div>
                            <div className='ladoDerInterno'>
                                {
                                    Object.keys(competenciaSelecc).length > 0 ?
                                        <CreacionHorario competencia={competenciaSelecc}
                                            bloque={bloqueSelecc}
                                            bloqueNumero={bloqueSelecc ? bloqueSelecc.numBloque : '?'}
                                            ocupanciaJornada={ocupanciaJornada}
                                            tipoJornada={tipoJornada}
                                            bloqueDevuelto={(b) => ManjearReciboBloque(b)}
                                            esPrimeraCargaBloque={esPrimeraCargaBloque}
                                            devolverFalsePrimeraCarga={() => setEsPrimeraCargaBloque(false)}
                                            totalHorasTomadasComp={totalHorasTomadasComp}
                                            devolverTotalHorasBloques={(h) => setTotalHorasTomadasComp(h)} />
                                        :
                                        <h1 style={{ paddingLeft: '15px' }}>
                                            Selecciona una competencia...
                                        </h1>
                                }
                            </div>
                        </div>
                        :
                        <h1 style={{ paddingLeft: '15px' }}>
                            Selecciona un grupo del panel izquierdo...
                        </h1>
                }
            </MarcoGralHorario>
            <div className='contBotones'>
                <div className='contEstadoHorario'>
                    <h2>Estado:</h2>
                    <h3 style={{ color: horarioConfirmado ? 'green' : 'red' }}>
                        {horarioConfirmado ? 'horario completo!' : 'horario incompleto...'}
                    </h3>
                </div>
                <BotonPositivo texto={'guardar'} />
                <BotonDestructivo texto={'volver'} onClick={() => navegar(-1)} />
            </div>
        </div>
    );
}
export default Horario;