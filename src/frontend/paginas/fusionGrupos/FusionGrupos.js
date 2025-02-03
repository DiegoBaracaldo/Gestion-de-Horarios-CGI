import { useEffect, useRef, useState } from "react";
import MarcoGralHorario from "../../componentes/marcoGeneralHorario/MarcoGralHorario";
import './FusionGrupos.css';
import CrudGrupos from "../crudGrupos/CrudGrupos";
import BotonPositivo from "../../componentes/botonPositivo/BotonPositivo";
import BotonDestructivo from "../../componentes/botonDestructivo/BotonDestructivo";
import { useNavigate } from "react-router-dom";
import ProgramasGrupos from "../../componentes/programasGrupos/ProgramasGrupos";
import ProgramaServicio from "../../../backend/repository/servicios/ProgramaService";
import GrupoServicio from "../../../backend/repository/servicios/GrupoService";
import FusionesServicio from "../../../backend/repository/servicios/FusionesService";
import SWALConfirm from "../../alertas/SWALConfirm";
import TarjetaHuesped from "../../componentes/tarjetaHuesped/TarjetaHuesped";
import Swal from "sweetalert2";

const FusionGrupos = () => {

    const navegar = useNavigate();

    const [textoHuesped, setTextoHuesped] = useState('');
    const [textoAnfi, setTextoAnfi] = useState('');
    const [grupoHuesped, setGrupoHuesped] = useState({});
    const [grupoAnfi, setGrupoAnfi] = useState({});
    const [abrirGrupos, setAbrirGrupos] = useState(false);

    const [listaProgramas, setListaProgramas] = useState([]);
    const [listaGrupos, setListaGrupos] = useState([]);
    const [listaCombinada, setListaCombinada] = useState([]);
    const [programasCompletados, setProgramasCompletados] = useState([]);
    const [indexPrograma, setindexPrograma] = useState(-1);
    const [indexGrupo, setIndexGrupo] = useState(-1);

    useEffect(() => {
        GetListas();
    }, []);

    const GetListas = async () => {
        const programas = new ProgramaServicio().CargarLista();
        const grupos = new GrupoServicio().CargarLista();
        const fusiones = new FusionesServicio().CargarLista();
        let [auxProgramas, auxGrupos, auxFusiones] = await Promise.all([programas, grupos, fusiones]);

        //Lleno cada grupo de sus huéspedes
        const gruposMap = new Map(auxGrupos.map(grupo => [grupo.id, grupo])); // Mapeamos los grupos por su id para búsquedas rápidas

        auxGrupos = auxGrupos.map(grupo => {
            const huespedesAux = [];
            auxFusiones.forEach(fusion => {
                if (fusion.idAnfitrion === grupo.id) {
                    const huesped = gruposMap.get(fusion.idHuesped);
                    if (huesped) {  // Verificamos si se encontró el huesped en el mapa
                        huespedesAux.push({ ...huesped });  // Usamos la copia del grupo
                    }
                }
            });
            // console.log(huespedesAux);
            return {
                ...grupo,
                huespedes: huespedesAux
            };
        });

        //Filtro grupos para que no aparezcan los que están como huéspedes
        auxGrupos = auxGrupos
            .filter(grupo => !auxFusiones.some(fusion => fusion.idHuesped === grupo.id));

        setListaProgramas(auxProgramas);
        setListaGrupos(auxGrupos);
        const listaCombinadaAux = CombinarLista(auxProgramas, auxGrupos);
        setListaCombinada([...listaCombinadaAux]);
        const auxProgramasCompletados = new Array(listaCombinadaAux.length).fill(null).map(() => ({
            completado: true,
            gruposCompletados: []
        }));
        setProgramasCompletados(auxProgramasCompletados);
    }


    function CombinarLista(programasParam, gruposParam) {
        return programasParam.map(programa => {
            return {
                ...programa,
                grupos: gruposParam.filter(grupo => grupo.idPrograma === programa.id)
            }
        });
    }

    useEffect(() => {
        setTextoAnfi(grupoAnfi?.codigoGrupo || '');
        setTextoHuesped(grupoHuesped?.codigoGrupo || '');
    }, [grupoAnfi, grupoHuesped]);

    // useEffect(() => {
    //     console.log(grupoHuesped);
    // }, [grupoHuesped]);

    const AbrirGruposHuesped = async () => {
        const respuesta = await new SWALConfirm().ConfirmAlert(`
            El grupo que seleccione PEDERÁ todo su horario. ¿Continuar?
            `);
        if (respuesta === 'si') setAbrirGrupos(true);
    }

    const ManejarSeleccHuesped = (g) => {
        GuardarFusion(g.id);
    }

    const ManejarSeleccAnfi = (g, iP, iG) => {
        setGrupoAnfi(g);
        setindexPrograma(iP);
        setIndexGrupo(iG);
    }

    async function GuardarFusion(idHuesped) {
        const fusionObj = {
            idPrograma: grupoAnfi.idPrograma,
            idHuesped: idHuesped,
            idAnfitrion: grupoAnfi.id
        };
        try {
            const respuesta = await new FusionesServicio().GuardarFusion(fusionObj);
            if (respuesta === 200) {
                Swal.fire('Fusión realizada con éxito!');
                GetListas();
            }
            else Swal.fire('Error al fusionar!');
        } catch (error) {
            Swal.fire(error);
        }
    }

    const CerrarGrupos = () => {
        setAbrirGrupos(false);
    }

    return (
        <div id="contExtFusionGrupos">
            <MarcoGralHorario titulo={'fusión de grupos'}>
                <ProgramasGrupos
                    listaProgramas={listaCombinada}
                    listaParaListaCompletado={programasCompletados}
                    grupoSelecc={ManejarSeleccAnfi} />
                {
                    Object.values(grupoAnfi).length > 0 ?
                        <div className="ladoHuespedes">
                            <div className="presentacionAnfi">
                                <h3>
                                    <span>Grupo Anfitrión: </span>
                                    <span>{grupoAnfi?.codigoGrupo}</span>
                                </h3>
                                <div className="contDescripcionesGrupo">
                                    <div>
                                        <label>
                                            <span className="etTitulo">ficha: </span>
                                            <span className="etContenido">{grupoAnfi?.id}</span></label>
                                    </div>
                                    <div>
                                        <label>
                                            <span className="etTitulo">jornada: </span>
                                            <span className="etContenido">{grupoAnfi?.jornada}</span></label>
                                    </div>
                                    <div>
                                        <label>
                                            <span className="etTitulo">cantidad aprendices: </span>
                                            <span className="etContenido">{grupoAnfi?.cantidadAprendices}</span></label>
                                    </div>
                                    <div>
                                        <label>
                                            <span className="etTitulo">responsable: </span>
                                            <span className="etContenido">{grupoAnfi?.nombreResponsable}</span></label>
                                    </div>
                                    <div>
                                        <label>
                                            <span className="etTitulo">es cadena formación: </span>
                                            <span className="etContenido">{grupoAnfi?.esCadenaFormacion ? 'si' : 'no'}</span></label>
                                    </div>
                                    <div>
                                        <label>
                                            <span className="etTitulo">trimestre lectivo: </span>
                                            <span className="etContenido">{grupoAnfi?.trimestreLectivo}</span></label>
                                    </div>
                                </div>
                            </div>
                            <div className="contBtnAgregarHuesped">
                                <button onClick={AbrirGruposHuesped}>nueva fusión +</button>
                            </div>
                            <div className="contHuespedes">
                                {
                                    indexPrograma >= 0 && indexGrupo >= 0 ?
                                    listaCombinada[indexPrograma]?.grupos[indexGrupo]?.huespedes?.map(huesped => 
                                        <TarjetaHuesped grupo={huesped} />
                                    )
                                    : null
                                }
                            </div>
                        </div>
                        :
                        <h2 style={{ paddingLeft: '10px' }}>
                            Selecciona un grupo anfitrión...
                        </h2>
                }
            </MarcoGralHorario>
            <div className="contBotones">
                <div>
                    <BotonDestructivo
                        texto={'atrás'}
                        onClick={() => navegar(-1)} />
                </div>
            </div>
            {
                abrirGrupos ?
                    <CrudGrupos
                        modoSeleccion={true}
                        onCloseCrud={CerrarGrupos}
                        grupoSeleccionado={(g) => ManejarSeleccHuesped(g)}
                        idPrograma={grupoAnfi?.idPrograma}
                        idAnfitrion={grupoAnfi?.id} 
                        yaSonHuespedes={
                            new Set(listaCombinada[indexGrupo]?.grupos[indexGrupo]?.huespedes?.map(grupo => 
                                grupo.id
                             ))}/>
                    : null
            }
        </div>
    );
}

export default FusionGrupos;