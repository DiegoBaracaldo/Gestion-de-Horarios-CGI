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
    const [ocupanciaJornada, setOcupanciaJornada] = useState([]);
    const [tipoJornada, setTipoJornada] = useState('');
    const [bloques, setBloques] = useState([]);
    const [seleccBloqueRadioArray, setSeleccBloqueRadioArray] = useState([]);

    useLayoutEffect(() => {
        GetListas();
    }, []);

    useEffect(() => {
        setListaGruposDinammica([...listaGruposInicial]);
    }, [listaGruposInicial]);

    useEffect(() => {
        //console.log(seleccBloqueRadioArray);
        if (indexBloqueSelecc >= 0) {
            setBloqueSelecc(bloques[seleccBloqueRadioArray.findIndex(valor => valor === true)]);
        }
    }, [seleccBloqueRadioArray]);

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

    useEffect(() => {
        if (Object.values(grupoSeleccionado).length > 0) {
            console.log(grupoSeleccionado.competencias);
            PedirDatosForaneosGrupo();
            setCompetenciasGrupo(grupoSeleccionado.competencias);
            setCompetenciaSelecc({});
            setBloques([]);
            setBloqueSelecc({});
        }
    }, [grupoSeleccionado]);

    useEffect(() => {
        setBloques([]);
        setBloqueSelecc({});
    }, [competenciaSelecc]);

    useEffect(() => {

    }, [bloqueSelecc]);

    const ManejarCheckBloque = (bloque, i) => {
        let auxNuevoSeleccLista = [...seleccBloqueRadioArray];
        auxNuevoSeleccLista = auxNuevoSeleccLista.map((selecc, j) => (i === j ? true : false));
        setSeleccBloqueRadioArray(auxNuevoSeleccLista);
        setBloqueSelecc(bloque);
        setIndexBloqueSelecc(i);
    }

    // useEffect(() => {
    //     if (competenciasGrupo.length > 0) {
    //         //Cuando se cargan las competencias del grupo según la piscina
    //     }
    // }, [competenciasGrupo]);

    async function PedirCompetenciasPorGrupo(idGrupo) {
        try {
            return await new CompetenciaServicio().CargarListaSegunPiscina(idGrupo);
        } catch (error) {
            Swal.fire('Error a obtener las piscinas de competencias de los grupos...', error);
            navegar(-1);
        }
    }

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
            setOcupanciaJornada(listaFiltradaOcupancia);

        } catch (error) {
            Swal.fire('Error a obtener los datos del grupo');
            navegar(-1);
        }
    }

    const ManejarSeleccCompetencia = (competencia) => {
        setIndexBloqueSelecc(-1);
        setCompetenciaSelecc(competencia);
    }

    //Se agrega un nuevo bloque
    const ManejarAddBloque = () => {
        const auxBloques = [...bloques];
        const cantidadObj = auxBloques.length;
        const objAux = {
            idInstructor: null,
            idAmbiente: null,
            franjas: []
        };
        if (cantidadObj > 0) objAux.numBloque = Math.max(...auxBloques.map(bloque => (bloque.numBloque))) + 1;
        else objAux.numBloque = 1;
        auxBloques.push(objAux);
        setBloques([...auxBloques]);
    }

    const ManejarRemoveBloque = (index) => {
        const listaAux = [...bloques];
        //Si se tiene seleccionado el último mientras se elimina uno, incluyéndolo
        if (indexBloqueSelecc + 1 === bloques.length || index < indexBloqueSelecc) {
            setIndexBloqueSelecc(indexBloqueSelecc - 1);
        }
        listaAux.splice(index, 1);
        setBloques([...listaAux]);
    }

    //Cada que se modifican los bloques
    useEffect(() => {
        if (bloques.length > 0) {
            // const objAux = {
            //     idGrupo: grupoSeleccionado.id,
            //     idCompetencia: competenciaSelecc.id,
            //     bloques: bloques
            // }
            // listaAux.push(objAux);
            // setContObjBloques(listaAux);
            //Se ajustan los checked de los radio de bloques cada que cambian por agregar o eliminar
            if (indexBloqueSelecc >= 0) {
                const listaAuxSelecc = bloques.map((bloque, i) => i === indexBloqueSelecc ? true : false);
                setSeleccBloqueRadioArray([...listaAuxSelecc]);
            }
            else {
                setSeleccBloqueRadioArray(bloques.map(() => false));
            }
            //Ahora, dependiendo de si se agregó o eliminó

        } else {
            setSeleccBloqueRadioArray([]);
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
                                                            id={grupoSeleccionado.codigoGrupo + comp.id} onChange={() => ManejarSeleccCompetencia(comp)}>
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
                                                        <button onClick={ManejarAddBloque}>+</button></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    bloques.map((bloque, index) => (
                                                        <tr key={grupoSeleccionado.codigoGrupo + competenciaSelecc.id + index}>
                                                            <td className='colBloque'>
                                                                <input type='radio' name='seleccBloque'
                                                                    id={'bloqueComp' + index}
                                                                    onChange={() => ManejarCheckBloque(bloque, index)}
                                                                    checked={seleccBloqueRadioArray[index]}>
                                                                </input>
                                                                <label htmlFor={'bloqueComp' + index}>
                                                                    <button onClick={() => ManejarRemoveBloque(index)}>
                                                                        X
                                                                    </button>
                                                                    <span>
                                                                        Bloque {bloque.numBloque}
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
                                    Object.keys(competenciaSelecc).length > 0 ?
                                        <CreacionHorario competencia={competenciaSelecc}
                                            franjas={grupoSeleccionado.franjas || []}
                                            setListaBloques={(b) => setBloques(b)}
                                            bloque={bloqueSelecc}
                                            bloqueNumero={bloqueSelecc ? bloqueSelecc.numBloque : '?'}
                                            ocupanciaJornada={ocupanciaJornada}
                                            tipoJornada={tipoJornada} />
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