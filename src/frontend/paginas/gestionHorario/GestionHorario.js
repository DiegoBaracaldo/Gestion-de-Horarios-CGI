import Swal from 'sweetalert2';
import AmbienteServicio from '../../../backend/repository/servicios/AmbienteService';
import CompetenciaServicio from '../../../backend/repository/servicios/CompetenciaService';
import GrupoServicio from '../../../backend/repository/servicios/GrupoService';
import InstructorServicio from '../../../backend/repository/servicios/InstructorService';
import ProgramaServicio from '../../../backend/repository/servicios/ProgramaService';
import BotonAtrasExclusivo from '../../componentes/botonAtrasExclusivo/BotonAtrasExclusivo';
import BotonProcesos from '../../componentes/botonProcesos/BotonProcesos';
import './GestionHorario.css';
import { useNavigate } from 'react-router-dom';
import { useEffect, useLayoutEffect, useState } from 'react';
import PiscinaServicio from '../../../backend/repository/servicios/PiscinaService';
import FranjaServicio from '../../../backend/repository/servicios/FranjaService';

const GestionHorario = () => {

    const navegar = useNavigate();
    const [competenciasListas, setCompetenciasListas] = useState(false);
    const [horarioListo, setHorarioListo] = useState(false);

    useLayoutEffect(() => {
        VerificarExistenciaEntidades();
        VerificarPoolCompetencias();
        VerificarHorario();
    }, []);

    async function VerificarExistenciaEntidades() {
        try {
            const getAmbiente = new AmbienteServicio().ExisteUno();
            const getGrupo = new GrupoServicio().ExisteUno();
            const getCompetencia = new CompetenciaServicio().ExisteUno();

            const respuesta = await Promise.all([getAmbiente, getGrupo, getCompetencia]);
            if (respuesta.includes(0)) {
                Swal.fire(`Debes tener registrados todos los datos necesarios
                     en la gestión de información antes de procer a construir el horario!`);
                navegar(-1);
            }
            //console.log(respuesta);
        } catch (error) {
            Swal.fire("Error al verificar existencia de información SQL_ERROR por: " + error);
            navegar(-1);
        }
    }

    async function VerificarPoolCompetencias(){
        //función para verificar que las piscinas de competencias de todos los
        //grupos estén listas.
        const respuesta = await new PiscinaServicio().PiscinasConfirmadas();
        console.log(respuesta);
        setCompetenciasListas(respuesta);
    }

    async function VerificarHorario(){
        //función para verificar que el horario esté confirmado
        const respuesta = await new FranjaServicio().ConfirmarHorarioCompleto();
        setHorarioListo(respuesta === 0 ? false : true);
    }

    return (
        <div id='contGestionHorario'>
            <div className='contRutas'>
                <div className='contBtnRutaInfo'>
                    <BotonProcesos texto="editar competencias" ruta={"/piscinaCompetencias"}/>
                </div>
                <div className='contBtnRutaInfo'>
                    <BotonProcesos texto="editar horario" disabledProp={!competenciasListas}
                    ruta={"/horario"}/>
                </div>
                <div className='contBtnRutaInfo'>
                    <BotonProcesos texto="fusionar grupos" disabledProp={!horarioListo} 
                    ruta={"/fusionGrupos"}/>
                </div>
                <div className='contBtnRutaInfo'>
                    <BotonProcesos texto="horario PDF" disabledProp={!horarioListo} />
                </div>
                <div className='contBtnRutaInfo'>
                    <BotonProcesos texto="Exportar copia de seguridad" disabledProp={!horarioListo} />
                </div>
            </div>

            <div className='contBtnVolverExclu'>
                <BotonAtrasExclusivo />
            </div>
        </div>
    );
}
export default GestionHorario;