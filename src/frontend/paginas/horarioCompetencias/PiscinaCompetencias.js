import { useEffect, useLayoutEffect, useState } from 'react';
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

const PiscinaCompetencias = () => {

    const navegar = useNavigate();

    useLayoutEffect(() => {
        GetListas();
    }, []);

    const [listaProgramas, setListaProgramas] = useState([]);
    const [listaGrupos, setListaGrupos] = useState([]);
    const [listaPiscinas, setListaPiscinas] = useState([]);
    //variable para comparar al guardar los cambios de manera eficiente
    let listaPiscinasInicial = [];
    const [listaCombinada, setListaCombinada] = useState([]);

    const [btnConfirmarOn, setBtnConfirmarOn] = useState(false);
    const [abrirListaComp, setAbrirListaComp] = useState(false);

    const [compSeleccionadas, setCompSeleccionadas] = useState([]);
    //lista que guarda las nuevas agregaciones
    const [agregados, setAgregados] = useState([]);
    // useEffect(() => {
    //     console.log("agregados", agregados);
    //     console.log('eliminados', eliminados);
    // }, [agregados]);
    let [eliminados, setEliminados] = useState([]);
    // useEffect(() => {
    //     console.log("agregados", agregados);
    //     console.log('eliminados', eliminados);
    // }, [eliminados]);

    // PROCESO DE AGREGAR COMPETENCIAS
    useEffect(() => {
        if (compSeleccionadas.length > 0 && Object.keys(grupoSelecc).length > 0) {
            //Agrego las competencias a la lista de competencias al grupo dentro de la lista de grupos
            const indexObjeto = listaGrupos.findIndex(obj => obj.codigoGrupo === grupoSelecc.codigoGrupo);

            if (indexObjeto >= 0) {
                let listaAux = [...listaGrupos];
                const listaAuxCompGrupo = listaAux[indexObjeto].competencias;
                listaAux[indexObjeto].competencias = [...listaAuxCompGrupo, ...compSeleccionadas];
                //ahora se agregan los cambios a "agregados" antes de cambiar el estado de listaGrupos
                compSeleccionadas.forEach(competencia => {
                    //Recojo la clave de código único
                    const codUnico = grupoSelecc.id.toString() + competencia.id.toString();
                    //Analizo si ha sido eliminada en el proceso actual y se elimina de la lista
                    //Antes de agregarse a los agregados
                    const indexEliminado = eliminados
                        .findIndex(eliminado => eliminado.idGrupo === grupoSelecc.id
                            && eliminado.idCompetencia === competencia.id);
                    if (indexEliminado >= 0) {
                        const listaTempEliminados = eliminados;
                        listaTempEliminados.splice(indexEliminado, 1);
                        setEliminados([...listaTempEliminados]);
                    } else {
                        //Analizo si ya está agregada la relación para evitar que se repita
                        const yaExisteRelacion =
                            agregados.some(agregado => agregado.codigoUnico === codUnico);
                        if (!yaExisteRelacion) {
                            console.log("agregando...");
                            const listaTemporal = agregados;
                            listaTemporal.push({
                                ...{
                                    idGrupo: grupoSelecc.id,
                                    idCompetencia: competencia.id,
                                    //Código para identificar si es nueva agregación más fácilmente al eliminar
                                    codigoUnico: codUnico
                                }
                            });
                            setAgregados([...listaTemporal]);

                        }
                    }
                });

                //Actualizar listaGrupos
                setListaGrupos(listaAux);
                //Poner chulo o no si el grupo tiene al menos una competencia
                PintarProgramasGrupos(listaAux, indexObjeto, true);
            }
        }
    }, [compSeleccionadas]);

    //Para pintar los grupos y programas según si han sido completados o no
    //Se supone que de esta manera se sincroniza la estructura de índices en la lista
    //con la listaCombinada.
    const [programasGruposCompletados, setProgramasGruposCompletados] = useState([]);

    useEffect(() => {
        //Esto crea una estructura de una lsita de objetos programa que tienen
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
                                    if (grupo.competencias.length > 0) return true;
                                    else return false;
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

    const [grupoSelecc, setGrupoSelecc] = useState({});
    //estos index recogen el valor del index en la lista del componente ProgramasGrupos
    const [indexSeleccPrograma, setIndexSeleccPrograma] = useState(-1);
    const [indexSeleccGrupo, setIndexSeleccGrupo] = useState(-1);
    const [programaSelecc, setProgramaSelecc] = useState({});

    //Cada que se selecciona un grupo
    useEffect(() => {
        if (Object.keys(grupoSelecc).length > 0) {
            //redundante pero es Para que se vean las competencias de cada grupo (por el renderizado )
            setListaGrupos([...listaGrupos]);
            //para llevar el rastro del programa al que pertenece el grupo seleccionado
            //Se asegura que se haga cambio de programa seleccionado para ahorrar procesamiento
            const idProgramaGrupoSelecc = grupoSelecc.idPrograma;
            if (idProgramaGrupoSelecc !== programaSelecc.id) {
                setProgramaSelecc(listaProgramas
                    .find(programa => programa.id === grupoSelecc.idPrograma)
                );
            }
        }
    }, [grupoSelecc]);

    //cada que se selecciona un programa nuevo mediante la selección de grupos
    useEffect(() => {

    }, [programaSelecc]);

    useEffect(() => {
        if (Array.isArray(listaProgramas) && listaProgramas.length > 0) {
            if (Array.isArray(listaGrupos) && listaGrupos.length > 0) {
                setListaCombinada(CombinarLista());
            }
        }
    }, [listaProgramas]);

    async function GetCompetencias() {
        try {

        } catch (error) {

        }
    }

    async function GetListas() {
        try {
            const programas = new ProgramaServicio().CargarLista();
            const grupos = new GrupoServicio().CargarLista();
            const piscinaCompetencias = new PiscinaServicio().CargarPiscinas();
            const respuesta = await Promise.all([programas, grupos, piscinaCompetencias]);
            const auxProgramas = respuesta[0];
            const auxGrupos = respuesta[1];
            const auxPiscinas = respuesta[2];
            listaPiscinasInicial = [...auxPiscinas];

            //analiza los programas a los cuales traer las competencias teniendo en cuenta
            //las piscinas cargadas

            const auxListasProgramasPiscinas = [];
            for (const tupla of listaPiscinasInicial) {
                //capturo el id del programa de cada grupo que está en la piscina
                const grupoEncontrado = auxGrupos.find(grupo => grupo.id === tupla.idGrupo);
                const idProgramaAux = grupoEncontrado ? grupoEncontrado.idPrograma : null;
                //mirar que no se haya incluido ya y lo agrego si no se ha incluido
                if (!auxListasProgramasPiscinas.includes(idProgramaAux) && idProgramaAux !== null)
                    auxListasProgramasPiscinas.push(idProgramaAux);
            }
            //console.log(auxListasProgramasPiscinas);

            //con la lista de ids programa descargo un array con las listas de competencias
            let respuestaCompetencias = await Promise.all(
                auxListasProgramasPiscinas
                    .map(idprograma => new CompetenciaServicio().CargarLista(idprograma))
            );
            //console.log(respuestaCompetencias);

            //aplano la lista de listas de competencias para tener solo una lista completa
            respuestaCompetencias = respuestaCompetencias.flat();

            //asigno las competencias que le pertenecen al grupo y la lista grupos de una vez
            setListaGrupos([...auxGrupos.map(grupo => {
                return {
                    ...grupo,
                    competencias: listaPiscinasInicial.map(relacion => {
                        if (grupo.id === relacion.idGrupo) {
                            const auxRelacion = respuestaCompetencias
                                .find(comp => comp.id === relacion.idCompetencia);
                            return auxRelacion;
                        }
                        return null;
                    }).filter(comp => comp !== null)
                }
            })]);
            setListaPiscinas([...auxPiscinas]);
            //setListaProgramas de último ya que activa todo 
            setListaProgramas([...auxProgramas]);
        } catch (error) {
            console.log(error);
            Swal.fire(error);
            navegar(-1);
        }
    }

    function CombinarLista() {
        return listaProgramas.map(programa => {
            return {
                ...programa,
                grupos: listaGrupos.filter(grupo => grupo.idPrograma === programa.id)
            }
        });
    }

    function PintarProgramasGrupos(listaAux, indexGrupo, pintadoManual) {
        if (pintadoManual) {
            //console.log("pintando manual");
            if (indexSeleccPrograma >= 0 && indexSeleccGrupo >= 0) {
                //Poner chulo o no si el grupo tiene al menos una competencia
                const listAux = [...programasGruposCompletados];
                listAux[indexSeleccPrograma].gruposCompletados[indexSeleccGrupo] =
                    listaAux[indexGrupo].competencias.length >= 1;
                //ahora analizo si el programa está completado para pintarlo
                listAux[indexSeleccPrograma].completado =
                    listAux[indexSeleccPrograma].gruposCompletados.every(valor => valor === true);
                setProgramasGruposCompletados(listAux);
                //Ahora analizo si todos los programas están listos para habilitar botón confirmar
                setBtnConfirmarOn(listAux.every(programa => programa.completado === true));
            }
        }
    }

    const ManejarClicPositivo = () => {
        setAbrirListaComp(true);
    }

    const ManejarClicDestructivo = (competencia) => {
        //Quito una competencia a la lista de competencias al grupo dentro de la lista de grupos
        const indexObjeto = listaGrupos.findIndex(obj => obj.codigoGrupo === grupoSelecc.codigoGrupo);

        if (indexObjeto >= 0) {
            let listaAux = [...listaGrupos];
            listaAux[indexObjeto].competencias =
                listaAux[indexObjeto].competencias.filter(comp => comp.id !== competencia.id);
            //Agregar relación de eliminación antes de actualizar listaGrupos
            const codigoUnico = grupoSelecc.id.toString() + competencia.id.toString();
            //Se analiza si se elimina una nueva agregación o es vieja de persistencia
            const indiceAuxAgregado = agregados.findIndex(agregado => agregado.codigoUnico === codigoUnico);
            if (indiceAuxAgregado < 0) {
                //Si es vieja de persistencia
                const listaTemporal = [...eliminados];
                listaTemporal.push({
                    idGrupo: grupoSelecc.id,
                    idCompetencia: competencia.id,
                    codigoUnico: grupoSelecc.id.toString() + competencia.id.toString()
                });
                setEliminados(listaTemporal);
            } else {
                //Si es nueva, es decir, de memoria
                const listaTemporal = [...agregados];
                listaTemporal.splice(indiceAuxAgregado, 1);
                setAgregados(listaTemporal);
            }
            //Se actualiza la listaGrupos
            setListaGrupos(listaAux);
            //Poner chulo o no si el grupo tiene al menos una competencia
            PintarProgramasGrupos(listaAux, indexObjeto, true);
        }
    }

    const ManejarGrupoSelecc = (grupo, indexPrograma, indexGrupo) => {
        setGrupoSelecc(grupo);
        setIndexSeleccGrupo(indexGrupo);
        setIndexSeleccPrograma(indexPrograma);
    }

    async function GuardarPiscina(vieneDeVolver) {
        if (!vieneDeVolver) {
            if (agregados.length > 0 || eliminados.length > 0) {
                const alerta = await new SWALConfirm().ConfirmAlert('¿Desea guardar el progreso actual?');
                if (alerta) {
                    try {
                        const respuesta = await new PiscinaServicio().GuardarPiscinas(agregados, eliminados);
                        Swal.fire(respuesta);
                    } catch (error) {
                        Swal.fire(error);
                    }
                }
            } else {
                Swal.fire('No hay cambios que guardar!');
            }
        } else {
            try {
                const respuesta = await new PiscinaServicio().GuardarPiscinas(agregados, eliminados);
                Swal.fire(respuesta);
            } catch (error) {
                Swal.fire(error);
            }
        }
        setAgregados([]);
        setEliminados([]);
    }

    const ManejarVolver = async () => {
        if (agregados.length > 0 || eliminados.length > 0) {
            const respuesta = await new SWALConfirm().ConfirmAlert('¿Desea guardar los cambios antes de salir?');
            if (respuesta) {
                GuardarPiscina(true);
                navegar(-1);
            } else {
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
                        Object.keys(grupoSelecc).length < 1 ?
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
                        Array.isArray(listaGrupos) ?
                            listaGrupos.map(item => {
                                if (item.codigoGrupo === grupoSelecc.codigoGrupo
                                    && item.competencias.length > 0) {
                                    return item.competencias.map(competencia => {
                                        return (
                                            <TarjetaCompetencia competencia={competencia}
                                                onClicDestructivo={() => ManejarClicDestructivo(competencia)} />)
                                    });
                                }
                            })
                            : null
                    }
                </div>
            </MarcoGralHorario>
            <div className='contBotones'>
                <div className='contEstadoProgramas'>
                    <h2>Estado:</h2>
                    <h3 style={{color: btnConfirmarOn ? 'green' : 'red'}}>
                        {btnConfirmarOn ? 'piscinas completas' : 'piscinas incompletas...'}
                    </h3>
                </div>
                <BotonPositivo texto={'guardar'} onClick={() => GuardarPiscina()}
                    disabledProp={agregados.length <= 0 && eliminados.length <= 0} />
                <BotonDestructivo texto={'volver'} onClick={ManejarVolver} />
            </div>
            {
                abrirListaComp && <CrudCompetencias modoSeleccionMultiple={true}
                    programaBusqueda={programaSelecc} onCloseProp={() => setAbrirListaComp(false)}
                    selecciones={(lista) => setCompSeleccionadas(lista)}
                    yaVienenSeleccionadas={grupoSelecc.competencias} />
            }
        </div>
    );
}
export default PiscinaCompetencias;