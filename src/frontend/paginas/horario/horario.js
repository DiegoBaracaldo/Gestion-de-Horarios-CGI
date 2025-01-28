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
import { FranjasPersonalizadasToBloques, FranjasToBloques } from './UtilidadesHorario';
import InstructorServicio from '../../../backend/repository/servicios/InstructorService';
import AmbienteServicio from '../../../backend/repository/servicios/AmbienteService';


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
    const [competenciasGrupo, setCompetenciasGrupo] = useState([]);
    const [ocupanciaJornada, setOcupanciaJornada] = useState(new Set());
    const ocupanciaBloquesInicial = useRef([]);
    const [tipoJornada, setTipoJornada] = useState('');
    const bloquesIniciales = useRef([]);
    const [seleccBloqueRadioArray, setSeleccBloqueRadioArray] = useState([]);

    /***************************************************************************/
    /**************** SECCIÓN CARGA LISTA PRINCIPAL ****************************/

    useLayoutEffect(() => {
        GetListas();
    }, []);

    useEffect(() => {
        setListaGruposDinammica([...listaGruposInicial]);
    }, [listaGruposInicial]);


    //LISTA PRINCIPAL
    async function GetListas() {
        try {
            //-- falta Mostrar mensaje que indica que se está generando la acción de cargar información

            //Funciones para usar en obtener lista anidada, deben estar declaradas de primeras
            //Variables para optimizar las consultas de ambientes e instructores para franjas personalizadas
            const idsInstructoresUnicos = new Set();
            const idsAmbientesUnicos = new Set();

            const CargarCompetencias = async (grupoBusqueda) => {
                try {
                    const competencias = await new CompetenciaServicio().CargarListaSegunPiscina(grupoBusqueda.id);
                    return Promise.all(
                        competencias.map(async (comp) => ({
                            ...comp,
                            franjas: await CargarFranjasCompetencia(grupoBusqueda.id, comp.id)
                        }))
                    );
                } catch (error) {
                    console.log("Error al obtener competencias", error);
                    return [];
                }
            };

            const CargarFranjasCompetencia = async (grupoId, competenciaId) => {
                try {
                    const franjas = await new FranjaServicio().ObtenerFranjasCompetenciaGrupo(grupoId, competenciaId);
                    //Se van guardando los ids sin repetir de ambientes e instructores si no son null
                    franjas.forEach(franja => franja.idInstructor !== null && idsInstructoresUnicos.add(franja.idInstructor));
                    franjas.forEach(franja => franja.idAmbiente !== null && idsAmbientesUnicos.add(franja.idAmbiente));
                    return franjas;
                } catch (error) {
                    console.log("Error al obtener las franjas", error);
                    return [];  // Devolvemos un arreglo vacío en caso de error
                }
            };

            const programas = new ProgramaServicio().CargarLista();
            const grupos = new GrupoServicio().CargarLista();
            const respuesta = await Promise.all([programas, grupos]);
            const auxProgramas = respuesta[0];
            let auxGrupos = respuesta[1];
            auxGrupos = await Promise.all(
                auxGrupos.map(async (grupo) => {
                    const auxCompetenciasLista = await CargarCompetencias(grupo);
                    return {
                        ...grupo,
                        competencias: auxCompetenciasLista
                    }
                })
            );

            //Luego, cuando se han cargado todos los grupos, y se han recopilado todos los ids
            //// de ambientes e instructores sin repetir, se consiguen desde el repositorio los
            //// objetos correspondientes
            const [instructoresUnicos, ambientesUnicos] = await Promise.all([
                new InstructorServicio().CargarInstructores([...idsInstructoresUnicos]),
                new AmbienteServicio().CargarAmbientes([...idsAmbientesUnicos])
            ]);

            //Ahora se forman los objetos franja Personalizados cuyo index es la franja
            //// y el dato es un objeto con el instructor y el ambiente y el idCompetencia
            auxGrupos = auxGrupos.map(grupo => {
                const franjasPersonalizadas = [];
                grupo.competencias.forEach(comp => {

                    comp.franjas.forEach(franja => {
                        const nuevoObj = {
                            numBloque: franja.numBloque,
                            idCompetencia: comp.id,
                            //La búsqueda de instructor y ambiente se realiza con ayuda de los sets en los array
                            instructor: franja.idInstructor === null ? {} :
                                instructoresUnicos[[...idsInstructoresUnicos].indexOf(franja.idInstructor)],
                            ambiente: franja.idAmbiente === null ? {} :
                                ambientesUnicos[[...idsAmbientesUnicos].indexOf(franja.idAmbiente)]
                        }
                        //Aquí se forma el array de franjas personalizado donde la franja es el index
                        //// y los objetos estánd entro de un objeto en ese índice, y los índices que 
                        //// no tienen franja serán Undefined
                        franjasPersonalizadas[franja.franja] = nuevoObj;
                    });
                });
                return {
                    ...grupo,
                    franjasPersonalizadas: franjasPersonalizadas
                }
            });

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
    }, [listaProgramas, listaGruposInicial]);

    useEffect(() => {
        //Esto crea una estructura de una lista de objetos programa que tienen
        //el estado de completado en false, además una llave que es un array
        //del mismo tamaño de los grupos que contiene, y un false por cada uno de ellos
        //para que coincida con la estructura de la lista
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


    /***************************************************************************/
    /***************************************************************************/


    //FUNCIÓN CLAVE PARA RE-RENDERIZAR AL MODIFICAR BLOQUES

    //Modificación Directa completa
    useEffect(() => {
        if (listaCombinada.length > 0
            && indexProgramaSelecc >= 0
            && indexGrupoSelecc >= 0
            && indexCompetenciaSelecc >= 0) {
            setBloques(ObtenerBloques());
        }
    }, [listaCombinada]);

    //Index y objetos seleccionados
    const [indexProgramaSelecc, setIndexProgramaSelecc] = useState(-1);
    function ObtenerProgramaSelecc() {
        return listaCombinada[indexProgramaSelecc];
    }

    const [indexGrupoSelecc, setIndexGrupoSelecc] = useState(-1);
    function ObtenerGrupoSelecc() {
        return listaCombinada[indexProgramaSelecc]?.grupos[indexGrupoSelecc];
    }

    const [indexCompetenciaSelecc, setIndexCompetenciaSelecc] = useState(-1);
    useEffect(() => {
        if (indexCompetenciaSelecc >= 0) setBloques(ObtenerBloques());
    }, [indexCompetenciaSelecc]);
    function ObtenerCompetenciaSelecc() {
        return listaCombinada[indexProgramaSelecc].grupos[indexGrupoSelecc].competencias[indexCompetenciaSelecc];
    }

    //De los bloques para abajo se manejan con useState, ya que son los que cambian
    //// así se garantiza que se rendericen solo cuando se modifican y no cuando solo se seleccionan
    const pintandoCelda = useRef(false);
    const [bloques, setBloques] = useState([]);
    useLayoutEffect(() => {
        //En caso de alteración de bloques por agregar nuevo bloque
        if (agregandoBloque.current) {
            agregandoBloque.current = false;
            setIndexBloqueSelecc(bloques.length - 1);
        }
        //En caso de alteración de bloques por pintado o despintado de celda
        if(pintandoCelda.current){
            setBloqueSelecc(ObtenerBloqueSelecc());
            pintandoCelda.current = false;
        }
        setOcupanciaBloques(ObtenerOcupanciaBloques());
        setTotalHorasTomadasComp(ObtenerHorasTomadasInstruc());
    }, [bloques]);
    function ObtenerBloques() {
        return FranjasPersonalizadasToBloques(
            ObtenerGrupoSelecc().franjasPersonalizadas,
            ObtenerCompetenciaSelecc().id);
    }

    const [bloqueSelecc, setBloqueSelecc] = useState({});
    const [indexBloqueSelecc, setIndexBloqueSelecc] = useState(-1);
    const [esPrimeraCargaBloque, setEsPrimeraCargaBloque] = useState(false)
    useEffect(() => {
        if (indexBloqueSelecc >= 0) {
            setBloqueSelecc(ObtenerBloqueSelecc());
            setEsPrimeraCargaBloque(true);
        }
        else setBloqueSelecc({});
    }, [indexBloqueSelecc]);
    function ObtenerBloqueSelecc() {
        return bloques[indexBloqueSelecc];
    }


    const [totalHorasTomadasComp, setTotalHorasTomadasComp] = useState(0);
    function ObtenerHorasTomadasInstruc() {
        return bloques.reduce((acc, bloque) => {
            return acc + ([...bloque.franjas].length / 2);
        }, 0)
    }

    const [ocupanciaBloques, setOcupanciaBloques] = useState(new Set());
    function ObtenerOcupanciaBloques() {
        const setAux = new Set();
        ObtenerGrupoSelecc()?.franjasPersonalizadas?.forEach((franja, index) => {
            if (index <= 336) {
                if (franja) setAux.add(index);
            } else {
                return;
            }
        });
        // console.log(setAux);
        return setAux;
    }

    //CADA QUE SE SELECCIONA UN GRUPO

    const ManejarSeleccGrupo = (grupo, indexPrograma, indexGrupo) => {
        setIndexProgramaSelecc(indexPrograma);
        setIndexGrupoSelecc(indexGrupo);
        setIndexCompetenciaSelecc(-1);
        setIndexBloqueSelecc(-1);
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

        // setCompetenciaSelecc({ ...competencia });
        setIndexCompetenciaSelecc(index);
        setIndexBloqueSelecc(-1);
        setBloqueSelecc({});
    }

    //CADA QUE SE SELECCIONA UN BLOQUE
    //HOOK PARA ELIMINAR BLOQUE
    const [indexBloqueEliminado, setIndexBloqueEliminado] = useState(-1);

    const ManejarCheckBloque = (bloque, i) => {
        setIndexBloqueSelecc(i);
    }

    //SECCIÓN AGREGAR NUEVO BLOQUE

    //Hook para detectar que es una agregación
    const agregandoBloque = useRef(false);

    const ManejarAddBloque = () => {
        // console.log(bloques);
        if (ObtenerHorasTomadasInstruc() < ObtenerCompetenciaSelecc().horasRequeridas) {
            agregandoBloque.current = true;
            //Insertar franjas personalizadas en blanco para que se carguen en los bloques
            //// Se guardan después del índice 336 así que se obtiene primero el ultimo
            //// índice ocupado
            const ultimoIndice = ObtenerGrupoSelecc().franjasPersonalizadas.length > 0 ?
                ObtenerGrupoSelecc().franjasPersonalizadas.length - 1 : 0;
            const cantidadBloques = bloques.length;
            // console.log(ultimoIndice);
            const franjaVacia =
            {
                numBloque: cantidadBloques + 1,
                idCompetencia: ObtenerCompetenciaSelecc().id,
                ambiente: {},
                instructor: {}
            };
            if (ultimoIndice <= 336) {
                const auxListaCombinada = [...listaCombinada];
                auxListaCombinada[indexProgramaSelecc]
                    .grupos[indexGrupoSelecc]
                    .franjasPersonalizadas[337] = franjaVacia;
                setListaCombinada(auxListaCombinada);
            } else {
                const auxListaCombinada = [...listaCombinada];
                auxListaCombinada[indexProgramaSelecc]
                    .grupos[indexGrupoSelecc]
                    .franjasPersonalizadas[ultimoIndice + 1] = franjaVacia;
                setListaCombinada(auxListaCombinada);
            }

        } else {
            Swal.fire(`Ya están completas las horas requeridas para esta competencia,
                        debes liberar un bloque para poder crear otro.`);
        }

    }


    // SECCIÓN PARA ELIMINAR EL BLOQUE, EL HOOK SE ENCUENTRA EN LA PARTE DE SELECCIÓN
    const [futuriIndexSelecc, setFuturoIndexSelecc] = useState(-1);

    const ManejarRemoveBloque = (bloque, index) => {
        //Primero elimino y luego selecciono
        setIndexBloqueEliminado(index);
        let listaAux = [...bloques];

        //Reiniciar valores si se elimina el último existente de la lista
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
                    indexProgramaSelecc >= 0 && indexGrupoSelecc >= 0 ?
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
                                            ObtenerGrupoSelecc().competencias.map((comp, index) => (
                                                <tr key={comp.id.toString() +
                                                    ObtenerGrupoSelecc().codigoGrupo.toString()}>
                                                    <td>
                                                        <input type='radio' name='compSeleccGrupo'
                                                            id={ObtenerGrupoSelecc().codigoGrupo + comp.id}
                                                            onChange={() => ManejarSeleccCompetencia(comp, index)}>
                                                        </input>
                                                        <label htmlFor={ObtenerGrupoSelecc().codigoGrupo + comp.id}>
                                                            {comp.id}
                                                        </label>
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                                {
                                    indexCompetenciaSelecc >= 0 ?
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
                                                    //Se hace la carga de bloques totalmente desde la lista combinada original
                                                    bloques.map((bloque, index) => (
                                                        <tr key={ObtenerGrupoSelecc().codigoGrupo
                                                            + ObtenerCompetenciaSelecc().id + index}>
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
                                                }
                                            </tbody>
                                        </table>
                                        :
                                        null
                                }
                            </div>
                            <div className='ladoDerInterno'>
                                {
                                    indexCompetenciaSelecc >= 0 ?
                                        <CreacionHorario
                                            ocupanciaJornada={ocupanciaJornada}
                                            tipoJornada={tipoJornada}
                                            competencia={ObtenerCompetenciaSelecc()}
                                            totalHorasTomadasComp={totalHorasTomadasComp}
                                            indexProgramaSelecc={indexProgramaSelecc}
                                            indexGrupoSelecc={indexGrupoSelecc}
                                            indexCompetenciaSelecc={indexCompetenciaSelecc}
                                            indexBloqueSelecc={indexBloqueSelecc}
                                            bloque={bloqueSelecc}
                                            bloqueNumero={bloqueSelecc ? bloqueSelecc.numBloque : '?'}
                                            ocupanciaBloques={ocupanciaBloques}
                                            esPrimeraCargaBloque={esPrimeraCargaBloque}
                                            devolverFalsePrimeraCarga={() => setEsPrimeraCargaBloque(false)}
                                            bloqueDevuelto={(b) => ManjearReciboBloque(b)}
                                            listaCompleta={listaCombinada} 
                                            actualizarListaCompleta={(lista) => setListaCombinada(lista)}
                                            setPintandoCelda={() => {return pintandoCelda.current = true}}/>
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