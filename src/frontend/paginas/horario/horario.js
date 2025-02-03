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
import { FranjasPersonalizadasToBloques, FranjasToBloques } from './UtilidadesHorario';
import InstructorServicio from '../../../backend/repository/servicios/InstructorService';
import AmbienteServicio from '../../../backend/repository/servicios/AmbienteService';
import SWALConfirm from '../../alertas/SWALConfirm';


const Horario = () => {
    const navegar = useNavigate();
    const [horarioConfirmado, setHorarioConfirmado] = useState(false);

    const listaFranjasAlteradas = useRef(new Set());
    const franjaAlterada = useRef([]);
    const [listaProgramas, setListaProgramas] = useState([]);
    const [listaGruposInicial, setListaGruposInicial] = useState([]);
    const [listaGruposDinamica, setListaGruposDinammica] = useState([...listaGruposInicial]);
    const listaCombinadaInicial = useRef([]);
    const [listaCombinada, setListaCombinada] = useState([]);
    //Para pintar los grupos y programas según si han sido completados o no
    //Se supone que de esta manera se sincroniza la estructura de índices en la lista
    //con la listaCombinada.
    const [programasGruposCompletados, setProgramasGruposCompletados] = useState([]);
    const [ocupanciaJornada, setOcupanciaJornada] = useState(new Set());
    const [tipoJornada, setTipoJornada] = useState('');
    const [seleccBloqueRadioArray, setSeleccBloqueRadioArray] = useState([]);
    const arrayIndexSeleccBloque = useRef(null);
    // useEffect(() => {
    //     console.log(seleccBloqueRadioArray)
    // }, [seleccBloqueRadioArray]);

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
            const grupos = new GrupoServicio().CargarListaByPool();
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
                setListaCombinada(JSON.parse(JSON.stringify(auxListaCombinada)));
                listaCombinadaInicial.current = JSON.parse(JSON.stringify(auxListaCombinada));

                //Creo el array de indices para guardar la selección de cada competencia
                arrayIndexSeleccBloque.current = auxListaCombinada.map(programa => (
                    programa.grupos.map(grupo => (
                        {
                            indexComp: -1,
                            competencias: grupo.competencias.map(comp => -1)
                        }
                    ))
                ));
                // console.log(arrayIndexSeleccBloque.current);
            }
        }
    }, [listaProgramas, listaGruposInicial]);

    useEffect(() => {
        //Esto crea una estructura de una lista de objetos programa que tienen
        //el estado de completado en false, además una llave que es un array
        //del mismo tamaño de los grupos que contiene, y un false por cada uno de ellos
        //para que coincida con la estructura de la lista

        if (Array.isArray(listaCombinada) && listaCombinada.length > 0) {

            const listaAux = listaCombinada.map(programa => {
                const gruposCompletados = programa.grupos?.filter(grupo => {
                    return grupo.competencias.every(comp => {
                        const franjasPerso = grupo.franjasPersonalizadas?.filter(franja =>
                            franja?.idCompetencia === comp.id
                        );
                        const todasTienenAmbEInstruc = franjasPerso.every(franja =>
                            Object.values(franja.instructor)?.length > 0
                            && Object.values(franja.ambiente)?.length > 0
                        );
                        return franjasPerso.length / 2 === comp.horasRequeridas && todasTienenAmbEInstruc;
                    });
                }).map(grupo => grupo.id);

                const todosGruposCompletados = programa.grupos?.length === gruposCompletados?.length;

                return {
                    completado: todosGruposCompletados,
                    gruposCompletados: gruposCompletados
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
            if (franjaAlterada.current.length > 0) {
                franjaAlterada.current.forEach(franja => listaFranjasAlteradas.current.add(franja));
                franjaAlterada.current = [];
            }
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
        //Guardo la selección en el array de selecciones
        if (arrayIndexSeleccBloque.current !== null && indexGrupoSelecc >= 0) {
            arrayIndexSeleccBloque.current[indexProgramaSelecc][indexGrupoSelecc]
                .indexComp = indexCompetenciaSelecc;
        }
        if (indexCompetenciaSelecc >= 0) {
            cargandoBloques.current = true;
            setBloques(ObtenerBloques());
        } else {
            setBloques([]);
            cargandoBloques.current = true;
        }
    }, [indexCompetenciaSelecc]);
    function ObtenerCompetenciaSelecc() {
        return listaCombinada[indexProgramaSelecc].grupos[indexGrupoSelecc].competencias[indexCompetenciaSelecc];
    }

    //De los bloques para abajo se manejan con useState, ya que son los que cambian
    //// así se garantiza que se rendericen solo cuando se modifican y no cuando solo se seleccionan
    const pintandoCelda = useRef(false);
    const [bloques, setBloques] = useState([]);
    useLayoutEffect(() => {
        //Primero esto
        setOcupanciaBloques(ObtenerOcupanciaBloques());
        setTotalHorasTomadasComp(ObtenerHorasTomadasInstruc());
        //En caso de que sea carga de bloques para acomodar selecCRadioBloques
        if (cargandoBloques.current) {
            //Se retoma el index almacenado para seleccionar el que se había dejado seleccionado
            if (indexCompetenciaSelecc >= 0) {
                const indexRecuperado =
                    arrayIndexSeleccBloque
                        .current[indexProgramaSelecc][indexGrupoSelecc]
                        .competencias[indexCompetenciaSelecc];
                // console.log(indexRecuperado)
                setSeleccBloqueRadioArray(new Array(bloques.length).fill(false));
                setIndexBloqueSelecc({ ...indexBloqueSelecc, valor: indexRecuperado });
            }
            cargandoBloques.current = false;
        }
        //En caso de alteración de bloques por agregar nuevo bloque
        else if (agregandoBloque.current) {
            //Primero acomodo el tamaño de de la tabla de bloques
            setSeleccBloqueRadioArray(new Array(bloques.length).fill(false));
            //Selección real del bloque
            setIndexBloqueSelecc({ ...indexBloqueSelecc, valor: bloques.length - 1 });
            agregandoBloque.current = false;
        }
        //En caso de alteración de bloques por pintado o despintado de celda
        else if (pintandoCelda.current) {
            setBloqueSelecc(ObtenerBloqueSelecc());
            pintandoCelda.current = false;
        }
        //En caso de eliminación
        else if (eliminando.current) {
            //Primero acomodo el tamaño de de la tabla de bloques
            setSeleccBloqueRadioArray(new Array(bloques.length).fill(false));
            //Si los bloques quedan vacíos, se reinician los valores
            if (bloques.length <= 0) {
                setIndexBloqueSelecc({ ...indexBloqueSelecc, valor: -1 });
            } else {
                //Luego, selección real de objeto
                setIndexBloqueSelecc({ ...indexBloqueSelecc, valor: nuevoIndexSelecc.current });
            }
            nuevoIndexSelecc.current = -1;
            eliminando.current = false;
        }
    }, [bloques]);
    function ObtenerBloques() {
        return FranjasPersonalizadasToBloques(
            ObtenerGrupoSelecc().franjasPersonalizadas,
            ObtenerCompetenciaSelecc().id);
    }

    const [bloqueSelecc, setBloqueSelecc] = useState({});
    const [indexBloqueSelecc, setIndexBloqueSelecc] = useState({ valor: -1 });
    const [esPrimeraCargaBloque, setEsPrimeraCargaBloque] = useState(false)
    useEffect(() => {
        //almaceno el valor en el array de seleccIndexBloque
        if (arrayIndexSeleccBloque.current !== null && indexCompetenciaSelecc >= 0) {
            arrayIndexSeleccBloque
                .current[indexProgramaSelecc][indexGrupoSelecc]
                .competencias[indexCompetenciaSelecc] = indexBloqueSelecc.valor;
        }
        // console.log(indexBloqueSelecc.valor);
        if (indexBloqueSelecc.valor >= 0) {
            setBloqueSelecc(ObtenerBloqueSelecc());
            setSeleccBloqueRadioArray([
                ...seleccBloqueRadioArray.map((_, index) => index === indexBloqueSelecc.valor ? true : false)
            ]);
            setEsPrimeraCargaBloque(true);
        }
        else {
            setSeleccBloqueRadioArray(new Array(seleccBloqueRadioArray.length).fill(false));
            setBloqueSelecc({});
        }
    }, [indexBloqueSelecc]);
    function ObtenerBloqueSelecc() {
        return { ...bloques[indexBloqueSelecc.valor] };
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
        // console.log(grupo);
        setIndexProgramaSelecc(indexPrograma);
        setIndexGrupoSelecc(indexGrupo);
        //Se reinicia selecc competencia
        setIndexCompetenciaSelecc(-1);
        setIndexBloqueSelecc({ ...indexBloqueSelecc, valor: -1 });
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
    const cargandoBloques = useRef(false);

    const ManejarSeleccCompetencia = async (competencia, index) => {
        setIndexCompetenciaSelecc(index);
    }

    //CADA QUE SE SELECCIONA UN BLOQUE
    const ManejarCheckBloque = (bloque, i) => {
        setIndexBloqueSelecc({ ...indexBloqueSelecc, valor: i });
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
            //Calcular numero de bloque
            const numDeBloque = bloques.length > 0 ? bloques[bloques.length - 1].numBloque + 1 : 1;
            // console.log(ultimoIndice);
            const franjaVacia =
            {
                numBloque: numDeBloque,
                idCompetencia: ObtenerCompetenciaSelecc().id,
                ambiente: {},
                instructor: {}
            };
            if (ultimoIndice <= 336) {
                const auxListaCombinada = [...listaCombinada];
                auxListaCombinada[indexProgramaSelecc]
                    .grupos[indexGrupoSelecc]
                    .franjasPersonalizadas[337] = franjaVacia;
                franjaAlterada.current = [`${indexProgramaSelecc}-${indexGrupoSelecc}-${337}`];
                setListaCombinada(auxListaCombinada);
            } else {
                const auxListaCombinada = [...listaCombinada];
                auxListaCombinada[indexProgramaSelecc]
                    .grupos[indexGrupoSelecc]
                    .franjasPersonalizadas[ultimoIndice + 1] = franjaVacia;
                franjaAlterada.current =
                    [`${indexProgramaSelecc}-${indexGrupoSelecc}-${ultimoIndice + 1}`];
                setListaCombinada(auxListaCombinada);
            }

        } else {
            Swal.fire(`Ya están completas las horas requeridas para esta competencia,
                        debes liberar un bloque para poder crear otro.`);
        }

    }

    // SECCIÓN PARA ELIMINAR EL BLOQUE

    const nuevoIndexSelecc = useRef(-1);
    const eliminando = useRef(false);

    const ManejarRemoveBloque = (bloque, index) => {
        eliminando.current = true;
        const listaCombAux = [...listaCombinada];
        const auxFranjasAlteradas = [];
        //Si es un bloque lleno  o parcial
        if (bloques[index].franjas.size > 0) {
            bloques[index].franjas.forEach(franja => {
                listaCombAux[indexProgramaSelecc].grupos[indexGrupoSelecc]
                    .franjasPersonalizadas[franja] = undefined;
                auxFranjasAlteradas.push(`${indexProgramaSelecc}-${indexGrupoSelecc}-${franja}`);
            });
        }
        //Si es un bloque vacío
        else {
            const subLista = listaCombAux[indexProgramaSelecc].grupos[indexGrupoSelecc]
                .franjasPersonalizadas.slice(337);
            const indexObj = subLista.findIndex(objFranja =>
                objFranja.idCompetencia === ObtenerCompetenciaSelecc().id
                && objFranja.numBloque === bloque.numBloque
            );
            listaCombAux[indexProgramaSelecc].grupos[indexGrupoSelecc]
                .franjasPersonalizadas.splice(indexObj + 337, 1);
            auxFranjasAlteradas.push(`${indexProgramaSelecc}-${indexGrupoSelecc}-${indexObj + 337}`);
        }

        //Se calcula el nuevo índice de seleccion por haber elimminado
        let iAux = indexBloqueSelecc.valor;
        //Si se elimina el seleccionado y es el último de la lista Ó
        //// si se elimina otro que está por encima del seleccionado
        if ((index === indexBloqueSelecc.valor && index === bloques.length - 1) ||
            (index < indexBloqueSelecc.valor)) {
            iAux = indexBloqueSelecc.valor - 1;
        }

        // console.log("i vale ", iAux);
        nuevoIndexSelecc.current = iAux;
        franjaAlterada.current = auxFranjasAlteradas;
        setListaCombinada(listaCombAux);
    }

    /********************************************************************************/
    /******************* SECCIÓN DE PERSISTENCIA ************************************/
    const agregaciones = [];
    const modificaciones = [];
    const eliminaciones = [];

    const GuardarHorario = async () => {
        DetectarCambiosDatos();
        //Luego mandar las listas a repo para ejecutar las operaciones en bd
        try {
            const respuesta = await new FranjaServicio().GuardarHorario(agregaciones, modificaciones, eliminaciones);
            if (respuesta === 200) {
                Swal.fire("Cambios guardados correctamente!");
                GetListas(); //Se reinicia todo desde BD
                listaFranjasAlteradas.current = new Set();
            } else {
                Swal.fire("No se guardaron los cambios!, error de base de datos!");
            }
        } catch (error) {
            Swal.fire("No se guardaron los cambios!, error de base de datos!");
        }

    }

    function DetectarCambiosDatos() {
        listaFranjasAlteradas.current.forEach(franja => {
            const franjaArray = franja.split('-');
            const [indexPrograma, indexGrupo, indexFranja] = franjaArray.map(num => parseInt(num, 10));
            let franjaInicial =
                listaCombinadaInicial.current[indexPrograma]?.grupos[indexGrupo]?.franjasPersonalizadas[indexFranja];
            let franjaModificada =
                listaCombinada[indexPrograma]?.grupos[indexGrupo]?.franjasPersonalizadas[indexFranja];
            //Si era undefined y ahora tiene objeto
            if (!franjaInicial && franjaModificada && Object.values(franjaModificada).length > 0) {
                const auxTupla = {
                    franja: indexFranja,
                    idGrupo: listaCombinada[indexPrograma]?.grupos[indexGrupo].id,
                    idCompetencia: franjaModificada.idCompetencia,
                    numBloque: franjaModificada.numBloque,
                    idInstructor: franjaModificada?.instructor?.id || null,
                    idAmbiente: franjaModificada?.ambiente?.id || null
                }
                agregaciones.push(auxTupla);
            }
            //Si tenía un objeto, y ahora también, pero cambian sus datos (modificado)
            else if (franjaInicial && Object.values(franjaInicial).length > 0
                && franjaModificada && Object.values(franjaModificada).length > 0) {
                let sonIguales = true;
                for (const llave in franjaInicial) {
                    const datoUno = typeof franjaInicial[llave] === 'object' ?
                        JSON.stringify(franjaInicial[llave]) : String(franjaInicial[llave]);
                    const datoDos = typeof franjaModificada[llave] === 'object' ?
                        JSON.stringify(franjaModificada[llave]) : String(franjaModificada[llave]);
                    if (datoUno !== datoDos)
                        sonIguales = false
                }
                if (!sonIguales) {
                    // console.log("No son iguales");
                    const auxObjModificacion = {
                        franja: indexFranja,
                        idGrupo: listaCombinada[indexPrograma]?.grupos[indexGrupo].id,
                        idCompetencia: franjaModificada.idCompetencia,
                        numBloque: franjaModificada.numBloque,
                        idInstructor: franjaModificada?.instructor?.id || null,
                        idAmbiente: franjaModificada?.ambiente?.id || null
                    }
                    modificaciones.push(auxObjModificacion);
                }
            }
            //Si tenía objeto y ahora es undefined
            else if (franjaInicial && Object.values(franjaInicial).length > 0 && !franjaModificada) {
                const auxTuplaEliminacion = {
                    franja: indexFranja,
                    idGrupo: listaCombinada[indexPrograma]?.grupos[indexGrupo].id
                }
                eliminaciones.push(auxTuplaEliminacion);
            }
        });
    }

    const ManejarVolver = async () => {
        if (listaFranjasAlteradas.current.size > 0) {
            const respuesta = await new SWALConfirm().ConfirmAlert("¿Desea guardar los cambios antes de salir?");
            if (respuesta === "si") {
                GuardarHorario();
                navegar(-1);
            }
            else if (respuesta === "no") navegar(-1);
        } else {
            navegar(-1);
        }
    }

    /********************************************************************************/
    /********************************************************************************/

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
                                            indexBloqueSelecc={indexBloqueSelecc.valor}
                                            bloque={bloqueSelecc}
                                            bloqueNumero={bloqueSelecc ? bloqueSelecc.numBloque : '?'}
                                            ocupanciaBloques={ocupanciaBloques}
                                            esPrimeraCargaBloque={esPrimeraCargaBloque}
                                            devolverFalsePrimeraCarga={() => setEsPrimeraCargaBloque(false)}
                                            listaCompleta={listaCombinada}
                                            actualizarListaCompleta={(lista) => setListaCombinada(lista)}
                                            setPintandoCelda={() => { return pintandoCelda.current = true }}
                                            setFranjaAlterada={(f) => franjaAlterada.current = (f)} />
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
                <BotonPositivo
                    texto={'guardar'}
                    disabledProp={listaFranjasAlteradas.current.size <= 0}
                    onClick={GuardarHorario} />
                <BotonDestructivo texto={'volver'} onClick={ManejarVolver} />
            </div>
        </div>
    );
}
export default Horario;