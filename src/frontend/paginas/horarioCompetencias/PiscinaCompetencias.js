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

const PiscinaCompetencias = () => {

    const navegar = useNavigate();

    useLayoutEffect(() => {
        GetListas();
    }, []);

    const [listaProgramas, setListaProgramas] = useState([]);
    const [listaGrupos, setListaGrupos] = useState([]);
    const [listaCombinada, setListaCombinada] = useState([]);
    
    const [btnConfirmarOn, setBtnConfirmarOn] = useState(false);

    //Para pintar los grupos y programas según si han sido completados o no
    //Se supone que de esta manera se sincroniza la estructura de índices en la lista
    //con la listaCombinada.
    const [programasGruposCompletados, setProgramasGruposCompletados] = useState([]);

    useEffect(() => {
        //Esto crea una estructura de una lsita de objetos programa que tienen
        //el estado de completado en false, además una lalve que es un array
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
                        listaAux[index].gruposCompletados = new Array(programa.grupos.length).fill(false);
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
            //Para que se vean las competencias de cada grupo (por el renderizado )
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
            const respuesta = await Promise.all([programas, grupos]);
            setListaProgramas([...respuesta[0]]);
            setListaGrupos([...respuesta[1].map(grupo => {
                return {
                    ...grupo,
                    competencias: []
                }
            })]);
        } catch (error) {
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

    const competenciaMock = {
        id: '123456',
        descripcion: `Elaborar productos lácteos con base en leche de ratones calcificados con forticalcio
        a las  3 y 40 de la mañana mientras hay fuegos artificiales en miami de singapur.`
    }

    function PintarProgramasGrupos(listaAux, indexGrupo) {
        if (indexSeleccPrograma >= 0 && indexSeleccGrupo >= 0) {
            //Poner chulo o no si el grupo tiene al menos una competencia
            const listAux = [...programasGruposCompletados];
            listAux[indexSeleccPrograma].gruposCompletados[indexSeleccGrupo] =
                listaAux[indexGrupo].competencias.length >= 1;
            //ahora analizo si el programa está completado para pintarlo
            listAux[indexSeleccPrograma].completado =
                listAux[indexSeleccPrograma].gruposCompletados.every(valor => valor === true);
            console.log(listAux[indexSeleccPrograma].gruposCompletados);
            setProgramasGruposCompletados(listAux);
            //Ahora analizo si todos los programas están listos para habilitar botón confirmar
            setBtnConfirmarOn(listAux.every(programa => programa.completado === true));
        }
    }

    const ManejarClicPositivo = () => {
        //Agrego una competencia a la lista de competencias al grupo dentro de la lista de grupos
        const indexObjeto = listaGrupos.findIndex(obj => obj.codigoGrupo === grupoSelecc.codigoGrupo);

        if (indexObjeto >= 0) {
            let listaAux = [...listaGrupos];
            listaAux[indexObjeto].competencias.push(1);
            setListaGrupos(listaAux);
            //Poner chulo o no si el grupo tiene al menos una competencia
            PintarProgramasGrupos(listaAux, indexObjeto);
        }
    }

    const ManejarClicDestructivo = () => {
        //Quito una competencia a la lista de competencias al grupo dentro de la lista de grupos
        const indexObjeto = listaGrupos.findIndex(obj => obj.codigoGrupo === grupoSelecc.codigoGrupo);

        if (indexObjeto >= 0) {
            let listaAux = [...listaGrupos];
            listaAux[indexObjeto].competencias.shift();
            setListaGrupos(listaAux);
            //Poner chulo o no si el grupo tiene al menos una competencia
            PintarProgramasGrupos(listaAux, indexObjeto);
        }
    }

    const ManejarGrupoSelecc = (grupo, indexPrograma, indexGrupo) => {
        setGrupoSelecc(grupo);
        setIndexSeleccGrupo(indexGrupo);
        setIndexSeleccPrograma(indexPrograma);
    }

    return (
        <div id='contPiscinaCompetencias'>
            <MarcoGralHorario titulo={'Piscina de Competencias'}>
                <ProgramasGrupos grupoSelecc={ManejarGrupoSelecc} listaProgramas={listaCombinada}
                    listaParaListaCompletado={programasGruposCompletados} />
                <div className='ladoDerechoCompetenciasPool'>
                    {
                        Object.keys(grupoSelecc).length < 1 ?
                            <h1>Selecciona un grupo de la lista...</h1>
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
                                            <TarjetaCompetencia competencia={competenciaMock}
                                                onClicDestructivo={ManejarClicDestructivo} />)
                                    });
                                }
                            })
                            : null
                    }
                </div>
            </MarcoGralHorario>
            <div className='contBotones'>
                <BotonPositivo texto={'confirmar'} disabledProp={!btnConfirmarOn}/>
                <BotonPositivo texto={'guardar'} />
                <BotonVolver />
            </div>
        </div>
    );
}
export default PiscinaCompetencias;