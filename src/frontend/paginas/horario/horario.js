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

    // useEffect(() => {
    //     console.log(seleccBloqueRadioArray);

    // }, [seleccBloqueRadioArray]);

    // useEffect(() => {
    //     console.log(ocupanciaJornada);
    // }, [ocupanciaJornada]);

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
                competenciaSelecc.bloques.reduce((arrayAcc, bloque) => {
                    return arrayAcc.concat(bloque.franjas)
                }, []).length / 2);
            //console.log(competenciaSelecc.bloques);
            setBloques([...competenciaSelecc.bloques]);
            setBloqueSelecc({});
        }
    }, [competenciaSelecc]);

    //CADA QUE SE SELECCIONA UN BLOQUE
    const [esPrimeraCargaBloque, setEsPrimeraCargaBloque] = useState(false)
    const [seleccionandoBloque, setSeleccionandoBloque] = useState(false);
    const [guardandoBloqueSelecc, setGuardandoBloqueSelecc] = useState(false);

    const ManejarCheckBloque = (bloque, i) => {
        setSeleccionandoBloque(true);
        //Se almacenan los cambios del bloque, mandandolo a la lsita de bloques
        ////en su index correspondiente antes de cambiar la selección a uno nuevo
        ////Si el anterior no es vacío y si es uno diferente (numBloque)
        if (Object.values(bloqueSelecc).length > 1 &&
            bloque.numBloque !== bloqueSelecc.numBloque) {
            setGuardandoBloqueSelecc(true);
            const listAux = [...bloques];
            listAux[indexBloqueSelecc] = bloqueSelecc;
            setBloques(listAux);
        }
        //Resto de lógica de selección de bloque
        const auxNuevoSeleccLista = bloques.map((selecc, j) => (i === j ? true : false));
        // console.log(auxNuevoSeleccLista);
        setSeleccBloqueRadioArray(auxNuevoSeleccLista);
        setIndexBloqueSelecc(i);
    }

    // useEffect(() => {
    //     console.log(bloqueSelecc);
    // }, [bloqueSelecc]);

    useEffect(() => {
        if(guardandoBloqueSelecc){
            setGuardandoBloqueSelecc(false);
        }
    }, [bloques, guardandoBloqueSelecc]);

    useEffect(() => {
        // console.log(indexBloqueSelecc);
        if (indexBloqueSelecc >= 0 && seleccionandoBloque) {
            console.log("seleccionando...");
            setBloqueSelecc(bloques[indexBloqueSelecc]);
        }
    }, [indexBloqueSelecc, seleccionandoBloque]);

    useEffect(() => {
        if (indexBloqueSelecc >= 0 && seleccionandoBloque) {
            // console.log("Se seleccionó el bloque...", bloqueSelecc);
            //Se maneja la detección de cambio de bloque por aquí porque en el useEffect hace loop
            setEsPrimeraCargaBloque(true);
            setSeleccionandoBloque(false);
        }
    }, [bloqueSelecc]);

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
        if (bloques[bloques.length - 1]?.franjas?.length > 0 || bloques.length === 0 ||
            (indexBloqueSelecc === bloques.length - 1 && bloqueSelecc.franjas.size > 0)
        ) {
            if (totalHorasTomadasComp < competenciaSelecc.horasRequeridas) {
                const auxBloques = [...bloques];
                const cantidadObj = auxBloques.length;
                const objAux = {
                    idInstructor: 0,
                    idAmbiente: 0,
                    idCompetencia: competenciaSelecc.id,
                    idGrupo: grupoSeleccionado.id,
                    franjas: []
                };
                if (cantidadObj > 0) objAux.numBloque = Math.max(...auxBloques.map(bloque => (bloque.numBloque))) + 1;
                else objAux.numBloque = 1;
                //Agrego el nuevo bloque a los bloques
                auxBloques.push(objAux);
                //Guardo los cambios del bloque anterior
                auxBloques[indexBloqueSelecc] = bloqueSelecc;
                //Se asigna el índice del bloque recién agregado
                setIndexBloqueAdd(auxBloques.length - 1);
                setBloques([...auxBloques]);
            } else {
                Swal.fire(`Ya están completas las horas requeridas para esta competencia,
                    debes liberar un bloque para poder crear otro.`);
            }
        } else {
            Swal.fire(`Rellena el último bloque con al menos 1 franja!`);
        }
    }

    //Cambio de bloques por agregar nuevo bloque
    useEffect(() => {
        if (bloques.length > 0 && indexBloqueAdd >= 0) {
            console.log("agregando...");
            //El hook indexBloqueAdd es redundante pero sirve para detectar cuando el cambio
            ////de bloques es por agregación
            const i = indexBloqueAdd;
            let auxListaSeleccRadio = new Array(bloques).fill(false);
            //Se agrega uno porque los bloques tienen también uno nuevo
            auxListaSeleccRadio.push(false);
            auxListaSeleccRadio = bloques.map((_, j) => i === j ? true : false);
            setSeleccBloqueRadioArray(auxListaSeleccRadio);
            setIndexBloqueSelecc(i);
            
            //Ahora se aplica selección con la sección dedicada a ello
            ManejarCheckBloque(bloques[i], i);
            //Se reinicia el valor del index agregado
            setIndexBloqueAdd(-1);
        }
    }, [bloques, indexBloqueAdd]);

    //SECCIÓN PARA ELIMINAR BLOQUE
    let indexBloqueEliminado = -1;

    const ManejarRemoveBloque = (bloque, index) => {
        indexBloqueEliminado = index;
        setTotalHorasTomadasComp((totalHorasTomadasComp - (index !== indexBloqueSelecc ?
            (bloque.franjas.size / 2) : (bloqueSelecc.franjas.size / 2))) || 0);
        const listaAux = [...bloques];

        //Reiniciar valores si se elimina el último de la lista
        if (listaAux.length === 0) {
            setSeleccBloqueRadioArray([]);
            setBloqueSelecc({});
            setIndexBloqueSelecc(-1);
        } else {

            listaAux.splice(index, 1);
            setBloques([...listaAux]);
        }
    }

    //CADA QUE SE MODIFICAN LOS BLOQUES
    useEffect(() => {
        if (bloques.length > 0) {
            // const objAux = {
            //     idGrupo: grupoSeleccionado.id,
            //     idCompetencia: competenciaSelecc.id,
            //     bloques: bloques
            // }
            // listaAux.push(objAux);
            // setContObjBloques(listaAux);
            if (indexBloqueSelecc >= 0) {
                //Cuando se elimina
                if (indexBloqueEliminado >= 0 && indexBloqueAdd < 0) {
                    console.log("a eliminar...");
                    const i = () => {
                        //Si se elimina el seleccionado y HABIA más por delante
                        if (indexBloqueEliminado === indexBloqueSelecc
                            && bloques.length >= 1 &&
                            indexBloqueEliminado < bloques.length)
                            return indexBloqueEliminado + 1;
                        //Si se elimina el seleccionado, ERA el último y HABÍA más de uno Ó
                        ////, si se elimina otro que no es el seleccionado pero ESTABA por encima
                        else if ((bloques.length >= 1 && indexBloqueEliminado < indexBloqueSelecc) ||
                            (indexBloqueEliminado === indexBloqueSelecc && bloques.length >= 1 &&
                                indexBloqueEliminado < bloques.length))
                            return indexBloqueEliminado - 1;
                        //El resto que es si se elimina uno NO seleccionado y está por debajo
                        else return indexBloqueEliminado;
                    }

                    let auxListaSeleccRadio = [...seleccBloqueRadioArray];
                    //Se elimina uno porque los bloques perdieron uno
                    auxListaSeleccRadio.pop();
                    auxListaSeleccRadio = auxListaSeleccRadio.map((_, j) => i === j ? true : false);
                    setSeleccBloqueRadioArray(auxListaSeleccRadio);
                    setBloqueSelecc(bloques[i]);
                    setIndexBloqueSelecc(i);
                    setEsPrimeraCargaBloque();

                    //Se reinicia el valor del index eliminado
                    indexBloqueEliminado = -1;
                }
            }
        } else {
            setSeleccBloqueRadioArray([]);
            setBloqueSelecc({});
            setIndexBloqueSelecc(-1);
        }
    }, [bloques]);

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
                                            bloqueDevuelto={(b) => setBloqueSelecc(b)}
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