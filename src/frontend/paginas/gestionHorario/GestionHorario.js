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
import { useEffect } from 'react';

const GestionHorario = () => {

    const navegar = useNavigate();

    useEffect(() => {
        VerificarExistenciaEntidades();
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

    return (
        <div id='contGestionHorario'>
            <div className='contRutas'>
                
            VISTA PARA CREAR HORARIO
                {/* <div className='contBtnRutaInfo'>
                    <BotonProcesos texto="GESTIÓN DE DATOS PARA CREACIÓN DE HORARIO" />
                </div>
                <div className='contBtnRutaInfo'>
                    <BotonProcesos texto="CREAR HORARIO" />
                </div> */}
            </div>

            <div className='contBtnVolverExclu'>
                <BotonAtrasExclusivo />
            </div>
        </div>
    );
}
export default GestionHorario;