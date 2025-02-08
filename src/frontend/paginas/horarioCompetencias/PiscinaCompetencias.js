import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import BotonPositivo from '../../componentes/botonPositivo/BotonPositivo';
import BotonVolver from '../../componentes/botonVolver/BotonVolver';
import MarcoGralHorario from '../../componentes/marcoGeneralHorario/MarcoGralHorario';
import ProgramasGrupos from '../../componentes/programasGrupos/ProgramasGrupos';
import './PiscinaCompetencias.css';
import TarjetaCompetencia from '../../componentes/tarjetaCompetencia/TarjetaCompetencia';
import ProgramaServicio from '../../../backend/repository/servicios/ProgramaService';
import Swal from 'sweetalert2';
import GrupoServicio from '../../../backend/repository/servicios/GrupoService';
import { useNavigate } from 'react-router-dom';
import CrudCompetencias from '../crudCompetencias/CrudCompetencias';
import CompetenciaServicio from '../../../backend/repository/servicios/CompetenciaService';
import SWALConfirm from '../../alertas/SWALConfirm';
import BotonDestructivo from '../../componentes/botonDestructivo/BotonDestructivo';
import PiscinaServicio from '../../../backend/repository/servicios/PiscinaService.js';
import FusionesServicio from '../../../backend/repository/servicios/FusionesService.js';

