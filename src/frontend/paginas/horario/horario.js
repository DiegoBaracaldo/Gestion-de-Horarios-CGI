import './Horario.css';
import BotonDestructivo from "../../componentes/botonDestructivo/BotonDestructivo";
import BotonPositivo from "../../componentes/botonPositivo/BotonPositivo";
import MarcoGralHorario from "../../componentes/marcoGeneralHorario/MarcoGralHorario";
import ProgramasGrupos from "../../componentes/programasGrupos/ProgramasGrupos";
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProgramaServicio from '../../../backend/repository/servicios/ProgramaService';
import GrupoServicio from '../../../backend/repository/servicios/GrupoService';
import Swal from 'sweetalert2';
import CompetenciaServicio from '../../../backend/repository/servicios/CompetenciaService';
import CreacionHorario from '../../componentes/creacionHorario/CreacionHorario';
import FranjaServicio from '../../../backend/repository/servicios/FranjaService';
import JornadaServicio from '../../../backend/repository/servicios/JornadaService';
import PiscinaServicio from '../../../backend/repository/servicios/PiscinaService';
import { FranjasToBloques } from './UtilidadesHorario';


const Horario = () => {
    const navegar = useNavigate();
    const [horarioConfirmado, setHorarioConfirmado] = useState(false);

    const [listaProgramas, setListaProgramas] = useState([]);
    const [listaGruposInicial, setListaGruposInicial] = useState([]);
    const [listaGruposDinamica, setListaGruposDinammica] = useState([...listaGruposInicial]);
    const listaCombinadaInicial = useRef([]);
    const [listaCombinada, setListaCombinada] = useState([]);
    //Para pintar los grupos y programas según si han sido completados o no
    //Se supone que de esta manera se sincroniza la estructura de índices en la lista
    //con la listaCombinada.
    const [programasGruposCompletados, setProgramasGruposCompletados] = useState([]);

    const [grupoSeleccionado, setGrupoSeleccionado] = useState({});
    const [competenciaSelecc, setCompetenciaSelecc] = useState({});
    const [bloqueSelecc, setBloqueSelecc] = useState({});
    const [competenciasGrupo, setCompetenciasGrupo] = useState([]);
    const [ocupanciaJornada, setOcupanciaJornada] = useState(new Set());
    const ocupanciaBloquesInicial = useRef([]);
    const ocupanciaBloques = useRef(new Set());
    const [tipoJornada, setTipoJornada] = useState('');
    const bloquesIniciales = useRef([]);
    const [bloques, setBloques] = useState([]);
    const [seleccBloqueRadioArray, setSeleccBloqueRadioArray] = useState(new Array(bloques).fill(false));
    const [totalHorasTomadasComp, setTotalHorasTomadasComp] = useState(0);

    useLayoutEffect(() => {
        GetListas();
    }, []);

    useEffect(() => {
        setListaGruposDinammica([...listaGruposInicial]);
    }, [listaGruposInicial]);

    async function GetListas() {
        try {
            //-- falta Mostrar mensaje que indica que se está generando la acción de cargar información
            const programas = new ProgramaServicio().CargarLista();
            const grupos = new GrupoServicio().CargarLista();
            const respuesta = await Promise.all([programas, grupos]);
            const auxProgramas = respuesta[0];
            let auxGrupos = respuesta[1];
            auxGrupos = await Promise.all(
                auxGrupos.map(async (grupo) => {
                    let auxCompetenciasLista = [];
                    try {
                        auxCompetenciasLista = await new CompetenciaServicio().CargarListaSegunPiscina(grupo.id);
                        auxCompetenciasLista = await Promise.all(
                            auxCompetenciasLista.map(async (comp) => {
                                let auxFranjasComp = [];
                                try {
                                    auxFranjasComp = await new FranjaServicio()
                                        .ObtenerFranjasCompetenciaGrupo(grupo.id, comp.id);
                                } catch (error) {
                                    console.log("Error al obtener las franjas según competencia y grupo");
                                    throw error;
                                }
                                return {
                                    ...comp,
                                    franjas: auxFranjasComp
                                }
                            })
                        );
                    } catch (error) {
                        console.log("Error al obtener lista de compentencias para el grupo por: " + error);
                        throw error;
                    }
                    return {
                        ...grupo,
                        competencias: auxCompetenciasLista
                    }
                })
            );
            // console.log(auxGrupos);
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
                const auxListaCombinada = CombinarLista();
                setListaCombinada(auxListaCombinada);
                listaCombinadaInicial.current = auxListaCombinada;
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

    //Index de objetos seleccionados
    const indexProgramaSelecc = useRef(-1);
    const indexGrupoSelecc = useRef(-1);
    const indexCompetenciaSelecc = useRef(-1);
    const indexBloqueSelecc = useRef(-1);

    //CADA QUE SE SELECCIONA UN GRUPO

    const ManejarSeleccGrupo = (grupo, indexPrograma, indexGrupo) => {
        indexProgramaSelecc.current = indexPrograma;
        indexGrupoSelecc.current = indexGrupo;
        setGrupoSeleccionado({ ...grupo });
        indexCompetenciaSelecc.current = -1;
        setCompetenciaSelecc({});
        setCompetenciasGrupo(grupo.competencias);
        indexBloqueSelecc.current = -1;
        setBloqueSelecc({});
        setBloques([]);
        bloquesIniciales.current = [];
        setTotalHorasTomadasComp(0);
        setTipoJornada('');
        setSeleccBloqueRadioArray(seleccBloqueRadioArray.map(() => false));
        PedirDatosForaneosGrupo(grupo);
    }

    async function PedirDatosForaneosGrupo(grupo) {
        try {
            const JornadaAux = new JornadaServicio().CargarJornada(grupo.idJornada);

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

    //CADA QUE SE SELECCIONA UNA COMPETENCIA

    const ManejarSeleccCompetencia = async (competencia, index) => {

        setCompetenciaSelecc({ ...competencia });
        indexCompetenciaSelecc.current = index;
        indexBloqueSelecc.current = -1;
        setBloqueSelecc({});
        setSeleccBloqueRadioArray(seleccBloqueRadioArray.map(() => false));

        setFranjasCompetencia([...competencia.franjas]);
        const auxGetBloques = await ObtenerBloques(competencia.franjas);
        setBloques(auxGetBloques);
        bloquesIniciales.current = auxGetBloques;
        setTotalHorasTomadasComp(
            auxGetBloques.reduce((acc, bloque) => {
                return acc + ([...bloque.franjas].length / 2);
            }, 0));
    }

    // SE ESPERA QUE SEA PUNTO CLAVE QUE ABSORA CAMBIOS DE BLOQUES Y LOS RENDERICE POR MEDIO DE FRANJAS
    //Para que se activen los cambios de renderizado en cadena al modificar los bloques
    //// pero no al seleccionar una competencia
    
    //Espero que este hook sea la clave renderizadora de cambios con clickUP, cambio de ambiente o instructor
    const [franjasCompetencia, setFranjasCompetencia] = useState([]);
    useEffect(() => {
        console.log(franjasCompetencia);
        if (franjasCompetencia.length > 0 && indexBloqueSelecc.current >= 0) {
            const auxGetBloques = ObtenerBloques(franjasCompetencia);
            setBloques(auxGetBloques);
            setTotalHorasTomadasComp(
                auxGetBloques.reduce((acc, bloque) => {
                    return acc + ([...bloque.franjas].length / 2);
                }, 0));
        }
    }, [franjasCompetencia]);

    async function ObtenerBloques(listaFranjas) {
        try {
            const respuesta = await FranjasToBloques(listaFranjas);
            bloquesIniciales.current = respuesta;
            // console.log(respuesta);
            return respuesta;
        } catch (error) {
            Swal.fire(error);
            return [];
        }
    }

    async function GuardarCambiosHorario(franjas) {
        try {
            //Se espera un 1
            console.log("Guardando...");
            return await new FranjaServicio().GuardarHorario(grupoSeleccionado.id, competenciaSelecc.id, franjas);
        } catch (error) {
            Swal.fire("Error en el guardado de los cambios en el horario!");
            return 0;
        }
    }


    //CADA QUE SE SELECCIONA UN BLOQUE
    const [esPrimeraCargaBloque, setEsPrimeraCargaBloque] = useState(false)
    const [seleccionandoBloque, setSeleccionandoBloque] = useState(false);
    const guardandoBloqueSelecc = useRef(false);
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
            guardandoBloqueSelecc.current = true;
            auxBloques[indexBloqueSelecc.current] = { ...bloqueSelecc };
            setBloques(auxBloques);
        }
        //Se se debe guardar bloque seleccionado por eliminación de diferente bloque
        else if (Object.values(bloqueSelecc).length > 1 &&
            bloque.numBloque !== bloqueSelecc.numBloque && indexBloqueEliminado >= 0
            && indexBloqueEliminado !== indexBloqueSelecc.current) {
            // console.log("Guardando bloque seleccionado");
            guardandoBloqueSelecc.current = true;
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
        if (guardandoBloqueSelecc.current) {
            guardandoBloqueSelecc.current = false;
        }
    }, [bloques]);



    //SECCIÓN AGREGAR NUEVO BLOQUE
    //Hook para detectar que es una agregación
    const indexBloqueAdd = useRef(-1);

    const ManejarAddBloque = () => {
        // console.log(bloques);
        if (totalHorasTomadasComp < competenciaSelecc.horasRequeridas) {
            const auxBloques = [...bloques];
            const cantidadObj = auxBloques.length;
            const objAux = {
                instructor: {},
                ambiente: {},
                franjas: new Set()

            };
            if (cantidadObj > 0) objAux.numBloque = Math.max(...auxBloques.map(bloque => (bloque.numBloque))) + 1;
            else objAux.numBloque = 1;
            //Agrego el nuevo bloque a los bloques
            auxBloques.push(objAux);
            //Se asigna el índice del bloque recién agregado
            indexBloqueAdd.current = auxBloques.length - 1;
            // setIndexBloqueAdd(auxBloques.length - 1);
            setBloques(auxBloques);
        } else {
            Swal.fire(`Ya están completas las horas requeridas para esta competencia,
                        debes liberar un bloque para poder crear otro.`);
        }

    }

    //Cambio de bloques por agregar nuevo bloque
    useEffect(() => {
        if (bloques.length > 0 && indexBloqueAdd.current >= 0 && !guardandoBloqueSelecc.current) {
            console.log("agregando...");
            //El hook indexBloqueAdd es redundante pero sirve para detectar cuando el cambio
            ////de bloques es por agregación
            const i = indexBloqueAdd.current;
            //Ahora se aplica selección con la sección dedicada a ello
            ManejarCheckBloque(bloques[i], i);
        }
    }, [bloques]);


    // SECCIÓN PARA ELIMINAR EL BLOQUE, EL HOOK SE ENCUENTRA EN LA PARTE DE SELECCIÓN
    const [futuriIndexSelecc, setFuturoIndexSelecc] = useState(-1);

    const ManejarRemoveBloque = (bloque, index) => {
        //Primero elimino y luego selecciono
        setIndexBloqueEliminado(index);
        let listaAux = [...bloques];

        //Reiniciar valores si se elimina el último de la lista
        if (listaAux.length === 1) {
            setSeleccBloqueRadioArray([]);
            setBloqueSelecc({});
            indexBloqueSelecc.current = -1;
            setBloques([]);
            setIndexBloqueEliminado(-1);
        } else {
            let i = indexBloqueSelecc.current;

            //Si se elimina el seleccionado y es el último de la lista Ó 
            //// si se elimina otro que está por encima del seleccionado
            if ((index === indexBloqueSelecc.current && index === listaAux.length - 1) ||
                (index < indexBloqueSelecc.current)
            )
                i = indexBloqueSelecc.current - 1;

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
            (seleccionandoBloque || indexBloqueEliminado >= 0 || indexBloqueAdd.current >= 0)) {
            if (indexBloqueEliminado >= 0) indexBloqueSelecc.current = -1;
            else indexBloqueSelecc.current = seleccBloqueRadioArray.findIndex(valor => valor === true);
            //Solo para reiniciar el indexSelecc para poder seguir con la selección al eliminar
            if (indexBloqueSelecc.current < 0 && indexBloqueEliminado >= 0 && indexBloqueAdd.current < 0) {
                const seleccAux = seleccBloqueRadioArray.findIndex(valor => valor === true);
                indexBloqueSelecc.current = seleccAux;
            }
            if (indexBloqueSelecc.current >= 0) {
                //Se analiza la nueva ocupancia bloques teniendo en cuenta la inicial
                //// Primero agrego las franjas ocupadas por bloques de otras competencias
                ocupanciaBloques.current = new Set([...ocupanciaBloquesInicial.current].reduce((acc, obj) => {
                    return obj.idCompetencia !== competenciaSelecc.id ? acc.concat([...obj.franjas]) : acc;
                }, []));
                //// Luego se añaden los de los bloques de la competencia actual según los cambios
                //// sin las franjas que le pertenecen al bloque seleccionado
                const auxOcupanciaCompSelecc = bloques.reduce((acc, bloque) => {
                    return bloque.numBloque !== bloques[indexBloqueSelecc.current].numBloque ?
                        acc.concat([...bloque.franjas]) : acc;
                }, []);

                ocupanciaBloques.current = new Set([...ocupanciaBloques.current, ...auxOcupanciaCompSelecc]);

                //Se selecciona el objeto según el index
                setBloqueSelecc({ ...bloques[indexBloqueSelecc.current] });
            }
        }
    }, [seleccBloqueRadioArray]);

    //Finaliza la selección
    useEffect(() => {
        // console.log(bloqueSelecc);
        if ((Object.values(bloqueSelecc).length >= 0) &&
            (seleccionandoBloque || indexBloqueEliminado >= 0 || indexBloqueAdd >= 0)) {
            // console.log("El objeto final seleccionado es: ", bloqueSelecc)
            setEsPrimeraCargaBloque(true);
            indexBloqueAdd.current = -1;
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

        } else {
            setSeleccBloqueRadioArray([]);
            setBloqueSelecc({});
            indexBloqueSelecc.current = -1;
        }
        setTotalHorasTomadasComp(
            bloques.reduce((acc, bloque) => {
                return acc + ([...bloque.franjas].length / 2);
            }, 0)
        );
    }, [bloques]);

    /**********************************************************************************************************/
    /**************************** SECCIÓN PARA TRATAR OCUPANCIA BLOQUES ***************************************/

    //Se hace para que cuando se cargue el bloque en creación hroario no haya desincronía con ocupancia bloques

    const ManjearReciboBloque = (bloque) => {
        setBloqueSelecc(bloque);
    }

    /**********************************************************************************************************/
    /**********************************************************************************************************/
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
                                                            onChange={() => ManejarSeleccCompetencia(comp, index)}>
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
                                                                            Bloque {bloque?.numBloque}
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
                                            devolverTotalHorasBloques={(h) => setTotalHorasTomadasComp(h)}
                                            ocupanciaBloques={ocupanciaBloques} 
                                            listaCompleta={listaCombinada}/>
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