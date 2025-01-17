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


const Horario = () => {
    const navegar = useNavigate();
    const [horarioConfirmado, setHorarioConfirmado] = useState(false);

    const [listaProgramas, setListaProgramas] = useState([]);
    const [listaGrupos, setListaGrupos] = useState([]);
    const [listaCombinada, setListaCombinada] = useState([]);
    //Para pintar los grupos y programas según si han sido completados o no
    //Se supone que de esta manera se sincroniza la estructura de índices en la lista
    //con la listaCombinada.
    const [programasGruposCompletados, setProgramasGruposCompletados] = useState([]);

    const [grupoSeleccionado, setGrupoSeleccionado] = useState({});
    const [competenciaSelecc, setCompetenciaSelecc] = useState({});
    const [competenciasGrupo, setCompetenciasGrupo] = useState([]);
    const [bloqueSelecc, setBloqueSelecc] = useState({});
    const [numDeBloque, setNumDeBloque] = useState(0);
    const [bloques, setBloques] = useState([]);

    useLayoutEffect(() => {
        GetListas();
    }, []);


    async function GetListas() {
        try {
            const programas = new ProgramaServicio().CargarLista();
            const grupos = new GrupoServicio().CargarLista();
            const franjas = new FranjaServicio().CargarFranjas();
            const respuesta = await Promise.all([programas, grupos, franjas]);
            const auxProgramas = respuesta[0];
            let auxGrupos = respuesta[1];
            const auxFranjas = respuesta[2];

            //Meto la key "franjas" a cada grupo con sus respectivas franjas desde bd
            //y si no tiene se agrega un array vacío
            auxGrupos = auxGrupos.map(grupo => (
                {
                    ...grupo,
                    franjas: auxFranjas.filter(franja => (franja.idGrupo === grupo.id))
                }
            ));

            setListaGrupos([...auxGrupos]);
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
            if (Array.isArray(listaGrupos) && listaGrupos.length > 0) {
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
                grupos: listaGrupos.filter(grupo => grupo.idPrograma === programa.id)
            }
        });
    }

    const ManejarSeleccGrupo = (grupo, indexPrograma, indexGrupo) => {
        setGrupoSeleccionado(grupo);
    }

    useEffect(() => {
        if (Object.values(grupoSeleccionado).length > 0) {
            PedirCompetenciasPiscina();
            setCompetenciaSelecc({});
            setBloques([]);
            setBloqueSelecc({});
        }
    }, [grupoSeleccionado]);

    useEffect(() => {
        setBloqueSelecc({});
    }, [competenciaSelecc]);

    useEffect(() => {
        
    }, [bloqueSelecc]);

    const ManejarCheckBloque = (bloque, numero) => {
        setBloqueSelecc(bloque);
        setNumDeBloque(numero);
    }

    // useEffect(() => {
    //     if (competenciasGrupo.length > 0) {
    //         //Cuando se cargan las competencias del grupo según la piscina
    //     }
    // }, [competenciasGrupo]);

    async function PedirCompetenciasPiscina() {
        try {
            setCompetenciasGrupo(await new CompetenciaServicio()
                .CargarListaSegunPiscina(grupoSeleccionado.id));
        } catch (error) {
            Swal.fire(error);
        }
    }

    const ManejarSeleccCompetencia = (competencia) => {
        setCompetenciaSelecc(competencia);
    }

    useEffect(() => {

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
                                        <th>competencias</th>
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
                                <table className='tablaBloquesCompetencia'>
                                    <thead>
                                        <th>bloques</th>
                                    </thead>
                                    <tbody>
                                        {
                                            bloques.map((bloque, index) => (
                                                <tr key={grupoSeleccionado.coigoGrupo + competenciaSelecc.id + index}>
                                                    <td>
                                                        <input type='radio' name='seleccBloque'
                                                            id={bloque.idInstructor.toString() + index.toString()} 
                                                            onChange={() => ManejarCheckBloque(bloque, index+1)}>
                                                        </input>
                                                        <label htmlFor={bloque.idInstructor.toString() + index.toString()}>
                                                            Bloque {(index + 1).toString()}
                                                        </label>
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                            </div>
                            <div className='ladoDerInterno'>
                                {
                                    Object.keys(competenciaSelecc).length > 0 ?
                                        <CreacionHorario competencia={competenciaSelecc}
                                            franjas={grupoSeleccionado.franjas || []}
                                            setListaBloques={(b) => setBloques(b)} 
                                            bloque={bloqueSelecc}
                                            bloqueNumero={numDeBloque}/>
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