const PiscinaCompetencias = () => {

    const navegar = useNavigate();

    useLayoutEffect(() => {
        GetListas();
    }, []);

    const [listaCombinada, setListaCombinada] = useState([]);

    const [btnConfirmarOn, setBtnConfirmarOn] = useState(false);
    const [abrirListaComp, setAbrirListaComp] = useState(false);

    //lista que guarda las nuevas agregaciones
    const [agregaciones, setAgregaciones] = useState(new Set());

    let [eliminaciones, setEliminaciones] = useState(new Set());
    // PROCESO DE AGREGAR COMPETENCIAS

    // useEffect(() => {
    //     console.log(agregaciones);
    //     console.log(eliminaciones);
    // }, [agregaciones, eliminaciones]);

    const ManejarSeleccCompetencias = (listaComp) => {
        const combinadaAux = [...listaCombinada];

        listaComp.forEach(competencia => {
            const auxSetTupla = `${grupoSelecc.id}-${competencia.id}`;
            if (eliminaciones.has(auxSetTupla)) {
                setEliminaciones(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(auxSetTupla);
                    return newSet;
                });
            } else {
                setAgregaciones(prev => new Set(prev).add(auxSetTupla));
            }

            combinadaAux[indexSeleccPrograma]
                .grupos[indexSeleccGrupo]
                .competencias.set(competencia.id, competencia);
        });

        setListaCombinada(combinadaAux);
    }

    //Para pintar los grupos y programas según si han sido completados o no
    //Se supone que de esta manera se sincroniza la estructura de índices en la lista
    //con la listaCombinada.
    const [programasGruposCompletados, setProgramasGruposCompletados] = useState([]);

    useEffect(() => {
        if (programasGruposCompletados.length > 0 &&
            programasGruposCompletados.every(programa => programa.completado === true))
            setBtnConfirmarOn(true);
        else setBtnConfirmarOn(false);
    }, [programasGruposCompletados]);

    useEffect(() => {
        //Esto crea una estructura de una lsita de objetos programa que tienen
        //el estado de completado en false, además una llave que es un array
        //del mismo tamaño de los grupos que contiene, y un false por cada uno de ellos
        //para que coincida con la estructura de la lista
        if (listaCombinada.length > 0) {
            const listaAux = listaCombinada.map(programa => {
                const gruposCompletados = programa.grupos.filter(grupo =>
                    grupo.competencias.size > 0
                ).map(grupo => grupo.id);
                const programaCompletado = programa.grupos.length === gruposCompletados.length;
                return {
                    completado: programaCompletado,
                    gruposCompletados: gruposCompletados
                }
            });
            setProgramasGruposCompletados([...listaAux]);

            //Se reinician valores si se está guardando
            if (guardando.current) {
                setAgregaciones(new Set());
                setEliminaciones(new Set());
                setGrupoSelecc(
                    listaCombinada[indexSeleccGrupo].grupos[indexSeleccGrupo]
                );
                guardando.current = false;
            }
        }
    }, [listaCombinada]);

    const [grupoSelecc, setGrupoSelecc] = useState({});
    //estos index recogen el valor del index en la lista del componente ProgramasGrupos
    const [indexSeleccPrograma, setIndexSeleccPrograma] = useState(-1);
    const [indexSeleccGrupo, setIndexSeleccGrupo] = useState(-1);
    const [programaSelecc, setProgramaSelecc] = useState({});

    async function GetListas() {
        try {
            const programas = new ProgramaServicio().CargarLista();
            const grupos = new GrupoServicio().CargarLista();
            const piscinaCompetencias = new PiscinaServicio().CargarPiscinas();
            const fusiones = new FusionesServicio().CargarLista();
            let [auxProgramas, auxGrupos, auxPiscinas, auxFusiones] =
                await Promise.all([programas, grupos, piscinaCompetencias, fusiones]);

            //Filtro grupos para que no aparezcan los que están como huéspedes
            auxGrupos = auxGrupos
                .filter(grupo => !auxFusiones.some(fusion => fusion.idHuesped === grupo.id));

            //Competencias únicas
            const idsCompetenciasUnicos = new Set();
            auxPiscinas.forEach(tupla => idsCompetenciasUnicos.add(tupla.idCompetencia));
            const competenciasMap = new Map();
            const respuestaCompetencias =
                await new CompetenciaServicio().CargarCompetencias([...idsCompetenciasUnicos]);

            respuestaCompetencias.forEach(comp => {
                competenciasMap.set(comp.id, comp);
            });

            //Se agregan las competencias según piscina a cada grupo
            auxGrupos = auxGrupos.map(grupo => {
                const nuevoGrupo = {
                    ...grupo,
                    competencias: new Map()
                }
                auxPiscinas.forEach(tupla => {
                    if (tupla.idGrupo === grupo.id) {
                        nuevoGrupo.competencias
                            .set(tupla.idCompetencia, competenciasMap.get(tupla.idCompetencia));
                    }
                });
                return nuevoGrupo;
            });
            //De último ya que activa todo 
            CombinarLista(auxProgramas, auxGrupos);
        } catch (error) {
            console.log(error);
            Swal.fire(error);
            navegar(-1);
        }
    }

    function CombinarLista(programas, grupos) {
        const combinadaAux = programas.map(programa => {
            return {
                ...programa,
                grupos: grupos.filter(grupo => grupo.idPrograma === programa.id)
            }
        });
        setListaCombinada(combinadaAux);
    }

    const ManejarClicPositivo = () => {
        setAbrirListaComp(true);
    }

    const ManejarClicDestructivo = (competencia) => {
        const auxSetTupla = `${grupoSelecc.id}-${competencia.id}`;
        if (agregaciones.has(auxSetTupla)) setAgregaciones(prev => {
            const newSet = new Set(prev);
            newSet.delete(auxSetTupla);
            return newSet;
        });
        else setEliminaciones(prev => new Set(prev).add(auxSetTupla));

        const auxCombinada = [...listaCombinada];
        auxCombinada[indexSeleccPrograma]
            .grupos[indexSeleccGrupo]
            .competencias.delete(competencia.id);
        setListaCombinada(auxCombinada);
    }

    const ManejarGrupoSelecc = (grupo, indexPrograma, indexGrupo) => {
        setGrupoSelecc(grupo);
        setProgramaSelecc({
            ...listaCombinada[indexPrograma],
            grupos: null
        });
        setIndexSeleccGrupo(indexGrupo);
        setIndexSeleccPrograma(indexPrograma);
    }

    function ConvertirATuplasPiscina() {
        const tuplasAgregacion = [];
        const tuplasEliminacion = [];

        agregaciones.forEach((clave, agregacion) => {
            const [idGrupo, idComp] = agregacion.split('-');
            // console.log(idGrupo, idComp);
            tuplasAgregacion.push({
                idGrupo: idGrupo,
                idCompetencia: idComp
            });
        });

        eliminaciones.forEach((clave, eliminacion) => {
            const [idGrupo, idComp] = eliminacion.split('-');
            // console.log(idGrupo, idComp);
            tuplasEliminacion.push({
                idGrupo: idGrupo,
                idCompetencia: idComp
            });
        });

        return [tuplasAgregacion, tuplasEliminacion];
    }

    const guardando = useRef(false);
    async function GuardarPiscina(vieneDeVolver) {
        if (!vieneDeVolver) {
            const alerta = await new SWALConfirm().ConfirmAlert('¿Desea guardar el progreso actual?');
            if (alerta === 'si') {
                try {
                    guardando.current = true;
                    const [tuplasAgregacion, tuplasEliminacion] = ConvertirATuplasPiscina();
                    const respuesta = await new PiscinaServicio()
                        .GuardarPiscinas(tuplasAgregacion, tuplasEliminacion);
                    Swal.fire(respuesta);
                    GetListas();
                } catch (error) {
                    Swal.fire(error);
                }
            }
        } else {
            try {
                guardando.current = true;
                const [tuplasAgregacion, tuplasEliminacion] = ConvertirATuplasPiscina();
                const respuesta = await new PiscinaServicio()
                    .GuardarPiscinas(tuplasAgregacion, tuplasEliminacion);
                Swal.fire(respuesta);
                GetListas();
            } catch (error) {
                Swal.fire(error);
            }
        }
    }

    const ManejarVolver = async () => {
        if (agregaciones.size > 0 || eliminaciones.size > 0) {
            const respuesta = await new SWALConfirm().ConfirmAlert('¿Desea guardar los cambios antes de salir?');
            if (respuesta === 'si') {
                GuardarPiscina(true);
                navegar(-1);
            } else if (respuesta === 'no') {
                navegar(-1);
            }
        } else {
            navegar(-1);
        }
    }

    return (
        <div id='contPiscinaCompetencias'>
            <MarcoGralHorario titulo={'Piscina de Competencias'}>
                <ProgramasGrupos grupoSelecc={ManejarGrupoSelecc} listaProgramas={listaCombinada}
                    listaParaListaCompletado={programasGruposCompletados} />
                <div className='ladoDerechoCompetenciasPool'>
                    {
                        Object.keys(grupoSelecc).length <= 0 ?
                            <h1>Selecciona un grupo del panel izquierdo...</h1>
                            :
                            <div className='tarjetaTitulo'>
                                <h2>Agregar todas las competencias requeridas para el
                                    grupo {grupoSelecc.codigoGrupo} trimestre {grupoSelecc.trimestreLectivo}
                                </h2>
                                <div className='contBtnAgregarComp'>
                                    <BotonPositivo texto={'+'} onClick={ManejarClicPositivo} />
                                </div>
                            </div>
                    }
                    {
                        Object.keys(grupoSelecc).length > 0 ?
                            Array.from(grupoSelecc.competencias.values()).map(competencia =>
                                <TarjetaCompetencia competencia={competencia}
                                    onClicDestructivo={() => ManejarClicDestructivo(competencia)} />
                            )
                            : null
                    }
                </div>
            </MarcoGralHorario>
            <div className='contBotones'>
                <div className='contEstadoProgramas'>
                    <h2>Estado:</h2>
                    <h3 style={{ color: btnConfirmarOn ? 'green' : 'red' }}>
                        {btnConfirmarOn ? 'piscinas completas' : 'piscinas incompletas...'}
                    </h3>
                </div>
                <BotonPositivo texto={'guardar'} onClick={() => GuardarPiscina()}
                    disabledProp={agregaciones.size <= 0 && eliminaciones.size <= 0} />
                <BotonDestructivo texto={'volver'} onClick={ManejarVolver} />
            </div>
            {
                abrirListaComp && <CrudCompetencias modoSeleccionMultiple={true}
                    programaBusqueda={programaSelecc} onCloseProp={() => setAbrirListaComp(false)}
                    selecciones={(lista) => ManejarSeleccCompetencias(lista)}
                    yaVienenSeleccionadas={Array.from(grupoSelecc.competencias.values())} />
            }
        </div>
    );
}
export default PiscinaCompetencias;